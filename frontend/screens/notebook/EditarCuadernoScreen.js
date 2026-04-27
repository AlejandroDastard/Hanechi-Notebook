import { ArrowLeft, Heading1, Heading2, Image as ImageIcon, Link as LinkIcon, List, Minus, Plus, Save, Trash2, Type } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import CabeceraComponent from '../../components/layout/CabeceraComponent';
import BloqueComponent from '../../components/notebook/BloqueComponent';
import IndiceComponent from '../../components/notebook/IndiceComponent';
import useCuadernoStore from '../../store/CuadernoStore';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

// Canvas para la edición de Cuadernos
const EditarCuadernoScreen = ({ navigation, route }) => {
    const { idCuaderno } = route.params;
    const { 
        cargarCuaderno, 
        paginas,
        paginaActiva,
        elementos, 
        cargando, 
        esSucio,
        agregarElemento,
        actualizarElemento,
        reordenarElementos,
        eliminarElemento,
        guardarLienzo,
        cambiarPagina,
        agregarPagina,
        eliminarPaginaActual,
        limpiarEstado
    } = useCuadernoStore();

    useEffect(() => {
        cargarCuaderno(idCuaderno);
        return () => limpiarEstado();
    }, [idCuaderno]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!esSucio) return;
            e.preventDefault();
            Alert.alert(
                'Cambios sin guardar',
                '¿Deseas guardar los cambios antes de salir?',
                [
                    { text: 'Cancelar', style: 'cancel', onPress: () => {} },
                    { text: 'Descartar', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
                    { 
                        text: 'Guardar y Salir', 
                        onPress: async () => { 
                            try {
                                await guardarLienzo(); 
                                navigation.dispatch(e.data.action); 
                            } catch (err) {
                                Alert.alert("Error", "No se pudo guardar automáticamente.");
                            }
                        } 
                    }
                ]
            );
        });
        return unsubscribe;
    }, [navigation, esSucio, guardarLienzo]);

    const manejarGuardado = async () => {
        if (cargando) return;
        try {
            await guardarLienzo();
            Alert.alert("Guardado", "El cuaderno se ha guardado correctamente.");
        } catch (e) {
            Alert.alert("Error", "Fallo al procesar los bloques. Revisa tu conexión.");
        }
    };

    const manejarEliminarPagina = () => {
        if (paginas.length <= 1) {
            Alert.alert("Aviso", "No puedes eliminar la única página del cuaderno.");
            return;
        }
        Alert.alert(
            "Eliminar Página",
            "¿Estás seguro de que deseas eliminar esta página y todo su contenido?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: () => eliminarPaginaActual() }
            ]
        );
    };

    const indiceActual = paginas.findIndex(p => p.id === paginaActiva?.id);

    // Renderiza el componente de bloque y la funcion de arrastrar
    const renderItem = useCallback(({ item, drag, isActive }) => (
        <BloqueComponent 
            elemento={item} 
            modoEdicion={true} 
            drag={drag} 
            isActive={isActive}
            onUpdate={(cont) => actualizarElemento(item.id || item.idTemporal, cont)}
            onDelete={() => eliminarElemento(item.id || item.idTemporal)}
        />
    ), [actualizarElemento, eliminarElemento]);

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Editar"
                iconoIzquierda={
                    <ArrowLeft 
                        color={Colores.texto.invertido} 
                        size={Tipografia.tamano.titulo} 
                    />
                }
                accionIzquierda={() => navigation.goBack()}
                iconoDerecha={
                    cargando ? (
                        <ActivityIndicator 
                            color={Colores.texto.invertido} 
                            size={Tipografia.tamano.basico} 
                        />
                    ) : (
                        <Save 
                            color={esSucio ? Colores.acento : Colores.texto.invertido} 
                            size={Tipografia.tamano.subtitulo} 
                        />
                    )
                }
                accionDerecha={manejarGuardado}
            />
            
            <View style={estilos.barraSuperior}>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={estilos.desplazamientoHerramientas}
                >
                    <TouchableOpacity 
                        style={estilos.botonHerramienta} 
                        onPress={() => agregarElemento('TITULO')}
                    >
                        <Heading1 
                            size={18} 
                            color={Colores.texto.principal} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={estilos.botonHerramienta} 
                        onPress={() => agregarElemento('SUBTITULO')}
                    >
                        <Heading2 
                            size={18} 
                            color={Colores.texto.principal} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={estilos.botonHerramienta} 
                        onPress={() => agregarElemento('TEXTO')}
                    >
                        <Type 
                            size={18} 
                            color={Colores.texto.principal} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={estilos.botonHerramienta} 
                        onPress={() => agregarElemento('IMAGEN')}
                    >
                        <ImageIcon 
                            size={18} 
                            color={Colores.texto.principal} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={estilos.botonHerramienta} 
                        onPress={() => agregarElemento('LISTA')}
                    >
                        <List 
                            size={18} 
                            color={Colores.texto.principal} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={estilos.botonHerramienta} 
                        onPress={() => agregarElemento('ENLACE')}
                    >
                        <LinkIcon 
                            size={18} 
                            color={Colores.texto.principal} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={estilos.botonHerramienta} 
                        onPress={() => agregarElemento('SEPARADOR')}
                    >
                        <Minus 
                            size={18} 
                            color={Colores.texto.principal} 
                        />
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={estilos.cajaLienzo}>
                {cargando && elementos.length === 0 ? (
                    <View style={estilos.contenedorCentro}>
                        <ActivityIndicator 
                            size="large" 
                            color={Colores.primario} 
                        />
                    </View>
                ) : (
                    <DraggableFlatList
                        data={elementos}
                        onDragEnd={({ data }) => reordenarElementos(data)}
                        keyExtractor={(item) => item.id || item.idTemporal}
                        renderItem={renderItem}
                        contentContainerStyle={estilos.listaContenido}
                        ListEmptyComponent={
                            <View style={estilos.contenedorCentro}>
                                <Text style={estilos.textoVacio}>
                                    Lienzo vacío. Añade bloques desde el menú superior.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            <IndiceComponent 
                paginas={paginas} 
                paginaActivaId={paginaActiva?.id} 
                onSelectPagina={cambiarPagina} 
                cargando={cargando} 
            />

            <View style={estilos.barraInferior}>
                <View style={estilos.navegacionIzquierda}>
                    <Text style={estilos.textoPagina}>Panel de Páginas</Text>
                </View>
                <View style={estilos.navegacionDerecha}>
                    <TouchableOpacity 
                        style={estilos.botonPrimario} 
                        onPress={agregarPagina}
                    >
                        <Plus 
                            color={Colores.texto.invertido} 
                            size={Tipografia.tamano.basico} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={estilos.botonEliminar} 
                        onPress={manejarEliminarPagina}
                    >
                        <Trash2 
                            color={Colores.texto.invertido} 
                            size={Tipografia.tamano.basico} 
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const baseTexto = {
    fontFamily: Tipografia.familia,
    fontSize: Tipografia.tamano.detalles
};

const baseBoton = {
    padding: 10,
    borderRadius: 8
};

const filaCentrada = {
    flexDirection: 'row',
    alignItems: 'center'
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    barraSuperior: {
        backgroundColor: Colores.superficie,
        borderBottomWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes
    },
    desplazamientoHerramientas: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        gap: 10
    },
    botonHerramienta: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: Colores.fondoMedio,
        borderRadius: 8,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes
    },
    cajaLienzo: {
        flex: 1,
        backgroundColor: Colores.fondoMedio
    },
    listaContenido: {
        padding: 20
    },
    contenedorCentro: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    textoVacio: {
        ...baseTexto,
        textAlign: 'center',
        color: Colores.texto.secundario
    },
    barraInferior: {
        ...filaCentrada,
        justifyContent: 'space-between',
        backgroundColor: Colores.superficie,
        paddingHorizontal: 15,
        paddingVertical: 12,
        elevation: 5
    },
    navegacionIzquierda: {
        ...filaCentrada,
        gap: 15
    },
    textoPagina: {
        ...baseTexto,
        fontWeight: '800',
        color: Colores.texto.principal
    },
    navegacionDerecha: {
        ...filaCentrada,
        gap: 10
    },
    botonPrimario: {
        ...baseBoton,
        backgroundColor: Colores.primario
    },
    botonEliminar: {
        ...baseBoton,
        backgroundColor: Colores.estados.error
    }
});

export default EditarCuadernoScreen;