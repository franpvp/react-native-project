import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, Alert, ScrollView, ActivityIndicator, View, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Button, Center, Input } from "native-base";
// import crashlytics from '@react-native-firebase/crashlytics';

// Dependencia Firestore
import { db, analyticsFirebase } from '@/database/firebase';
import TableModal from '@/components/Modals/ModalAñoTipoIndicadores';
import React from 'react';

export default function VistaAñoTipoIndicador() {

    const analytics = analyticsFirebase;

    const [tipoIndicador, setTipoIndicador] = useState('');
    const [anio, setAnio] = useState('');
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Realizar solicitud get a API Costos de abonos/retiros
    // Ejemplo para currency = 'btc' y para transaction_type = 'withdrawal'
    const fetchDataFromApi = async (tipoIndicador: string, anio: string) => {
    try {
        const response = await fetch(`http://192.168.1.85:8080/api/consultar-tipo-año/${tipoIndicador}/${anio}`);
        if (!response.ok) {
            throw new Error('No hay respuesta de API');
        }
        const data = await response.json();
        // Mostrar data de consulta a API de BUDA
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Error al consultar API');
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
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={250} name="code-slash" style={styles.headerImage} />}>
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
    headerImage: {
        color: '#808080',
        bottom: -30,
        left: -10,
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
