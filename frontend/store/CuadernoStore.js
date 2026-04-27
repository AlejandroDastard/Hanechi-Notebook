import { create } from 'zustand';
import CuadernoDataService from '../services/CuadernoDataService';

const useCuadernoStore = create((set, get) => ({
    cuadernoActivo: null,
    paginas: [],
    paginaActiva: null,
    elementos: [],
    elementosEliminados: [],
    cargando: false,
    esSucio: false,

    cargarCuaderno: async (idCuaderno) => {
        set({ cargando: true, elementos: [], paginas: [], esSucio: false });
        try {
            const cuaderno = await CuadernoDataService.obtenerPorId(idCuaderno);
            const dataPaginas = await CuadernoDataService.obtenerPaginasCuaderno(idCuaderno);
            let listaPaginas = Array.isArray(dataPaginas) && dataPaginas.length > 0 ? dataPaginas : [];
            
            if (listaPaginas.length === 0) {
                const nueva = await CuadernoDataService.crearPagina(idCuaderno, 1);
                listaPaginas = [nueva];
            }
            
            const seleccion = listaPaginas[0];
            set({
                cuadernoActivo: cuaderno,
                paginas: listaPaginas,
                paginaActiva: seleccion,
                elementos: Array.isArray(seleccion.elementos) ? seleccion.elementos : [],
                cargando: false,
                elementosEliminados: []
            });
        } catch (error) {
            set({ cargando: false, elementos: [], paginas: [] });
        }
    },

    agregarElemento: (tipo) => {
        const { elementos } = get();
        let contenidoInicial = '';
        if (tipo === 'LISTA') contenidoInicial = '[]';
        if (tipo === 'SEPARADOR') contenidoInicial = 'separador';

        const nuevo = {
            idTemporal: `temp_${Date.now()}`,
            tipo: tipo,
            contenido: contenidoInicial,
            orden: elementos.length + 1
        };
        set({ elementos: [...elementos, nuevo], esSucio: true });
    },

    actualizarElemento: (identificador, contenido) => {
        const { elementos } = get();
        const actualizados = elementos.map(el => 
            (el.id === identificador || el.idTemporal === identificador) ? { ...el, contenido } : el
        );
        set({ elementos: actualizados, esSucio: true });
    },

    reordenarElementos: (nuevaLista) => {
        if (!nuevaLista) return;
        const listaOrdenada = nuevaLista.map((el, i) => ({ ...el, orden: i + 1 }));
        set({ elementos: listaOrdenada, esSucio: true });
    },

    eliminarElemento: (identificador) => {
        const { elementos, elementosEliminados } = get();
        const objetivo = elementos.find(e => e.id === identificador || e.idTemporal === identificador);
        const restantes = elementos.filter(e => e.id !== identificador && e.idTemporal !== identificador);
        const reindexados = restantes.map((el, i) => ({ ...el, orden: i + 1 }));
        const nuevosEliminados = (objetivo && objetivo.id) 
            ? [...elementosEliminados, objetivo.id] 
            : elementosEliminados;
        set({ 
            elementos: reindexados, 
            elementosEliminados: nuevosEliminados, 
            esSucio: true 
        });
    },

    guardarLienzo: async () => {
        const { paginaActiva, paginas, elementos, elementosEliminados } = get();
        if (!paginaActiva || !paginaActiva.id) return;
        set({ cargando: true });
        try {
            for (const idEliminado of elementosEliminados) {
                try {
                    await CuadernoDataService.eliminarElemento(idEliminado);
                } catch (e) {}
            }
            
            const copiaElementos = [...elementos];
            for (let i = 0; i < copiaElementos.length; i++) {
                const el = copiaElementos[i];
                
                // Evitar fallos con separadores e imágenes vacías
                if (el.tipo !== 'SEPARADOR' && el.tipo !== 'IMAGEN' && (!el.contenido || el.contenido.toString().trim() === '')) {
                    continue; 
                }

                const dto = {
                    tipo: el.tipo,
                    contenido: el.contenido ? el.contenido.toString() : (el.tipo === 'SEPARADOR' ? 'separador' : ''),
                    orden: el.orden || (i + 1)
                };

                if (el.id && !el.id.toString().startsWith('temp_')) {
                    dto.id = el.id;
                }

                const guardado = await CuadernoDataService.guardarElemento(paginaActiva.id, dto);
                
                if (guardado && guardado.id) {
                    copiaElementos[i] = { ...el, id: guardado.id, idTemporal: null };
                }
            }

            const paginasActualizadas = paginas.map(p => 
                p.id === paginaActiva.id ? { ...p, elementos: copiaElementos } : p
            );

            set({ 
                elementos: copiaElementos, 
                paginas: paginasActualizadas,
                esSucio: false, 
                elementosEliminados: [], 
                cargando: false 
            });
        } catch (error) {
            set({ cargando: false });
            throw error;
        }
    },

    cambiarPagina: async (indice) => {
        const { paginas, esSucio, guardarLienzo } = get();
        if (indice < 0 || indice >= paginas.length) return;
        
        if (esSucio) {
            await guardarLienzo();
        }
        
        const seleccion = paginas[indice];
        set({
            paginaActiva: seleccion,
            elementos: Array.isArray(seleccion.elementos) ? seleccion.elementos : [],
            esSucio: false,
            elementosEliminados: []
        });
    },

    agregarPagina: async () => {
        const { cuadernoActivo, paginas, esSucio, guardarLienzo } = get();
        if (!cuadernoActivo) return;
        set({ cargando: true });
        try {
            if (esSucio) await guardarLienzo();
            
            const nueva = await CuadernoDataService.crearPagina(cuadernoActivo.id, paginas.length + 1);
            const actualizadas = [...paginas, nueva];
            
            set({
                paginas: actualizadas,
                paginaActiva: nueva,
                elementos: [],
                esSucio: false,
                elementosEliminados: [],
                cargando: false
            });
        } catch (error) {
            set({ cargando: false });
        }
    },

    eliminarPaginaActual: async () => {
        const { paginaActiva, paginas } = get();
        if (!paginaActiva || paginas.length <= 1) return;
        set({ cargando: true });
        try {
            await CuadernoDataService.eliminarPagina(paginaActiva.id);
            const restantes = paginas.filter(p => p.id !== paginaActiva.id);
            const seleccion = restantes[0];
            set({
                paginas: restantes,
                paginaActiva: seleccion,
                elementos: Array.isArray(seleccion.elementos) ? seleccion.elementos : [],
                esSucio: false,
                elementosEliminados: [],
                cargando: false
            });
        } catch (error) {
            set({ cargando: false });
        }
    },

    limpiarEstado: () => {
        set({ 
            cuadernoActivo: null, 
            paginas: [],
            paginaActiva: null, 
            elementos: [], 
            elementosEliminados: [], 
            esSucio: false, 
            cargando: false 
        });
    }
}));

export default useCuadernoStore;