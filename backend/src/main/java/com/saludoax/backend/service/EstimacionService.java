package com.saludoax.backend.service;

import com.saludoax.backend.dto.EstimacionDTO;
import com.saludoax.backend.dto.EstimacionResultado;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.Estimacion;
import com.saludoax.backend.repository.CitaRepository;
import com.saludoax.backend.repository.EstimacionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class EstimacionService {

    private static final Logger log = LoggerFactory.getLogger(EstimacionService.class);

    private final CitaRepository citaRepository;
    private final EstimacionRepository estimacionRepository;
    private final GroqEstimacionService groqEstimacionService;
    private final FallbackEstimacionService fallbackEstimacionService;
    private final SalaEsperaService salaEsperaService;

    public EstimacionService(CitaRepository citaRepository, EstimacionRepository estimacionRepository,
                              GroqEstimacionService groqEstimacionService, FallbackEstimacionService fallbackEstimacionService,
                              SalaEsperaService salaEsperaService) {
        this.citaRepository = citaRepository;
        this.estimacionRepository = estimacionRepository;
        this.groqEstimacionService = groqEstimacionService;
        this.fallbackEstimacionService = fallbackEstimacionService;
        this.salaEsperaService = salaEsperaService;
    }

    @Transactional
    public EstimacionDTO estimar(Long citaId) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));

        EstimacionResultado resultado;
        try {
            resultado = groqEstimacionService.estimar(cita);
        } catch (Exception e) {
            log.warn("IA de estimacion no disponible, usando fallback determinista: {}", e.getMessage());
            resultado = fallbackEstimacionService.estimar(cita);
        }

        Estimacion estimacion = estimacionRepository.findByCitaId(citaId).orElseGet(Estimacion::new);
        estimacion.setCita(cita);
        estimacion.setGravedad(resultado.getGravedad());
        estimacion.setTiempoEstimadoMin(resultado.getTiempoEstimadoMin());
        estimacionRepository.save(estimacion);
        salaEsperaService.registrarLlegada(cita);

        return toDTO(estimacion);
    }

    public EstimacionDTO obtenerPorCita(Long citaId) {
        Estimacion estimacion = estimacionRepository.findByCitaId(citaId)
                .orElseThrow(() -> new IllegalArgumentException("Esta cita no tiene estimacion todavia"));
        return toDTO(estimacion);
    }

    private EstimacionDTO toDTO(Estimacion e) {
        return new EstimacionDTO(
                e.getId(),
                e.getCita().getId(),
                e.getGravedad().name(),
                e.getTiempoEstimadoMin(),
                e.getCreadoEn()
        );
    }
}
