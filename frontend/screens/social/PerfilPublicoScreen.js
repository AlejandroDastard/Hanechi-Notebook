import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, UserCheck, UserPlus, UserMinus } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BusquedaComponent from '../../components/cards/BusquedaComponent';
import EstadisticaComponent from '../../components/common/EstadisticaComponent';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import CuadernoDataService from '../../services/CuadernoDataService';
import InteraccionDataService from '../../services/InteraccionDataService';
import SocialDataService from '../../services/SocialDataService';
import UsuarioDataService from '../../services/UsuarioDataService';
import useAuthStore from '../../store/AuthStore';

import { Colores, Tipografia, Metricas } from '../../theme/AppTheme';
import { obtenerImagenAvatar, obtenerImagenBanner } from '../../utils/ImagenHelper';

const PerfilPublicoScreen = ({ route, navigation }) => {
    const { idUsuario } = route.params;
    const usuarioAuth = useAuthStore(state => state.usuario);

    const [perfil, setPerfil] = useState(null);
    const [estadisticas, setEstadisticas] = useState({
        totalSeguidores: 0,
        totalSiguiendo: 0,
        totalCuadernos: 0
    });
    const [cuadernos, setCuadernos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [siguiendo, setSiguiendo] = useState(false);
    const [cargandoSocial, setCargandoSocial] = useState(false);

    useEffect(() => {
        if (idUsuario && usuarioAuth?.id && idUsuario === usuarioAuth.id) {
            navigation.navigate('Perfil');
        }
    }, [idUsuario, usuarioAuth?.id]);

    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                if (!idUsuario || idUsuario === usuarioAuth?.id) return;
                setCargando(true);
                try {
                    const [dataPerfil, dataStats, dataCuadernos, listaSiguiendo] = await Promise.all([
                        UsuarioDataService.obtenerPerfilPublico(idUsuario),
                        InteraccionDataService.obtenerEstadisticasUsuario(idUsuario),
                        CuadernoDataService.obtenerCuadernosUsuario(idUsuario),
                        SocialDataService.obtenerSiguiendo(usuarioAuth.id)
                    ]);
                    setPerfil(dataPerfil);
                    if (dataStats) {
                        setEstadisticas({
                            totalSeguidores: dataStats.totalSeguidores ?? 0,
                            totalSiguiendo: dataStats.totalSiguiendo ?? 0,
                            totalCuadernos: dataStats.totalCuadernos ?? 0
                        });
                    }
                    const publicos = Array.isArray(dataCuadernos) 
                        ? dataCuadernos.filter(c => c.visibilidad === 'PUBLICO') 
                        : [];
                    setCuadernos(publicos);
                    const yaLeSigo = Array.isArray(listaSiguiendo) && 
                        listaSiguiendo.some(rel => rel.idReceptor === idUsuario);
                    setSiguiendo(yaLeSigo);
                } catch (e) {
                    console.error(e);
                } finally {
                    setCargando(false);
                }
            };
            cargarDatos();
        }, [idUsuario, usuarioAuth?.id])
    );

    const handleToggleSeguir = async () => {
        if (cargandoSocial || !usuarioAuth?.id) return;
        setCargandoSocial(true);
        try {
            if (siguiendo) {
                await SocialDataService.dejarDeSeguirUsuario(usuarioAuth.id, idUsuario);
                setSiguiendo(false);
                setEstadisticas(p => ({ 
                    ...p, 
                    totalSeguidores: Math.max(0, (p.totalSeguidores || 0) - 1) 
                }));
            } else {
                await SocialDataService.seguirUsuario(usuarioAuth.id, idUsuario);
                setSiguiendo(true);
                setEstadisticas(p => ({ 
                    ...p, 
                    totalSeguidores: (p.totalSeguidores || 0) + 1 
                }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setCargandoSocial(false);
        }
    };

    if (cargando) {
        return (
            <View style={estilos.cajaCarga}>
                <ActivityIndicator size="large" color={Colores.primario} />
            </View>
        );
    }

    const renderHeader = () => (
        <View style={estilos.cabeceraPerfil}>
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
                        style={[
                            estilos.botonSeguir, 
                            siguiendo ? estilos.estadoActivo : estilos.estadoInactivo
                        ]}
                        onPress={handleToggleSeguir}
                        disabled={cargandoSocial}
                    >
                        {cargandoSocial ? (
                            <ActivityIndicator size="small" color={siguiendo ? Colores.estados.error : Colores.texto.invertido} />
                        ) : (
                            <>
                                {siguiendo ? (
                                    <UserMinus color={Colores.estados.error} size={18} />
                                ) : (
                                    <UserPlus color={Colores.texto.invertido} size={18} />
                                )}
                                <Text style={[
                                    estilos.textoSeguir, 
                                    siguiendo ? estilos.colorError : estilos.colorInvertido
                                ]}>
                                    {siguiendo ? 'Dejar de Seguir' : 'Seguir'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={estilos.rellenoLateral}>
                    <Text style={estilos.nombrePublico}>
                        {perfil?.nombrePerfil || "Usuario"}
                    </Text>
                    <Text style={estilos.nombreSistema}>
                        @{perfil?.nombreUsuario || "usuario"}
                    </Text>
                    <Text style={estilos.textoBiografia}>
                        {perfil?.biografia || perfil?.bibliografia || "Aún no hay nada escrito."}
                    </Text>
                </View>

                <EstadisticaComponent 
                    estadisticas={estadisticas} 
                    totalCuadernosManual={cuadernos.length} 
                />
            </View>
            <Text style={estilos.tituloSeccion}></Text>
        </View>
    );

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Perfil" 
                iconoIzquierda={<ArrowLeft color={Colores.texto.invertido} size={Tipografia.tamano.titulo} strokeWidth={2} />} 
                accionIzquierda={() => navigation.goBack()} 
            />

            <FlatList
                data={cuadernos}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={estilos.listaCuadernos}
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
                        <Text style={estilos.textoVacio}>No hay cuadernos públicos.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    cajaCarga: {
        flex: 1,
        backgroundColor: Colores.fondoBase,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cabeceraPerfil: {
        backgroundColor: Colores.fondoBase
    },
    imagenBanner: {
        width: '100%',
        height: 180,
        backgroundColor: Colores.fondoMedio
    },
    bloqueInformacion: {
        marginTop: -45,
        zIndex: 1
    },
    rellenoLateral: {
        paddingHorizontal: 16
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
    botonSeguir: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 14,
        shadowColor: Colores.sombras,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        zIndex: 3
    },
    estadoInactivo: {
        backgroundColor: Colores.primario
    },
    estadoActivo: {
        backgroundColor: Colores.fondoBase,
        borderWidth: 1,
        borderColor: Colores.estados.error
    },
    textoSeguir: {
        fontFamily: Tipografia.familia,
        fontWeight: '800',
        marginLeft: 8,
        fontSize: Tipografia.tamano.basico
    },
    colorInvertido: {
        color: Colores.texto.invertido
    },
    colorError: {
        color: Colores.estados.error
    },
    nombrePublico: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.subtitulo,
        fontWeight: '900',
        color: Colores.texto.principal
    },
    nombreSistema: {
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
    tituloSeccion: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.normal,
        fontWeight: '800',
        color: Colores.texto.principal,
        marginHorizontal: 16,
        marginVertical: 16
    },
    listaCuadernos: {
        paddingBottom: 40
    },
    contenedorVacio: {
        padding: 60,
        alignItems: 'center'
    },
    textoVacio: {
        fontFamily: Tipografia.familia,
        textAlign: 'center',
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario
    }
});

export default PerfilPublicoScreen;