import { useFocusEffect } from '@react-navigation/native';

import { ArrowDownAZ, ArrowUpAZ, Book, Check, ChevronDown, Hash, Menu, Search, SlidersHorizontal, User } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BusquedaComponent from '../../components/cards/BusquedaComponent';
import CabeceraComponent from '../../components/layout/CabeceraComponent';
import CuadernoDataService from '../../services/CuadernoDataService';
import UsuarioDataService from '../../services/UsuarioDataService';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

// Gestiona la busqueda de Cuadernos y Usuarios
const ExplorarScreen = ({ navigation }) => {
    const [tipo, setTipo] = useState('cuadernos');
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState([]);
    const [cargando, setCargando] = useState(false);
    
    const [etiquetas, setEtiquetas] = useState([]);
    const [tagSeleccionado, setTagSeleccionado] = useState('Todos');
    const [ordenAsc, setOrdenAsc] = useState(true);
    const [mostrarDropdown, setMostrarDropdown] = useState(false);

    // Obtiene la lista de etiquetas
    useEffect(() => {
        const cargarEtiquetas = async () => {
            try {
                const data = await CuadernoDataService.listarEtiquetas();
                setEtiquetas([{ id: 'all', nombre: 'Todos' }, ...data]);
            } catch (e) {
                setEtiquetas([{ id: 'all', nombre: 'Todos' }]);
            }
        };
        cargarEtiquetas();
    }, []);

    // Actualiza los resultados cuando cambia el tipo de búsqueda
    useFocusEffect(
        useCallback(() => {
            const texto = query.trim();
            if (texto === '' && tipo === 'cuadernos') {
                cargarPublicos();
            } else if (texto === '') {
                setResultados([]);
            }
        }, [tipo])
    );

    // Obtiene los cuadernos públicos
    const cargarPublicos = async () => {
        setCargando(true);
        try {
            const data = await CuadernoDataService.obtenerCuadernosPublicos();
            setResultados(Array.isArray(data) ? data : []);
        } catch (e) {
            setResultados([]);
        } finally {
            setCargando(false);
        }
    };

    // Consulta de busqueda según el tipo
    const manejarBusqueda = async () => {
        const textoBusqueda = query.trim().toLowerCase();
        
        if (!textoBusqueda && tipo === 'cuadernos') {
            cargarPublicos();
            return;
        }

        if (!textoBusqueda) {
            setResultados([]);
            return;
        }

        setCargando(true);
        try {
            if (tipo === 'usuarios') {
                const data = await UsuarioDataService.buscarPerfiles(textoBusqueda);
                setResultados(Array.isArray(data) ? data : []);
            } else if (tipo === 'codigo') {
                try {
                    const item = await CuadernoDataService.obtenerPorCodigo(textoBusqueda.toUpperCase());
                    setResultados(item ? [item] : []);
                } catch (e) {
                    setResultados([]);
                }
            } else {
                const data = await CuadernoDataService.obtenerCuadernosPublicos();
                const lista = Array.isArray(data) ? data : [];
                const filtrados = lista.filter(c => 
                    (c.titulo || "").toLowerCase().includes(textoBusqueda) || 
                    (c.descripcion || "").toLowerCase().includes(textoBusqueda)
                );
                setResultados(filtrados);
            }
        } catch (e) {
            setResultados([]);
        } finally {
            setCargando(false);
        }
    };

    // Filtros de etiquetas y el orden
    const listaFinal = useMemo(() => {
        let lista = [...resultados];
        
        if (tipo !== 'usuarios' && tagSeleccionado !== 'Todos') {
            lista = lista.filter(c => 
                c.etiquetas && Array.isArray(c.etiquetas) && 
                c.etiquetas.some(t => (t.nombre || "").toString() === tagSeleccionado)
            );
        }

        lista.sort((a, b) => {
            let valA = "";
            let valB = "";

            if (tipo === 'usuarios') {
                valA = (a.nombrePerfil || a.nombreUsuario || "").toString().toLowerCase();
                valB = (b.nombrePerfil || b.nombreUsuario || "").toString().toLowerCase();
            } else {
                valA = (a.titulo || "").toString().toLowerCase();
                valB = (b.titulo || "").toString().toLowerCase();
            }

            if (ordenAsc) return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

        return lista;
    }, [resultados, tagSeleccionado, ordenAsc, tipo]);

    return (
        <SafeAreaView style={estilos.contenedorPantalla}>
            <CabeceraComponent 
                titulo="Explorar" 
                iconoIzquierda={
                    <Menu 
                        color={Colores.texto.invertido} 
                        size={Tipografia.tamano.titulo} 
                    />
                } 
                accionIzquierda={() => navigation.openDrawer()} 
            />

            <View style={estilos.cajaCabecera}>
                <View style={estilos.filaAcciones}>
                    <View style={estilos.cajaBusqueda}>
                        <Search 
                            color={Colores.texto.secundario} 
                            size={Tipografia.tamano.subtitulo} 
                        />
                        <TextInput 
                            style={estilos.entradaTexto} 
                            placeholder={
                                tipo === 'usuarios' ? "Buscar usuario..." : 
                                tipo === 'codigo' ? "Ingresa el código..." : "Buscar contenido..."
                            }
                            placeholderTextColor={Colores.texto.secundario}
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={manejarBusqueda}
                        />
                    </View>
                    
                    <View style={estilos.contenedorSelector}>
                        <TouchableOpacity 
                            style={[estilos.botonSelector, tipo === 'cuadernos' && estilos.botonActivo]}
                            onPress={() => { setTipo('cuadernos'); setQuery(''); setTagSeleccionado('Todos'); }}
                        >
                            <Book 
                                size={Tipografia.tamano.subtitulo} 
                                color={tipo === 'cuadernos' ? Colores.primario : Colores.texto.secundario} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[estilos.botonSelector, tipo === 'codigo' && estilos.botonActivo]}
                            onPress={() => { setTipo('codigo'); setQuery(''); setTagSeleccionado('Todos'); }}
                        >
                            <Hash 
                                size={Tipografia.tamano.subtitulo} 
                                color={tipo === 'codigo' ? Colores.primario : Colores.texto.secundario} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[estilos.botonSelector, tipo === 'usuarios' && estilos.botonActivo]}
                            onPress={() => { setTipo('usuarios'); setQuery(''); setTagSeleccionado('Todos'); }}
                        >
                            <User 
                                size={Tipografia.tamano.subtitulo} 
                                color={tipo === 'usuarios' ? Colores.primario : Colores.texto.secundario} 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={estilos.filaFiltros}>
                    <TouchableOpacity 
                        style={estilos.botonDesplegable}
                        onPress={() => setMostrarDropdown(!mostrarDropdown)}
                    >
                        <SlidersHorizontal 
                            size={Tipografia.tamano.basico} 
                            color={Colores.primario} 
                        />
                        <Text style={estilos.textoDesplegable}>Filtro: {tagSeleccionado}</Text>
                        <ChevronDown 
                            size={Tipografia.tamano.basico} 
                            color={Colores.texto.secundario} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={estilos.botonOrden} 
                        onPress={() => setOrdenAsc(!ordenAsc)}
                    >
                        {ordenAsc ? (
                            <ArrowDownAZ 
                                color={Colores.primario} 
                                size={Tipografia.tamano.subtitulo} 
                            />
                        ) : (
                            <ArrowUpAZ 
                                color={Colores.primario} 
                                size={Tipografia.tamano.subtitulo} 
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {mostrarDropdown && (
                    <View style={estilos.contenedorOpciones}>
                        <ScrollView 
                            style={estilos.desplazamientoOpciones} 
                            nestedScrollEnabled
                        >
                            {etiquetas.map((t) => (
                                <TouchableOpacity 
                                    key={t.id || t.nombre} 
                                    style={estilos.itemOpcion}
                                    onPress={() => {
                                        setTagSeleccionado(t.nombre);
                                        setMostrarDropdown(false);
                                    }}
                                >
                                    <Text style={[
                                        estilos.textoOpcion, 
                                        tagSeleccionado === t.nombre && estilos.textoActivo
                                    ]}>
                                        {t.nombre}
                                    </Text>
                                    {tagSeleccionado === t.nombre && (
                                        <Check 
                                            size={Tipografia.tamano.basico} 
                                            color={Colores.primario} 
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>

            {cargando ? (
                <View style={estilos.contenedorCarga}>
                    <ActivityIndicator 
                        size="large" 
                        color={Colores.primario} 
                    />
                </View>
            ) : (
                <FlatList 
                    data={listaFinal}
                    keyExtractor={(item) => (item.id || item.idUsuario || Math.random()).toString()}
                    contentContainerStyle={estilos.listaResultados}
                    numColumns={tipo === 'usuarios' ? 1 : 2}
                    key={tipo} 
                    ListEmptyComponent={
                        <View style={estilos.contenedorVacio}>
                            <Search 
                                color={Colores.sombras} 
                                size={64} 
                                strokeWidth={1} 
                            />
                            <Text style={estilos.textoVacio}>No se encontraron resultados</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <BusquedaComponent 
                            item={item} 
                            tipo={tipo} 
                            onPress={() => {
                                if (tipo === 'usuarios') {
                                    navigation.navigate('PerfilPublico', { idUsuario: item.idUsuario || item.id });
                                } else {
                                    navigation.navigate('CuadernosFlujo', { 
                                        screen: 'ResumenCuaderno', 
                                        params: { idCuaderno: item.id } 
                                    });
                                }
                            }}
                        />
                    )}
                />
            )}
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

const sombraSutil = {
    shadowColor: Colores.texto.principal,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    cajaCabecera: {
        padding: 20,
        backgroundColor: Colores.superficie,
        borderBottomWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        zIndex: 10
    },
    filaAcciones: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cajaBusqueda: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colores.fondoBase,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colores.bordes,
        height: 50,
        paddingHorizontal: 12,
        marginRight: 10
    },
    entradaTexto: {
        ...baseTexto,
        flex: 1,
        marginLeft: 10,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.principal,
        fontWeight: '500'
    },
    contenedorSelector: {
        flexDirection: 'row',
        backgroundColor: Colores.fondoMedio,
        borderRadius: 10,
        padding: 3
    },
    botonSelector: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8
    },
    botonActivo: {
        ...sombraSutil,
        backgroundColor: Colores.superficie
    },
    filaFiltros: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center'
    },
    botonDesplegable: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colores.fondoBase,
        padding: 12,
        borderRadius: 12,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes
    },
    textoDesplegable: {
        ...baseTexto,
        flex: 1,
        marginLeft: 10,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '700',
        color: Colores.texto.secundario
    },
    botonOrden: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: Colores.fondoMedio,
        borderRadius: 12,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes
    },
    contenedorOpciones: {
        position: 'absolute',
        top: 135,
        left: 20,
        right: 20,
        backgroundColor: Colores.superficie,
        borderRadius: 16,
        elevation: 8,
        shadowColor: Colores.texto.principal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        zIndex: 100
    },
    desplazamientoOpciones: {
        maxHeight: 220
    },
    itemOpcion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: Metricas.bordeAncho,
        borderBottomColor: Colores.fondoBase
    },
    textoOpcion: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario,
        fontWeight: '600'
    },
    textoActivo: {
        color: Colores.primario,
        fontWeight: '800'
    },
    listaResultados: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 40
    },
    contenedorCarga: {
        flex: 1,
        ...centrado
    },
    contenedorVacio: {
        alignItems: 'center',
        marginTop: 80,
        paddingHorizontal: 40
    },
    textoVacio: {
        ...baseTexto,
        marginTop: 20,
        textAlign: 'center',
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario,
        fontWeight: '500'
    }
});

export default ExplorarScreen;