import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colores, Tipografia } from '../../theme/AppTheme';

// Barra de navegación superior
const CabeceraComponent = ({ titulo, accionIzquierda, iconoIzquierda, accionDerecha, iconoDerecha }) => {
    return (
        <View style={estilos.contenedorCabecera}>
            <SafeAreaView style={estilos.areaSegura}>
                <View style={estilos.cajaNavegacion}>
                    <TouchableOpacity 
                        onPress={accionIzquierda} 
                        style={estilos.botonAccion}
                    >
                        {iconoIzquierda}
                    </TouchableOpacity>
                    
                    <Text style={estilos.textoTitulo}>{titulo}</Text>
                    
                    <TouchableOpacity 
                        onPress={accionDerecha} 
                        style={estilos.botonAccion} 
                        disabled={!accionDerecha}
                    >
                        {iconoDerecha}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const estilos = StyleSheet.create({
    contenedorCabecera: {
        backgroundColor: Colores.primario,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: Colores.texto.principal,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    areaSegura: {
        backgroundColor: Colores.primario
    },
    cajaNavegacion: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    botonAccion: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
    },
    textoTitulo: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.titulo,
        fontWeight: '900',
        color: Colores.texto.invertido,
        letterSpacing: 3,
        textTransform: 'uppercase'
    }
});

export default CabeceraComponent;