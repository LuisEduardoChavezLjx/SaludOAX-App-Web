package com.saludoax.backend.config;

import com.saludoax.backend.model.*;
import com.saludoax.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Carga datos de prueba solo si la base esta vacia.
 * Cumple el requisito de 10-15 registros por tabla principal,
 * incluyendo al menos un usuario por rol con credenciales documentadas
 * (ver README para las credenciales del admin de evaluacion).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final int[] SISTOLICAS_SEED = {118, 122, 145, 130, 185, 110, 128, 152, 120, 138};
    private static final int[] DIASTOLICAS_SEED = {76, 80, 92, 84, 125, 70, 82, 95, 78, 88};
    private static final int[] EDADES_SEED = {34, 67, 45, 4, 72, 28, 51, 63, 39, 6};
    private static final String[] CONTEXTOS_SEED = {
            "Consulta de rutina, sin molestias",
            "Dolor de rodilla al caminar desde hace dos semanas",
            "Dolor de cabeza persistente y vision borrosa",
            "Fiebre y tos desde hace tres dias",
            "Mareo intenso, zumbido en oidos y dolor en el pecho",
            "Revision anual de control",
            "Molestia estomacal despues de comer",
            "Falta de aire al subir escaleras",
            "Erupcion en la piel del antebrazo",
            "Control de crecimiento y vacunas"
    };

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final PacienteRepository pacienteRepository;
    private final MedicoRepository medicoRepository;
    private final EspecialidadRepository especialidadRepository;
    private final CitaRepository citaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(RolRepository rolRepository, UsuarioRepository usuarioRepository,
                      PacienteRepository pacienteRepository, MedicoRepository medicoRepository,
                      EspecialidadRepository especialidadRepository, CitaRepository citaRepository,
                      PasswordEncoder passwordEncoder) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.pacienteRepository = pacienteRepository;
        this.medicoRepository = medicoRepository;
        this.especialidadRepository = especialidadRepository;
        this.citaRepository = citaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 1) {
            return; // ya hay datos ademas del posible admin; no duplicar
        }

        Rol rolAdmin = rolRepository.findByNombre("ADMIN").orElseThrow();
        Rol rolPaciente = rolRepository.findByNombre("PACIENTE").orElseThrow();
        Rol rolMedico = rolRepository.findByNombre("MEDICO").orElseThrow();

        // Usuario admin de evaluacion (credenciales documentadas en el README)
        crearUsuarioSiNoExiste("admin@saludoax.com", "Admin123!", rolAdmin);

        // 10 pacientes de prueba
        for (int i = 1; i <= 10; i++) {
            Usuario u = crearUsuarioSiNoExiste("paciente" + i + "@correo.com", "Paciente123!", rolPaciente);
            if (pacienteRepository.findByUsuarioId(u.getId()).isEmpty()) {
                Paciente p = new Paciente();
                p.setUsuario(u);
                p.setNombre("Paciente de prueba " + i);
                p.setTelefono("951000000" + i);
                p.setPesoKg(new java.math.BigDecimal(60 + i));
                p.setPresionSistolica(SISTOLICAS_SEED[i - 1]);
                p.setPresionDiastolica(DIASTOLICAS_SEED[i - 1]);
                p.setFechaNacimiento(java.time.LocalDate.now().minusYears(EDADES_SEED[i - 1]));
                p.setSexo(i % 2 == 0 ? "FEMENINO" : "MASCULINO");
                p.setContextoSalud(CONTEXTOS_SEED[i - 1]);
                pacienteRepository.save(p);
            }
        }

        // Especialidades ya vienen del seed SQL (migracion V7)
        List<Especialidad> especialidades = especialidadRepository.findAll();

        // 5 medicos de prueba, cada uno con una especialidad asignada por N:M
        String[] nombresMedicos = {
                "Dra. Ana Gomez", "Dr. Luis Ramirez", "Dra. Carmen Ruiz",
                "Dr. Jorge Diaz", "Dra. Sofia Torres"
        };
        for (int i = 0; i < nombresMedicos.length; i++) {
            Usuario u = crearUsuarioSiNoExiste("medico" + (i + 1) + "@saludoax.com", "Medico123!", rolMedico);
            if (medicoRepository.findByUsuarioId(u.getId()).isEmpty()) {
                Medico m = new Medico();
                m.setUsuario(u);
                m.setNombre(nombresMedicos[i]);
                Especialidad esp = especialidades.get(i % especialidades.size());
                m.setEspecialidad(esp.getNombre());
                m.setDisponible(true);
                m.getEspecialidades().add(esp);
                medicoRepository.save(m);
            }
        }

        // 10 citas de prueba distribuidas entre pacientes y medicos
        List<Paciente> pacientes = pacienteRepository.findAll();
        List<Medico> medicos = medicoRepository.findAll();
        for (int i = 0; i < 10 && !pacientes.isEmpty() && !medicos.isEmpty(); i++) {
            Cita c = new Cita();
            c.setPaciente(pacientes.get(i % pacientes.size()));
            c.setMedico(medicos.get(i % medicos.size()));
            c.setFechaHora(LocalDateTime.now().plusDays(1).plusHours(i));
            c.setEstado(EstadoCita.PENDIENTE);
            Paciente pacienteDeLaCita = pacientes.get(i % pacientes.size());
            c.setPesoKg(pacienteDeLaCita.getPesoKg());
            c.setPresionSistolica(pacienteDeLaCita.getPresionSistolica());
            c.setPresionDiastolica(pacienteDeLaCita.getPresionDiastolica());
            c.setContextoSalud(pacienteDeLaCita.getContextoSalud());
            citaRepository.save(c);
        }
    }

    private Usuario crearUsuarioSiNoExiste(String email, String password, Rol rol) {
        return usuarioRepository.findByEmail(email).orElseGet(() -> {
            Usuario u = new Usuario();
            u.setEmail(email);
            u.setPasswordHash(passwordEncoder.encode(password));
            u.setRol(rol);
            return usuarioRepository.save(u);
        });
    }
}
