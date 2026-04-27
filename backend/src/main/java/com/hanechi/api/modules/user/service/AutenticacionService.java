package com.hanechi.api.modules.user.service;

import java.time.ZonedDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hanechi.api.infrastructure.mail.EmailService;
import com.hanechi.api.infrastructure.security.jwt.JwtService;
import com.hanechi.api.modules.user.dto.AutenticacionDTO;
import com.hanechi.api.modules.user.dto.CodigoVerificacionDTO;
import com.hanechi.api.modules.user.dto.InicioSesionDTO;
import com.hanechi.api.modules.user.dto.RegistroDTO;
import com.hanechi.api.modules.user.enums.EstadoUsuario;
import com.hanechi.api.modules.user.model.CodigoVerificacion;
import com.hanechi.api.modules.user.model.Usuario;
import com.hanechi.api.modules.user.repository.CodigoVerificacionRepository;
import com.hanechi.api.modules.user.repository.UsuarioRepository;

@Service
public class AutenticacionService {
    private final UsuarioRepository usuarioRepository;
    private final CodigoVerificacionRepository codigoRepository;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final FabricaUsuarioService fabricaUsuarioService;

    public AutenticacionService(UsuarioRepository usuarioRepository, CodigoVerificacionRepository codigoRepository, JwtService jwtService, EmailService emailService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, FabricaUsuarioService fabricaUsuarioService) {
        this.usuarioRepository = usuarioRepository;
        this.codigoRepository = codigoRepository;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.fabricaUsuarioService = fabricaUsuarioService;
    }

    // --- POST ---

    @Transactional
    public String signup(RegistroDTO dto) {
        String correoLimpio = dto.getCorreo().toLowerCase().trim();
        String nombreLimpio = dto.getNombreUsuario().toLowerCase().trim();

        if (usuarioRepository.existsByCorreo(correoLimpio)) {
            throw new RuntimeException("El correo ya esta en uso");
        }

        if (usuarioRepository.existsByNombreUsuario(nombreLimpio)) {
            throw new RuntimeException("El usuario ya esta en uso");
        }

        String passCifrada = passwordEncoder.encode(dto.getContrasena());
        Usuario nuevo = fabricaUsuarioService.crearDesdeRegistro(dto, passCifrada);

        nuevo.setNombreUsuario(nombreLimpio);
        nuevo.setCorreo(correoLimpio);

        usuarioRepository.save(nuevo);

        return enviarCodigo(correoLimpio);
    }

    @Transactional
    public String iniciarSesionMfa(InicioSesionDTO loginDto) {
        String correoLimpio = loginDto.getCorreo().toLowerCase().trim();
        
        Usuario usuario = usuarioRepository.findByCorreo(correoLimpio)
            .orElseThrow(() -> new RuntimeException("Credenciales invalidas"));

        if (usuario.getEstadoUsuario() == EstadoUsuario.BORRADO || usuario.getEstadoUsuario() == EstadoUsuario.BANNEADO) {
            throw new RuntimeException("La cuenta no esta disponible");
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(correoLimpio, loginDto.getContrasena()));
        return enviarCodigo(correoLimpio);
    }

    @Transactional
    public AutenticacionDTO verificarYGenerarToken(CodigoVerificacionDTO dto) {
        String correo = dto.getCorreo().toLowerCase().trim();
        CodigoVerificacion cv = codigoRepository.findByCorreoAndCodigo(correo, dto.getCodigo())
            .orElseThrow(() -> new RuntimeException("Codigo incorrecto"));

        if (cv.getFechaExpiracion().isBefore(ZonedDateTime.now())) {
            codigoRepository.delete(cv);
            throw new RuntimeException("Codigo expirado");
        }

        Usuario usuario = usuarioRepository.findByCorreo(correo)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getEstadoUsuario() == EstadoUsuario.PENDIENTE) {
            usuario.setEstadoUsuario(EstadoUsuario.ACTIVO);
            usuarioRepository.save(usuario);
        }

        if (usuario.getEstadoUsuario() != EstadoUsuario.ACTIVO) {
            throw new RuntimeException("Cuenta inactiva o bloqueada");
        }

        String token = jwtService.generateToken(usuario);
        codigoRepository.delete(cv);

        AutenticacionDTO res = new AutenticacionDTO();
        res.setToken(token);
        res.cargarDatosUsuario(usuario);
        
        return res;
    }

    @Transactional
    public void reenviarCodigo(String correo) {
        enviarCodigo(correo.toLowerCase().trim());
    }

    private String enviarCodigo(String correo) {
        String codigo = String.format("%06d", (int) (Math.random() * 1000000));
        codigoRepository.deleteByCorreo(correo);
        CodigoVerificacion cv = new CodigoVerificacion(correo, codigo, ZonedDateTime.now().plusMinutes(5));
        
        codigoRepository.save(cv);
        emailService.enviarCodigoMfa(correo, codigo);
        
        return "MFA_REQUIRED";
    }
}