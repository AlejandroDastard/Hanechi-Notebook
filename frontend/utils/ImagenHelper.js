const IMAGENES_LOCALES = {
    avatar_default: require('../assets/img/avatar/default_avatar.png'),
    banner_default: require('../assets/img/banner/default_banner.jpg'),
    cuaderno_default: require('../assets/img/notebook/default_portada.png')
};

const BASE_URL_SERVER = "http://10.0.2.2:8080/assets/img";

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