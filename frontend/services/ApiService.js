import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApiService = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT) || 15000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

ApiService.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("hanechi_token");

            if (token && token.trim() !== "") {
                config.headers.Authorization = `Bearer ${token}`;
            }

            console.log(`[API Request] ${config.method.toUpperCase()} -> ${config.url}`);
        } catch (error) {
            console.error("[API Request Error] Error al recuperar el token:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

ApiService.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            const status = error.response.status;
            console.error(`[API Response Error] Status: ${status}`);

            if (status === 401 || status === 403) {
                console.warn("[API] Sesión inválida o expirada.");
                // Quitar el permiso tras un error: await AsyncStorage.multiRemove(["hanechi_token", "hanechi_usuario"]);
            }
        } else if (error.request) {
            console.error("[API Network Error] No hubo respuesta del servidor.");
        } else {
            console.error("[API Critical Error]:", error.message);
        }
        return Promise.reject(error);
    }
);

export default ApiService;