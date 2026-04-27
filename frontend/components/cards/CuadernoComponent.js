import { ChevronRight, Clock, Lock } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';
import { obtenerImagenCuaderno } from '../../utils/ImagenHelper';

// Convierte la fecha en texto breve
const formatearFechaAmigable = (fecha) => {
    if (!fecha) return "Pendiente";
    const d = new Date(fecha);
    const opciones = { 
        day: '2-digit', 
        month: 'short' 
    };
    return d.toLocaleDateString('es-ES', opciones).replace('.', '');
};

// Tarjeta visual con la información de un cuaderno
const CuadernoComponent = ({ cuaderno, alPresionar }) => {
    return (
        <TouchableOpacity 
            style={estilos.contenedorTarjeta} 
            activeOpacity={0.7} 
            onPress={alPresionar}
        >
            <View style={estilos.seccionImagen}>
                <Image 
                    source={obtenerImagenCuaderno(cuaderno?.urlPortada)} 
                    style={estilos.imagenPortada}
                    defaultSource={require('../../assets/img/notebook/default_portada.png')}
                />
                {cuaderno?.visibilidad === 'PRIVADO' && (
                    <View style={estilos.capaPrivada}>
                        <Lock 
                            color={Colores.texto.invertido} 
                            size={Tipografia.tamano.detalles - 2} 
                            strokeWidth={3} 
                        />
                    </View>
                )}
            </View>

            <View style={estilos.seccionInformacion}>
                <View style={estilos.filaSuperior}>
                    <Text 
                        style={estilos.textoTitulo} 
                        numberOfLines={1}
                    >
                        {cuaderno.titulo || "Sin título"}
                    </Text>
                </View>

                <Text 
                    style={estilos.textoDescripcion} 
                    numberOfLines={1}
                >
                    {cuaderno.descripcion || "Explora este cuaderno."}
                </Text>
                
                <View style={estilos.filaInferior}>
                    <View style={estilos.insigniaFecha}>
                        <Clock 
                            size={Tipografia.tamano.detalles} 
                            color={Colores.primario} 
                            style={estilos.iconoReloj} 
                        />
                        <Text style={estilos.textoFecha}>
                            {formatearFechaAmigable(cuaderno.fechaActualizado || cuaderno.fechaCreacion)}
                        </Text>
                    </View>

                    <View style={estilos.cajaDerecha}>
                        <View style={estilos.fichaEtiqueta} />
                        <View style={estilos.circuloAccion}>
                            <ChevronRight 
                                size={Tipografia.tamano.basico} 
                                color={Colores.texto.invertido} 
                                strokeWidth={3} 
                            />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const baseTexto = {
    fontFamily: Tipografia.familia
};

const baseInsignia = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
};

const estilos = StyleSheet.create({
    contenedorTarjeta: {
        backgroundColor: Colores.superficie,
        borderRadius: 24,
        marginBottom: 16,
        width: '100%',
        flexDirection: 'row',
        padding: 12,
        shadowColor: Colores.texto.principal,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes
    },
    seccionImagen: {
        position: 'relative',
        justifyContent: 'center'
    },
    imagenPortada: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: Colores.fondoMedio,
        resizeMode: 'cover'
    },
    capaPrivada: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colores.texto.principal,
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colores.texto.invertido
    },
    seccionInformacion: {
        flex: 1,
        paddingLeft: 16,
        justifyContent: 'space-between',
        paddingVertical: 4
    },
    filaSuperior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textoTitulo: {
        ...baseTexto,
        fontSize: Tipografia.tamano.normal,
        fontWeight: '900',
        color: Colores.texto.principal,
        flex: 1
    },
    textoDescripcion: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario,
        fontWeight: '500',
        marginVertical: 4
    },
    filaInferior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4
    },
    insigniaFecha: {
        ...baseInsignia,
        backgroundColor: Colores.fondoBase
    },
    iconoReloj: {
        marginRight: 6
    },
    textoFecha: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        color: Colores.primario,
        fontWeight: '700'
    },
    cajaDerecha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    fichaEtiqueta: {
        ...baseInsignia,
        backgroundColor: Colores.fondoMedio,
        borderRadius: 8
    },
    circuloAccion: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colores.primario,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CuadernoComponent;