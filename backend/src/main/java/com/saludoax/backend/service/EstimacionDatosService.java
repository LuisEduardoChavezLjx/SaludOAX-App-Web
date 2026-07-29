package com.saludoax.backend.service;

import com.saludoax.backend.dto.EstimacionResultado;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.Estimacion;
import com.saludoax.backend.repository.CitaRepository;
import com.saludoax.backend.repository.EstimacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EstimacionDatosService {

    private final CitaRepository citaRepository;
    private final EstimacionRepository estimacionRepository;
    private final SalaEsperaService salaEsperaService;

    public EstimacionDatosService(CitaRepository citaRepository, EstimacionRepository estimacionRepository,
                                   SalaEsperaService salaEsperaService) {
        this.citaRepository = citaRepository;
        this.estimacionRepository = estimacionRepository;
        this.salaEsperaService = salaEsperaService;
    }

    @Transactional(readOnly = true)
    public Cita obtenerCitaConPaciente(Long citaId) {
        return citaRepository.findByIdConPaciente(citaId)
                .orElseThrow(() -> new IllegalArgumentException("Cita no encontrada"));
    }

    @Transactional(readOnly = true)
    public Estimacion obtenerEstimacionPorCita(Long citaId) {
        return estimacionRepository.findByCitaId(citaId)
                .orElseThrow(() -> new IllegalArgumentException("Esta cita no tiene estimacion todavia"));
    }

    @Transactional
    public Estimacion guardarResultado(Long citaId, Cita cita, EstimacionResultado resultado) {
        Estimacion estimacion = estimacionRepository.findByCitaId(citaId).orElseGet(Estimacion::new);
        estimacion.setCita(cita);
        estimacion.setGravedad(resultado.getGravedad());
        estimacion.setTiempoEstimadoMin(resultado.getTiempoEstimadoMin());
        estimacionRepository.save(estimacion);
        salaEsperaService.registrarLlegada(cita);
        return estimacion;
    }
}
