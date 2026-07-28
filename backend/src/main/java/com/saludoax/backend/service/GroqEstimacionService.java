package com.saludoax.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saludoax.backend.dto.EstimacionResultado;
import com.saludoax.backend.model.Cita;
import com.saludoax.backend.model.Gravedad;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Map;

@Service
public class GroqEstimacionService implements IAEstimacionService {

    private static final Logger log = LoggerFactory.getLogger(GroqEstimacionService.class);
    private static final Duration TIMEOUT = Duration.ofSeconds(8);

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String apiKey;
    private final String model;

    public GroqEstimacionService(
            @Value("${app.ia.api-url}") String apiUrl,
            @Value("${app.ia.api-key}") String apiKey,
            @Value("${app.ia.model}") String model
    ) {
        this.apiKey = apiKey;
        this.model = model;

        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(
                HttpClient.newBuilder().connectTimeout(TIMEOUT).build());
        requestFactory.setReadTimeout(TIMEOUT);

        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .requestFactory(requestFactory)
                .build();
    }

    @Override
    public EstimacionResultado estimar(Cita cita) {
        Map<String, Object> body = Map.of(
                "model", model,
                "temperature", 0.2,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content",
                                "Eres un asistente clinico de triage. Responde unicamente JSON con las claves " +
                                "\"gravedad\" (LEVE, MODERADA o URGENTE) y \"tiempoEstimadoMin\" " +
                                "(entero, minutos de consulta estimados)."),
                        Map.of("role", "user", "content", construirPrompt(cita))
                )
        );

        String respuesta = restClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .body(body)
                .retrieve()
                .body(String.class);

        return parsearRespuesta(respuesta);
    }

    private String construirPrompt(Cita cita) {
        Integer edad = cita.getPaciente().getFechaNacimiento() != null
                ? Period.between(cita.getPaciente().getFechaNacimiento(), LocalDate.now()).getYears()
                : null;

        return String.format(
                "Edad: %s. Sexo: %s. Peso: %s kg. Presion arterial: %s/%s. Motivo de consulta: %s.",
                edad != null ? edad : "desconocida",
                cita.getPaciente().getSexo(),
                cita.getPesoKg(),
                cita.getPresionSistolica(),
                cita.getPresionDiastolica(),
                cita.getContextoSalud() != null ? cita.getContextoSalud() : "sin especificar"
        );
    }

    private EstimacionResultado parsearRespuesta(String respuestaCruda) {
        try {
            JsonNode raiz = objectMapper.readTree(respuestaCruda);
            String contenido = raiz.path("choices").get(0).path("message").path("content").asText();
            JsonNode json = objectMapper.readTree(contenido);

            Gravedad gravedad = Gravedad.valueOf(json.path("gravedad").asText().toUpperCase());
            int tiempoEstimadoMin = json.path("tiempoEstimadoMin").asInt();

            return new EstimacionResultado(gravedad, tiempoEstimadoMin);
        } catch (Exception e) {
            log.error("No se pudo interpretar la respuesta de Groq", e);
            throw new IllegalStateException("Respuesta de IA invalida", e);
        }
    }
}
