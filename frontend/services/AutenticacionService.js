import { Platform } from 'react-native';
import ApiService from './ApiService';

const AutenticacionService = {
    
    registrarse: async (datos) => {
        try {
            const respuesta = await ApiService.post('/auth/signup', {
                nombreUsuario: datos.nombreUsuario,
                correo: datos.correo,
                contrasena: datos.contrasena,
                fechaNacimiento: datos.fechaNacimiento
            });
            return respuesta.data;
        } catch (error) {
            throw error;
        }
    },

    iniciarSesion: async (correo, contrasena) => {
        try {
            const respuesta = await ApiService.post('/auth/login', {
                correo: correo,
                contrasena: contrasena
            });
            return respuesta.data; 
        } catch (error) {
            throw error;
        }
    },

    verificarMfa: async (correo, codigo) => {
        try {
            const respuesta = await ApiService.post('/auth/mfa/verificar', {
                correo: correo,
                codigo: codigo
            });
            return respuesta.data;
        } catch (error) {
            throw error;
        }
    },

    reenviarCodigoMfa: async (correo) => {
        try {
            const respuesta = await ApiService.post('/auth/mfa/reenviar', {
                correo: correo
            });
            return respuesta.data;
        } catch (error) {
            throw error;
        }
    },

    registrarSesion: async (idUsuario) => {
        try {
            const nombreDispositivo = Platform.OS === 'ios' ? 'App iOS' : 'App Android';
            const respuesta = await ApiService.post('/sesiones', {
                idUsuario: idUsuario,
                dispositivo: `Hanechi NoteBook - ${nombreDispositivo}`
            });
            return respuesta.data;
        } catch (error) {
            console.warn("No se pudo registrar la sesión:", error);
            throw error;
        }
    }
};

export default AutenticacionService;