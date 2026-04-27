import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, ImagePlus, ChevronDown, ChevronUp, Lock, Globe, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import BotonComponent from '../../components/common/BotonComponent';
import EntradaComponent from '../../components/common/EntradaComponent';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import ApiService from '../../services/ApiService';
import SocialDataService from '../../services/SocialDataService';
import useAuthStore from '../../store/AuthStore';
import { Colores, Tipografia, Metricas } from '../../theme/AppTheme';

// Creación de un nuevo cuaderno
const CrearCuadernoScreen = ({ navigation }) => {
    const usuario = useAuthStore(s => s.usuario);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [esPublico, setEsPublico] = useState(false);
    const [portadaPreview, setPortadaPreview] = useState(null);
    const [urlPortada, setUrlPortada] = useState('');
    
    const [etiquetasDb, setEtiquetasDb] = useState([]);
    const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([]);
    const [desplegarEtiquetas, setDesplegarEtiquetas] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);

    // Obtiene la lista de etiquetas disponibles
    useEffect(() => {
        const cargarTags = async () => {
            try {
                const data = await SocialDataService.obtenerEtiquetas();
                setEtiquetasDb(data || []);
            } catch (e) {
            } finally {
                setCargando(false);
            }
        };
        cargarTags();
    }, []);

    // Permite seleccionar una imagen de la galería para la portada
    const seleccionarImagen = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!res.canceled) {
            const uri = res.assets[0].uri;
            setPortadaPreview(uri);
            setUrlPortada(uri.split('/').pop());
        }
    };

    // Alterna la selección de una etiqueta
    const alternarEtiqueta = (idEtiqueta) => {
        if (etiquetasSeleccionadas.includes(idEtiqueta)) {
            setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter(id => id !== idEtiqueta));
        } else {
            setEtiquetasSeleccionadas([...etiquetasSeleccionadas, idEtiqueta]);
        }
    };

    // Envía la información del nuevo cuaderno
    const guardarCuaderno = async () => {
        if (!titulo.trim()) return;
        setGuardando(true);
        try {
            const payload = {
                titulo,
                descripcion,
                urlPortada,
                visibilidad: esPublico ? 'PUBLICO' : 'PRIVADO',
                idEtiquetas: etiquetasSeleccionadas
            };
            const res = await ApiService.post(`/cuadernos/usuario/${usuario.id}`, payload);
            navigation.replace('EditarCuaderno', { idCuaderno: res.data.id });
        } catch (e) {
        } finally {
            setGuardando(false);
        }
    };

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Nuevo Cuaderno" 
                iconoIzquierda={
                    <ArrowLeft 
                        color={Colores.texto.invertido} 
                        size={Tipografia.tamano.subtitulo} 
                    />
                } 
                accionIzquierda={() => navigation.goBack()} 
            />
            <ScrollView 
                contentContainerStyle={estilos.cajaDesplazamiento} 
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity 
                    style={estilos.cajaImagen} 
                    onPress={seleccionarImagen} 
                    activeOpacity={0.8}
                >
                    {portadaPreview ? (
                        <Image 
                            source={{ uri: portadaPreview }} 
                            style={estilos.imagenCompleta} 
                        />
                    ) : (
                        <View style={estilos.marcadorPosicion}>
                            <ImagePlus 
                                size={48} 
                                color={Colores.texto.secundario} 
                            />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={estilos.seccionFormulario}>
                    <EntradaComponent 
                        etiqueta="Título" 
                        valor={titulo} 
                        alCambiarTexto={setTitulo} 
                        colorFondo={Colores.fondoMedio}
                    />
                    <EntradaComponent 
                        etiqueta="Descripción" 
                        valor={descripcion} 
                        alCambiarTexto={setDescripcion} 
                        multiline={true} 
                        colorFondo={Colores.fondoMedio}
                    />
                </View>

                <View style={estilos.filaVisibilidad}>
                    <View style={estilos.etiquetaVisibilidad}>
                        {esPublico ? (
                            <Globe 
                                size={20} 
                                color={Colores.primario} 
                            />
                        ) : (
                            <Lock 
                                size={20} 
                                color={Colores.texto.secundario} 
                            />
                        )}
                        <Text style={estilos.textoVisibilidad}>Público</Text>
                    </View>
                    <Switch 
                        value={esPublico} 
                        onValueChange={setEsPublico} 
                        trackColor={{ 
                            true: Colores.primario, 
                            false: Colores.bordes 
                        }} 
                        thumbColor={Colores.superficie}
                    />
                </View>

                <View style={estilos.contenedorDesplegable}>
                    <TouchableOpacity 
                        style={estilos.botonDesplegable} 
                        onPress={() => setDesplegarEtiquetas(!desplegarEtiquetas)}
                        activeOpacity={0.7}
                    >
                        <Text style={estilos.textoDesplegable}>
                            Etiquetas ({etiquetasSeleccionadas.length})
                        </Text>
                        {desplegarEtiquetas ? (
                            <ChevronUp 
                                size={20} 
                                color={Colores.texto.principal} 
                            />
                        ) : (
                            <ChevronDown 
                                size={20} 
                                color={Colores.texto.principal} 
                            />
                        )}
                    </TouchableOpacity>
                    
                    {desplegarEtiquetas && (
                        <View style={estilos.contenedorEtiquetas}>
                            {cargando ? (
                                <ActivityIndicator color={Colores.primario} />
                            ) : (
                                etiquetasDb.map(tag => {
                                    const activo = etiquetasSeleccionadas.includes(tag.id);
                                    return (
                                        <TouchableOpacity 
                                            key={tag.id} 
                                            style={[
                                                estilos.itemEtiqueta, 
                                                activo && estilos.etiquetaActiva
                                            ]}
                                            onPress={() => alternarEtiqueta(tag.id)}
                                        >
                                            <Text style={[
                                                estilos.textoEtiqueta, 
                                                activo && estilos.textoActivo
                                            ]}>
                                                {tag.nombre}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </View>
                    )}
                </View>

                <View style={estilos.separadorEspaciado} />
                
                <TouchableOpacity 
                    style={estilos.botonGuardado} 
                    onPress={guardarCuaderno} 
                    disabled={guardando}
                >
                    {guardando ? (
                        <ActivityIndicator color={Colores.texto.invertido} />
                    ) : (
                        <>
                            <Save 
                                size={20} 
                                color={Colores.texto.invertido} 
                            />
                            <Text style={estilos.textoGuardado}>Crear y Empezar a Escribir</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const baseTexto = {
    fontFamily: Tipografia.familia
};

const centrado = {
    justifyContent: 'center',
    alignItems: 'center'
};

const paddingEstandar = {
    padding: 18
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    cajaDesplazamiento: {
        padding: 25
    },
    cajaImagen: {
        ...centrado,
        width: '100%',
        height: 180,
        backgroundColor: Colores.fondoMedio,
        borderRadius: Metricas.radioImagen + 4,
        marginBottom: 25,
        overflow: 'hidden',
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        borderStyle: 'dashed'
    },
    imagenCompleta: {
        width: '100%',
        height: '100%'
    },
    marcadorPosicion: {
        ...centrado
    },
    seccionFormulario: {
        gap: 15,
        marginBottom: 25
    },
    filaVisibilidad: {
        ...paddingEstandar,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colores.superficie,
        borderRadius: 12,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        marginBottom: 25
    },
    etiquetaVisibilidad: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    textoVisibilidad: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '700',
        color: Colores.texto.principal
    },
    contenedorDesplegable: {
        backgroundColor: Colores.superficie,
        borderRadius: 12,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        overflow: 'hidden'
    },
    botonDesplegable: {
        ...paddingEstandar,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textoDesplegable: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '800',
        color: Colores.texto.principal
    },
    contenedorEtiquetas: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: 18,
        paddingBottom: 18
    },
    itemEtiqueta: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: Colores.fondoMedio,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes
    },
    etiquetaActiva: {
        backgroundColor: Colores.primario,
        borderColor: Colores.primario
    },
    textoEtiqueta: {
        ...baseTexto,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '600',
        color: Colores.texto.secundario
    },
    textoActivo: {
        color: Colores.texto.invertido,
        fontWeight: '800'
    },
    separadorEspaciado: {
        height: 40
    },
    botonGuardado: {
        ...centrado,
        flexDirection: 'row',
        backgroundColor: Colores.primario,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
        elevation: 2
    },
    textoGuardado: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        fontWeight: '800',
        color: Colores.texto.invertido
    }
});

export default CrearCuadernoScreen;