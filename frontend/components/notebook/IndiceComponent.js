import { FileText } from 'lucide-react-native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

// Barra de navegación horizontal para las páginas del cuaderno
const IndiceComponent = ({ paginas, paginaActivaId, onSelectPagina, cargando }) => {
    return (
        <View style={estilos.contenedorPrincipal}>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={estilos.cajaDesplazamiento}
            >
                {paginas.map((pagina, index) => {
                    const esActiva = pagina.id === paginaActivaId;
                    return (
                        <TouchableOpacity 
                            key={pagina.id}
                            style={[
                                estilos.casillaPagina, 
                                esActiva && estilos.casillaActiva
                            ]}
                            onPress={() => onSelectPagina(index)}
                            disabled={esActiva || cargando}
                        >
                            {cargando && esActiva ? (
                                <ActivityIndicator 
                                    size="small" 
                                    color={Colores.texto.invertido} 
                                />
                            ) : (
                                <FileText 
                                    size={18} 
                                    color={esActiva ? Colores.texto.invertido : Colores.texto.secundario} 
                                />
                            )}
                            <Text style={[
                                estilos.textoEtiqueta, 
                                esActiva && estilos.textoResaltado
                            ]}>
                                {index + 1}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const estilos = StyleSheet.create({
    contenedorPrincipal: {
        backgroundColor: Colores.fondoMedio,
        borderTopWidth: Metricas.bordeAncho,
        borderBottomWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        height: 50,
        justifyContent: 'center'
    },
    cajaDesplazamiento: {
        paddingHorizontal: 15,
        alignItems: 'center',
        gap: 10
    },
    casillaPagina: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colores.superficie,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Metricas.radioBoton,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        gap: 6
    },
    casillaActiva: {
        backgroundColor: Colores.primario,
        borderColor: Colores.primario
    },
    textoEtiqueta: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.detalles,
        fontWeight: '700',
        color: Colores.texto.secundario
    },
    textoResaltado: {
        color: Colores.texto.invertido
    }
});

export default IndiceComponent;