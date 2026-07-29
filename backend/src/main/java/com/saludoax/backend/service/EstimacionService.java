package com.saludoax.backend.service;

import com.saludoax.backend.dto.EstimacionDTO;
import com.saludoax.backend.dto.EstimacionResultado;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.Estimacion;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;

@Service
public class EstimacionService {

    private static final Logger log = LoggerFactory.getLogger(EstimacionService.class);

    private final EstimacionDatosService datosService;
    private final GroqEstimacionService groqEstimacionService;
    private final FallbackEstimacionService fallbackEstimacionService;
    private final EstimacionValidadorClinico validadorClinico;

    public EstimacionService(EstimacionDatosService datosService, GroqEstimacionService groqEstimacionService,
                              FallbackEstimacionService fallbackEstimacionService,
                              EstimacionValidadorClinico validadorClinico) {
        this.datosService = datosService;
        this.groqEstimacionService = groqEstimacionService;
        this.fallbackEstimacionService = fallbackEstimacionService;
        this.validadorClinico = validadorClinico;
    }

    public EstimacionDTO estimar(Long citaId) {
        Cita cita = datosService.obtenerCitaConPaciente(citaId);
        EstimacionResultado resultado = obtenerResultado(cita);
        Estimacion estimacion = datosService.guardarResultado(citaId, cita, resultado);
        return toDTO(estimacion);
    }

    private EstimacionResultado obtenerResultado(Cita cita) {
        try {
            EstimacionResultado resultadoIA = groqEstimacionService.estimar(cita);
            return validadorClinico.validar(resultadoIA, cita);
        } catch (ResourceAccessException e) {
            log.warn("IA de estimacion no respondio a tiempo o hubo un problema de red, usando fallback determinista", e);
        } catch (HttpClientErrorException.Unauthorized e) {
            log.error("API key de la IA de estimacion invalida o vencida, usando fallback determinista", e);
        } catch (RestClientException e) {
            log.warn("IA de estimacion devolvio un error HTTP, usando fallback determinista", e);
        } catch (IllegalStateException e) {
            log.warn("No se pudo interpretar la respuesta de la IA de estimacion, usando fallback determinista", e);
        } catch (Exception e) {
            log.error("Fallo inesperado al estimar con IA, usando fallback determinista", e);
        }
        return fallbackEstimacionService.estimar(cita);
    }

    public EstimacionDTO obtenerPorCita(Long citaId) {
        return toDTO(datosService.obtenerEstimacionPorCita(citaId));
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
