import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Alert, ScrollView, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Center, Input, Button, IconButton, Icon, ChevronLeftIcon } from "native-base";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import TableModal from '@/components/ModalComponent';
import { useNavigation } from '@react-navigation/native';


import db from '../../../database/firebase';

const VistaEstadoMercado = () => {

    const navigation = useNavigation();

    const [marketId, setMarketId] = useState('');
    const [apiData, setApiData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Personaliza las opciones de navegación aquí
        navigation.setOptions({
          headerLeft: () => (
            <IconButton
              icon={<ChevronLeftIcon name="chevron-left" size={5} color="blue"/>} // Icono de ChevronLeftIcon
              colorScheme="dark" // Ajusta el esquema de color según tu tema
              onPress={() => navigation.goBack()} // Acción al presionar el botón
            />
          ),
        });
      }, []);

    const fetchDataApiBuda = async (marketId: string) => {

        try {
            // Consulta a servicio Java Springboot
            const response = await fetch(`http://localhost:8080/api/consultar-mercado/${marketId}`);
            if (!response.ok) {
                throw new Error('No hay respuesta de API');
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error al consultar API');
        }
    };

    const saveDataToFirestore = async (data: any) => {
        try {
            await db.db.collection('marketData').add(data);
        } catch (error) {
            await db.db.collection('marketIdError').add(data);
            console.error('Error saving data to Firestore: ', error);
            Alert.alert('Error', 'Failed to save data to Firestore');
        }
    };
    
    const handleApiAndFirestore = async () => {
    setLoading(true);
    const data = await fetchDataApiBuda(marketId);
    if (data) {
        setApiData(data);
        await saveDataToFirestore(data);
        setModalVisible(true);
    }
    setLoading(false);
};

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
            <Image
                source={require('@/assets/images/partial-react-logo.png')}
                style={styles.reactLogo}
            />
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

export default VistaEstadoMercado;