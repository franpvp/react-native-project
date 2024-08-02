import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, Alert, ScrollView, ActivityIndicator, View, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Button, Center, Input } from "native-base";
// import crashlytics from '@react-native-firebase/crashlytics';

// Dependencia Firestore
import { db, analyticsFirebase, crashlyticsFirebase } from '@/database/firebase';
import TableModal from '@/components/Modals/ModalAñoTipoIndicadores';
import React from 'react';

export default function VistaAñoTipoIndicador() {

    const analytics = analyticsFirebase;
    const crashlytics = crashlyticsFirebase;

    const [tipoIndicador, setTipoIndicador] = useState('');
    const [anio, setAnio] = useState('');
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const nombreVistaActual = "VistaAñoTipoIndicador";

    const fetchDataFromApi = async (tipoIndicador: string, anio: string) => {
        // Se agrega logEvent para hacer seguimiento en click a botón
        analytics.logEvent('screen_view', {
            firebase_screen: nombreVistaActual,
            mensaje: "Se hace click en botón Consultar"
        })

        try {
            const response = await fetch(`http://192.168.1.85:8080/api/consultar-tipo-año/${tipoIndicador}/${anio}`);
            if (!response.ok) {
                analytics.logEvent('screen_view', {
                    firebase_screen: nombreVistaActual,
                    mensaje: "No hay respuesta de API"
                })
                throw new Error('No hay respuesta de API');
            }
            const data = await response.json();
            // Mostrar data de consulta a API de BUDA
            console.log(data)
            return data;
        } catch (error: any) {
            console.error(error);
            // Crashlytics
            crashlytics.recordError(error);
            // Alert.alert('Error', 'Error al consultar API');
        }
    }

const handleApi = async () => {
    setLoading(true);
    // Se espera la respuesta de data al ingresar la currency
    const data = await fetchDataFromApi(tipoIndicador, anio);
    if (data) {
        // Almacenamos la data en setApiData
        setApiData(data);
        setModalVisible(true);
    }
    setLoading(false);
};

    return (
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#3d3f58', dark: '#353636' }}
        headerImage={
            <View style={styles.headerContainer}>
                <Ionicons size={250} name="calendar" style={styles.headerImage} />
                <Text style={styles.headerText}>YYYY</Text>
            </View>
        }>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Consultar Indicadores</ThemedText>
        </ThemedView>
        <ThemedText>Entrega los últimos valores registrados de los principales indicadores.</ThemedText>
        <ThemedView>
            <Input 
                size="lg" 
                variant="outline" 
                placeholder="Ingrese consulta" 
                mt={3}
                value={tipoIndicador}
                onChangeText={setTipoIndicador}
            />
        </ThemedView>
        <ThemedView>
            <Input 
                size="lg" 
                variant="outline" 
                placeholder="Ingrese año" 
                mt={3}
                value={anio}
                onChangeText={setAnio}
            />
        </ThemedView>
        <Center>
            <Button 
                size="lg" 
                variant="solid" 
                w="80%" 
                borderRadius={40}
                marginTop={5}
                onPress={handleApi}>
                Consultar
            </Button>
        </Center>
        <ScrollView>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {apiData && (
                <TableModal isOpen={modalVisible} onClose={() => setModalVisible(false)} data={apiData} />
            )}
        </ScrollView>
    </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    headerText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 170,
        marginLeft: 250
    },
    headerImage: {
        color: 'white',
        top: -15,
        left: 25,
        position: 'absolute',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: 'white',
    },
    cell: {
        flex: 1,
        paddingHorizontal: 8,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
        backgroundColor: 'blue',
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    jsonContainer: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
    },
    jsonText: {
        fontFamily: 'monospace',
    },
    
});
