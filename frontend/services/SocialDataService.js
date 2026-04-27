import ApiService from './ApiService';

const SocialDataService = {
    obtenerNotificaciones: async (idUsuario) => {
        const res = await ApiService.get(`/notificaciones/usuario/${idUsuario}`);
        return res.data;
    },

    obtenerSeguidores: async (idUsuario) => {
        const res = await ApiService.get(`/relaciones/seguidores/${idUsuario}`);
        return res.data;
    },

    obtenerSiguiendo: async (idUsuario) => {
        const res = await ApiService.get(`/relaciones/siguiendo/${idUsuario}`);
        return res.data;
    },

    seguirUsuario: async (idEmisor, idReceptor) => {
        const res = await ApiService.post('/relaciones', { idEmisor, idReceptor });
        return res.data;
    },

    dejarDeSeguirUsuario: async (idEmisor, idReceptor) => {
        const res = await ApiService.delete('/relaciones', { data: { idEmisor, idReceptor } });
        return res.data;
    },

    obtenerEtiquetas: async () => {
        const res = await ApiService.get('/etiquetas');
        return res.data;
    }
};

export default SocialDataService;