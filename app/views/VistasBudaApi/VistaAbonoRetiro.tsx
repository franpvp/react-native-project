import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, Alert, ScrollView, ActivityIndicator, View, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Button, Center, Input } from "native-base";

// Dependencia Firestore
import { db } from '@/database/firebase';
import TableModal from '@/components/ModalComponent';

export default function VistaAbonoRetiro() {

  // Se requieren dos parámetros a la consulta
  const [currency, setCurrency] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Realizar solicitud get a API Costos de abonos/retiros
  // Ejemplo para currency = 'btc' y para transaction_type = 'withdrawal'
  const fetchDataFromApiAR = async (currency: string, transactionType: string) => {
    try {
      const response = await fetch(`https://www.buda.com/api/v2/currencies/${currency}/fees/${transactionType}`);
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

  const saveDataToFirestoreAR = async (data: any) => {
    try {
      // Guardar la data a la tabla abonosRetiros en Firestore
      await db.collection('abonosRetiros').add(data);
    } catch (error) {
      // En caso de error guardar en tabla abonosRetirosError
      await db.collection('abonosRetirosError').add(data);
      console.error('Error al guardar en Firestore: ', error);
      Alert.alert('Error', 'Error al guardar en Firestore');
    }
  };

  const handleApiAndFirestoreAR = async (transactionType: string) => {
    setLoading(true);
    // Se espera la respuesta de data al ingresar la currency
    const data = await fetchDataFromApiAR(currency, transactionType);
    if (data) {
      // Almacenamos la data en setApiData
      setApiData(data);
      // Guardamos la data obtenida en Firestore
      await saveDataToFirestoreAR(data);
      setModalVisible(true);
    }
    setLoading(false);
  };

  const typeSelected = async (tipoSeleccionado: string) => {
    switch (tipoSeleccionado) {
      case 'deposit':
        await handleApiAndFirestoreAR('deposit'); // Suponiendo que 'deposit' es el tipo de transacción para abono en la API
        break;
      case 'withdrawal':
        await handleApiAndFirestoreAR('withdrawal'); // Suponiendo que 'withdrawal' es el tipo de transacción para retiro en la API
        break;
      default:
        break;
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={250} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Costos Abono y Retiros</ThemedText>
      </ThemedView>
      <ThemedText>Entrega los costos asociados a realizar un abono o retiro en la moneda seleccionada.</ThemedText>
      <ThemedView>
        <Input 
            size="lg" 
            variant="outline" 
            placeholder="Ingrese consulta" 
            mt={3}
            value={currency}
            onChangeText={setCurrency}
        />
      </ThemedView>
      <ThemedView>
          <Center>
              <Button 
                  size="lg" 
                  variant="solid" 
                  w="80%" 
                  borderRadius={40}
                  onPress={() => typeSelected('deposit')}>
                      Deposito
              </Button>
          </Center>
      </ThemedView>
      <ThemedView>
          <Center>
              <Button 
                  size="lg" 
                  variant="solid" 
                  w="80%" 
                  borderRadius={40}
                  onPress={() => typeSelected('withdrawal')}>
                      Retiro
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
