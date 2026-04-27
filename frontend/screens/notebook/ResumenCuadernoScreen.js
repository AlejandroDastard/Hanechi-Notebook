import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft, Eye, Heart, Bookmark, Settings, Trash2, BookOpen, Edit3, User } from 'lucide-react-native';
import { Colores, Tipografia, Metricas } from '../../theme/AppTheme';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import CuadernoDataService from '../../services/CuadernoDataService';
import InteraccionDataService from '../../services/InteraccionDataService';
import UsuarioDataService from '../../services/UsuarioDataService';
import ApiService from '../../services/ApiService';
import useAuthStore from '../../store/AuthStore';
import { obtenerImagenCuaderno } from '../../utils/ImagenHelper';

const ResumenCuadernoScreen = ({ navigation, route }) => {
    const { idCuaderno } = route.params;
    const usuarioLogueado = useAuthStore(s => s.usuario);
    
    const [cuaderno, setCuaderno] = useState(null);
    const [creador, setCreador] = useState(null);
    const [estadisticas, setEstadisticas] = useState(null);
    const [cargando, setCargando] = useState(true);
    
    const [haDadoLike, setHaDadoLike] = useState(false);
    const [haGuardado, setHaGuardado] = useState(false);

    useEffect(() => {
        const cargarData = async () => {
            try {
                const infoCuaderno = await CuadernoDataService.obtenerPorId(idCuaderno);
                const infoStats = await InteraccionDataService.obtenerEstadisticasCuaderno(idCuaderno);
                
                if (infoCuaderno.idUsuario) {
                    const perfilAutor = await UsuarioDataService.obtenerPerfilPublico(infoCuaderno.idUsuario);
                    setCreador(perfilAutor);
                }

                if (usuarioLogueado) {
                    const interacciones = await InteraccionDataService.obtenerInteraccionesPorCuaderno(idCuaderno);
                    const miLike = interacciones.find(i => i.idUsuario === usuarioLogueado.id && i.tipoInteraccion === 'LIKE');
                    const miGuardado = interacciones.find(i => i.idUsuario === usuarioLogueado.id && i.tipoInteraccion === 'GUARDADO');
                    
                    setHaDadoLike(!!miLike);
                    setHaGuardado(!!miGuardado);
                }

                setCuaderno(infoCuaderno);
                setEstadisticas(infoStats);
            } catch (e) {
                console.error("Error al cargar la pantalla de resumen:", e);
            } finally {
                setCargando(false);
            }
        };
        cargarData();
    }, [idCuaderno, usuarioLogueado]);

    useEffect(() => {
        if (!cargando && usuarioLogueado && idCuaderno) {
            InteraccionDataService.registrarInteraccion({
                idCuaderno: idCuaderno,
                idUsuario: usuarioLogueado.id,
                tipoInteraccion: 'VISTA',
                fechaInteraccion: new Date().toISOString()
            }).catch(() => null);
        }
    }, [cargando]);

    const manejarInteraccion = async (tipo) => {
        if (!usuarioLogueado) {
            Alert.alert("Identifícate", "Inicia sesión para interactuar con este cuaderno.");
            return;
        }

        const esLike = tipo === 'LIKE';
        const yaInteractuo = esLike ? haDadoLike : haGuardado;

        try {
            await InteraccionDataService.registrarInteraccion({
                idCuaderno: idCuaderno,
                idUsuario: usuarioLogueado.id,
                tipoInteraccion: tipo,
                fechaInteraccion: new Date().toISOString()
            });

            if (esLike) {
                setHaDadoLike(!yaInteractuo);
                setEstadisticas(prev => ({
                    ...prev,
                    totalLikes: yaInteractuo ? prev.totalLikes - 1 : prev.totalLikes + 1
                }));
            } else {
                setHaGuardado(!yaInteractuo);
                setEstadisticas(prev => ({
                    ...prev,
                    totalGuardados: yaInteractuo ? prev.totalGuardados - 1 : prev.totalGuardados + 1
                }));
            }
        } catch (e) {
            console.error("Error al procesar la interacción:", e);
        }
    };

    const esPropietario = cuaderno && usuarioLogueado && cuaderno.idUsuario === usuarioLogueado.id;

    // Acción para ocultar el cuaderno (Soft Delete)
    const confirmarSoftDelete = () => {
        Alert.alert(
            "Enviar a la Papelera",
            "¿Estás seguro de que deseas ocultar este cuaderno del catálogo público?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await ApiService.delete(`/cuadernos/${idCuaderno}`);
                            navigation.goBack();
                        } catch (e) {
                            Alert.alert("Error", "No se pudo borrar el cuaderno.");
                        }
                    } 
                }
            ]
        );
    };

    if (cargando) {
        return (
            <SafeAreaView style={estilos.contenedorPantalla}>
                <View style={estilos.cajaCarga}>
                    <ActivityIndicator size="large" color={Colores.primario} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Detalles" 
                iconoIzquierda={<ArrowLeft color={Colores.texto.invertido} size={Tipografia.tamano.titulo} />} 
                accionIzquierda={() => navigation.goBack()}
                iconoDerecha={esPropietario ? <Settings color={Colores.texto.invertido} size={Tipografia.tamano.titulo} /> : null}
                accionDerecha={() => esPropietario && navigation.navigate('ConfiguracionCuaderno', { idCuaderno })}
            />
            
            <ScrollView contentContainerStyle={estilos.cajaDesplazamiento} showsVerticalScrollIndicator={false}>
                <Image 
                    source={obtenerImagenCuaderno(cuaderno?.urlPortada)} 
                    style={estilos.imagenPortada} 
                />
                
                <View style={estilos.bloqueInformacion}>
                    <Text style={estilos.textoTitulo}>{cuaderno?.titulo}</Text>
                    
                    <View style={estilos.filaMetricasGlobal}>
                        <View style={estilos.filaEstadisticas}>
                            <View style={estilos.itemEstadistica}>
                                <Eye color={Colores.texto.secundario} size={16} />
                                <Text style={estilos.textoEstadistica}>{estadisticas?.totalVisitas || 0}</Text>
                            </View>
                            
                            <TouchableOpacity 
                                style={[estilos.itemEstadistica, haDadoLike && estilos.botonActivoLike]}
                                onPress={() => manejarInteraccion('LIKE')}
                            >
                                <Heart 
                                    color={haDadoLike ? Colores.texto.invertido : Colores.estados.error} 
                                    fill={haDadoLike ? Colores.texto.invertido : 'transparent'}
                                    size={16} 
                                />
                                <Text style={[estilos.textoEstadistica, haDadoLike && estilos.textoBlanco]}>
                                    {estadisticas?.totalLikes || 0}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[estilos.itemEstadistica, haGuardado && estilos.botonActivoGuardado]}
                                onPress={() => manejarInteraccion('GUARDADO')}
                            >
                                <Bookmark 
                                    color={haGuardado ? Colores.texto.invertido : Colores.primario} 
                                    fill={haGuardado ? Colores.texto.invertido : 'transparent'}
                                    size={16} 
                                />
                                <Text style={[estilos.textoEstadistica, haGuardado && estilos.textoBlanco]}>
                                    {estadisticas?.totalGuardados || 0}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity 
                            style={estilos.filaCreador}
                            onPress={() => navigation.navigate('PerfilPublico', { 
                                idUsuario: creador?.idUsuario 
                            })}
                        >
                            <View style={estilos.avatarMini}>
                                <User color={Colores.texto.secundario} size={10} />
                            </View>
                            <Text style={estilos.textoUsuario} numberOfLines={1}>
                                {creador?.nombrePerfil || "usuario"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={estilos.etiquetaSeccion}>DESCRIPCION</Text>
                    <Text style={estilos.textoDescripcion}>{cuaderno?.descripcion || "Este cuaderno no tiene descripción disponible."}</Text>
                </View>

                <View style={estilos.cajaAcciones}>
                    <TouchableOpacity 
                        style={estilos.botonPrincipal} 
                        onPress={() => navigation.navigate('VerCuaderno', { idCuaderno: cuaderno.id })}
                    >
                        <BookOpen size={20} color={Colores.texto.invertido} />
                        <Text style={estilos.textoPrincipal}>Leer Cuaderno</Text>
                    </TouchableOpacity>

                    {esPropietario && (
                        <View style={estilos.filaPropietario}>
                            <TouchableOpacity 
                                style={estilos.botonSecundario} 
                                onPress={() => navigation.navigate('EditarCuaderno', { idCuaderno: cuaderno.id })}
                            >
                                <Edit3 size={20} color={Colores.primario} />
                                <Text style={estilos.textoSecundario}>Editar Cuaderno</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={estilos.botonEliminar} 
                                onPress={confirmarSoftDelete}
                            >
                                <Trash2 size={20} color={Colores.estados.error} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
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
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    cajaDesplazamiento: { 
        paddingBottom: 40 
    },
    imagenPortada: { 
        width: '100%', 
        height: 260, 
        backgroundColor: Colores.fondoMedio 
    },
    bloqueInformacion: { 
        padding: 25, 
        backgroundColor: Colores.fondoBase, 
        borderTopLeftRadius: 28, 
        borderTopRightRadius: 28, 
        marginTop: -30,
        elevation: 1,
    },
    textoTitulo: { 
        fontSize: 26, 
        fontFamily: Tipografia.familia,
        fontWeight: '900', 
        color: Colores.texto.principal, 
        marginBottom: 15 
    },
    filaMetricasGlobal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
        gap: 10
    },
    filaCreador: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: Colores.fondoBase,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colores.bordes,
        maxWidth: '40%'
    },
    avatarMini: { 
        width: 18, 
        height: 18, 
        borderRadius: 9, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 6,
        backgroundColor: Colores.fondoMedio
    },
    textoUsuario: { 
        fontSize: 12, 
        fontFamily: Tipografia.familia,
        fontWeight: '700', 
        color: Colores.primario 
    },
    filaEstadisticas: { 
        flexDirection: 'row', 
        gap: 8,
        flex: 1
    },
    itemEstadistica: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 5, 
        paddingVertical: 8, 
        paddingHorizontal: 10, 
        backgroundColor: Colores.fondoBase, 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: Colores.bordes 
    },
    botonActivoLike: { 
        backgroundColor: Colores.estados.error, 
        borderColor: Colores.estados.error 
    },
    botonActivoGuardado: { 
        backgroundColor: Colores.primario, 
        borderColor: Colores.primario 
    },
    textoEstadistica: { 
        fontSize: 12, 
        fontFamily: Tipografia.familia,
        fontWeight: '800', 
        color: Colores.texto.secundario 
    },
    textoBlanco: { 
        color: Colores.texto.invertido 
    },
    etiquetaSeccion: { 
        fontSize: Tipografia.tamano.basico, 
        fontFamily: Tipografia.familia,
        fontWeight: '800', 
        color: Colores.texto.secundario, 
        marginBottom: 8,
        letterSpacing: 0.5
    },
    textoDescripcion: { 
        fontSize: Tipografia.tamano.detalles, 
        fontFamily: Tipografia.familia,
        color: Colores.texto.principal, 
        lineHeight: 26,
        marginBottom: 20
    },
    cajaAcciones: { 
        paddingHorizontal: 25, 
        paddingTop: 30,
        gap: 15
    },
    botonPrincipal: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: Colores.primario, 
        paddingVertical: 18, 
        borderRadius: 16, 
        gap: 12,
        elevation: 3,
        shadowColor: Colores.primario,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    textoPrincipal: { 
        fontSize: 18, 
        fontFamily: Tipografia.familia,
        fontWeight: '800', 
        color: Colores.texto.invertido 
    },
    filaPropietario: {
        flexDirection: 'row',
        gap: 12
    },
    botonSecundario: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.superficie,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
        borderWidth: 2,
        borderColor: Colores.primario
    },
    textoSecundario: {
        fontSize: 16,
        fontFamily: Tipografia.familia,
        fontWeight: '800',
        color: Colores.primario
    },
    botonEliminar: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.fondoBase,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colores.estados.error
    }
});

export default ResumenCuadernoScreen;