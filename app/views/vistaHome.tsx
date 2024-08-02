import React, { useEffect, useState } from "react";
import { VStack, Center, Box, Text } from "native-base";
import { View, Image, StyleSheet, Button, Pressable} from 'react-native';
import { ScrollView } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderBackButton } from '@react-navigation/elements';
import { db, analyticsFirebase, authFirebase, crashlyticsFirebase } from "@/database/firebase"; 
import Ionicons from "@expo/vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function VistaHome({ navigation }: any) {
  
  // const logTestEvent = async () => {
  //   await analytics.logEvent('test_event', {
  //     test_param: 'test_value',
  //   });
  //   console.log('Test event logged');
  // };

  const [apiData, setApiData] = useState<any[]>([]);
    const analytics = analyticsFirebase;
    const crashlytics = crashlyticsFirebase;

    const nombreVistaActual = "VistaHome";

    useEffect(() => {
      const loadData = async () => {
        const data = await fetchDataApiIndicadores();
        if (data) {
          // Extrae los indicadores del objeto
          const indicatorsList = Object.values(data).filter(item => typeof item === 'object' && item !== null);
          setApiData(indicatorsList);
        }
      };
      loadData();
    }, []);

    const fetchDataApiIndicadores = async () => {
      crashlytics.log("Obteniendo data Vista Indicadores");
      try {
        const response = await fetch(`http://192.168.1.85:8080/api/consultar-indicadores`);
        if (!response.ok) {
          throw new Error('No hay respuesta de API');
        }
        const data = await response.json();
        console.log(data); // Verifica la estructura de los datos aquí
        return data;
      } catch (error: any) {
        console.error(error);
        crashlytics.recordError(error);
        crashlytics.setAttribute("Tipo Error", error.name);
        crashlytics.setAttribute("Mensaje Error", error.message);
      }
    };

    const renderIndicatorBox = (indicator: any) => (
      <Box key={indicator.codigo} style={styles.indicatorBox}>
        <Text fontSize="lg" color="white" fontWeight={600}>{indicator.nombre}</Text>
        <Text fontSize="md" color="white">{indicator.valor} {indicator.unidad_medida}</Text>
      </Box>
    );

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {/* Contenido Endpoint Indicadores económicos */}
        <VStack alignItems="center" paddingBottom={5}>
          <Box style={styles.containerListaIndicadores}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {apiData.length > 0 ? (
              apiData.map((indicator) => renderIndicatorBox(indicator))
            ) : (
              <Text color="white">No se encontraron datos</Text>
            )}
          </ScrollView>
          </Box>
          <Box style={styles.containerIndBox}>
            <Box alignItems="center">
              <Pressable
                style={styles.pressableSmaller}
              >
                <Image
                  source={require('../../assets/images/indIcon.png')}
                  style={styles.image}
                  resizeMode="contain"
                />
              </Pressable>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Pressable
                  onPress={() => navigation.navigate("Indicadores")}
                >
                  <Box style={styles.firstBox}>
                    <Ionicons name="cash" size={24} color="white" style={styles.icon} />
                    <Text fontSize="lg" color="white" fontWeight={600}>Indicadores</Text>
                  </Box>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("Tipo Indicador")}
                >
                  <Box style={styles.secondBox}>
                  <Icon name="bitcoin" size={24} color="white" style={styles.icon} />
                    <Text fontSize="lg" color="white" fontWeight={600}>Tipo Indicador</Text>
                  </Box>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("Fecha Tipo Indicador")}
                >
                  <Box style={styles.thirdBox}>
                    <Text fontSize="lg" color="white" fontWeight='bold'>DD-MM-YYYY</Text>
                    <Text fontSize="lg" color="white" fontWeight={600}>Fecha Tipo Indicador</Text>
                  </Box>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("Año Tipo Indicador")}
                >
                  <Box style={styles.fourthBox}>
                  <Icon name="calendar" size={24} color="white" style={styles.icon} />
                    <Text fontSize="lg" color="white" fontWeight={600}>Año Tipo Indicador</Text>
                  </Box>
                </Pressable>
              </ScrollView>
            </Box>
          </Box>
        </VStack>
        {/* Contenido Endpoints Buda API */}
        <VStack alignItems="center" paddingBottom={5}>
          <Box style={styles.containerBudaBox}>
            <Box alignItems="center">
              <Pressable
                style={styles.pressable}
              >
                <Image
                  source={require('../../assets/images/buda.png')}
                  style={styles.image}
                  resizeMode="contain"
                />
              </Pressable>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Pressable
                  onPress={() => navigation.navigate("Estado Mercado")}
                >
                  <Box style={styles.firstBox}>
                    <Ionicons name="analytics-outline" size={24} color="white" style={styles.icon} />
                    <Text fontSize="lg" color="white" fontWeight={600}>Estado Mercado</Text>
                  </Box>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("Abonos y Retiros")}
                >
                  <Box style={styles.secondBox}>
                    <Ionicons name="swap-horizontal-outline" size={24} color="white" style={styles.icon} />
                    <Text fontSize="lg" color="white" fontWeight={600}>Costos Abonos y Retiros</Text>
                  </Box>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("Volumen Mercado")}
                >
                  <Box style={styles.thirdBox}>
                    <Ionicons name="bar-chart-outline" size={24} color="white" style={styles.icon} />
                    <Text fontSize="lg" color="white" fontWeight={600}>Volumen Mercado</Text>
                  </Box>
                </Pressable>
              </ScrollView>
            </Box>
          </Box>
        </VStack>
      </ScrollView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e5e5e5"
  },
  containerListaIndicadores: {
    alignSelf: "center",
    width: '100%',
    backgroundColor: "#3d3f58",
  },
  indicatorBox: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: 10,
    backgroundColor: "#0369a1",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topBox: {
    position: 'absolute',
    alignSelf: "center",
    width: '100%',
    height: '70%',
    borderBottomEndRadius: 300,
    borderBottomLeftRadius: 300,
    backgroundColor: "#4d4dfe",
  },
  containerIndBox: {
    alignSelf: "center",
    width: '100%',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: "#3d3f58",
  },
  containerBudaBox: {
    alignSelf: "center",
    width: '100%',
    marginBottom: 100, 
    borderRadius: 20,
    backgroundColor: "#e5e5e5",
  },
  firstBox: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 20,
    marginLeft: 40,
    marginBottom: 30, 
    backgroundColor: "#0369a1",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondBox: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30, 
    backgroundColor: "#0369a1",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thirdBox: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 20,
    marginRight: 10,
    backgroundColor: "#0369a1",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fourthBox: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 20,
    marginRight: 40,
    backgroundColor: "#0369a1",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pressable: {
    width: 300,
    height: 250,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  pressableSmaller: {
    width: 300,
    height: 220,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tituloHome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25
  },
  buttonContainer: {
    marginLeft: 5,
    padding: 10,
    color: 'transparent',
    },
  icon: {
    marginBottom: 5,
  }
});