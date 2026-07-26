package com.saludoax.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RecuperarRequest {

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene formato valido")
    private String email;

    public RecuperarRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
