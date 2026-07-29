package com.saludoax.backend.service;

import com.saludoax.backend.dto.EstimacionResultado;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.Gravedad;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
public class FallbackEstimacionService implements IAEstimacionService {

    private static final int EDAD_RIESGO = 65;
    private static final int SISTOLICA_CRISIS = 180;
    private static final int DIASTOLICA_CRISIS = 120;
    private static final int SISTOLICA_ALTA = 140;
    private static final int DIASTOLICA_ALTA = 90;
    private static final int SISTOLICA_BAJA = 90;

    @Override
    public EstimacionResultado estimar(Cita cita) {
        Gravedad gravedad = calcularGravedad(cita);
        int tiempoEstimadoMin = switch (gravedad) {
            case LEVE -> 15;
            case MODERADA -> 25;
            case URGENTE -> 40;
        };
        return new EstimacionResultado(gravedad, tiempoEstimadoMin);
    }


    Gravedad calcularGravedad(Cita cita) {
        Integer sistolica = cita.getPresionSistolica();
        Integer diastolica = cita.getPresionDiastolica();

        Gravedad gravedad = Gravedad.LEVE;

        if (esCrisisHipertensiva(sistolica, diastolica)) {
            gravedad = Gravedad.URGENTE;
        } else if (esPresionAnormal(sistolica, diastolica)) {
            gravedad = Gravedad.MODERADA;
        }

        if (esEdadDeRiesgo(cita) && gravedad != Gravedad.URGENTE) {
            gravedad = gravedad == Gravedad.LEVE ? Gravedad.MODERADA : Gravedad.URGENTE;
        }

        return gravedad;
    }

    private boolean esCrisisHipertensiva(Integer sistolica, Integer diastolica) {
        return (sistolica != null && sistolica >= SISTOLICA_CRISIS)
                || (diastolica != null && diastolica >= DIASTOLICA_CRISIS);
    }

    private boolean esPresionAnormal(Integer sistolica, Integer diastolica) {
        boolean hipertension = (sistolica != null && sistolica >= SISTOLICA_ALTA)
                || (diastolica != null && diastolica >= DIASTOLICA_ALTA);
        boolean hipotension = sistolica != null && sistolica < SISTOLICA_BAJA;
        return hipertension || hipotension;
    }

    private boolean esEdadDeRiesgo(Cita cita) {
        LocalDate fechaNacimiento = cita.getPaciente().getFechaNacimiento();
        if (fechaNacimiento == null) return false;
        return Period.between(fechaNacimiento, LocalDate.now()).getYears() >= EDAD_RIESGO;
    }
}
