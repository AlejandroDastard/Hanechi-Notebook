import ApiService from './ApiService';

const CuadernoDataService = {
    // --- CUADERNOS ---

    obtenerCuadernosPublicos: async () => {
        const res = await ApiService.get('/cuadernos/publicos');
        return res.data;
    },

    obtenerPorCodigo: async (codigo) => {
        const res = await ApiService.get(`/cuadernos/codigo/${codigo}`);
        return res.data;
    },

    obtenerCuadernosUsuario: async (idUsuario) => {
        const res = await ApiService.get(`/cuadernos/usuario/${idUsuario}`);
        return res.data;
    },

    obtenerPorId: async (idCuaderno) => {
        const res = await ApiService.get(`/cuadernos/${idCuaderno}`);
        return res.data;
    },

    // --- ETIQUETAS ---

    listarEtiquetas: async () => {
        const res = await ApiService.get('/etiquetas');
        return res.data;
    },

    // --- PÁGINAS ---

    obtenerPaginasCuaderno: async (idCuaderno) => {
        const res = await ApiService.get(`/paginas/cuaderno/${idCuaderno}`);
        return res.data;
    },

    crearPagina: async (idCuaderno, numeroPagina) => {
        const res = await ApiService.post(`/paginas/cuaderno/${idCuaderno}`, { numeroPagina });
        return res.data;
    },

    eliminarPagina: async (idPagina) => {
        const res = await ApiService.delete(`/paginas/${idPagina}`);
        return res.data;
    },

    // --- ELEMENTOS ---

    guardarElemento: async (idPagina, dto) => {
        const res = await ApiService.post(`/elementos/pagina/${idPagina}`, dto);
        return res.data;
    },

    eliminarElemento: async (idElemento) => {
        const res = await ApiService.delete(`/elementos/${idElemento}`);
        return res.data;
    }
};

export default CuadernoDataService;