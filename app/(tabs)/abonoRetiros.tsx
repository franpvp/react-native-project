import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TextInput, Alert, Button } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';

import db from '../../database/firebase';

export default function TabInfo() {

  // Se requieren dos parámetros a la consulta
  const [currency, setCurrency] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // Guardar la data a la tabla abonosRetiros de Firebase
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
    const data = await fetchDataFromApiAR(currency, transactionType);
    if (data) {
      setApiData(data);
      await saveDataToFirestoreAR(data);
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
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Costos Abono y Retiros</ThemedText>
      </ThemedView>
      <ThemedText>Entrega los costos asociados a realizar un abono o retiro en la moneda seleccionada.</ThemedText>
      <ThemedView>
        <TextInput
          style= {styles.input}
          placeholder="Ingrese currency"
          value={currency}
          onChangeText={setCurrency}
        />
      </ThemedView>
      {/* Boton para caso de abono */}
      <ThemedView style={styles.button}>
        <Button
            title="Abono"
            color="#FFFFFF"
            onPress={() => typeSelected('deposit')}
          />
      </ThemedView>
      {/* Boton para caso de Retiro */}
      <ThemedView style={styles.button}>
        <Button
            title="Retiro"
            color="#FFFFFF"
            onPress={() => typeSelected('withdrawal')}
            disabled={loading}
          />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
});
