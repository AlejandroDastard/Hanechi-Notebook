import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

const BotonComponent = ({
    titulo,
    onPress,
    variante = 'primaria',
    estaCargando = false,
    estaDeshabilitado = false
}) => {
    const estilosVariantes = {
        primaria: estilos.variantePrimaria,
        acento: estilos.varianteAcento,
        fantasma: estilos.varianteFantasma
    };

    const estiloBoton = [
        estilos.botonContenedor,
        estilosVariantes[variante],
        (estaDeshabilitado || estaCargando) && estilos.estadoDeshabilitado
    ];

    const estiloTexto = [
        estilos.etiquetaBase,
        variante === 'fantasma' ? estilos.textoColor : estilos.textoInvertido
    ];

    return (
        <TouchableOpacity
            style={estiloBoton}
            onPress={onPress}
            disabled={estaDeshabilitado || estaCargando}
            activeOpacity={0.7}
        >
            {estaCargando ? (
                <ActivityIndicator 
                    color={variante === 'fantasma' ? Colores.primario : Colores.texto.invertido} 
                />
            ) : (
                <Text style={estiloTexto}>{titulo}</Text>
            )}
        </TouchableOpacity>
    );
};

const sombraComun = {
    elevation: 2,
    shadowColor: Colores.sombras,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
};

const estilos = StyleSheet.create({
    botonContenedor: {
        height: 50,
        borderRadius: Metricas.radioImagen,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: Metricas.base,
        flexDirection: 'row'
    },
    variantePrimaria: {
        ...sombraComun,
        backgroundColor: Colores.primario
    },
    varianteAcento: {
        ...sombraComun,
        backgroundColor: Colores.acento
    },
    varianteFantasma: {
        backgroundColor: 'transparent',
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.primario
    },
    estadoDeshabilitado: {
        opacity: 0.5
    },
    etiquetaBase: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.normal,
        fontWeight: '600'
    },
    textoInvertido: {
        color: Colores.texto.invertido
    },
    textoColor: {
        color: Colores.primario
    }
});

export default BotonComponent;