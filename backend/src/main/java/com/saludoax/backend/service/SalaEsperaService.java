package com.saludoax.backend.service;

import com.saludoax.backend.dto.TurnoSalaEsperaDTO;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.EstadoCita;
import com.saludoax.backend.model.EstadoTurno;
import com.saludoax.backend.model.Estimacion;
import com.saludoax.backend.model.TurnoSalaEspera;
import com.saludoax.backend.repository.EstimacionRepository;
import com.saludoax.backend.repository.TurnoSalaEsperaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class SalaEsperaService {

    private static final int MINUTOS_POR_DEFECTO = 15;
    private static final List<EstadoTurno> ESTADOS_ACTIVOS = List.of(EstadoTurno.ESPERANDO, EstadoTurno.EN_CONSULTA);

    private final TurnoSalaEsperaRepository turnoRepository;
    private final EstimacionRepository estimacionRepository;

    public SalaEsperaService(TurnoSalaEsperaRepository turnoRepository, EstimacionRepository estimacionRepository) {
        this.turnoRepository = turnoRepository;
        this.estimacionRepository = estimacionRepository;
    }

    public List<TurnoSalaEsperaDTO> listarPorMedico(Long medicoId) {
        List<TurnoConEstimacion> ordenados = turnoRepository
                .findByCita_Medico_IdAndEstadoIn(medicoId, ESTADOS_ACTIVOS)
                .stream()
                .map(t -> new TurnoConEstimacion(t, estimacionRepository.findByCitaId(t.getCita().getId()).orElse(null)))
                .sorted(Comparator
                        .comparingInt((TurnoConEstimacion tc) -> severidad(tc.estimacion))
                        .thenComparing(tc -> tc.turno.getHoraLlegada()))
                .toList();

        List<TurnoSalaEsperaDTO> resultado = new ArrayList<>();
        int minutosAcumulados = 0;
        for (int i = 0; i < ordenados.size(); i++) {
            TurnoConEstimacion tc = ordenados.get(i);
            int minutosConsulta = tc.estimacion != null ? tc.estimacion.getTiempoEstimadoMin() : MINUTOS_POR_DEFECTO;

            resultado.add(new TurnoSalaEsperaDTO(
                    tc.turno.getCita().getId(),
                    tc.turno.getCita().getPaciente().getNombre(),
                    i + 1,
                    tc.turno.getEstado().name(),
                    tc.estimacion != null ? tc.estimacion.getGravedad().name() : null,
                    minutosAcumulados,
                    tc.turno.getHoraLlegada()
            ));

            minutosAcumulados += minutosConsulta;
        }
        return resultado;
    }

    public TurnoSalaEsperaDTO obtenerTurnoDeCita(Long citaId) {
        return turnoRepository.findByCitaId(citaId)
                .map(turno -> listarPorMedico(turno.getCita().getMedico().getId()).stream()
                        .filter(dto -> dto.getCitaId().equals(citaId))
                        .findFirst()
                        .orElse(null))
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

    private int severidad(Estimacion estimacion) {
        if (estimacion == null) return 3;
        return switch (estimacion.getGravedad()) {
            case URGENTE -> 0;
            case MODERADA -> 1;
            case LEVE -> 2;
        };
    }

    private record TurnoConEstimacion(TurnoSalaEspera turno, Estimacion estimacion) {}
}
