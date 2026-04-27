import * as ImagePicker from 'expo-image-picker';
import { GripHorizontal, ImagePlus, Minus, X } from 'lucide-react-native';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

// Gestiona la representacion de los distintos tipos de bloques de contenido
const BloqueComponent = ({ elemento, modoEdicion, drag, isActive, onUpdate, onDelete }) => {
    const { tipo, contenido } = elemento;

    const procesarLista = (str) => {
        try { 
            return JSON.parse(str); 
        } catch (e) { 
            return []; 
        }
    };

    const actualizarLista = (textoStr) => {
        const array = textoStr.split('\n');
        onUpdate(JSON.stringify(array));
    };

    const renderizarLista = () => {
        const array = procesarLista(contenido);
        return array.map((item, idx) => (
            <View key={idx} style={estilos.filaLista}>
                <Text style={estilos.puntoLista}>•</Text>
                <Text style={estilos.textoLista}>
                    {item}
                </Text>
            </View>
        ));
    };

    const seleccionarImagen = async () => {
        if (!modoEdicion) return;
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });
        if (!res.canceled) {
            const uri = res.assets[0].uri;
            onUpdate(uri.split('/').pop());
        }
    };

    const obtenerImagen = () => {
        if (!contenido) return null;
        if (contenido.startsWith('file://') || contenido.startsWith('http')) return { uri: contenido };
        return { uri: `http://10.0.2.2:8080/assets/img/notebook/${contenido}` };
    };

    const renderizarVista = () => {
        if (tipo === 'IMAGEN') {
            return contenido ? (
                <Image source={obtenerImagen()} style={estilos.imagenVisual} resizeMode="contain" />
            ) : null;
        }
        if (tipo === 'SEPARADOR') {
            return <View style={estilos.divisorSeparador} />;
        }
        if (tipo === 'LISTA') {
            return <View style={estilos.contenedorLista}>{renderizarLista()}</View>;
        }
        
        let estBase = estilos.textoNormal;
        if (tipo === 'TITULO') estBase = estilos.textoTitulo;
        if (tipo === 'SUBTITULO') estBase = estilos.textoSubtitulo;
        if (tipo === 'ENLACE') estBase = estilos.textoEnlace;

        return <Text style={estBase}>{contenido}</Text>;
    };

    const renderizarEdicion = () => {
        if (tipo === 'IMAGEN') {
            return (
                <TouchableOpacity onPress={seleccionarImagen} style={estilos.cajaImagen}>
                    {contenido ? (
                        <Image source={obtenerImagen()} style={estilos.imagenEntrada} resizeMode="cover" />
                    ) : (
                        <View style={estilos.cajaMarcador}>
                            <ImagePlus 
                                size={Tipografia.tamano.titulo} 
                                color={Colores.texto.secundario} 
                            />
                        </View>
                    )}
                </TouchableOpacity>
            );
        }
        if (tipo === 'SEPARADOR') {
            return (
                <View style={estilos.cajaSeparador}>
                    <Minus 
                        size={Tipografia.tamano.subtitulo} 
                        color={Colores.bordes} 
                    />
                    <Minus 
                        size={Tipografia.tamano.subtitulo} 
                        color={Colores.bordes} 
                    />
                    <Minus 
                        size={Tipografia.tamano.subtitulo} 
                        color={Colores.bordes} 
                    />
                </View>
            );
        }

        const val = tipo === 'LISTA' ? procesarLista(contenido).join('\n') : contenido;
        const multi = tipo === 'TEXTO' || tipo === 'LISTA';

        let estInp = estilos.entradaBasica;
        if (tipo === 'TITULO') estInp = estilos.entradaTitulo;
        if (tipo === 'SUBTITULO') estInp = estilos.entradaSubtitulo;

        return (
            <TextInput
                style={estInp}
                value={val}
                onChangeText={tipo === 'LISTA' ? actualizarLista : onUpdate}
                placeholder={`Contenido de ${tipo.toLowerCase()}...`}
                placeholderTextColor={Colores.texto.secundario}
                multiline={multi}
                scrollEnabled={false}
            />
        );
    };

    if (!modoEdicion) {
        if (!contenido || (tipo === 'LISTA' && procesarLista(contenido).length === 0)) {
            if (tipo !== 'SEPARADOR') return null;
        }
        return (
            <View style={estilos.contenedorVisual}>
                {renderizarVista()}
            </View>
        );
    }

    return (
        <View style={[estilos.tarjetaEdicion, isActive && estilos.tarjetaActiva]}>
            <View style={estilos.cabeceraTarjeta}>
                <Text style={estilos.etiquetaTipo}>
                    {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                </Text>
                <View style={estilos.filaAcciones}>
                    <TouchableOpacity onPress={onDelete} style={estilos.botonEliminar}>
                        <X 
                            color={Colores.estados.error} 
                            size={Tipografia.tamano.detalles} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onLongPress={drag} delayLongPress={100} style={estilos.botonArrastrar}>
                        <GripHorizontal 
                            color={Colores.texto.secundario} 
                            size={Tipografia.tamano.subtitulo} 
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={estilos.cuerpoBloque}>
                {renderizarEdicion()}
            </View>
        </View>
    );
};

const baseTexto = {
    fontFamily: Tipografia.familia,
    color: Colores.texto.secundario
};

const entradaReset = {
    padding: 0,
    fontFamily: Tipografia.familia
};

const centrado = {
    justifyContent: 'center',
    alignItems: 'center'
};

const estilos = StyleSheet.create({
    contenedorVisual: {
        marginBottom: 15
    },
    textoTitulo: {
        ...baseTexto,
        fontSize: Tipografia.tamano.titulo,
        fontWeight: '900',
        color: Colores.texto.principal
    },
    textoSubtitulo: {
        ...baseTexto,
        fontSize: Tipografia.tamano.subtitulo,
        fontWeight: '700',
        marginTop: 10
    },
    textoNormal: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        lineHeight: 26
    },
    textoEnlace: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        color: Colores.primario,
        textDecorationLine: 'underline'
    },
    divisorSeparador: {
        height: Metricas.bordeAncho,
        backgroundColor: Colores.bordes,
        marginVertical: 20
    },
    contenedorLista: {
        marginVertical: 5
    },
    filaLista: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6
    },
    puntoLista: {
        fontSize: Tipografia.tamano.normal,
        color: Colores.primario,
        marginRight: 10,
        lineHeight: 24
    },
    textoLista: {
        ...baseTexto,
        flex: 1,
        fontSize: Tipografia.tamano.basico,
        lineHeight: 24
    },
    imagenVisual: {
        width: '100%',
        height: 250,
        borderRadius: Metricas.radioImagen,
        marginVertical: 10
    },
    tarjetaEdicion: {
        backgroundColor: Colores.superficie,
        borderRadius: 12,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        padding: 15,
        marginBottom: 15,
        elevation: 1
    },
    tarjetaActiva: {
        borderColor: Colores.primario,
        elevation: 6
    },
    cabeceraTarjeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    etiquetaTipo: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '800',
        color: Colores.primario,
        textTransform: 'uppercase'
    },
    filaAcciones: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    botonEliminar: {
        marginRight: 15,
        padding: 4,
        backgroundColor: 'rgba(224, 122, 95, 0.12)',
        borderRadius: 6
    },
    botonArrastrar: {
        padding: 2
    },
    cuerpoBloque: {
        minHeight: 40
    },
    entradaBasica: {
        ...entradaReset,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.principal,
        lineHeight: 22
    },
    entradaTitulo: {
        ...entradaReset,
        fontSize: Tipografia.tamano.subtitulo + 4,
        fontWeight: '800',
        color: Colores.texto.principal
    },
    entradaSubtitulo: {
        ...entradaReset,
        fontSize: Tipografia.tamano.normal,
        fontWeight: '700',
        color: Colores.texto.secundario
    },
    cajaSeparador: {
        ...centrado,
        flexDirection: 'row',
        marginVertical: 10,
        gap: 4
    },
    cajaImagen: {
        ...centrado,
        width: '100%',
        height: 150,
        backgroundColor: Colores.fondoMedio,
        borderRadius: Metricas.radioBoton,
        overflow: 'hidden',
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        borderStyle: 'dashed'
    },
    imagenEntrada: {
        width: '100%',
        height: '100%'
    },
    cajaMarcador: {
        ...centrado
    }
});

export default BloqueComponent;