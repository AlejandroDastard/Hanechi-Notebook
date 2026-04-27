import { ArrowLeft, ChevronLeft, ChevronRight, FileX } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CabeceraComponent from '../../components/layout/CabeceraComponent';
import BloqueComponent from '../../components/notebook/BloqueComponent';
import IndiceComponent from '../../components/notebook/IndiceComponent';
import useCuadernoStore from '../../store/CuadernoStore';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

// Visualización de los elementos del cuaderno
const VerCuadernoScreen = ({ navigation, route }) => {
    const { idCuaderno } = route.params;
    const { 
        cargarCuaderno, 
        cuadernoActivo, 
        paginas,
        paginaActiva,
        elementos, 
        cargando, 
        cambiarPagina,
        limpiarEstado 
    } = useCuadernoStore();

    useEffect(() => {
        cargarCuaderno(idCuaderno);
        return () => limpiarEstado();
    }, [idCuaderno]);

    const indiceActual = paginas.findIndex(p => p.id === paginaActiva?.id);

    // Cargar cada bloque de contenido de la página
    const renderItem = useCallback(({ item }) => (
        <BloqueComponent 
            elemento={item} 
            modoEdicion={false} 
        />
    ), []);

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Modo Lectura"
                iconoIzquierda={
                    <ArrowLeft 
                        color={Colores.texto.invertido} 
                        size={Tipografia.tamano.subtitulo} 
                    />
                }
                accionIzquierda={() => navigation.goBack()}
            />
            
            <View style={estilos.cajaLienzo}>
                {cargando && elementos.length === 0 ? (
                    <View style={estilos.contenedorCarga}>
                        <ActivityIndicator 
                            size="large" 
                            color={Colores.primario} 
                        />
                        <Text style={estilos.textoCarga}>Preparando lienzo...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={elementos}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        renderItem={renderItem}
                        contentContainerStyle={estilos.listaContenido}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={estilos.contenedorVacio}>
                                <FileX 
                                    size={48} 
                                    color={Colores.texto.secundario} 
                                />
                                <Text style={estilos.textoVacio}>Esta página está en blanco.</Text>
                            </View>
                        }
                    />
                )}
            </View>

            <View style={estilos.navegacionInferior}>
                <TouchableOpacity 
                    style={[estilos.botonFlecha, indiceActual <= 0 && estilos.flechaDeshabilitada]} 
                    onPress={() => cambiarPagina(indiceActual - 1)}
                    disabled={indiceActual <= 0}
                >
                    <ChevronLeft 
                        color={Colores.texto.principal} 
                        size={Tipografia.tamano.subtitulo + 4} 
                    />
                </TouchableOpacity>
                
                <View style={estilos.envoltorioIndice}>
                    <IndiceComponent 
                        paginas={paginas} 
                        paginaActivaId={paginaActiva?.id} 
                        onSelectPagina={cambiarPagina} 
                        cargando={cargando} 
                    />
                </View>

                <TouchableOpacity 
                    style={[estilos.botonFlecha, indiceActual >= paginas.length - 1 && estilos.flechaDeshabilitada]} 
                    onPress={() => cambiarPagina(indiceActual + 1)}
                    disabled={indiceActual >= paginas.length - 1}
                >
                    <ChevronRight 
                        color={Colores.texto.principal} 
                        size={Tipografia.tamano.subtitulo + 4} 
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const centrado = {
    justifyContent: 'center',
    alignItems: 'center'
};

const baseTextoSecundario = {
    color: Colores.texto.secundario,
    fontFamily: Tipografia.familia
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    cajaLienzo: {
        flex: 1,
        backgroundColor: Colores.superficie
    },
    listaContenido: {
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 60
    },
    contenedorCarga: {
        flex: 1,
        ...centrado
    },
    textoCarga: {
        ...baseTextoSecundario,
        marginTop: 15,
        fontSize: Tipografia.tamano.detalles
    },
    contenedorVacio: {
        alignItems: 'center',
        marginTop: 80
    },
    textoVacio: {
        ...baseTextoSecundario,
        textAlign: 'center',
        fontSize: Tipografia.tamano.basico,
        marginTop: 15
    },
    navegacionInferior: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colores.fondoMedio,
        borderTopWidth: Metricas.bordeAncho,
        borderTopColor: Colores.bordes
    },
    botonFlecha: {
        ...centrado,
        padding: 15
    },
    flechaDeshabilitada: {
        opacity: 0.3
    },
    envoltorioIndice: {
        flex: 1
    }
});

export default VerCuadernoScreen;