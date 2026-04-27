import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuthStore from '../store/AuthStore';
import AutenticacionNavigator from './AutenticacionNavigator';
import MenuLateralNavigator from './MenuLateralNavigator';
import CuadernosNavigator from './CuadernosNavigator';

const Stack = createNativeStackNavigator();

const PrincipalNavigator = () => {
    const { estaAutenticado, inicializarAuth, cargando } = useAuthStore();

    useEffect(() => {
        inicializarAuth();
    }, []);

    if (cargando) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {estaAutenticado ? (
                    <Stack.Group>
                        <Stack.Screen name="MainDrawer" component={MenuLateralNavigator} />
                        <Stack.Screen name="CuadernosFlujo" component={CuadernosNavigator} />
                    </Stack.Group>
                ) : (
                    <Stack.Screen name="Auth" component={AutenticacionNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default PrincipalNavigator;