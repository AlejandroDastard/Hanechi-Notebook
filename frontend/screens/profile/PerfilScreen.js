import { useFocusEffect } from '@react-navigation/native';
import { Bookmark, Edit3, Grid, Heart, Menu } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BusquedaComponent from '../../components/cards/BusquedaComponent';
import EstadisticaComponent from '../../components/common/EstadisticaComponent';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import CuadernoDataService from '../../services/CuadernoDataService';
import InteraccionDataService from '../../services/InteraccionDataService';
import UsuarioDataService from '../../services/UsuarioDataService';
import useAuthStore from '../../store/AuthStore';

import { Colores, Tipografia, Metricas } from '../../theme/AppTheme';
import { obtenerImagenAvatar, obtenerImagenBanner } from '../../utils/ImagenHelper';

const PerfilScreen = ({ navigation }) => {
    const usuarioAuth = useAuthStore(state => state.usuario);
    
    const [perfil, setPerfil] = useState(null);
    const [estadisticas, setEstadisticas] = useState({
        totalSeguidores: 0,
        totalSiguiendo: 0,
        totalCuadernos: 0
    });
    const [datosLista, setDatosLista] = useState([]);
    const [tabActiva, setTabActiva] = useState('propios');
    const [cargandoPerfil, setCargandoPerfil] = useState(true);
    const [cargandoLista, setCargandoLista] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const cargarInfoBase = async () => {
                if (!usuarioAuth?.id) return;
                try {
                    const [dataPerfil, dataStats] = await Promise.all([
                        UsuarioDataService.obtenerPerfil(usuarioAuth.id),
                        InteraccionDataService.obtenerEstadisticasUsuario(usuarioAuth.id)
                    ]);
                    setPerfil(dataPerfil);
                    if (dataStats) {
                        setEstadisticas({
                            totalSeguidores: dataStats.totalSeguidores ?? 0,
                            totalSiguiendo: dataStats.totalSiguiendo ?? 0,
                            totalCuadernos: dataStats.totalCuadernos ?? 0
                        });
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setCargandoPerfil(false);
                }
            };
            cargarInfoBase();
        }, [usuarioAuth?.id])
    );

    useEffect(() => {
        const cargarContenidoTab = async () => {
            if (!usuarioAuth?.id) return;
            setDatosLista([]);
            setCargandoLista(true);
            try {
                let resultados = [];
                if (tabActiva === 'propios') {
                    resultados = await CuadernoDataService.obtenerCuadernosUsuario(usuarioAuth.id);
                } else if (tabActiva === 'likes') {
                    resultados = await InteraccionDataService.obtenerCuadernosConLike(usuarioAuth.id);
                } else if (tabActiva === 'guardados') {
                    resultados = await InteraccionDataService.obtenerCuadernosGuardados(usuarioAuth.id);
                }
                setDatosLista(Array.isArray(resultados) ? resultados : []);
            } catch (error) {
                console.error(error);
            } finally {
                setCargandoLista(false);
            }
        };
        cargarContenidoTab();
    }, [tabActiva, usuarioAuth?.id]);

    if (cargandoPerfil) {
        return (
            <View style={estilos.centroPantalla}>
                <ActivityIndicator size="large" color={Colores.primario} />
            </View>
        );
    }

    const renderHeader = () => (
        <View style={estilos.cabeceraContenedor}>
            <Image 
                source={obtenerImagenBanner(perfil?.urlBanner)} 
                style={estilos.imagenBanner} 
            />
            
            <View style={estilos.bloqueInformacion}>
                <View style={estilos.filaIdentidad}>
                    <Image 
                        source={obtenerImagenAvatar(perfil?.urlAvatar)} 
                        style={estilos.imagenAvatar} 
                    />
                    <TouchableOpacity 
                        style={estilos.botonAccion} 
                        onPress={() => navigation.navigate('EditarPerfil')}
                    >
                        <Edit3 color={Colores.texto.invertido} size={18} />
                        <Text style={estilos.textoBoton}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>

                <View style={estilos.rellenoLateral}>
                    <Text style={estilos.textoNombre}>
                        {perfil?.nombrePerfil || usuarioAuth?.nombreUsuario}
                    </Text>
                    <Text style={estilos.textoUsuario}>
                        @{usuarioAuth?.nombreUsuario}
                    </Text>
                    <Text style={estilos.textoBiografia}>
                        {perfil?.biografia || perfil?.bibliografia || "Aún no hay nada escrito."}
                    </Text>
                </View>

                <EstadisticaComponent estadisticas={estadisticas} />
            </View>

            <View style={estilos.barraPestanas}>
                <TouchableOpacity 
                    style={[estilos.botonSeccion, tabActiva === 'propios' && estilos.bordeActivo]} 
                    onPress={() => setTabActiva('propios')}
                >
                    <Grid size={24} color={tabActiva === 'propios' ? Colores.primario : Colores.texto.secundario} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[estilos.botonSeccion, tabActiva === 'likes' && estilos.bordeActivo]} 
                    onPress={() => setTabActiva('likes')}
                >
                    <Heart size={24} color={tabActiva === 'likes' ? Colores.primario : Colores.texto.secundario} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[estilos.botonSeccion, tabActiva === 'guardados' && estilos.bordeActivo]} 
                    onPress={() => setTabActiva('guardados')}
                >
                    <Bookmark size={24} color={tabActiva === 'guardados' ? Colores.primario : Colores.texto.secundario} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={estilos.contenedorRaiz}>
            <CabeceraComponent 
                titulo="Mi Perfil" 
                iconoIzquierda={<Menu color={Colores.texto.invertido} size={26} strokeWidth={2} />} 
                accionIzquierda={() => navigation.openDrawer()} 
            />
            <FlatList
                data={datosLista}
                keyExtractor={(item, index) => (item.id || index).toString()}
                numColumns={2}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={estilos.listaResultados}
                renderItem={({ item }) => (
                    <BusquedaComponent 
                        item={item} 
                        tipo="cuadernos" 
                        onPress={() => navigation.navigate('CuadernosFlujo', { 
                            screen: 'ResumenCuaderno', 
                            params: { idCuaderno: item.id } 
                        })}
                    />
                )}
                ListEmptyComponent={
                    <View style={estilos.contenedorVacio}>
                        {cargandoLista ? (
                            <ActivityIndicator size="small" color={Colores.primario} />
                        ) : (
                            <Text style={estilos.textoVacio}>No hay contenido todavía.</Text>
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const estilos = StyleSheet.create({
    contenedorRaiz: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    centroPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cabeceraContenedor: {
        backgroundColor: Colores.fondoBase
    },
    imagenBanner: {
        width: '100%',
        height: 160,
        backgroundColor: Colores.fondoMedio
    },
    bloqueInformacion: {
        marginTop: -45,
        zIndex: 1
    },
    rellenoLateral: {
        paddingHorizontal: Metricas.paddingRaiz
    },
    filaIdentidad: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 16
    },
    imagenAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: Colores.fondoBase,
        backgroundColor: Colores.superficie,
        zIndex: 2
    },
    botonAccion: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colores.primario,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
        shadowColor: Colores.sombras,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 3
    },
    textoBoton: {
        fontFamily: Tipografia.familia,
        color: Colores.texto.invertido,
        fontWeight: '800',
        marginLeft: 8,
        fontSize: Tipografia.tamano.basico
    },
    textoNombre: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.subtitulo,
        fontWeight: '900',
        color: Colores.texto.principal
    },
    textoUsuario: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.basico,
        color: Colores.primario,
        fontWeight: '700',
        marginBottom: 12
    },
    textoBiografia: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario,
        lineHeight: 24
    },
    barraPestanas: {
        flexDirection: 'row',
        borderTopWidth: Metricas.bordeAncho,
        borderBottomWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        backgroundColor: Colores.superficie,
        marginBottom: 15
    },
    botonSeccion: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent'
    },
    bordeActivo: {
        borderBottomColor: Colores.primario
    },
    listaResultados: {
        paddingBottom: 40
    },
    contenedorVacio: {
        padding: 60,
        alignItems: 'center'
    },
    textoVacio: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario,
        textAlign: 'center'
    }
});

export default PerfilScreen;