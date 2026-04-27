import { Home, Search, User } from 'lucide-react-native';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colores, Tipografia, Metricas } from '../../theme/AppTheme';

// Barra de navegación inferior
const PestanasComponent = ({ state, descriptors, navigation }) => {
    return (
        <SafeAreaView style={estilos.areaSegura}>
            <View style={estilos.contenedorBarra}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    if (options.tabBarButton) return null;

                    const label = options.title !== undefined ? options.title : route.name;
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({ 
                            type: 'tabPress', 
                            target: route.key, 
                            canPreventDefault: true 
                        });
                        
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    let IconoComponente;
                    if (route.name === 'Inicio') IconoComponente = Home;
                    if (route.name === 'Explorar') IconoComponente = Search;
                    if (route.name === 'Perfil') IconoComponente = User;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={estilos.botonNavegacion}
                            activeOpacity={1}
                        >
                            <View style={[
                                estilos.barraIndicadora, 
                                isFocused && estilos.indicadorActivo
                            ]} />
                            {IconoComponente && (
                                <IconoComponente 
                                    color={isFocused ? Colores.primario : Colores.texto.secundario} 
                                    size={Tipografia.tamano.titulo} 
                                    strokeWidth={2} 
                                    style={estilos.margenIcono} 
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

const estilos = StyleSheet.create({
    areaSegura: {
        backgroundColor: Colores.fondoBase,
        borderTopWidth: Metricas.bordeAncho,
        borderTopColor: Colores.bordes
    },
    contenedorBarra: {
        flexDirection: 'row',
        height: 75,
        backgroundColor: Colores.fondoBase,
        paddingLeft: 10,
        paddingRight: 10
    },
    botonNavegacion: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    barraIndicadora: {
        position: 'absolute',
        top: 0,
        width: 35,
        height: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: 'transparent'
    },
    indicadorActivo: {
        backgroundColor: Colores.primario
    },
    margenIcono: {
        marginBottom: 6
    }
});

export default PestanasComponent;