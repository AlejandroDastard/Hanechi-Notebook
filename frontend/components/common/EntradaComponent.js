import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colores, Metricas, Tipografia } from '../../theme/AppTheme';

const EntradaComponent = ({
    etiqueta,
    valor,
    alCambiarTexto,
    placeholder,
    esContrasena = false,
    error = null,
    Icono = null,
    ...propiedades
}) => {
    const [estaEnFoco, setEstaEnFoco] = useState(false);

    const estiloContenedorInput = [
        estilos.campoIngreso,
        estaEnFoco && estilos.bordeResaltado,
        error && estilos.bordeError
    ];

    return (
        <View style={estilos.contenedorRaiz}>
            {etiqueta && <Text style={estilos.etiquetaTexto}>{etiqueta}</Text>}

            <View style={estiloContenedorInput}>
                {Icono && (
                    <View style={estilos.bloqueIcono}>
                        <Icono 
                            size={20} 
                            color={estaEnFoco ? Colores.acento : Colores.texto.secundario} 
                        />
                    </View>
                )}
                
                <TextInput
                    style={estilos.inputTexto}
                    value={valor}
                    onChangeText={alCambiarTexto}
                    placeholder={placeholder}
                    placeholderTextColor={Colores.texto.secundario}
                    secureTextEntry={esContrasena}
                    onFocus={() => setEstaEnFoco(true)}
                    onBlur={() => setEstaEnFoco(false)}
                    {...propiedades}
                />
            </View>

            {error && <Text style={estilos.avisoError}>{error}</Text>}
        </View>
    );
};

const textoInformativo = {
    marginLeft: 4,
    fontSize: Tipografia.tamano.detalles
};

const estilos = StyleSheet.create({
    contenedorRaiz: {
        marginVertical: 10,
        width: '100%'
    },
    etiquetaTexto: {
        ...textoInformativo,
        fontFamily: Tipografia.familia,
        color: Colores.texto.secundario,
        marginBottom: 6,
        textTransform: 'uppercase',
        fontWeight: '700'
    },
    campoIngreso: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colores.superficie,
        borderRadius: 8,
        borderWidth: Metricas.bordeAncho,
        borderColor: Colores.bordes,
        height: 50,
        paddingHorizontal: 15
    },
    bloqueIcono: {
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputTexto: {
        flex: 1,
        fontFamily: Tipografia.familia,
        fontSize: Tipografia.tamano.normal,
        color: Colores.texto.principal,
        height: '100%'
    },
    bordeResaltado: {
        borderColor: Colores.acento,
        borderWidth: 1.5
    },
    bordeError: {
        borderColor: Colores.estados.error
    },
    avisoError: {
        ...textoInformativo,
        color: Colores.estados.error,
        marginTop: 4
    }
});

export default EntradaComponent;