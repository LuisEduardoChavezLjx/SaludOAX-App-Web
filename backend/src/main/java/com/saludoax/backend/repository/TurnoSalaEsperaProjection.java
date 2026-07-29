package com.saludoax.backend.repository;

import java.time.LocalDateTime;

public interface TurnoSalaEsperaProjection {
    Long getCitaId();
    String getPacienteNombre();
    String getPacienteTelefono();
    String getEstado();
    String getGravedad();
    Integer getPosicion();
    Integer getMinutosEsperaEstimados();
    LocalDateTime getHoraLlegada();
}
