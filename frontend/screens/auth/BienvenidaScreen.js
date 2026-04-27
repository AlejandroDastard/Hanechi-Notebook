import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

// Página Inicial de bienvenida
const BienvenidaScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <View style={estilos.grupoCentro}>
                <Image 
                    source={require('../../assets/img/brand/logo.png')} 
                    style={estilos.imagenLogo}
                    resizeMode="contain"
                />

                <View style={estilos.contenedorAcciones}>
                    <TouchableOpacity 
                        style={estilos.botonPrincipal}
                        onPress={() => navigation.navigate('InicioSesion')}
                        activeOpacity={0.8}
                    >
                        <Text style={estilos.textoPrincipal}>Iniciar Sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={estilos.botonSecundario}
                        onPress={() => navigation.navigate('InicioSesion')}
                        activeOpacity={0.8}
                    >
                        <Text style={estilos.textoSecundario}>Crear Cuenta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const baseBoton = {
    height: 50,
    borderRadius: Metricas.radioImagen,
    justifyContent: 'center',
    alignItems: 'center'
};

const baseTexto = {
    fontFamily: Tipografia.familia,
    fontSize: Tipografia.tamano.basico
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.primario,
        paddingHorizontal: 30
    },
    grupoCentro: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imagenLogo: {
        width: 220,
        height: 220,
        tintColor: Colores.fondoBase,
        marginBottom: 35
    },
    contenedorAcciones: {
        width: '100%'
    },
    botonPrincipal: {
        ...baseBoton,
        backgroundColor: Colores.fondoBase,
        marginBottom: 15
    },
    botonSecundario: {
        ...baseBoton,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colores.fondoBase
    },
    textoPrincipal: {
        ...baseTexto,
        fontWeight: '700',
        color: Colores.primario
    },
    textoSecundario: {
        ...baseTexto,
        fontWeight: '600',
        color: Colores.fondoBase
    }
});

export default BienvenidaScreen;