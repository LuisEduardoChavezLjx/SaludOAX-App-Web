package com.saludoax.backend.service;

import com.saludoax.backend.dto.TurnoSalaEsperaDTO;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.EstadoCita;
import com.saludoax.backend.model.EstadoTurno;
import com.saludoax.backend.model.TurnoSalaEspera;
import com.saludoax.backend.repository.TurnoSalaEsperaProjection;
import com.saludoax.backend.repository.TurnoSalaEsperaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SalaEsperaService {

    private static final List<String> ESTADOS_ACTIVOS = List.of(
            EstadoTurno.ESPERANDO.name(), EstadoTurno.EN_CONSULTA.name());

    private final TurnoSalaEsperaRepository turnoRepository;

    public SalaEsperaService(TurnoSalaEsperaRepository turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    public List<TurnoSalaEsperaDTO> listarPorMedico(Long medicoId) {
        return turnoRepository.listarConTriageYPosicion(medicoId, ESTADOS_ACTIVOS).stream()
                .map(this::toDTO)
                .toList();
    }

    public TurnoSalaEsperaDTO obtenerTurnoDeCita(Long citaId) {
        return turnoRepository.buscarConTriageYPosicion(citaId, ESTADOS_ACTIVOS)
                .map(this::toDTO)
                .orElse(null);
    }

    @Transactional
    public void registrarLlegada(Cita cita) {
        if (turnoRepository.findByCitaId(cita.getId()).isPresent()) return;
        TurnoSalaEspera turno = new TurnoSalaEspera();
        turno.setCita(cita);
        turnoRepository.save(turno);
    }

    @Transactional
    public void iniciar(Long citaId) {
        TurnoSalaEspera turno = buscarTurnoOFallar(citaId);
        turno.setEstado(EstadoTurno.EN_CONSULTA);
        turnoRepository.save(turno);
    }

    @Transactional
    public void finalizar(Long citaId) {
        TurnoSalaEspera turno = buscarTurnoOFallar(citaId);
        turno.setEstado(EstadoTurno.FINALIZADO);
        turno.getCita().setEstado(EstadoCita.ATENDIDA);
        turnoRepository.save(turno);
    }

    private TurnoSalaEspera buscarTurnoOFallar(Long citaId) {
        return turnoRepository.findByCitaId(citaId)
                .orElseThrow(() -> new IllegalArgumentException("Turno no encontrado"));
    }

    private TurnoSalaEsperaDTO toDTO(TurnoSalaEsperaProjection p) {
        return new TurnoSalaEsperaDTO(
                p.getCitaId(),
                p.getPacienteNombre(),
                p.getPosicion(),
                p.getEstado(),
                p.getGravedad(),
                p.getMinutosEsperaEstimados(),
                p.getHoraLlegada()
        );
    }
}
