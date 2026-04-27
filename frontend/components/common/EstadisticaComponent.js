import { StyleSheet, Text, View } from 'react-native';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

const EstadisticaComponent = ({ estadisticas, totalCuadernosManual }) => {
    const siguiendo = estadisticas?.totalSiguiendo || 0;
    const seguidores = estadisticas?.totalSeguidores || 0;
    const cuadernos = totalCuadernosManual !== undefined 
        ? totalCuadernosManual 
        : (estadisticas?.totalCuadernos || 0);

    return (
        <View style={estilos.contenedorPrincipal}>
            <View style={estilos.columnaDato}>
                <Text style={estilos.valorNumerico}>{siguiendo}</Text>
                <Text style={estilos.etiquetaTexto}>Siguiendo</Text>
            </View>
            
            <View style={estilos.separadorVertical} />
            
            <View style={estilos.columnaDato}>
                <Text style={estilos.valorNumerico}>{seguidores}</Text>
                <Text style={estilos.etiquetaTexto}>Seguidores</Text>
            </View>
            
            <View style={estilos.separadorVertical} />
            
            <View style={estilos.columnaDato}>
                <Text style={estilos.valorNumerico}>{cuadernos}</Text>
                <Text style={estilos.etiquetaTexto}>Cuadernos</Text>
            </View>
        </View>
    );
};

const baseTexto = {
    fontFamily: Tipografia.familia
};

const sombraSutil = {
    shadowColor: Colores.sombras,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
};

const estilos = StyleSheet.create({
    contenedorPrincipal: {
        ...sombraSutil,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        paddingVertical: Metricas.paddingRaiz,
        backgroundColor: Colores.superficie,
        borderTopWidth: Metricas.bordeAncho,
        borderBottomWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        width: '100%'
    },
    columnaDato: {
        flex: 1,
        alignItems: 'center'
    },
    valorNumerico: {
        ...baseTexto,
        fontSize: Tipografia.tamano.subtitulo,
        fontWeight: '900',
        color: Colores.texto.principal
    },
    etiquetaTexto: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        color: Colores.texto.secundario,
        fontWeight: '600',
        marginTop: 2
    },
    separadorVertical: {
        width: Metricas.bordeAncho,
        height: '60%',
        backgroundColor: Colores.bordes,
        alignSelf: 'center'
    }
});

export default EstadisticaComponent;