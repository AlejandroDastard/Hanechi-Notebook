import ApiService from './ApiService';

const UsuarioDataService = {
    // --- PERFILES ---

    buscarPerfiles: async (nombre) => {
        const res = await ApiService.get(`/perfiles/buscar?nombre=${nombre.toLowerCase()}`);
        return res.data;
    },

    obtenerPerfil: async (idUsuario) => {
        const res = await ApiService.get(`/perfiles/${idUsuario}`);
        return res.data;
    },

    obtenerPerfilPublico: async (idUsuario) => {
        const res = await ApiService.get(`/perfiles/${idUsuario}/publico`);
        return res.data;
    },

    actualizarPerfil: async (idUsuario, datos) => {
        const res = await ApiService.patch(`/perfiles/${idUsuario}`, datos);
        return res.data;
    },

    // --- USUARIO ---

    obtenerUsuarioCompleto: async (idUsuario) => {
        const res = await ApiService.get(`/usuarios/${idUsuario}`);
        return res.data;
    },

    cambiarNombre: async (idUsuario, nuevoNombre) => {
        const res = await ApiService.patch(`/usuarios/${idUsuario}/nombre`, { nuevoNombre });
        return res.data;
    },

    cambiarContrasena: async (idUsuario, contrasenaActual, contrasenaNueva) => {
        const res = await ApiService.put(`/usuarios/${idUsuario}/contrasena`, { contrasenaActual, contrasenaNueva });
        return res.data;
    },

    eliminarCuenta: async (idUsuario) => {
        const res = await ApiService.delete(`/usuarios/${idUsuario}`);
        return res.data;
    },

    // --- CONFIGURACIÓN ---

    obtenerConfiguracionPorUsuario: async (idUsuario) => {
        const res = await ApiService.get(`/configuraciones/${idUsuario}`);
        return res.data;
    },

    actualizarConfiguracion: async (idConfiguracion, datos) => {
        const res = await ApiService.patch(`/configuraciones/${idConfiguracion}`, datos);
        return res.data;
    },

    // --- SESIONES ---
    
    listarSesiones: async (idUsuario) => {
        const res = await ApiService.get(`/sesiones/usuario/${idUsuario}`);
        return res.data;
    },

    cerrarSesion: async (idSesion) => {
        const res = await ApiService.delete(`/sesiones/${idSesion}`);
        return res.data;
    }
};

export default UsuarioDataService;