import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Alert, ScrollView, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Center, Input, Button, IconButton, Icon, ChevronLeftIcon } from "native-base";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import TableModal from '@/components/Modals/ModalComponent';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { db, analyticsFirebase, crashlyticsFirebase } from '@/database/firebase';

const VistaEstadoMercado = () => {

    const [marketId, setMarketId] = useState('');
    const [apiData, setApiData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const analytics = analyticsFirebase;
    const crashlytics = crashlyticsFirebase;

    const nombreVistaActual = "VistaEstadoMercado";

    const fetchDataApi = async (marketId: string) => {
        analytics.logEvent('screen_view', {
            firebase_screen: nombreVistaActual,
            mensaje: "Se hace click en botón Consultar"
        })
        crashlytics.log("Obteniendo data de Vista Estado Mercado")
        try {
            // Registra un evento antes de hacer la consulta
            await analytics.logEvent('fetch_data_api_buda_start', {
                marketId: marketId
            });
            // Consulta a servicio Java Springboot
            const response = await fetch(`http://192.168.1.83:8080/api/consultar-mercado/${marketId}`);
            if (!response.ok) {
                throw new Error('No hay respuesta de API');
            }
            const data = await response.json();
            console.log(data);

             // Registra un evento después de una consulta exitosa
            await analytics.logEvent('fetch_data_api_buda_success', {
                marketId: marketId,
                responseLength: data.length // Por ejemplo, puedes registrar la longitud de la respuesta
            });

            return data;
        } catch (error: any) {
            console.error(error);
            // Agregar evento de Crashlytics
            crashlytics.recordError(error);
            // Registra un evento en caso de error
            await analytics.logEvent('fetch_data_api_buda_error', {
                marketId: marketId,
                errorMessage: error.message
            });

            // Alert.alert('Error', 'Error al consultar API');
        }
    };

    const saveDataToFirestore = async (data: any) => {
        try {
            // Registra un evento antes de intentar guardar los datos
            await analytics.logEvent('save_data_to_firestore_start', {
                dataId: data.id || null,
            });
            await db.collection('marketData').add(data);

            // Registra un evento después de guardar los datos exitosamente
            await analytics.logEvent('save_data_to_firestore_success', {
                dataId: data.id || null,
            });
        } catch (error: any) {
            await db.collection('marketIdError').add(data);
            // Registra un evento en caso de error
            await analytics.logEvent('save_data_to_firestore_error', {
                dataId: data.id || null, // Suponiendo que data tiene una propiedad id
                errorMessage: error.message,
            });
            console.error('Error saving data to Firestore: ', error);
            Alert.alert('Error', 'Failed to save data to Firestore');
        }
    };
    
    const handleApiAndFirestore = async () => {
        // Registra un evento de clic en el botón
        await analytics.logEvent('button_click_buscar', {
            screen_name: nombreVistaActual,
            buttonName: 'handleApiAndFirestore',
            mensaje: 'Click en botón Buscar'
        });
        await analytics.logScreenView({
            screen_name: nombreVistaActual,
            mensaje: "Click en botón consultar"
        });
        setLoading(true);
        const data = await fetchDataApi(marketId);
        if (data) {
            setApiData(data);
            await saveDataToFirestore(data);
            setModalVisible(true);
        }
        setLoading(false);
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#3d3f58', dark: '#1D3D47' }}
            headerImage={<Ionicons size={300} name="analytics-outline" style={styles.headerImage} />
        }>
            <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Consulta Estado Mercado</ThemedText>
            </ThemedView>
            <ThemedView>
            <Input 
                size="lg" 
                variant="outline" 
                placeholder="Ingrese consulta" 
                mt={3}
                value={marketId}
                onChangeText={setMarketId}
            />
            </ThemedView>
            <ThemedView>
            <Center>
                <Button 
                    size="lg" 
                    variant="solid" 
                    w="80%" 
                    borderRadius={40}
                    marginTop={5}
                    onPress={handleApiAndFirestore}>
                    Buscar
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: 'white',
    },
    headerImage: {
        color: 'white',
        bottom: -20,
        right: 20,
        position: 'absolute',
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
        color: 'white',
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

export default VistaEstadoMercado;