import ApiService from './ApiService';

const InteraccionEstadisticaDataService = {
    // --- INTERACCION ---
    
    registrarInteraccion: async (datos) => {
        const res = await ApiService.post('/interacciones', datos);
        return res.data;
    },

    obtenerInteraccionesPorCuaderno: async (idCuaderno) => {
        const res = await ApiService.get(`/interacciones/cuaderno/${idCuaderno}`);
        return res.data;
    },

    // --- ESTADISTICAS ---

    obtenerEstadisticasUsuario: async (idUsuario) => {
        const res = await ApiService.get(`/estadisticas/usuarios/${idUsuario}`);
        return res.data;
    },

    obtenerEstadisticasCuaderno: async (idCuaderno) => {
        const res = await ApiService.get(`/estadisticas/cuadernos/${idCuaderno}`);
        return res.data;
    },

    obtenerCuadernosConLike: async (idUsuario) => {
        const res = await ApiService.get(`/interacciones/usuario/${idUsuario}/likes`);
        return res.data;
    },

    obtenerCuadernosGuardados: async (idUsuario) => {
        const res = await ApiService.get(`/interacciones/usuario/${idUsuario}/guardados`);
        return res.data;
    }
};

export default InteraccionEstadisticaDataService;