import React, { useState } from "react";
import { VStack, Center } from "native-base";
import {View, Image, StyleSheet, Button, Pressable} from 'react-native';
import { ScrollView } from "react-native";

export default function VistaHomeBuda({ navigation }: any) {

    return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <VStack alignItems="center" paddingBottom={10}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Pressable
                    // Redirigir a vista Estado Mercado
                    onPress={() => navigation.navigate("Estado Mercado")}
                    style={{
                        width: 300,
                        height: 200,
                        borderWidth: 1, // Añadir borde
                        borderColor: '#D9D9D9', // Color del borde
                        borderRadius: 10, // Borde redondeado
                        overflow: 'hidden', // Para asegurar que el borde se muestre correctamente
                    }}
                >
                    <Image
                        source={require('../../../assets/images/MarketDataImg.png')}
                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                    />
                </Pressable>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <Pressable 
                    // Redirigir a vista Abonos y Retiros
                    onPress={() => navigation.navigate("Abonos y Retiros")}
                    style={{
                        width: 300,
                        height: 200,
                        borderWidth: 1, // Añadir borde
                        borderColor: '#D9D9D9', // Color del borde
                        borderRadius: 10, // Borde redondeado
                        overflow: 'hidden', // Para asegurar que el borde se muestre correctamente
                    }}
                >
                    <Image 
                        source={require('../../../assets/images/AbonosRetiros.webp')}
                        style={{
                            width: 300,
                            height: 200,
                            borderWidth: 2, // Añadir borde
                            borderColor: '#D9D9D9', // Color del borde
                            borderRadius: 10, // Borde redondeado
                            overflow: 'hidden', // Para asegurar que el borde se muestre correctamente
                        }}
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
});
