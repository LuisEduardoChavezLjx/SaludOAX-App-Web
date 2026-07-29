package com.saludoax.backend.service;

import com.saludoax.backend.dto.EstimacionResultado;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.Gravedad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class EstimacionValidadorClinico {

    private static final Logger log = LoggerFactory.getLogger(EstimacionValidadorClinico.class);

    private final FallbackEstimacionService fallbackEstimacionService;

    public EstimacionValidadorClinico(FallbackEstimacionService fallbackEstimacionService) {
        this.fallbackEstimacionService = fallbackEstimacionService;
    }

    public EstimacionResultado validar(EstimacionResultado resultadoIA, Cita cita) {
        Gravedad gravedadMinima = fallbackEstimacionService.calcularGravedad(cita);
        if (resultadoIA.getGravedad().ordinal() < gravedadMinima.ordinal()) {
            log.warn("IA subestimo la gravedad (devolvio {}, criterio clinico exige minimo {}) para la cita {}, " +
                            "se descarta y se aplica el resultado determinista",
                    resultadoIA.getGravedad(), gravedadMinima, cita.getId());
            return fallbackEstimacionService.estimar(cita);
        }
        return resultadoIA;
    }
}
