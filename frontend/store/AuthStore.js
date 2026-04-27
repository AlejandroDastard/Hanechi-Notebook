import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
    token: null,
    usuario: null,
    estaAutenticado: false,
    cargando: true,

    inicializarAuth: async () => {
        try {
            const tokenGuardado = await AsyncStorage.getItem('hanechi_token');
            const usuarioGuardado = await AsyncStorage.getItem('hanechi_usuario');

            if (tokenGuardado && usuarioGuardado) {
                set({
                    token: tokenGuardado,
                    usuario: JSON.parse(usuarioGuardado),
                    estaAutenticado: true
                });
            }
        } catch (error) {
            console.error("[AuthStore] Error de hidratación:", error);
        } finally {
            set({ cargando: false });
        }
    },

    login: async (token, usuario) => {
        if (!token || !usuario) return;
        
        try {
            await AsyncStorage.setItem('hanechi_token', token);
            await AsyncStorage.setItem('hanechi_usuario', JSON.stringify(usuario));
            
            set({
                token: token,
                usuario: usuario,
                estaAutenticado: true
            });
        } catch (error) {
            console.error("[AuthStore] Error al guardar sesión:", error);
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.multiRemove(['hanechi_token', 'hanechi_usuario']);
            set({
                token: null,
                usuario: null,
                estaAutenticado: false
            });
        } catch (error) {
            console.error("[AuthStore] Error al cerrar sesión:", error);
        }
    }
}));

export default useAuthStore;