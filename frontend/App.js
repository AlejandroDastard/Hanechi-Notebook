import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PrincipalNavigator from './navigation/PrincipalNavigator';
import { Colores } from './theme/AppTheme';

const App = () => {

    useEffect(() => {
        const configurarNavegacionSytem = async () => {
            if (Platform.OS === 'android') {
                await NavigationBar.setVisibilityAsync("hidden");
                await NavigationBar.setBehaviorAsync('sticky-immersive');
            }
        };

        configurarNavegacionSytem();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <SafeAreaView style={estilos.contenedorRaiz}>
                    <StatusBar 
                        backgroundColor={Colores.fondoBase} 
                        barStyle="dark-content" 
                    />
                    <PrincipalNavigator />
                </SafeAreaView>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

const estilos = StyleSheet.create({
    contenedorRaiz: {
        flex: 1,
        backgroundColor: Colores.fondoBase
    }
});

export default App;