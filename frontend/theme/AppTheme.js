import { StyleSheet } from 'react-native';

// --- Paleta de colores ---
export const Colores = {
    // Colores de Marca y Acento
    primario: '#588157',
    acento: '#E07A5F',

    // Colores de Fondo y Superficie
    fondoBase: '#FAF9F6',
    fondoMedio: '#DAD7CD',
    superficie: '#FFFFFF',
    bordes: '#D6D3D1',
    sombras: '#E7E5E4',

    // Colores de Texto
    texto: {
        principal: '#1C1917',
        secundario: '#78716C',
        invertido: '#FFFFFF',
        enlace: '#588157'
    },

    // Mensajes de estado
    estados: {
        exito: '#588157',
        error: '#E07A5F',
        alerta: '#DAD7CD'
    }
};

// --- Tipografía ---
export const Tipografia = {
    familia: 'Inter',
    tamano: {
        titulo: 28,   // Encabezados
        subtitulo: 20, // Secciones y modales
        normal: 18,    // Navegación y botones
        basico: 16,    // Cuerpo de texto
        detalles: 14   // Metadatos
    }
};

// --- Rejilla y Métricas ---
export const Metricas = {
    base: 8,
    paddingRaiz: 16,
    radioBoton: 8,
    radioImagen: 12,
    bordeAncho: 1
};

// --- Estilo de componentes y Profundidad ---
export const EstilosGlobales = StyleSheet.create({
    // Contenedor principal con padding estándar
    contenedorRaiz: {
        flex: 1,
        backgroundColor: Colores.fondoBase,
        padding: Metricas.paddingRaiz
    },

    // Tipografía base
    textoPrincipal: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.principal
    },

    // Profundidad
    sombraSutil: {
        shadowColor: Colores.sombras,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        backgroundColor: Colores.superficie
    },

    // Profundidad: Sombra Elevada (Elevation 4)
    sombraElevada: {
        shadowColor: Colores.sombras,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: Colores.superficie
    },

    // Cajas de texto
    input: {
        backgroundColor: Colores.superficie,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        borderRadius: Metricas.base / 2,
        padding: Metricas.base,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.principal
    },
    inputFoco: {
        borderColor: Colores.acento
    },

    // Botones Primarios
    botonPrimario: {
        backgroundColor: Colores.primario,
        paddingVertical: Metricas.base * 1.5,
        paddingHorizontal: Metricas.base * 2,
        borderRadius: Metricas.radioBoton,
        alignItems: 'center',
        justifyContent: 'center'
    },
    botonTextoInvertido: {
        color: Colores.texto.invertido,
        fontSize: Tipografia.tamano.normal,
        fontWeight: '600'
    },

    // Botones de Acciones Críticas
    botonCritico: {
        backgroundColor: Colores.acento,
        paddingVertical: Metricas.base * 1.5,
        borderRadius: Metricas.radioBoton,
        alignItems: 'center'
    }
});