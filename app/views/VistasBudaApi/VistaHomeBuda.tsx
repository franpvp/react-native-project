import React, { useState } from "react";
import { VStack, Center } from "native-base";
import {View, Image, StyleSheet, Button, Pressable} from 'react-native';
import { ScrollView } from "react-native";

export default function VistaHomeBuda({ navigation }: any) {
    return (
    <ScrollView>
        <VStack alignItems="center" paddingBottom={10}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Pressable
                    // Redirigir a vista Estado Mercado
                    onPress={() => navigation.navigate("Estado Mercado")}
                    style={styles.pressable}
                >
                    <Image
                        source={require('../../../assets/images/MarketDataImg.png')}
                        style={styles.image}
                    />
                </Pressable>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Pressable 
                    // Redirigir a vista Abonos y Retiros
                    onPress={() => navigation.navigate("Abonos y Retiros")}
                    style={styles.pressable}
                >
                    <Image 
                        source={require('../../../assets/images/AbonosRetiros.webp')}
                        style={styles.image}
                    />
                </Pressable>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Pressable 
                    // Redirigir a vista Abonos y Retiros
                    onPress={() => navigation.navigate("Volumen Mercado")}
                    style={{ width: 300, height: 220 }}
                >
                    <Image 
                        source={require('../../../assets/images/VolumenMercado.png')}
                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                    />
                </Pressable>
            </View>
        </VStack>
    </ScrollView>
);
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
    },
    pressable: {
        width: 300,
        height: 250,
        borderColor: '#D9D9D9',
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});
