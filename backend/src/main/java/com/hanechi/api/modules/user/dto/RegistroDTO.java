package com.hanechi.api.modules.user.dto;

import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegistroDTO {
    private String nombreUsuario;
    private String correo;
    private String contrasena;
    private LocalDate fechaNacimiento;
}