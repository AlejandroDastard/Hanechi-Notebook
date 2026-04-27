import { StyleSheet, Text, View } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import useEditorStore from '../../store/EditorStore';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';
import BloqueComponent from './BloqueComponent';

const LienzoComponent = ({ modoEdicion }) => {
    const { elementos, reordenarElementos, actualizarContenidoElemento, eliminarElemento } = useEditorStore();

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <BloqueComponent 
                elemento={item} 
                modoEdicion={modoEdicion} 
                drag={drag} 
                isActive={isActive} 
                onUpdate={(val) => actualizarContenidoElemento(item.id || item.idTemporal, val)}
                onDelete={() => eliminarElemento(item.id || item.idTemporal)}
            />
        );
    };

    if (elementos.length === 0) {
        return (
            <View style={estilos.contenedorVacio}>
                <Text style={estilos.textoVacio}>El lienzo está en blanco.</Text>
            </View>
        );
    }

    return (
        <DraggableFlatList
            data={elementos}
            onDragEnd={({ data }) => reordenarElementos(data)}
            keyExtractor={(item) => item.id || item.idTemporal}
            renderItem={renderItem}
            contentContainerStyle={estilos.listaElementos}
        />
    );
};

const estilos = StyleSheet.create({
    listaElementos: {
        paddingHorizontal: Metricas.paddingRaiz,
        paddingTop: Metricas.paddingRaiz,
        paddingBottom: 100
    },
    contenedorVacio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textoVacio: {
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.basico,
        color: Colores.texto.secundario
    }
});

export default LienzoComponent;