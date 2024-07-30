import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, TextInput, Alert, ScrollView, ActivityIndicator, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';

// Dependencias Firebase
import { db, analyticsFirebase, crashlyticsFirebase } from '@/database/firebase';
import { Button, Center, Input } from 'native-base';
import React from 'react';
import TableModal from '@/components/Modals/ModalVolumenMercado';

export default function VistaVolumenMercado() {

  const [marketId, setMarketId] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const analytics = analyticsFirebase;
  const crashlytics = crashlyticsFirebase;

  const nombreVistaActual = "VistaVolumenMercado";

  const fetchDataFromApiVolume = async (market_id: string) => {
    await analytics.logScreenView({
      screen_name: nombreVistaActual,
      mensaje: "Click en botón consultar"
    });
    crashlytics.log('Obteniendo data Vista Volumen Mercado.');
    try {
      const response = await fetch(`http://10.200.82.184:8080/api/consultar-volumen/${market_id}`);
      if (!response.ok) {
        throw new Error('No hay respuesta de API');
      }
      const data = await response.json();
      // Mostrar data de consulta a API de BUDA
      console.log(data)
      return data;
    } catch (error: any) {
      console.error(error);
      // Agregar evento de Crashlytics
      crashlytics.recordError(error);
      // Alert.alert('Error', 'Error al consultar API');
    }
  }

  const saveDataToFirestore = async (data: any) => {
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

  const handleApiAndFirestore = async () => {
    setLoading(true);
    const data = await fetchDataFromApiVolume(marketId);
    if (data) {
      setApiData(data);
      await saveDataToFirestore(data);
    }
    setLoading(false);
  };

    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#3d3f58', dark: '#353636' }}
        headerImage={<Ionicons size={220} name="bar-chart" style={styles.headerImage} />}>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Volumen De Mercado</ThemedText>
        </ThemedView>
        <ThemedText>Consultar volumen transado en un determinado mercado.</ThemedText>
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
                    Consultar
              </Button>
          </Center>
        </ThemedView>
        <ScrollView>
          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          {apiData && (
              <View style={styles.jsonContainer}>
                  <TableModal isOpen={modalVisible} onClose={() => setModalVisible(false)} data={apiData} />
              </View>
          )}
        </ScrollView>
      </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
  headerImage: {
    color: 'white',
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
  
});
