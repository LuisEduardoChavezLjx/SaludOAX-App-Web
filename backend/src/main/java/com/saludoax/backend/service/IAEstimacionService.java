package com.saludoax.backend.service;

import com.saludoax.backend.dto.EstimacionResultado;
import com.saludoax.backend.model.Cita;

public interface IAEstimacionService {

    EstimacionResultado estimar(Cita cita);
}
