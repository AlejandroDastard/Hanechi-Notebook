import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BotonComponent from '../../components/common/BotonComponent';
import EntradaComponent from '../../components/common/EntradaComponent';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import UsuarioDataService from '../../services/UsuarioDataService';
import useAuthStore from '../../store/AuthStore';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

// Controla la configuracion de datos de perfil
const EditarPerfilScreen = ({ navigation, route }) => {
    const usuario = useAuthStore(s => s.usuario);
    const perfilActual = route.params?.perfilActual || {};

    const [nombrePerfil, setNombrePerfil] = useState(perfilActual.nombrePerfil || '');
    const [bibliografia, setBiografia] = useState(perfilActual.bibliografia || '');
    const [urlAvatar, setUrlAvatar] = useState(perfilActual.urlAvatar || '');
    const [urlBanner, setUrlBanner] = useState(perfilActual.urlBanner || '');
    
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    
    const [cargando, setCargando] = useState(false);

    // Abre la galeria y obtener la uri de la imagen
    const pick = async (tipo) => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: tipo === 'avatar' ? [1, 1] : [3, 1],
            quality: 0.7,
        });

        if (!res.canceled) {
            const uri = res.assets[0].uri;
            
            if (tipo === 'avatar') {
                setAvatarPreview(uri);
                setUrlAvatar(uri);
            } else {
                setBannerPreview(uri);
                setUrlBanner(uri);
            }
        }
    };

    // Envia los datos actualizados del perfil
    const save = async () => {
        setCargando(true);
        try {
            const finalAvatar = urlAvatar.startsWith('file://') ? urlAvatar : perfilActual.urlAvatar;
            const finalBanner = urlBanner.startsWith('file://') ? urlBanner : perfilActual.urlBanner;
            await UsuarioDataService.actualizarPerfil(usuario.id, { 
                nombrePerfil, 
                bibliografia, 
                urlAvatar: finalAvatar, 
                urlBanner: finalBanner 
            });
            navigation.goBack();
        } catch (e) {
        } finally { 
            setCargando(false); 
        }
    };

    // Determina la fuente de la imagen
    const getImagenSrc = (tipo) => {
        if (tipo === 'avatar') {
            if (avatarPreview) return { uri: avatarPreview };
            if (perfilActual.urlAvatar) return { 
                uri: perfilActual.urlAvatar.startsWith('file://') 
                    ? perfilActual.urlAvatar 
                    : `http://10.0.2.2:8080/assets/img/avatar/${perfilActual.urlAvatar}` 
            };
            return null;
        } else {
            if (bannerPreview) return { uri: bannerPreview };
            if (perfilActual.urlBanner) return { 
                uri: perfilActual.urlBanner.startsWith('file://') 
                    ? perfilActual.urlBanner 
                    : `http://10.0.2.2:8080/assets/img/banner/${perfilActual.urlBanner}` 
            };
            return null;
        }
    };

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Editar Perfil"
                iconoIzquierda={
                    <ArrowLeft 
                        color={Colores.texto.invertido} 
                        size={Tipografia.tamano.subtitulo} 
                        strokeWidth={2} 
                    />
                }
                accionIzquierda={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={estilos.desplazamientoContenido}>
                <View style={estilos.bloqueSeleccion}>
                    <Text style={estilos.etiquetaTexto}>Avatar</Text>
                    <TouchableOpacity 
                        onPress={() => pick('avatar')} 
                        style={estilos.selectorCircular}
                    >
                        {getImagenSrc('avatar') ? (
                            <Image 
                                source={getImagenSrc('avatar')} 
                                style={estilos.imagenCompleta} 
                            />
                        ) : (
                            <Text style={estilos.simboloMas}>+</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={estilos.bloqueSeleccion}>
                    <Text style={estilos.etiquetaTexto}>Banner</Text>
                    <TouchableOpacity 
                        onPress={() => pick('banner')} 
                        style={estilos.selectorRectangular}
                    >
                        {getImagenSrc('banner') ? (
                            <Image 
                                source={getImagenSrc('banner')} 
                                style={estilos.imagenCompleta} 
                            />
                        ) : (
                            <Text style={estilos.simboloMas}>+</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <EntradaComponent 
                    etiqueta="Nombre Público" 
                    valor={nombrePerfil} 
                    alCambiarTexto={setNombrePerfil} 
                />
                <EntradaComponent 
                    etiqueta="Biografía" 
                    valor={bibliografia} 
                    alCambiarTexto={setBiografia} 
                    multiline={true} 
                />
                
                <View style={estilos.separadorVertical} />
                
                <BotonComponent 
                    titulo="Guardar Cambios" 
                    onPress={save} 
                    estaCargando={cargando} 
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const baseSelector = {
    backgroundColor: Colores.fondoMedio,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: Metricas.bordeAncho,
    borderColor: Colores.bordes,
    borderStyle: 'dashed'
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    desplazamientoContenido: {
        paddingHorizontal: 25,
        paddingTop: 25,
        paddingBottom: 40
    },
    bloqueSeleccion: {
        marginBottom: 25,
        alignItems: 'center'
    },
    etiquetaTexto: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '700',
        color: Colores.texto.secundario,
        marginBottom: 10,
        textTransform: 'uppercase'
    },
    selectorCircular: {
        ...baseSelector,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    selectorRectangular: {
        ...baseSelector,
        width: '100%',
        height: 120,
        borderRadius: Metricas.radioImagen
    },
    imagenCompleta: {
        width: '100%',
        height: '100%'
    },
    simboloMas: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.titulo,
        color: Colores.texto.secundario
    },
    separadorVertical: {
        height: 20
    }
});

export default EditarPerfilScreen;