package com.hanechi.api.infrastructure.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCodigoMfa(String destino, String codigo) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(destino);
            helper.setSubject("Hanechi - Tu código de seguridad");
            helper.setText(generarCuerpoHtml(codigo), true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Error al enviar email: " + e.getMessage());
        }
    }

    private String generarCuerpoHtml(String codigo) {
        return """
            <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF9F6; padding: 40px 20px; font-family: 'Inter', Arial, sans-serif;">
                <tr>
                    <td align="center">
                        <table width="100%%" style="max-width: 500px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #D6D3D1; overflow: hidden; box-shadow: 0 6px 18px rgba(231, 229, 228, 0.5);">
                            <tr>
                                <td style="background-color: #588157; padding: 0;">
                                    <table width="100%%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td style="padding: 30px; text-align: center;">
                                                <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; letter-spacing: 5px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">HANECHI</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="8" style="background-color: #E07A5F; font-size: 1px; line-height: 1px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 40px 35px;">
                                    <h2 style="margin: 0 0 18px; color: #1C1917; font-size: 22px; font-weight: 600;">Verificación de Seguridad</h2>
                                    <p style="margin: 0 0 28px; color: #78716C; font-size: 16px; line-height: 1.7;">
                                        Has solicitado un código de acceso para tu cuenta. Por favor, utiliza el siguiente código de un solo uso (OTP) para completar el proceso.
                                    </p>
                                    
                                    <table width="100%%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center">
                                                <div style="background-color: #FAF9F6; border-radius: 12px; padding: 25px 15px; border: 1px solid #D6D3D1; display: inline-block; min-width: 280px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                                                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 48px; font-weight: 800; letter-spacing: 14px; color: #E07A5F; text-shadow: 0 1px 2px rgba(0,0,0,0.05); display: block; line-height: 1;">%s</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="margin: 32px 0 0; color: #78716C; font-size: 14px; text-align: center; line-height: 1.5;">
                                        Este código es válido por <strong>5 minutos</strong>.<br>
                                        Si no has solicitado este correo, puedes ignorarlo de forma segura.
                                    </p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 25px; background-color: #FAF9F6; border-top: 1px solid #D6D3D1; text-align: center;">
                                    <p style="margin: 0; font-size: 12px; color: #78716C; letter-spacing: 1px; line-height: 1.4;">
                                        &copy; 2026 Hanechi. Tu seguridad es nuestra prioridad.<br>
                                        Este es un mensaje automático, por favor no respondas.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            """.formatted(codigo);
    }
}