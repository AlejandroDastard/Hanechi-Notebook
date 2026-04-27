import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Menu, UserMinus } from 'lucide-react-native';
import { Colores, Tipografia, Metricas } from '../../theme/AppTheme';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import SocialDataService from '../../services/SocialDataService';
import UsuarioDataService from '../../services/UsuarioDataService';
import useAuthStore from '../../store/AuthStore';
import { obtenerImagenAvatar } from '../../utils/ImagenHelper';

const AmigosScreen = ({ navigation }) => {
    const usuarioPropio = useAuthStore(s => s.usuario);
    const [pestañaActiva, setPestañaActiva] = useState('siguiendo');
    const [conexiones, setConexiones] = useState([]);
    const [cargando, setCargando] = useState(true);

    const cargarConexiones = async (tipo) => {
        if (!usuarioPropio?.id) return;
        setCargando(true);
        try {
            let dataRelaciones = tipo === 'siguiendo' 
                ? await SocialDataService.obtenerSiguiendo(usuarioPropio.id) 
                : await SocialDataService.obtenerSeguidores(usuarioPropio.id);
            
            if (dataRelaciones && dataRelaciones.length > 0) {
                const datosCompletos = await Promise.all(
                    dataRelaciones.map(async (item) => {
                        const idPerfilBuscar = tipo === 'siguiendo' ? item.idReceptor : item.idEmisor;
                        try {
                            const infoPerfil = await UsuarioDataService.obtenerPerfilPublico(idPerfilBuscar);
                            return { ...item, ...infoPerfil };
                        } catch (err) {
                            return item;
                        }
                    })
                );
                setConexiones(datosCompletos);
            } else {
                setConexiones([]);
            }
        } catch (error) {
            setConexiones([]);
        } finally {
            setCargando(false);
        }
    };

    useFocusEffect(useCallback(() => { cargarConexiones(pestañaActiva); }, [pestañaActiva]));

    const handleDejarDeSeguir = async (idReceptor) => {
        if (!usuarioPropio?.id) return;
        try {
            await SocialDataService.dejarDeSeguirUsuario(usuarioPropio.id, idReceptor);
            setConexiones(prev => prev.filter(item => item.idReceptor !== idReceptor));
        } catch (error) {
            console.error(error);
        }
    };

    const RenderUsuario = ({ item }) => {
        const esSiguiendo = pestañaActiva === 'siguiendo';
        const idNavegacion = esSiguiendo ? item.idReceptor : item.idEmisor;
        
        return (
            <TouchableOpacity 
                style={estilos.tarjetaUsuario} 
                onPress={() => navigation.navigate('PerfilPublico', { idUsuario: idNavegacion })}
            >
                <View style={estilos.contenedorPerfil}>
                    <Image 
                        source={obtenerImagenAvatar(item.urlAvatar)} 
                        style={estilos.imagenAvatar} 
                    />
                    <View style={estilos.informacionUsuario}>
                        <Text style={estilos.nombrePerfil} numberOfLines={1}>
                            {item.nombrePerfil || item.nombreUsuario || "Usuario"}
                        </Text>
                        <Text style={estilos.identificadorUsuario} numberOfLines={1}>
                            @{item.nombreUsuario || "usuario"}
                        </Text>
                    </View>
                </View>

                {esSiguiendo && (
                    <TouchableOpacity 
                        style={estilos.botonDejarSeguir}
                        onPress={() => handleDejarDeSeguir(item.idReceptor)}
                    >
                        <UserMinus size={18} color={Colores.estados.error} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Amigos" 
                iconoIzquierda={<Menu color={Colores.texto.invertido} size={Tipografia.tamano.titulo} />} 
                accionIzquierda={() => navigation.openDrawer()} 
            />
            <View style={estilos.cabeceraFija}>
                <View style={estilos.contenedorSelector}>
                    <TouchableOpacity 
                        style={[estilos.pestanaOpcion, pestañaActiva === 'siguiendo' && estilos.pestanaActiva]} 
                        onPress={() => setPestañaActiva('siguiendo')}
                    >
                        <Text style={[estilos.textoPestana, pestañaActiva === 'siguiendo' && estilos.textoActivo]}>
                            Siguiendo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[estilos.pestanaOpcion, pestañaActiva === 'seguidores' && estilos.pestanaActiva]} 
                        onPress={() => setPestañaActiva('seguidores')}
                    >
                        <Text style={[estilos.textoPestana, pestañaActiva === 'seguidores' && estilos.textoActivo]}>
                            Seguidores
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {cargando ? (
                <View style={estilos.contenedorCarga}>
                    <ActivityIndicator size="large" color={Colores.primario} />
                </View>
            ) : (
                <FlatList 
                    data={conexiones} 
                    keyExtractor={(item, index) => index.toString()} 
                    contentContainerStyle={estilos.listaContenido} 
                    renderItem={RenderUsuario} 
                    ListEmptyComponent={
                        <View style={estilos.contenedorVacio}>
                            <Text style={estilos.textoVacio}>No se encontraron resultados.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    cabeceraFija: {
        paddingHorizontal: 20,
        paddingTop: 15,
        backgroundColor: Colores.fondoBase
    },
    contenedorSelector: {
        flexDirection: 'row',
        backgroundColor: Colores.fondoMedio,
        borderRadius: 12,
        padding: 4,
        marginBottom: 20
    },
    pestanaOpcion: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10
    },
    pestanaActiva: {
        backgroundColor: Colores.superficie,
        elevation: 1,
        shadowColor: Colores.sombras,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2
    },
    textoPestana: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '600',
        color: Colores.texto.secundario
    },
    textoActivo: {
        color: Colores.texto.principal,
        fontWeight: '800'
    },
    listaContenido: {
        paddingHorizontal: 25,
        paddingBottom: 40
    },
    contenedorCarga: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tarjetaUsuario: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colores.superficie,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes
    },
    contenedorPerfil: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    imagenAvatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        marginRight: 15,
        backgroundColor: Colores.fondoMedio
    },
    informacionUsuario: {
        flex: 1,
        paddingRight: 10
    },
    nombrePerfil: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.basico,
        fontWeight: '800',
        color: Colores.texto.principal,
        marginBottom: 2
    },
    identificadorUsuario: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.detalles,
        color: Colores.primario,
        fontWeight: '700'
    },
    botonDejarSeguir: {
        padding: 8,
        backgroundColor: Colores.fondoBase,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colores.estados.error
    },
    contenedorVacio: {
        padding: 40,
        alignItems: 'center'
    },
    textoVacio: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario
    }
});

export default AmigosScreen;