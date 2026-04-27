import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ConfiguracionCuadernoScreen from '../screens/notebook/ConfiguracionCuadernoScreen';
import CrearCuadernoScreen from '../screens/notebook/CrearCuadernoScreen';
import EditarCuadernoScreen from '../screens/notebook/EditarCuadernoScreen';
import ResumenCuadernoScreen from '../screens/notebook/ResumenCuadernoScreen';
import VerCuadernoScreen from '../screens/notebook/VerCuadernoScreen';
import PerfilPublicoScreen from '../screens/social/PerfilPublicoScreen';

const Stack = createNativeStackNavigator();

const CuadernosNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CrearCuaderno" component={CrearCuadernoScreen} />
            <Stack.Screen name="ResumenCuaderno" component={ResumenCuadernoScreen} />
            <Stack.Screen name="EditarCuaderno" component={EditarCuadernoScreen} />
            <Stack.Screen name="VerCuaderno" component={VerCuadernoScreen} />
            <Stack.Screen name="ConfiguracionCuaderno" component={ConfiguracionCuadernoScreen} />

            <Stack.Screen name="PerfilPublico" component={PerfilPublicoScreen} />
        </Stack.Navigator>
    );
};

export default CuadernosNavigator;