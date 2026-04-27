import { useFocusEffect } from '@react-navigation/native';
import { Bell, Heart, Bookmark, UserPlus, Eye, Menu, NotebookText } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import CabeceraComponent from '../../components/layout/CabeceraComponent';
import SocialDataService from '../../services/SocialDataService';
import useAuthStore from '../../store/AuthStore';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

const NotificacionesScreen = ({ navigation }) => {
    const usuario = useAuthStore(s => s.usuario);
    const [notificaciones, setNotificaciones] = useState([]);
    const [cargando, setCargando] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const cargarNotificaciones = async () => {
                if (!usuario?.id) return;
                try {
                    const data = await SocialDataService.obtenerNotificaciones(usuario.id);
                    
                    // Ordenar por fecha descendente
                    const ordenadas = (data || []).sort((a, b) => 
                        new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
                    );
                    setNotificaciones(ordenadas);
                } catch (e) {
                    console.error("Error al cargar notificaciones:", e);
                    setNotificaciones([]);
                } finally {
                    setCargando(false);
                }
            };
            cargarNotificaciones();
        }, [usuario?.id])
    );

    const obtenerConfiguracionNotificacion = (tipo) => {
        switch (tipo) {
            case 'LIKE':
                return { 
                    icono: <Heart color={Colores.estados.error} size={20} fill={Colores.estados.error} />, 
                    mensaje: 'le ha dado like a tu cuaderno.' 
                };
            case 'GUARDADO':
                return { 
                    icono: <Bookmark color={Colores.primario} size={20} fill={Colores.primario} />, 
                    mensaje: 'ha guardado tu cuaderno.' 
                };
            case 'FOLLOW':
                return { 
                    icono: <UserPlus color={Colores.estados.exito} size={20} />, 
                    mensaje: 'ha comenzado a seguirte.' 
                };
            case 'VISTA':
                return { 
                    icono: <Eye color={Colores.texto.secundario} size={20} />, 
                    mensaje: 'ha visitado tu cuaderno.' 
                };
            default:
                return { 
                    icono: <Bell color={Colores.primario} size={20} />, 
                    mensaje: 'ha interactuado contigo.' 
                };
        }
    };

    const RenderItemNotificacion = ({ item }) => {
        const config = obtenerConfiguracionNotificacion(item.tipoNotificacion);
        
        return (
            <TouchableOpacity 
                style={estilos.itemNotificacion}
                onPress={() => {
                    if (item.tipoNotificacion === 'FOLLOW') {
                        navigation.navigate('PerfilPublico', { idUsuario: item.idEmisor });
                    } else if (item.tipoReferencia === 'CUADERNO') {
                        navigation.navigate('CuadernosFlujo', { 
                            screen: 'ResumenCuaderno', 
                            params: { idCuaderno: item.idReferencia } 
                        });
                    }
                }}
            >
                <View style={estilos.bloqueIcono}>
                    {config.icono}
                </View>
                <View style={estilos.columnaDerecha}>
                    <Text style={estilos.textoMensaje}>
                        <Text style={estilos.nombreUsuario}>{item.nombreEmisor || 'Alguien'} </Text>
                        {config.mensaje}
                    </Text>
                    <Text style={estilos.textoFecha}>
                        {new Date(item.fechaCreacion).toLocaleString([], { 
                            day: '2-digit', 
                            month: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Notificaciones"
                iconoIzquierda={<Menu color={Colores.texto.invertido} size={Tipografia.tamano.titulo} />}
                accionIzquierda={() => navigation.openDrawer()}
            />
            {cargando ? (
                <View style={estilos.contenedorCarga}>
                    <ActivityIndicator size="large" color={Colores.primario} />
                </View>
            ) : (
                <FlatList
                    data={notificaciones}
                    keyExtractor={item => item.id}
                    contentContainerStyle={estilos.listaNotificaciones}
                    showsVerticalScrollIndicator={false}
                    renderItem={RenderItemNotificacion}
                    ListEmptyComponent={
                        <View style={estilos.contenedorVacio}>
                            <Bell color={Colores.bordes} size={64} style={{ marginBottom: 20 }} />
                            <Text style={estilos.textoVacio}>No tienes notificaciones todavía.</Text>
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
    contenedorCarga: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.fondoBase
    },
    listaNotificaciones: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40
    },
    itemNotificacion: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colores.superficie,
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colores.bordes,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    bloqueIcono: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colores.fondoBase,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: Colores.bordes
    },
    columnaDerecha: {
        flex: 1
    },
    textoMensaje: {
        fontFamily: Tipografia.familia,
        fontSize: 14,
        color: Colores.texto.principal,
        lineHeight: 20
    },
    nombreUsuario: {
        fontWeight: '900',
        color: Colores.primario
    },
    textoFecha: {
        fontFamily: Tipografia.familia,
        fontSize: 11,
        color: Colores.texto.secundario,
        marginTop: 6,
        fontWeight: '600'
    },
    contenedorVacio: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100
    },
    textoVacio: {
        fontFamily: Tipografia.familia,
        textAlign: 'center',
        color: Colores.texto.secundario,
        fontSize: 16,
        fontWeight: '600'
    }
});

export default NotificacionesScreen;