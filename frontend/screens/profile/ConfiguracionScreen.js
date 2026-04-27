import { useFocusEffect } from '@react-navigation/native';
import { Lock, LogOut, Menu, Trash2, User, ChevronRight, Monitor } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

import CabeceraComponent from '../../components/layout/CabeceraComponent';
import UsuarioDataService from '../../services/UsuarioDataService';
import useAuthStore from '../../store/AuthStore';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

const ConfiguracionScreen = ({ navigation }) => {
    const usuarioAuth = useAuthStore(s => s.usuario);
    const logoutStore = useAuthStore(s => s.logout || (() => {}));
    
    const [sesiones, setSesiones] = useState([]);
    const [config, setConfig] = useState(null);
    const [cargando, setCargando] = useState(true);

    const [nuevoNombre, setNuevoNombre] = useState('');
    const [passActual, setPassActual] = useState('');
    const [passNueva, setPassNueva] = useState('');

    const esUsuarioValido = (cadena) => /^[a-z0-9\-_]{6,16}$/.test(cadena);
    const esPasswordValido = (cadena) => /^[a-zA-Z0-9!@#$%&_\-]{6,16}$/.test(cadena);

    const OPCIONES_NOTIFICACION = ['SIGUIENDO', 'AMIGOS', 'TODOS'];
    const OPCIONES_CONTENIDO = ['TODO_PUBLICO', 'MAS_16', 'PARA_ADULTOS'];

    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                if (!usuarioAuth?.id) return;
                try {
                    const [dataSesiones, dataConfig] = await Promise.all([
                        UsuarioDataService.listarSesiones(usuarioAuth.id),
                        UsuarioDataService.obtenerConfiguracionPorUsuario(usuarioAuth.id)
                    ]);
                    
                    setSesiones(dataSesiones || []);
                    setConfig(dataConfig);
                } catch (e) {
                    console.error("Error cargando configuración:", e);
                } finally {
                    setCargando(false);
                }
            };
            cargarDatos();
        }, [usuarioAuth?.id])
    );

    const patchConfig = async (campo, valor) => {
        if (!config?.id) return;
        const backup = { ...config };
        setConfig({ ...config, [campo]: valor });
        try { 
            await UsuarioDataService.actualizarConfiguracion(config.id, { [campo]: valor }); 
        } catch (e) {
            setConfig(backup);
            Alert.alert("Error", "No se pudieron guardar los cambios.");
        }
    };

    const rotarOpcion = (campo, opciones) => {
        if (!config) return;
        const actual = config[campo];
        const siguiente = opciones[(opciones.indexOf(actual) + 1) % opciones.length];
        patchConfig(campo, siguiente);
    };

const esUsuarioValido = (cadena) => /^[a-z0-9\-_]{6,16}$/.test(cadena);
    const esPasswordValido = (cadena) => /^[a-zA-Z0-9!@#$%&_\-]{6,16}$/.test(cadena);

    const handleCambiarNombre = async () => {
        const nombreLimpio = nuevoNombre.trim();

        if (!nombreLimpio) {
            Alert.alert("Error", "El nombre no puede estar vacío.");
            return;
        }

        // Validación de formato para el nuevo nombre
        if (!esUsuarioValido(nombreLimpio)) {
            Alert.alert(
                "Formato Inválido", 
                "El nombre debe tener entre 6 y 16 caracteres (letras minúsculas, números, guiones o guiones bajos)."
            );
            return;
        }

        try {
            await UsuarioDataService.cambiarNombre(usuarioAuth.id, nombreLimpio);
            Alert.alert("Éxito", "Nombre de usuario actualizado.");
            setNuevoNombre('');
        } catch (e) {
            Alert.alert("Error", "No se pudo actualizar el nombre.");
        }
    };

    const handleCambiarPassword = async () => {
        if (!passActual || !passNueva) {
            Alert.alert("Error", "Completa ambos campos de contraseña.");
            return;
        }

        // Validación de formato para la nueva contraseña
        if (!esPasswordValido(passNueva)) {
            Alert.alert(
                "Contraseña Débil", 
                "La nueva contraseña debe tener entre 6 y 16 caracteres e incluir solo caracteres permitidos."
            );
            return;
        }

        try {
            await UsuarioDataService.cambiarContrasena(usuarioAuth.id, passActual, passNueva);
            Alert.alert("Éxito", "Contraseña actualizada.");
            setPassActual('');
            setPassNueva('');
        } catch (e) {
            Alert.alert("Error", "La contraseña actual es incorrecta o hubo un problema en el servidor.");
        }
    };

    const handleEliminarCuenta = () => {
        Alert.alert(
            "Eliminar Cuenta", 
            "¿Estás completamente seguro? Esta acción borrará todos tus datos permanentemente.",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await UsuarioDataService.eliminarCuenta(usuarioAuth.id);
                            handleCerrarSesionCompleto();
                        } catch (e) {
                            Alert.alert("Error", "No se pudo procesar la baja.");
                        }
                    }
                }
            ]
        );
    };

    const handleCerrarSesionCompleto = async () => {
        if (logoutStore) {
            logoutStore();
        } else {
            navigation.replace('Auth');
        }
    };

    const revocarSesionRemota = (idSesion) => {
        Alert.alert("Seguridad", "¿Cerrar esta sesión remota?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Cerrar", onPress: async () => {
                await UsuarioDataService.cerrarSesion(idSesion);
                const s = await UsuarioDataService.listarSesiones(usuarioAuth.id);
                setSesiones(s);
            }, style: "destructive" }
        ]);
    };

    if (cargando) {
        return (
            <View style={estilos.contenedorCarga}>
                <ActivityIndicator size="large" color={Colores.primario} />
            </View>
        );
    }

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Configuración" 
                iconoIzquierda={<Menu color={Colores.texto.invertido} size={Tipografia.tamano.titulo} />} 
                accionIzquierda={() => navigation.openDrawer()} 
            />
            <ScrollView 
                contentContainerStyle={estilos.desplazamientoContenido} 
                showsVerticalScrollIndicator={false}
            >
                <Text style={estilos.etiquetaBloque}>DATOS PERSONALES</Text>
                <View style={estilos.contenedorBloque}>
                    <View style={estilos.seccionEntrada}>
                        <Text style={estilos.etiquetaEntrada}>Nuevo Nombre de Usuario</Text>
                        <View style={estilos.filaEntrada}>
                            <TextInput 
                                style={estilos.cajaEntrada} 
                                value={nuevoNombre} 
                                onChangeText={setNuevoNombre}
                                placeholder="Nuevo nombre..."
                                placeholderTextColor={Colores.texto.secundario}
                            />
                            <TouchableOpacity style={estilos.botonPequeno} onPress={handleCambiarNombre}>
                                <User color={Colores.primario} size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={estilos.lineaDivisoria} />
                    
                    <View style={estilos.seccionEntrada}>
                        <Text style={estilos.etiquetaEntrada}>Cambiar Contraseña</Text>
                        <TextInput 
                            style={estilos.cajaEntradaSimple} 
                            value={passActual} 
                            onChangeText={setPassActual}
                            secureTextEntry
                            placeholder="Contraseña actual"
                            placeholderTextColor={Colores.texto.secundario}
                        />
                        <View style={estilos.filaAjustada}>
                            <TextInput 
                                style={estilos.cajaEntrada} 
                                value={passNueva} 
                                onChangeText={setPassNueva}
                                secureTextEntry
                                placeholder="Nueva contraseña"
                                placeholderTextColor={Colores.texto.secundario}
                            />
                            <TouchableOpacity style={estilos.botonPequeno} onPress={handleCambiarPassword}>
                                <Lock color={Colores.primario} size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Text style={estilos.etiquetaBloque}>PRIVACIDAD Y VISIBILIDAD</Text>
                <View style={estilos.contenedorBloque}>
                    <View style={estilos.filaElemento}>
                        <Text style={estilos.textoElemento}>Perfil Público</Text>
                        <Switch 
                            value={config?.perfilPublico || false} 
                            onValueChange={v => patchConfig('perfilPublico', v)} 
                            trackColor={{ false: Colores.bordes, true: Colores.primario }} 
                            thumbColor={Colores.superficie} 
                        />
                    </View>
                    <View style={estilos.lineaDivisoria} />
                    <View style={estilos.filaElemento}>
                        <Text style={estilos.textoElemento}>Mostrar Estadísticas</Text>
                        <Switch 
                            value={config?.mostrarEstadisticas || false} 
                            onValueChange={v => patchConfig('mostrarEstadisticas', v)} 
                            trackColor={{ false: Colores.bordes, true: Colores.primario }} 
                            thumbColor={Colores.superficie} 
                        />
                    </View>
                </View>

                <Text style={estilos.etiquetaBloque}>SISTEMA</Text>
                <View style={estilos.contenedorBloque}>
                    <View style={estilos.filaElemento}>
                        <Text style={estilos.textoElemento}>Modo Oscuro</Text>
                        <Switch 
                            value={config?.tema === 'oscuro'} 
                            onValueChange={v => patchConfig('tema', v ? 'oscuro' : 'claro')} 
                            trackColor={{ false: Colores.bordes, true: Colores.primario }} 
                            thumbColor={Colores.superficie} 
                        />
                    </View>
                    <View style={estilos.lineaDivisoria} />
                    <View style={estilos.filaElemento}>
                        <Text style={estilos.textoElemento}>Autoguardado Activo</Text>
                        <Switch 
                            value={config?.autoguardadoActivo || false} 
                            onValueChange={v => patchConfig('autoguardadoActivo', v)} 
                            trackColor={{ false: Colores.bordes, true: Colores.primario }} 
                            thumbColor={Colores.superficie} 
                        />
                    </View>
                </View>

                <Text style={estilos.etiquetaBloque}>CONTENIDO Y ALERTAS</Text>
                <View style={estilos.contenedorBloque}>
                    <TouchableOpacity 
                        style={estilos.filaElemento} 
                        onPress={() => rotarOpcion('nivelNotificacion', OPCIONES_NOTIFICACION)}
                    >
                        <Text style={estilos.textoElemento}>Notificaciones</Text>
                        <View style={estilos.contenedorInsignia}>
                            <Text style={estilos.textoInsignia}>{config?.nivelNotificacion}</Text>
                            <ChevronRight size={16} color={Colores.primario} />
                        </View>
                    </TouchableOpacity>
                    <View style={estilos.lineaDivisoria} />
                    <TouchableOpacity 
                        style={estilos.filaElemento} 
                        onPress={() => rotarOpcion('preferenciaContenido', OPCIONES_CONTENIDO)}
                    >
                        <Text style={estilos.textoElemento}>Filtro de Contenido</Text>
                        <View style={estilos.contenedorInsignia}>
                            <Text style={estilos.textoInsignia}>{config?.preferenciaContenido}</Text>
                            <ChevronRight size={16} color={Colores.primario} />
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={estilos.etiquetaBloque}>SESIONES ACTIVAS</Text>
                <View style={estilos.contenedorBloque}>
                    {sesiones.length === 0 ? (
                        <Text style={estilos.textoVacio}>No hay otras sesiones activas.</Text>
                    ) : (
                        sesiones.map((s, i) => (
                            <View key={s.id}>
                                <View style={estilos.filaSesion}>
                                    <View style={estilos.iconoDispositivo}>
                                        <Monitor size={20} color={Colores.texto.secundario} />
                                    </View>
                                    <View style={estilos.informacionSesion}>
                                        <Text style={estilos.textoSesion}>{s.dispositivo || 'Dispositivo desconocido'}</Text>
                                        <Text style={estilos.textoFecha}>Iniciada: {new Date(s.fechaInicio).toLocaleDateString()}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={estilos.botonRevocacion} 
                                        onPress={() => revocarSesionRemota(s.id)}
                                    >
                                        <Text style={estilos.textoRevocacion}>Cerrar</Text>
                                    </TouchableOpacity>
                                </View>
                                {i < sesiones.length - 1 && <View style={estilos.lineaDivisoria} />}
                            </View>
                        ))
                    )}
                </View>

                <View style={estilos.contenedorAcciones}>
                    <TouchableOpacity style={estilos.botonSalida} onPress={handleCerrarSesionCompleto}>
                        <LogOut color={Colores.texto.invertido} size={20} />
                        <Text style={estilos.textoBoton}>CERRAR SESIÓN ACTUAL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={estilos.botonEliminacion} onPress={handleEliminarCuenta}>
                        <Trash2 color={Colores.texto.invertido} size={20} />
                        <Text style={estilos.textoBoton}>ELIMINAR MI CUENTA</Text>
                    </TouchableOpacity>
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
    contenedorCarga: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.fondoBase
    },
    desplazamientoContenido: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 40
    },
    etiquetaBloque: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.normal,
        fontWeight: '800',
        color: Colores.texto.secundario,
        marginBottom: 10,
        marginLeft: 5,
        letterSpacing: 1
    },
    contenedorBloque: {
        backgroundColor: Colores.superficie,
        borderRadius: 16,
        paddingHorizontal: 15,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: Colores.bordes,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5
    },
    seccionEntrada: {
        paddingVertical: 15
    },
    etiquetaEntrada: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.familia.basico,
        fontWeight: '700',
        color: Colores.texto.principal,
        marginBottom: 8
    },
    filaEntrada: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    filaAjustada: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 10
    },
    cajaEntrada: {
        flex: 1,
        height: 48,
        backgroundColor: Colores.fondoBase,
        borderRadius: 12,
        paddingHorizontal: 15,
        color: Colores.texto.principal,
        fontFamily: Tipografia.familia,
        borderWidth: 1,
        borderColor: Colores.bordes
    },
    cajaEntradaSimple: {
        width: '100%',
        height: 48,
        backgroundColor: Colores.fondoBase,
        borderRadius: 12,
        paddingHorizontal: 15,
        color: Colores.texto.principal,
        fontFamily: Tipografia.familia,
        borderWidth: 1,
        borderColor: Colores.bordes
    },
    botonPequeno: {
        width: 48,
        height: 48,
        backgroundColor: Colores.fondoBase,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colores.primario
    },
    lineaDivisoria: {
        height: 1,
        backgroundColor: Colores.bordes,
        width: '100%'
    },
    filaElemento: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16
    },
    textoElemento: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.familia.basico,
        fontWeight: '600',
        color: Colores.texto.principal
    },
    contenedorInsignia: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    textoInsignia: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.familia.basico,
        fontWeight: '800',
        color: Colores.primario,
        backgroundColor: Colores.fondoBase,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden'
    },
    filaSesion: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15
    },
    iconoDispositivo: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colores.fondoBase,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    informacionSesion: {
        flex: 1
    },
    textoSesion: {
        fontFamily: Tipografia.familia,
        fontSize: 14,
        fontWeight: '700',
        color: Colores.texto.principal
    },
    textoFecha: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.familia.detalles,
        color: Colores.texto.secundario,
        marginTop: 2
    },
    botonRevocacion: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: Colores.fondoBase,
        borderWidth: 1,
        borderColor: Colores.estados.error
    },
    textoRevocacion: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.familia.basico,
        fontWeight: '700',
        color: Colores.estados.error
    },
    textoVacio: {
        fontFamily: Tipografia.familia,
        fontSize: 14,
        color: Colores.texto.secundario,
        textAlign: 'center',
        paddingVertical: 20
    },
    contenedorAcciones: {
        gap: 15,
        marginTop: 10
    },
    botonSalida: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.primario,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
        elevation: 3,
        shadowColor: Colores.primario,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6
    },
    botonEliminacion: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colores.estados.error,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 10,
        opacity: 0.9
    },
    textoBoton: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.familia.basico,
        fontWeight: '900',
        color: Colores.texto.invertido,
        letterSpacing: 0.5
    }
});

export default ConfiguracionScreen;