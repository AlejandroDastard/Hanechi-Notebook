import { Hash } from 'lucide-react-native';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colores, EstilosGlobales, Metricas, Tipografia } from '../../theme/AppTheme';
import { obtenerImagenAvatar, obtenerImagenCuaderno } from '../../utils/ImagenHelper';

const { width } = Dimensions.get('window');

// Tarjetas de busqueda para cuadernos o usuarios
const BusquedaComponent = ({ item, tipo, onPress }) => {
    if (tipo === 'cuadernos' || tipo === 'codigo') {
        return (
            <TouchableOpacity 
                style={[estilos.tarjetaCuaderno, EstilosGlobales.sombraSutil]} 
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Image 
                    source={obtenerImagenCuaderno(item.urlPortada)} 
                    style={estilos.imagenCuaderno} 
                />
                <View style={estilos.informacionCuaderno}>
                    <Text 
                        style={estilos.tituloCuaderno} 
                        numberOfLines={2}
                    >
                        {item.titulo || "Sin título"}
                    </Text>
                    <View style={estilos.pieCuaderno}>
                        <Hash 
                            size={12} 
                            color={Colores.primario} 
                        />
                        <Text style={estilos.codigoCuaderno}>
                            {item.codigo || "----"}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity 
            style={[estilos.tarjetaUsuario, EstilosGlobales.sombraSutil]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Image 
                source={obtenerImagenAvatar(item.urlAvatar)} 
                style={estilos.imagenUsuario} 
            />
            <View style={estilos.informacionUsuario}>
                <Text style={estilos.nombreUsuario}>
                    {item.nombrePerfil || item.nombreUsuario || "Usuario"}
                </Text>
                <Text style={estilos.identificadorUsuario}>
                    @{item.nombreUsuario || "desconocido"}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const baseTexto = {
    fontFamily: Tipografia.familia
};

const baseTarjeta = {
    backgroundColor: Colores.superficie,
    borderRadius: 20,
    borderColor: Colores.bordes
};

const estilos = StyleSheet.create({
    tarjetaCuaderno: {
        ...baseTarjeta,
        width: (width / 2) - 22,
        marginBottom: 15,
        marginHorizontal: 7,
        overflow: 'hidden',
        borderWidth: Metricas.bordeAncho
    },
    imagenCuaderno: {
        width: '100%',
        height: 130,
        backgroundColor: Colores.fondoMedio
    },
    informacionCuaderno: {
        padding: 12
    },
    tituloCuaderno: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        fontWeight: '800',
        color: Colores.texto.principal,
        marginBottom: 8
    },
    pieCuaderno: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    codigoCuaderno: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        color: Colores.primario,
        fontWeight: '800',
        marginLeft: 4
    },
    tarjetaUsuario: {
        ...baseTarjeta,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5
    },
    imagenUsuario: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
        borderWidth: 2,
        borderColor: Colores.primario
    },
    informacionUsuario: {
        flex: 1
    },
    nombreUsuario: {
        ...baseTexto,
        fontSize: Tipografia.tamano.normal,
        fontWeight: '800',
        color: Colores.texto.principal
    },
    identificadorUsuario: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        color: Colores.primario,
        fontWeight: '600',
        marginTop: 2
    }
});

export default BusquedaComponent;