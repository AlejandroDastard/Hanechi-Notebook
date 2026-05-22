import { Platform } from 'react-native';

const IMAGENES_LOCALES = {
    avatar_default: require('../assets/img/avatar/default_avatar.png'),
    banner_default: require('../assets/img/banner/default_banner.jpg'),
    cuaderno_default: require('../assets/img/notebook/default_portada.png')
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Limpia el sufijo "/api" para apuntar a la raíz del servidor de Spring Boot
const BASE_URL_SERVER = `${API_URL.replace(/\/api$/, '')}/assets/img`;

export const obtenerImagenAvatar = (nombreArchivo) => {
    if (!nombreArchivo || nombreArchivo === "default_avatar.png") {
        return IMAGENES_LOCALES.avatar_default;
    }
    
    if (nombreArchivo.startsWith('file://') || nombreArchivo.startsWith('http')) {
        return { uri: nombreArchivo };
    }

    return { uri: `${BASE_URL_SERVER}/avatar/${nombreArchivo}` };
};

export const obtenerImagenBanner = (nombreArchivo) => {
    if (!nombreArchivo || nombreArchivo === "default_banner.png" || nombreArchivo === "default_banner.jpg") {
        return IMAGENES_LOCALES.banner_default;
    }

    if (nombreArchivo.startsWith('file://') || nombreArchivo.startsWith('http')) {
        return { uri: nombreArchivo };
    }

    return { uri: `${BASE_URL_SERVER}/banner/${nombreArchivo}` };
};

export const obtenerImagenCuaderno = (urlPortada) => {
    if (!urlPortada) {
        return IMAGENES_LOCALES.cuaderno_default;
    }
    
    if (urlPortada.startsWith('http') || urlPortada.startsWith('file://')) {
        return { uri: urlPortada };
    }

    return { uri: `${BASE_URL_SERVER}/notebook/${urlPortada}` };
};

export const subirImagenAlServidor = async (uri, tipo) => {
    try {
        const formData = new FormData();
        const nombreArchivo = uri.split('/').pop();
        
        const coincidenciaExt = /\.(\w+)$/.exec(nombreArchivo);
        const tipoMime = coincidenciaExt ? `image/${coincidenciaExt[1]}` : 'image/jpeg';

        formData.append('file', {
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            name: nombreArchivo,
            type: tipoMime,
        });

        const URL_ENV = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(`${URL_ENV}/upload/${tipo}`, {
            method: 'POST',
            body: formData,
            headers: {},
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor: Código de estado ${response.status}`);
        }

        const data = await response.json();
        return data.nombreArchivo;
    } catch (error) {
        console.error("Error en subirImagenAlServidor:", error);
        throw error;
    }
};