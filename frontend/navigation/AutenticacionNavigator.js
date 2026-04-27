import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BienvenidaScreen from '../screens/auth/BienvenidaScreen';
import InicioSesionScreen from '../screens/auth/InicioSesionScreen';
import Verificacion2FAScreen from '../screens/auth/Verificacion2FAScreen';

const Stack = createNativeStackNavigator();

const AutenticacionNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false,animation: 'fade'}}>
            <Stack.Screen name="Bienvenida" component={BienvenidaScreen} />
            <Stack.Screen name="InicioSesion" component={InicioSesionScreen} />
            <Stack.Screen name="Verificacion2FA" component={Verificacion2FAScreen} />
        </Stack.Navigator>
    );
};

export default AutenticacionNavigator;