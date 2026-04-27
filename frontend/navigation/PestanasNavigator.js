import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PestanasComponent from '../components/layout/PestanasComponent';

import InicioScreen from '../screens/home/InicioScreen';
import ExplorarScreen from '../screens/explore/ExplorarScreen';
import PerfilScreen from '../screens/profile/PerfilScreen';
import NotificacionesScreen from '../screens/social/NotificacionesScreen';
import AmigosScreen from '../screens/social/AmigosScreen';
import ConfiguracionScreen from '../screens/profile/ConfiguracionScreen';
import EditarPerfilScreen from '../screens/profile/EditarPerfilScreen';
import PerfilPublicoScreen from '../screens/social/PerfilPublicoScreen';

const Tab = createBottomTabNavigator();

const PestanasNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <PestanasComponent {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Inicio" component={InicioScreen}/>
            <Tab.Screen name="Cuadernos" component={InicioScreen} options={{ title: 'Vault', tabBarButton: () => null }} />
            <Tab.Screen name="Explorar" component={ExplorarScreen}/>
            <Tab.Screen name="Perfil" component={PerfilScreen}/>

            <Tab.Screen name="Notificaciones" component={NotificacionesScreen} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="Amigos" component={AmigosScreen} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="Configuracion" component={ConfiguracionScreen} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="EditarPerfil" component={EditarPerfilScreen} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="PerfilPublico" component={PerfilPublicoScreen} options={{ tabBarButton: () => null }} />
        </Tab.Navigator>
    );
};

export default PestanasNavigator;