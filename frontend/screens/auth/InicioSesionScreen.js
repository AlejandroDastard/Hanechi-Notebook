import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Check, CircleAlert, Lock, LogIn, Mail, User, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BotonComponent from '../../components/common/BotonComponent';
import EntradaComponent from '../../components/common/EntradaComponent';
import AutenticacionService from '../../services/AutenticacionService';

import { Colores, Tipografia } from '../../theme/AppTheme';

// Gestiona el acceso o registro
const InicioSesionScreen = ({ navigation }) => {
    const [modoRegistro, setModoRegistro] = useState(false);
    
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState(new Date(2000, 0, 1));
    const [mostrarPicker, setMostrarPicker] = useState(false);
    
    const [cargando, setCargando] = useState(false);
    const [terminosAceptados, setTerminosAceptados] = useState(false);
    const [mensajeError, setMensajeError] = useState('');

    const esEmailValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    const esUsuarioValido = (cadena) => /^[a-z0-9\-_]{6,16}$/.test(cadena);
    const esPasswordValido = (cadena) => /^[a-zA-Z0-9!@#$%&_\-]{6,16}$/.test(cadena);

    // Actualiza la fecha de nacimiento seleccionada
    const alCambiarFecha = (event, fechaSeleccionada) => {
        setMostrarPicker(Platform.OS === 'ios');
        if (fechaSeleccionada) {
            setFechaNacimiento(fechaSeleccionada);
        }
    };

    // Gestiona la validación y envío de datos
    const manejarAccion = async () => {
        setMensajeError('');
        const emailLimpio = email.trim().toLowerCase();
        const nombreLimpio = nombre.trim().toLowerCase();

        if (!emailLimpio || !password) {
            setMensajeError('Por favor, rellena los campos obligatorios.');
            return;
        }

        if (!esEmailValido(emailLimpio)) {
            setMensajeError('Introduce un correo electrónico válido.');
            return;
        }

        // Prueba de validez de contenido
        if (modoRegistro) {
            if (!nombreLimpio || !confirmarPassword) {
                setMensajeError('Todos los campos son obligatorios.');
                return;
            }
            if (!esUsuarioValido(nombreLimpio)) {
                setMensajeError('Usuario: 6-16 caracteres (minúsculas, números, - o _)');
                return;
            }
            if (password !== confirmarPassword) {
                setMensajeError('Las contraseñas no coinciden.');
                return;
            }
            if (!esPasswordValido(password)) {
                setMensajeError('La contraseña debe tener entre 6 y 16 caracteres.');
                return;
            }
            if (!terminosAceptados) {
                setMensajeError('Debes aceptar los términos y condiciones.');
                return;
            }
        }

        setCargando(true);
        try {
            if (modoRegistro) {
                const fechaISO = fechaNacimiento.toISOString().split('T')[0];
                await AutenticacionService.registrarse({
                    nombreUsuario: nombreLimpio,
                    correo: emailLimpio,
                    contrasena: password,
                    fechaNacimiento: fechaISO
                });
                
                navigation.navigate('Verificacion2FA', { email: emailLimpio });
            } else {
                const respuesta = await AutenticacionService.iniciarSesion(emailLimpio, password);
                if (respuesta === "MFA_REQUIRED") {
                    navigation.navigate('Verificacion2FA', { email: emailLimpio });
                }
            }
        } catch (error) {
            const detalle = error.response?.data?.detail || error.response?.data?.message || 'Error de conexión con la API';
            setMensajeError(detalle);
        } finally {
            setCargando(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={estilos.contenedorPantalla}
        >
            <ScrollView 
                contentContainerStyle={estilos.desplazamientoContenido} 
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground 
                    source={require('../../assets/img/brand/fondo_auth.jpg')} 
                    style={estilos.imagenCabecera}
                    resizeMode="cover"
                >
                    <View style={estilos.capaSuperpuesta}>
                        <SafeAreaView style={estilos.areaSegura}>
                            <View style={estilos.contenedorLogo}>
                                <Image 
                                    source={require('../../assets/img/brand/logo.png')} 
                                    style={estilos.graficoLogo} 
                                />
                            </View>
                            <Text style={estilos.tituloAplicacion}>Hanechi NoteBook</Text>
                        </SafeAreaView>
                    </View>
                </ImageBackground>

                <View style={estilos.cuerpoPrincipal}>
                    <View style={estilos.selectorModo}>
                        <TouchableOpacity 
                            style={[estilos.pestanaOpcion, !modoRegistro && estilos.pestanaActiva]} 
                            onPress={() => { setModoRegistro(false); setMensajeError(''); }}
                        >
                            <View style={estilos.contenidoPestana}>
                                <LogIn 
                                    size={16} 
                                    color={!modoRegistro ? Colores.texto.principal : Colores.texto.secundario} 
                                    style={estilos.iconoPestana} 
                                />
                                <Text style={[estilos.textoPestana, !modoRegistro && estilos.textoActivo]}>Login</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[estilos.pestanaOpcion, modoRegistro && estilos.pestanaActiva]} 
                            onPress={() => { setModoRegistro(true); setMensajeError(''); }}
                        >
                            <View style={estilos.contenidoPestana}>
                                <UserPlus 
                                    size={16} 
                                    color={modoRegistro ? Colores.texto.principal : Colores.texto.secundario} 
                                    style={estilos.iconoPestana} 
                                />
                                <Text style={[estilos.textoPestana, modoRegistro && estilos.textoActivo]}>Registro</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={estilos.contenedorFormulario}>
                        {modoRegistro && (
                            <EntradaComponent 
                                placeholder="Nombre de Usuario" 
                                valor={nombre} 
                                alCambiarTexto={(t) => setNombre(t.toLowerCase())} 
                                autoCapitalize="none"
                                Icono={User}
                            />
                        )}

                        <EntradaComponent 
                            placeholder="Correo Electrónico" 
                            valor={email} 
                            alCambiarTexto={(t) => setEmail(t.toLowerCase())} 
                            keyboardType="email-address"
                            autoCapitalize="none"
                            Icono={Mail}
                        />

                        {modoRegistro && (
                            <View style={estilos.seccionFecha}>
                                <TouchableOpacity 
                                    style={estilos.selectorFecha} 
                                    onPress={() => setMostrarPicker(true)}
                                >
                                    <View style={estilos.contenidoFecha}>
                                        <Calendar 
                                            size={20} 
                                            color={Colores.primario} 
                                            style={estilos.iconoFecha} 
                                        />
                                        <Text style={estilos.textoFecha}>
                                            {fechaNacimiento.toLocaleDateString('es-ES')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {mostrarPicker && (
                                    <DateTimePicker
                                        value={fechaNacimiento}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={alCambiarFecha}
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>
                        )}

                        <EntradaComponent 
                            placeholder="Contraseña" 
                            valor={password} 
                            alCambiarTexto={setPassword} 
                            esContrasena={true} 
                            Icono={Lock}
                        />

                        {modoRegistro && (
                            <EntradaComponent 
                                placeholder="Confirmar Contraseña" 
                                valor={confirmarPassword} 
                                alCambiarTexto={setConfirmarPassword} 
                                esContrasena={true} 
                                Icono={Lock}
                            />
                        )}

                        {mensajeError ? (
                            <View style={estilos.contenedorError}>
                                <CircleAlert 
                                    size={14} 
                                    color={Colores.estados.error} 
                                />
                                <Text style={estilos.textoError}>{mensajeError}</Text>
                            </View>
                        ) : null}

                        {modoRegistro ? (
                            <TouchableOpacity 
                                style={estilos.filaCheck}
                                onPress={() => setTerminosAceptados(!terminosAceptados)}
                                activeOpacity={0.8}
                            >
                                <View style={[estilos.cajaCheck, terminosAceptados && estilos.checkActivo]}>
                                    {terminosAceptados && (
                                        <Check 
                                            size={12} 
                                            color={Colores.texto.invertido} 
                                            strokeWidth={4} 
                                        />
                                    )}
                                </View>
                                <Text style={estilos.textoLegal}>Acepto los términos y condiciones</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={estilos.enlaceOlvido}>
                                <Text style={estilos.textoOlvido}>¿Olvidaste tu contraseña?</Text>
                            </TouchableOpacity>
                        )}

                        <BotonComponent 
                            titulo={modoRegistro ? "Registrarse" : "Iniciar Sesión"} 
                            onPress={manejarAccion} 
                            estaCargando={cargando} 
                        />

                        <TouchableOpacity 
                            style={estilos.botonAlternar}
                            onPress={() => { setModoRegistro(!modoRegistro); setMensajeError(''); }}
                        >
                            <Text style={estilos.textoAlternar}>
                                {modoRegistro ? "¿Ya tienes una cuenta? Inicia sesión" : "¿No tienes una cuenta? Regístrate gratis"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const baseTexto = {
    fontFamily: Tipografia.familia
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
    desplazamientoContenido: {
        flexGrow: 1
    },
    imagenCabecera: {
        width: '100%',
        height: 260
    },
    capaSuperpuesta: {
        ...centrado,
        flex: 1,
        backgroundColor: 'rgba(88, 129, 87, 0.8)'
    },
    areaSegura: {
        alignItems: 'center'
    },
    contenedorLogo: {
        ...centrado,
        width: 90,
        height: 90,
        backgroundColor: Colores.superficie,
        borderRadius: 15,
        marginBottom: 10
    },
    graficoLogo: {
        width: 60,
        height: 60,
        tintColor: Colores.primario
    },
    tituloAplicacion: {
        ...baseTexto,
        fontSize: Tipografia.tamano.titulo,
        fontWeight: '900',
        color: Colores.texto.invertido
    },
    cuerpoPrincipal: {
        flex: 1,
        backgroundColor: Colores.fondoBase,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingHorizontal: 30,
        paddingTop: 30
    },
    selectorModo: {
        flexDirection: 'row',
        backgroundColor: Colores.fondoMedio,
        borderRadius: 12,
        padding: 4,
        marginBottom: 25
    },
    pestanaOpcion: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10
    },
    contenidoPestana: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconoPestana: {
        marginRight: 6
    },
    pestanaActiva: {
        backgroundColor: Colores.superficie,
        elevation: 2
    },
    textoPestana: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '700',
        color: Colores.texto.secundario
    },
    textoActivo: {
        color: Colores.texto.principal
    },
    contenedorFormulario: {
        width: '100%',
        paddingBottom: 40
    },
    seccionFecha: {
        marginVertical: 10
    },
    selectorFecha: {
        height: 50,
        backgroundColor: Colores.superficie,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colores.bordes,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    contenidoFecha: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconoFecha: {
        marginRight: 10
    },
    textoFecha: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.principal
    },
    contenedorError: {
        flexDirection: 'row',
        ...centrado,
        marginVertical: 10
    },
    textoError: {
        ...baseTexto,
        color: Colores.estados.error,
        fontWeight: '700',
        fontSize: Tipografia.tamano.detalles,
        marginLeft: 6
    },
    filaCheck: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15
    },
    cajaCheck: {
        ...centrado,
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colores.bordes,
        marginRight: 10
    },
    checkActivo: {
        backgroundColor: Colores.primario,
        borderColor: Colores.primario
    },
    textoLegal: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        color: Colores.texto.secundario
    },
    enlaceOlvido: {
        alignItems: 'flex-end',
        marginBottom: 20
    },
    textoOlvido: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        color: Colores.texto.principal,
        fontWeight: '600'
    },
    botonAlternar: {
        marginTop: 20,
        padding: 10
    },
    textoAlternar: {
        ...baseTexto,
        textAlign: 'center',
        color: Colores.primario,
        fontWeight: '700',
        fontSize: Tipografia.tamano.detalles
    }
});

export default InicioSesionScreen;