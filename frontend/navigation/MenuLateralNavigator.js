import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';

import { Bell, Home, LogOut, Settings, Users } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import UsuarioDataService from '../services/UsuarioDataService';
import useAuthStore from '../store/AuthStore';
import { Colores, Metricas, Tipografia } from '../theme/AppTheme';
import { obtenerImagenAvatar, obtenerImagenBanner } from '../utils/ImagenHelper';
import PestanasNavigator from './PestanasNavigator';

const Drawer = createDrawerNavigator();

// Gestiona el contenido del menú lateral
const CustomDrawerContent = (props) => {
    const { usuario, logout } = useAuthStore();
    const { navigation } = props;
    const [perfil, setPerfil] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const cargar = async () => {
                if (usuario?.id) {
                    try {
                        const data = await UsuarioDataService.obtenerPerfil(usuario.id);
                        setPerfil(data);
                    } catch (e) {}
                }
            };
            cargar();
        }, [usuario?.id])
    );

    // Transición a la Pantalla de pestañas
    const navTo = (screen) => navigation.navigate('InicioTabs', { screen });

    return (
        <View style={estilos.contenedorPantalla}>
            <DrawerContentScrollView {...props}>
                <View style={estilos.cabeceraNavegacion}>
                    <Image 
                        source={obtenerImagenBanner(perfil?.urlBanner)} 
                        style={estilos.imagenBanner} 
                    />
                    <View style={estilos.capaSuperpuesta} />
                    
                    <View style={estilos.bloqueUsuario}>
                        <Image 
                            source={obtenerImagenAvatar(perfil?.urlAvatar)} 
                            style={estilos.imagenAvatar} 
                        />
                        <Text style={estilos.textoUsuario}>
                            {perfil?.nombrePerfil || usuario?.nombreUsuario}
                        </Text>
                    </View>
                </View>

                <View style={estilos.listaOpciones}>
                    <TouchableOpacity 
                        style={estilos.botonOpcion} 
                        onPress={() => navTo('Inicio')}
                    >
                        <Home 
                            color={Colores.texto.secundario} 
                            size={Tipografia.tamano.titulo} 
                            strokeWidth={2} 
                            style={estilos.iconoOpcion} 
                        />
                        <Text style={estilos.textoOpcion}>Inicio</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={estilos.botonOpcion} 
                        onPress={() => navTo('Amigos')}
                    >
                        <Users 
                            color={Colores.texto.secundario} 
                            size={Tipografia.tamano.titulo} 
                            strokeWidth={2} 
                            style={estilos.iconoOpcion} 
                        />
                        <Text style={estilos.textoOpcion}>Amigos</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={estilos.botonOpcion} 
                        onPress={() => navTo('Notificaciones')}
                    >
                        <Bell 
                            color={Colores.texto.secundario} 
                            size={Tipografia.tamano.titulo} 
                            strokeWidth={2} 
                            style={estilos.iconoOpcion} 
                        />
                        <Text style={estilos.textoOpcion}>Notificaciones</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={estilos.botonOpcion} 
                        onPress={() => navTo('Configuracion')}
                    >
                        <Settings 
                            color={Colores.texto.secundario} 
                            size={Tipografia.tamano.titulo} 
                            strokeWidth={2} 
                            style={estilos.iconoOpcion} 
                        />
                        <Text style={estilos.textoOpcion}>Ajustes</Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>

            <TouchableOpacity 
                style={estilos.botonSalida} 
                onPress={logout}
            >
                <LogOut 
                    color={Colores.texto.invertido} 
                    size={Tipografia.tamano.subtitulo} 
                    strokeWidth={2} 
                />
                <Text style={estilos.textoSalida}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const MenuLateralNavigator = () => (
    <Drawer.Navigator 
        drawerContent={props => <CustomDrawerContent {...props} />} 
        screenOptions={{ 
            headerShown: false, 
            drawerStyle: { 
                width: '80%' 
            } 
        }}
    >
        <Drawer.Screen name="InicioTabs" component={PestanasNavigator} />
    </Drawer.Navigator>
);

const baseTexto = {
    fontFamily: Tipografia.familia
};

const estilos = StyleSheet.create({
    contenedorPantalla: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    },
    cabeceraNavegacion: {
        height: 180,
        marginBottom: 20
    },
    imagenBanner: {
        ...StyleSheet.absoluteFillObject
    },
    capaSuperpuesta: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    bloqueUsuario: {
        position: 'absolute',
        bottom: 20,
        left: 20
    },
    imagenAvatar: {
        width: 80,
        height: 80,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: Colores.texto.invertido,
        marginBottom: 10,
        backgroundColor: Colores.fondoMedio
    },
    textoUsuario: {
        ...baseTexto,
        fontSize: Tipografia.tamano.titulo,
        fontWeight: '900',
        color: Colores.texto.invertido
    },
    listaOpciones: {
        padding: 20
    },
    botonOpcion: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: Metricas.radioImagen,
        marginBottom: 5
    },
    iconoOpcion: {
        marginRight: 30
    },
    textoOpcion: {
        ...baseTexto,
        fontSize: Tipografia.tamano.basico,
        fontWeight: '700',
        color: Colores.texto.secundario
    },
    botonSalida: {
        margin: 20,
        padding: 15,
        backgroundColor: Colores.primario,
        borderRadius: Metricas.radioImagen,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textoSalida: {
        ...baseTexto,
        color: Colores.texto.invertido,
        fontWeight: '800',
        fontSize: Tipografia.tamano.basico,
        marginLeft: 10
    }
});

export default MenuLateralNavigator;