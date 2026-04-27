import { useFocusEffect } from '@react-navigation/native';

import { Bell, Menu, Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CuadernoComponent from '../../components/cards/CuadernoComponent';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import CuadernoDataService from '../../services/CuadernoDataService';
import useAuthStore from '../../store/AuthStore';

import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

// Carga los datos de los cuadernos asociados al usuario
const InicioScreen = ({ navigation }) => {
    const usuario = useAuthStore((state) => state.usuario);
    const [cuadernos, setCuadernos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                if (!usuario?.id) return;
                try {
                    const data = await CuadernoDataService.obtenerCuadernosUsuario(usuario.id);
                    setCuadernos(data || []);
                } catch (error) {
                    setCuadernos([]);
                } finally {
                    setCargando(false);
                }
            };
            cargarDatos();
        }, [usuario?.id])
    );

    // Genera la seccion de acceso a crear un cuaderno
    const RenderCabecera = () => (
        <View style={estilos.cabeceraLista}>
            <Text style={estilos.textoTitulo}>Nuevo Cuaderno</Text>
            <Text style={estilos.textoSubtitulo}>
                Crea un espacio en blanco para tus próximas aventuras, recetas o reflexiones diarias.
            </Text>

            <View style={estilos.tarjetaPromocion}>
                <TouchableOpacity 
                    style={estilos.areaImagen}
                    onPress={() => navigation.navigate('CuadernosFlujo', { screen: 'CrearCuaderno' })}
                >
                    <View style={estilos.circuloIcono}>
                        <Plus 
                            color={Colores.texto.secundario} 
                            size={Tipografia.tamano.titulo} 
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={estilos.divisionSeccion}>
                <Text style={estilos.etiquetaSeccion}>Cuadernos Recientes</Text>
            </View>
        </View>
    );

    // Vista de cuando no hay cuadernos disponibles
    const RenderEstadoVacio = () => (
        <View style={estilos.estadoVacio}>
            <View style={estilos.fondoEmoticon}>
                <Text style={estilos.textoEmoticon}>📚</Text>
            </View>
            <Text style={estilos.tituloInformativo}>Archivo Vacío</Text>
            <Text style={estilos.descripcionInformativa}>Todavía no has creado ningún cuaderno en tu cuenta.</Text>
        </View>
    );

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Inicio"
                iconoIzquierda={
                    <Menu 
                        color={Colores.texto.invertido} 
                        size={Tipografia.tamano.titulo} 
                    />
                }
                accionIzquierda={() => navigation.openDrawer()}
                iconoDerecha={
                    <Bell 
                        color={Colores.texto.invertido} 
                        size={Tipografia.tamano.titulo} 
                    />
                }
                accionDerecha={() => navigation.navigate('Notificaciones')}
            />

            {cargando ? (
                <View style={estilos.contenedorCarga}>
                    <ActivityIndicator 
                        size="large" 
                        color={Colores.primario} 
                    />
                </View>
            ) : (
                <FlatList
                    data={cuadernos}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={estilos.listaCuadernos}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={RenderCabecera}
                    ListEmptyComponent={RenderEstadoVacio}
                    renderItem={({ item }) => (
                        <CuadernoComponent 
                            cuaderno={item} 
                            alPresionar={() => navigation.navigate('CuadernosFlujo', { 
                                screen: 'ResumenCuaderno', 
                                params: { idCuaderno: item.id } 
                            })} 
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const baseTexto = {
    fontFamily: Tipografia.familia,
    color: Colores.texto.secundario
};

const centrado = {
    justifyContent: 'center',
    alignItems: 'center'
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    contenedorCarga: {
        flex: 1,
        ...centrado
    },
    listaCuadernos: {
        paddingHorizontal: Metricas.paddingRaiz * 1.5,
        paddingBottom: 40
    },
    cabeceraLista: {
        marginVertical: 20
    },
    textoTitulo: {
        ...baseTexto,
        fontSize: Tipografia.tamano.titulo,
        fontWeight: '900',
        marginBottom: 8
    },
    textoSubtitulo: {
        ...baseTexto,
        fontSize: Tipografia.tamano.subtitulo - 2,
        lineHeight: 22,
        marginBottom: 30
    },
    tarjetaPromocion: {
        marginBottom: 40
    },
    areaImagen: {
        ...centrado,
        width: '100%',
        height: 180,
        backgroundColor: Colores.fondoMedio,
        borderRadius: Metricas.base * 2,
        marginBottom: 20
    },
    circuloIcono: {
        ...centrado,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colores.superficie,
        elevation: 3
    },
    etiquetaTarjeta: {
        ...baseTexto,
        fontSize: 10,
        fontWeight: '800',
        color: Colores.primario,
        letterSpacing: 1,
        marginBottom: 8
    },
    tituloTarjeta: {
        ...baseTexto,
        fontSize: Tipografia.tamano.subtitulo,
        fontWeight: '800',
        color: Colores.texto.principal,
        marginBottom: 8
    },
    descripcionTarjeta: {
        ...baseTexto,
        fontSize: Tipografia.tamano.subtitulo,
        lineHeight: 22,
        marginBottom: 20
    },
    contenedorBoton: {
        backgroundColor: Colores.primario,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignSelf: 'flex-start'
    },
    textoBoton: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '700',
        color: Colores.texto.invertido
    },
    divisionSeccion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: Metricas.bordeAncho,
        borderTopColor: Colores.bordes,
        paddingTop: 30
    },
    etiquetaSeccion: {
        ...baseTexto,
        fontSize: Tipografia.tamano.subtitulo,
        fontWeight: '800',
        color: Colores.texto.principal
    },
    estadoVacio: {
        alignItems: 'center',
        paddingVertical: 40
    },
    fondoEmoticon: {
        ...centrado,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colores.fondoMedio,
        marginBottom: 20
    },
    textoEmoticon: {
        fontSize: 36
    },
    tituloInformativo: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        fontWeight: '800',
        color: Colores.texto.principal,
        marginBottom: 10
    },
    descripcionInformativa: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        textAlign: 'center',
        paddingHorizontal: 20
    }
});

export default InicioScreen;