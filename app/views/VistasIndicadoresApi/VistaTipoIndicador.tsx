import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Dimensions, Image, TextInput, Alert, ScrollView, ActivityIndicator, View, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Button, Center, Input } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';

// Dependencia Firestore
import { db, analyticsFirebase, crashlyticsFirebase } from '@/database/firebase';
import TableModal from '@/components/Modals/ModalTipoIndicador';


export default function VistaTipoIndicador() {

    const analytics = analyticsFirebase;
    const crashlytics = crashlyticsFirebase;

    const [tipoIndicador, setTipoIndicador] = useState('');
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const nombreVistaActual = "VistaTipoIndicador";

    const fetchDataFromApi = async (tipoIndicador: string) => {
        analytics.logEvent('screen_view', {
            firebase_screen: nombreVistaActual,
            mensaje: "Se hace click en botón Consultar"
        })
        crashlytics.log("Obteniendo data Vista Tipo Indicador")
        try {
            const response = await fetch(`http://192.168.1.83:8080/api/consultar-tipo/${tipoIndicador}`);
            if (!response.ok) {
                throw new Error('No hay respuesta de API');
            }
            const data = await response.json();
            
            console.log(data)
            return data;
        } catch (error: any) {
            console.error(error);
            // Crashlytics
            crashlytics.recordError(error);
            Alert.alert('Error', 'Error al consultar API');
        }
    }

    const handleApiAndFirestore = async () => {
        setLoading(true);
        // Se espera la respuesta de data al ingresar la currency
        const data = await fetchDataFromApi(tipoIndicador);
        if (data) {
            // Almacenamos la data en setApiData
            setApiData(data);
            setModalVisible(true);
        }
        setLoading(false);
    };

    const ChartComponent = ({ data }: any) => {
        const chartData = data.serie.map((item: { fecha: string | number | Date; valor: any; }) => ({
            date: new Date(item.fecha),
            value: item.valor
        }));

        chartData.sort((a: { date: number; }, b: { date: number; }) => a.date - b.date);

        const values = chartData.map((item: { value: any; }) => item.value);
        const labels = chartData.map((item: { date: { toLocaleDateString: () => any; }; }) => item.date.toLocaleDateString());

        return (
            <View style={styles.container}>
                <Text style={styles.title}>{data.nombre}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ width: Math.max(values.length * 70, Dimensions.get('window').width) }}>
                        <LineChart
                            data={{
                            labels: labels,
                            datasets: [
                                {
                                data: values
                                }
                            ]
                            }}
                            width={Math.max(values.length * 70, Dimensions.get('window').width)}
                            height={350}
                            yAxisLabel="$"
                            yAxisSuffix=""
                            yAxisInterval={1}
                            chartConfig={{
                                backgroundColor: "#292524",
                                backgroundGradientFrom: "#292524",
                                backgroundGradientTo: "#292524",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726"
                            }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 10
                            }}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    };

    return (
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#3d3f58', dark: '#353636' }}
        headerImage={
            <View style={styles.imageContainer}>
                <Icon name="bitcoin" size={150} color="white" style={styles.icon} />
                <Icon name="usd" size={150} color="white" style={styles.icon} />
            </View>
        }>
        <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Consultar Tipo Indicador</ThemedText>
        </ThemedView>
        <ThemedText>Entrega los valores del último mes del indicador consultado.</ThemedText>
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
        <Center>
            <Button 
                size="lg" 
                variant="solid" 
                w="80%" 
                borderRadius={40}
                marginTop={5}
                onPress={handleApiAndFirestore}>
                Consultar
            </Button>
        </Center>
        <ScrollView style={{marginBottom: 100}}>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {apiData && (
                <>
                <TableModal isOpen={modalVisible} onClose={() => setModalVisible(false)} data={apiData} />
                <ChartComponent data={apiData}/>
                </>
            )}
        </ScrollView>
    </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: 'white',
        bottom: -30,
        left: -10,
        position: 'absolute',
    },
    container: {
        padding: 16,
        backgroundColor: '#292524',
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
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
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reactLogo: {
        width: 200,
        height: 200,
        marginHorizontal: 10,
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
    icon: {
        marginTop: 30,
        marginHorizontal: 25,
    },
    
});
