import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, Alert, ScrollView, ActivityIndicator, View, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Button, Center, Input } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
// import crashlytics from '@react-native-firebase/crashlytics';

// Dependencia Firestore
import { db, analyticsFirebase, crashlyticsFirebase } from '@/database/firebase';
import TableModal from '@/components/Modals/ModalFechaTipoIndicador';
import React from 'react';

export default function VistaFechaTipoIndicador() {

    const analytics = analyticsFirebase;
    const crashlytics = crashlyticsFirebase;

    const [tipoIndicador, setTipoIndicador] = useState('');
    const [fecha, setFecha] = useState('');
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const nombreVistaActual = "VistaFechaTipoIndicador";

    const fetchDataFromApi = async (tipoIndicador: string, fecha: string) => {
        analytics.logEvent('screen_view', {
            firebase_screen: nombreVistaActual,
            mensaje: "Se hace click en botón Consultar"
        })
    try {
        const response = await fetch(`http://192.168.1.83:8080/api/consultar-tipo-fecha/${tipoIndicador}/${fecha}`);
        if (!response.ok) {
            throw new Error('No hay respuesta de API');
        }
        const data = await response.json();
        // Mostrar data de consulta a API de BUDA
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
        // Crashlytics
        Alert.alert('Error', 'Error al consultar API');
    }
}

const handleApi = async () => {
    setLoading(true);
    // Se espera la respuesta de data al ingresar la currency
    const data = await fetchDataFromApi(tipoIndicador, fecha);
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
                <Text style={styles.headerText}>DD-MM-YYYY</Text>
            </View>
        }>
        <ThemedView style={styles.titleContainer}>
            <Text style={styles.titulo}>Consultar por fecha indicador</Text>
        </ThemedView>
        <ThemedText>Entrega el valor del indicador consultado según la fecha especificada.</ThemedText>
        <ThemedView>
            <TextInput
                value={tipoIndicador}
                onChangeText={setTipoIndicador}
                placeholder="Ingrese consulta"
                autoCapitalize='none'
                style={styles.input}
            ></TextInput>
        </ThemedView>
        <ThemedView>
            <TextInput
                value={fecha}
                onChangeText={setFecha}
                placeholder="Ingrese fecha (dd-mm-yyyy)"
                autoCapitalize='none'
                style={styles.input}
            ></TextInput>
        </ThemedView>
        <Center>
            <Button 
                size="lg" 
                variant="solid" 
                w="80%" 
                borderRadius={40}
                marginTop={1}
                marginBottom={20}
                onPress={handleApi}>
                Buscar
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
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 190,
        marginLeft: 250
    },
    headerImage: {
        color: 'white',
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
    button: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
        backgroundColor: 'blue',
        borderRadius: 10,
    },
    input: {
        height: 45,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 0.5,
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 12,
        fontSize: 16,
        color: 'black',
        width: '100%',
    },
    titulo: {
        fontSize: 32,
        fontWeight: "700",
        textAlign: 'justify',
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
