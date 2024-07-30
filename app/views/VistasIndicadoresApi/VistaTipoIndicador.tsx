import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Dimensions, Image, TextInput, Alert, ScrollView, ActivityIndicator, View, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Button, Center, Input } from "native-base";
// import crashlytics from '@react-native-firebase/crashlytics';

// Dependencia Firestore
import { db, analyticsFirebase } from '@/database/firebase';
import TableModal from '@/components/Modals/ModalTipoIndicador';


export default function VistaTipoIndicador() {

    const analytics = analyticsFirebase;

    const [tipoIndicador, setTipoIndicador] = useState('');
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchDataFromApi = async (tipoIndicador: string) => {
    try {
        const response = await fetch(`http://10.200.82.184:8080/api/consultar-tipo/${tipoIndicador}`);
        if (!response.ok) {
            throw new Error('No hay respuesta de API');
        }
        const data = await response.json();
        
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
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
            <View>
                <ScrollView showsHorizontalScrollIndicator={false}>
                    <Text>Gráfica de Unidad de Fomento (UF)</Text>
                    <LineChart
                        data={{
                            labels: labels,
                            datasets: [
                                {
                                    data: values
                                }
                            ]
                        }}
                        width={Dimensions.get('window').width - 70}
                        height={450}
                        yAxisLabel="$"
                        yAxisSuffix=""
                        yAxisInterval={1}
                        chartConfig={{
                            backgroundColor: "#000e21",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
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
                            borderRadius: 16
                        }}
                    />
                </ScrollView>
                
            </View>
        );
    };

    return (
    <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Ionicons size={250} name="code-slash" style={styles.headerImage} />}>
            <ScrollView showsHorizontalScrollIndicator={false}>
                
            </ScrollView>
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
