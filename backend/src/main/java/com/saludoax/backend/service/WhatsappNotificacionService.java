package com.saludoax.backend.service;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class WhatsappNotificacionService {

    private static final Logger log = LoggerFactory.getLogger(WhatsappNotificacionService.class);

    private static final String PREFIJO_WHATSAPP = "whatsapp:";
    private static final String LADA_MEXICO = "+52";

    private final String accountSid;
    private final String authToken;
    private final String numeroOrigen;

    public WhatsappNotificacionService(
            @Value("${twilio.account-sid:}") String accountSid,
            @Value("${twilio.auth-token:}") String authToken,
            @Value("${twilio.whatsapp-from:}") String numeroOrigen
    ) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.numeroOrigen = numeroOrigen;
    }

    @Async
    public void notificarTurnoListo(String telefonoDestino, String pacienteNombre, String medicoNombre) {
        if (!hayCredenciales()) {
            log.warn("Twilio sin configurar, se omite la notificacion de turno de {}", pacienteNombre);
            return;
        }
        if (telefonoDestino == null || telefonoDestino.isBlank()) {
            log.warn("El paciente {} no tiene telefono registrado, se omite la notificacion de turno", pacienteNombre);
            return;
        }

        String cuerpo = "SaludOAX: Es su turno. Por favor, pase al consultorio del Dr. " + medicoNombre;

        try {
            Twilio.init(accountSid, authToken);
            Message enviado = Message.creator(
                    new PhoneNumber(PREFIJO_WHATSAPP + aFormatoInternacional(telefonoDestino)),
                    new PhoneNumber(PREFIJO_WHATSAPP + aFormatoInternacional(numeroOrigen)),
                    cuerpo
            ).create();
            log.info("Notificacion de turno enviada por WhatsApp a {} (sid {})", pacienteNombre, enviado.getSid());
        } catch (ApiException e) {
            log.error("Twilio rechazo la notificacion de turno de {}: {}", pacienteNombre, e.getMessage(), e);
        } catch (RuntimeException e) {
            log.error("Fallo de red o inesperado al notificar el turno de {}", pacienteNombre, e);
        }
    }

    private boolean hayCredenciales() {
        return !accountSid.isBlank() && !authToken.isBlank() && !numeroOrigen.isBlank();
    }

    private String aFormatoInternacional(String telefono) {
        String limpio = telefono.replaceAll("[^0-9+]", "");
        return limpio.startsWith("+") ? limpio : LADA_MEXICO + limpio;
    }
}
