import { Image, StyleSheet, Platform, Alert, Button, TextInput, ActivityIndicator, View, ScrollView, Text, SafeAreaView } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import db from '../../database/firebase';

export default function HomeScreen() {

  const [marketId, setMarketId] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDataFromApi = async (marketId: string) => {
    try {
      const response = await fetch(`https://www.buda.com/api/v2/markets/${marketId}/ticker`);
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
  };

  const saveDataToFirestore = async (data: any) => {
    try {
      // Guardar la data a la tabla marketData de Firebase
      await db.collection('marketData').add(data);
    } catch (error) {
      // En caso de error guardar en tabla marketIdError
      await db.collection('marketIdError').add(data);
      console.error('Error saving data to Firestore: ', error);
      Alert.alert('Error', 'Failed to save data to Firestore');
    }
  };

  const handleApiAndFirestore = async () => {
    setLoading(true);
    const data = await fetchDataFromApi(marketId);
    if (data) {
      setApiData(data);
      await saveDataToFirestore(data);
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
        <ThemedText type="title">Consulta BUDA.com</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Ingresar Market ID</ThemedText>
      </ThemedView>
      <ThemedView>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el market_id"
          value={marketId}
          onChangeText={setMarketId}
        />
      </ThemedView>
      <ThemedView style={styles.button}>
        <Button
          title="Consultar"
          color="#FFFFFF"
          onPress={handleApiAndFirestore}
          disabled={loading}
        />
      </ThemedView>
      <ScrollView>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {apiData && (
          <View style={styles.jsonContainer}>
            <Text style={styles.jsonText}>{JSON.stringify(apiData, null, 2)}</Text>
          </View>
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
