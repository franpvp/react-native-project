import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, Alert, ScrollView, ActivityIndicator, View, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Button, Center, Input, Box } from "native-base";
// import crashlytics from '@react-native-firebase/crashlytics';

// Dependencia Firestore
import { db, analyticsFirebase, crashlyticsFirebase } from '@/database/firebase';
import TableModal from '@/components/Modals/ModalIndicadores';
import React from 'react';

export default function VistaIndicadores() {

    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const analytics = analyticsFirebase;
    const crashlytics = crashlyticsFirebase;

    const nombreVistaActual = "VistaIndicadores";

    const fetchDataApiIndicadores = async () => {
        analytics.logEvent('screen_view', {
            firebase_screen: nombreVistaActual,
            mensaje: "Se hace click en botón Consultar"
        })
        crashlytics.log("Obteniendo data Vista Indicadores");
        try {
            const response = await fetch(`http://192.168.1.83:8080/api/consultar-indicadores`);
            if (!response.ok) {
                throw new Error('No hay respuesta de API');
            }
            const data = await response.json();
            console.log(data)
            return data;
        } catch (error: any) {
            console.error(error);
            // Agregar crash de Crashlytics 
            crashlytics.recordError(error)
            crashlytics.setAttribute("Tipo Error", error.name);
            crashlytics.setAttribute("Mensaje Error", error.message);
            // Alert.alert('Error', 'Error al consultar API');
        }
    }

    const handleApiAndFirestore = async () => {
        analytics.logEvent('screen_view' ,{
            firebase_screen: nombreVistaActual,
            mensaje: "Click botón Consulta"
        })
        setLoading(true);
        try {
            // Se espera la respuesta de data al ingresar la currency
            const data = await fetchDataApiIndicadores();
            if (data) {
                // Almacenamos la data en setApiData
                setApiData(data);
                // Guardamos la data obtenida en Firestore
                await fetchDataApiIndicadores();
                setModalVisible(true);
            } else {
                // Si no se obtiene data, se reporta un error a Crashlytics y se fuerza un crash
                crashlytics.log('No se obtuvo data de fetchDataApiIndicadores');
                crashlytics.crash();
            }
        } catch (error: any) {
            crashlytics.recordError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#3d3f58', dark: '#353636' }}
        headerImage={<Ionicons size={200} name="cash" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Consultar Indicadores</ThemedText>
        </ThemedView>
        <ThemedText>Entrega los últimos valores registrados de los principales indicadores.</ThemedText>
        <ThemedView>
            <Center>
                <Button 
                    size="lg" 
                    variant="solid" 
                    w="80%" 
                    marginTop={5}
                    borderRadius={40}
                    onPress={handleApiAndFirestore}>
                    Consultar
                </Button>
            </Center>
        </ThemedView>
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
    headerImage: {
        color: 'white',
        bottom: -10,
        top: 20,
        right: 30,
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
    box: {
        width: '100%',
        backgroundColor: '#0e7490',
        position: 'absolute'
    }
    
});
