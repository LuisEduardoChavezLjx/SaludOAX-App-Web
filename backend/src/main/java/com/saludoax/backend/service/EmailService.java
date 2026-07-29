package com.saludoax.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String urlFrontend;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.frontend-url:http://localhost:5173}") String urlFrontend) {
        this.mailSender = mailSender;
        this.urlFrontend = urlFrontend.endsWith("/")
                ? urlFrontend.substring(0, urlFrontend.length() - 1)
                : urlFrontend;
    }

    public void enviarCorreoReset(String destinatario, String token) {
        String enlace = urlFrontend + "/restablecer/" + token;

        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, "utf-8");
            helper.setTo(destinatario);
            helper.setSubject("Restablece tu contrasena - SaludOAX");

            String html = """
                <!DOCTYPE html>
                <html>
                <head><meta charset="utf-8"></head>
                <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
                    <tr>
                      <td align="center">
                        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden">
                          <tr>
                            <td style="padding:32px 32px 0" align="center">
                              <span style="font-size:22px;font-weight:700;color:#1e3a5f">SaludOAX</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:24px 32px 0">
                              <h1 style="font-size:18px;color:#1e293b;margin:0 0 8px">Restablece tu contrasena</h1>
                              <p style="font-size:14px;color:#64748b;line-height:1.6;margin:0">
                                Recibimos una solicitud para restablecer la contrasena de tu cuenta.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding:24px 32px">
                              <a href="%s"
                                 style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;background:#1e3a5f;border-radius:8px;text-decoration:none">
                                Restablecer contrasena
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:0 32px 24px">
                              <p style="font-size:13px;color:#94a3b8;line-height:1.5;margin:0;text-align:center">
                                Este enlace expira en 15 minutos.<br>
                                Si no solicitaste este cambio, ignora este correo.
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
                              <p style="font-size:11px;color:#94a3b8;margin:0;text-align:center">
                                SaludOAX — Sistema de gestion de citas medicas
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(enlace);

            helper.setText(html, true);
            mailSender.send(mime);
            log.info("Correo de recuperacion enviado a {}", destinatario);
        } catch (MailException e) {
            log.error("Error al enviar correo de recuperacion a {}: {}", destinatario, e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Error al preparar correo para {}: {}", destinatario, e.getMessage(), e);
            throw new RuntimeException("Error al preparar correo", e);
        }
    }
}
