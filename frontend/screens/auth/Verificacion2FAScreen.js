import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BotonComponent from '../../components/common/BotonComponent';
import AutenticacionService from '../../services/AutenticacionService';
import useAuthStore from '../../store/AuthStore';
import { Colores, Tipografia } from '../../theme/AppTheme';

// Controla el input del código de verificacion
const Verificacion2FAScreen = ({ navigation, route }) => {
    const { email } = route.params || { email: '' };
    const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    
    const inputsRef = useRef([]);
    const loginGlobal = useAuthStore((state) => state.login);

    // Actualiza el temporizador de reenvío
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const avanzarPin = (val, i) => {
        const digito = val.slice(-1);
        const nuevo = [...codigo];
        nuevo[i] = digito;
        setCodigo(nuevo);
        setError('');

        if (digito && i < 5) {
            inputsRef.current[i + 1].focus();
        }
    };

    const retrocederPin = (e, i) => {
        if (e.nativeEvent.key === 'Backspace' && !codigo[i] && i > 0) {
            inputsRef.current[i - 1].focus();
        }
    };

    const reenviar = async () => {
        if (cooldown > 0) return;
        try {
            await AutenticacionService.reenviarCodigoMfa(email);
            setCooldown(30);
            setError('');
        } catch (e) {
            setError('No se pudo reenviar el código.');
        }
    };

    const verificar = async () => {
        const pin = codigo.join('');
        if (pin.length < 6) {
            setError('Ingresa el código completo.');
            return;
        }

        setCargando(true);
        setError('');
        try {
            const respuesta = await AutenticacionService.verificarMfa(email, pin);
            const objetoUsuario = {
                id: respuesta.usuarioId,
                nombreUsuario: respuesta.nombreUsuario,
                rol: respuesta.rol
            };
            await loginGlobal(respuesta.token, objetoUsuario);
            if (respuesta.usuarioId) {
                try {
                    await AutenticacionService.registrarSesion(respuesta.usuarioId);
                } catch (errorSesion) {
                    console.warn("Fallo en registro de sesión:", errorSesion);
                }
            }
        } catch (e) {
            setError('Código incorrecto o expirado.');
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
                contentContainerStyle={estilos.cajaDesplazamiento} 
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground 
                    source={require('../../assets/img/brand/fondo_auth.jpg')} 
                    style={estilos.imagenCabecera}
                    resizeMode="cover"
                >
                    <View style={estilos.capaSuperpuesta}>
                        <SafeAreaView style={estilos.areaSegura}>
                            <TouchableOpacity 
                                style={estilos.botonRegresar} 
                                onPress={() => navigation.goBack()}
                            >
                                <ArrowLeft 
                                    color={Colores.texto.invertido} 
                                    size={Tipografia.tamano.subtitulo} 
                                />
                            </TouchableOpacity>

                            <View style={estilos.bloqueCabecera}>
                                <View style={estilos.contenedorLogo}>
                                    <Image 
                                        source={require('../../assets/img/brand/logo.png')} 
                                        style={estilos.graficoLogo} 
                                    />
                                </View>
                                <Text style={estilos.tituloSeguridad}>Seguridad 2FA</Text>
                            </View>
                        </SafeAreaView>
                    </View>
                </ImageBackground>

                <View style={estilos.cuerpoContenido}>
                    <Text style={estilos.tituloCodigo}>Código de Acceso</Text>
                    <Text style={estilos.instruccionTexto}>Introduce los 6 dígitos enviados a:</Text>
                    <Text style={estilos.correoUsuario}>{email}</Text>

                    <View style={estilos.filaEntradas}>
                        {codigo.map((digito, index) => (
                            <TextInput 
                                key={index}
                                ref={el => inputsRef.current[index] = el}
                                style={[
                                    estilos.casillaCodigo, 
                                    digito ? estilos.casillaEnfocada : null
                                ]}
                                maxLength={1}
                                keyboardType="numeric"
                                value={digito}
                                onChangeText={v => avanzarPin(v, index)}
                                onKeyPress={e => retrocederPin(e, index)}
                                selectTextOnFocus={true}
                            />
                        ))}
                    </View>

                    {error ? (
                        <View style={estilos.alertaError}>
                            <Text style={estilos.textoError}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={estilos.bloqueBotones}>
                        <BotonComponent 
                            titulo="Verificar Código" 
                            onPress={verificar} 
                            estaCargando={cargando} 
                        />

                        <TouchableOpacity 
                            onPress={reenviar} 
                            disabled={cooldown > 0}
                            style={estilos.botonReenviar}
                        >
                            <View style={estilos.filaAlineada}>
                                <RefreshCw 
                                    size={Tipografia.tamano.basico} 
                                    color={cooldown > 0 ? Colores.texto.secundario : Colores.primario} 
                                    style={estilos.margenIcono}
                                />
                                <Text style={[
                                    estilos.textoAccion, 
                                    cooldown > 0 && estilos.textoInactivo
                                ]}>
                                    {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código nuevo"}
                                </Text>
                            </View>
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
    cajaDesplazamiento: {
        flexGrow: 1
    },
    imagenCabecera: {
        width: '100%',
        height: 280
    },
    capaSuperpuesta: {
        flex: 1,
        backgroundColor: 'rgba(88, 129, 87, 0.85)',
        justifyContent: 'space-between'
    },
    areaSegura: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    botonRegresar: {
        ...centrado,
        position: 'absolute',
        top: Platform.OS === 'ios' ? 10 : 30,
        left: 20,
        zIndex: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        width: 44,
        height: 44
    },
    bloqueCabecera: {
        flex: 1,
        ...centrado
    },
    contenedorLogo: {
        ...centrado,
        width: 90,
        height: 90,
        backgroundColor: Colores.superficie,
        borderRadius: 20,
        marginBottom: 15,
        elevation: 8,
        shadowColor: Colores.texto.principal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65
    },
    graficoLogo: {
        width: 60,
        height: 60,
        tintColor: Colores.primario
    },
    tituloSeguridad: {
        ...baseTexto,
        fontSize: Tipografia.tamano.titulo + 4,
        fontWeight: '900',
        color: Colores.texto.invertido,
        letterSpacing: 1
    },
    cuerpoContenido: {
        flex: 1,
        backgroundColor: Colores.fondoBase,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        marginTop: -35,
        paddingHorizontal: 25,
        paddingTop: 45,
        alignItems: 'center'
    },
    tituloCodigo: {
        ...baseTexto,
        fontSize: Tipografia.tamano.titulo,
        fontWeight: '800',
        color: Colores.texto.principal,
        marginBottom: 8
    },
    instruccionTexto: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario,
        textAlign: 'center'
    },
    correoUsuario: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        fontWeight: '700',
        color: Colores.primario,
        marginBottom: 35
    },
    filaEntradas: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 25
    },
    casillaCodigo: {
        width: 46,
        height: 58,
        backgroundColor: Colores.superficie,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colores.bordes,
        textAlign: 'center',
        fontSize: Tipografia.tamano.titulo,
        fontWeight: 'bold',
        color: Colores.texto.principal,
        elevation: 2,
        shadowColor: Colores.texto.principal,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1
    },
    casillaEnfocada: {
        borderColor: Colores.primario,
        backgroundColor: Colores.fondoBase
    },
    alertaError: {
        backgroundColor: 'rgba(224, 122, 95, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 20
    },
    textoError: {
        ...baseTexto,
        color: Colores.estados.error,
        fontWeight: '700',
        fontSize: Tipografia.tamano.detalles,
        textAlign: 'center'
    },
    bloqueBotones: {
        width: '100%',
        marginTop: 5
    },
    botonReenviar: {
        marginTop: 25,
        alignItems: 'center',
        padding: 10
    },
    filaAlineada: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    margenIcono: {
        marginRight: 8
    },
    textoAccion: {
        ...baseTexto,
        color: Colores.primario,
        fontWeight: '700',
        fontSize: Tipografia.tamano.detalles
    },
    textoInactivo: {
        color: Colores.texto.secundario
    }
});

export default Verificacion2FAScreen;