import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, ChevronDown, ChevronUp, Globe, ImagePlus, Lock, Save } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import EntradaComponent from '../../components/common/EntradaComponent';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import ApiService from '../../services/ApiService';
import CuadernoDataService from '../../services/CuadernoDataService';
import SocialDataService from '../../services/SocialDataService';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';
import { obtenerImagenCuaderno } from '../../utils/ImagenHelper';

// Edicion de informacion de un cuaderno
const ConfiguracionCuadernoScreen = ({ navigation, route }) => {
    const { idCuaderno } = route.params;
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [esPublico, setEsPublico] = useState(false);
    const [urlPortada, setUrlPortada] = useState('');
    
    const [etiquetasDb, setEtiquetasDb] = useState([]);
    const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([]);
    const [desplegarEtiquetas, setDesplegarEtiquetas] = useState(false);
    const [cargandoIncial, setCargandoInicial] = useState(true);
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const tagsData = await SocialDataService.obtenerEtiquetas();
                setEtiquetasDb(tagsData || []);

                const cuadernoData = await CuadernoDataService.obtenerPorId(idCuaderno);
                setTitulo(cuadernoData.titulo || '');
                setDescripcion(cuadernoData.descripcion || '');
                setEsPublico(cuadernoData.visibilidad === 'PUBLICO');
                setUrlPortada(cuadernoData.urlPortada || '');
                if (cuadernoData.etiquetas) {
                    setEtiquetasSeleccionadas(cuadernoData.etiquetas.map(t => t.id));
                }
            } catch (e) {
                Alert.alert("Error", "No se pudo cargar la configuración.");
            } finally {
                setCargandoInicial(false);
            }
        };
        cargarDatos();
    }, [idCuaderno]);

    const seleccionarImagen = async () => {
        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!res.canceled) {
            const uri = res.assets[0].uri;
            setUrlPortada(uri);
        }
    };

    const alternarEtiqueta = (idEtiqueta) => {
        if (etiquetasSeleccionadas.includes(idEtiqueta)) {
            setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter(id => id !== idEtiqueta));
        } else {
            setEtiquetasSeleccionadas([...etiquetasSeleccionadas, idEtiqueta]);
        }
    };

    const guardarConfiguracion = async () => {
        setGuardando(true);
        try {
            const payload = {
                descripcion,
                visibilidad: esPublico ? 'PUBLICO' : 'PRIVADO',
                idEtiquetas: etiquetasSeleccionadas
            };
            await ApiService.patch(`/cuadernos/${idCuaderno}`, payload);
            Alert.alert("Éxito", "Configuración guardada correctamente.", [
                { text: "Aceptar", onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert("Error", "Fallo al actualizar el cuaderno.");
        } finally {
            setGuardando(false);
        }
    };

    if (cargandoIncial) {
        return (
            <SafeAreaView style={estilos.contenedorPantalla}>
                <CabeceraComponent 
                    titulo="Cargando..." 
                    iconoIzquierda={
                        <ArrowLeft 
                            color={Colores.texto.invertido} 
                            size={Tipografia.tamano.subtitulo} 
                        />
                    } 
                    accionIzquierda={() => navigation.goBack()} 
                />
                <View style={estilos.cajaCarga}>
                    <ActivityIndicator 
                        size="large" 
                        color={Colores.primario} 
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Ajustes de Obra" 
                iconoIzquierda={
                    <ArrowLeft 
                        color={Colores.texto.invertido} 
                        size={Tipografia.tamano.subtitulo} 
                    />
                } 
                accionIzquierda={() => navigation.goBack()} 
            />
            <ScrollView 
                contentContainerStyle={estilos.desplazamientoContenido} 
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity 
                    style={estilos.contenedorImagen} 
                    onPress={seleccionarImagen} 
                    activeOpacity={0.8}
                >
                    {urlPortada ? (
                        <Image 
                            source={obtenerImagenCuaderno(urlPortada)} 
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
                        editable={false}
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
                        <Text style={estilos.textoVisibilidad}>Visibilidad Pública</Text>
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
                            Géneros y Etiquetas ({etiquetasSeleccionadas.length})
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
                            {etiquetasDb.map(tag => {
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
                            })}
                        </View>
                    )}
                </View>

                <View style={estilos.separadorEspaciado} />
                
                <TouchableOpacity 
                    style={estilos.botonGuardado} 
                    onPress={guardarConfiguracion} 
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
                            <Text style={estilos.textoGuardado}>Sincronizar Cambios</Text>
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
    desplazamientoContenido: {
        padding: 25
    },
    cajaCarga: {
        flex: 1,
        ...centrado
    },
    contenedorImagen: {
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
        elevation: 2,
        shadowColor: Colores.sombras,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    textoGuardado: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        fontWeight: '800',
        color: Colores.texto.invertido
    }
});

export default ConfiguracionCuadernoScreen;