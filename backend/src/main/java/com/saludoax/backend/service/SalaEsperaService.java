package com.saludoax.backend.service;

import com.saludoax.backend.dto.TurnoSalaEsperaDTO;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.EstadoCita;
import com.saludoax.backend.model.EstadoTurno;
import com.saludoax.backend.model.Medico;
import com.saludoax.backend.model.TurnoSalaEspera;
import com.saludoax.backend.repository.TurnoSalaEsperaProjection;
import com.saludoax.backend.repository.TurnoSalaEsperaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SalaEsperaService {

    private static final List<String> ESTADOS_ACTIVOS = List.of(
            EstadoTurno.ESPERANDO.name(), EstadoTurno.EN_CONSULTA.name());

    private final TurnoSalaEsperaRepository turnoRepository;
    private final WhatsappNotificacionService whatsappNotificacionService;

    public SalaEsperaService(TurnoSalaEsperaRepository turnoRepository,
                             WhatsappNotificacionService whatsappNotificacionService) {
        this.turnoRepository = turnoRepository;
        this.whatsappNotificacionService = whatsappNotificacionService;
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
        notificarSiguienteEnFila(turno.getCita().getMedico());
    }

    private void notificarSiguienteEnFila(Medico medico) {
        String medicoNombre = medico.getNombre();
        turnoRepository.listarConTriageYPosicion(medico.getId(), List.of(EstadoTurno.ESPERANDO.name()))
                .stream()
                .findFirst()
                .ifPresent(siguiente -> notificarTrasCommit(
                        siguiente.getPacienteTelefono(),
                        siguiente.getPacienteNombre(),
                        medicoNombre));
    }

    private void notificarTrasCommit(String telefono, String pacienteNombre, String medicoNombre) {
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                whatsappNotificacionService.notificarTurnoListo(telefono, pacienteNombre, medicoNombre);
            }
        });
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
