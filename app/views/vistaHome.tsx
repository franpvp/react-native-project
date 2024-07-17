import React, { useState } from "react";
import { VStack, Center } from "native-base";
import {View, Image, StyleSheet, Button, Pressable} from 'react-native';
import { ScrollView } from "react-native";

export default function VistaHome({ navigation }: any) {

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack alignItems="center" paddingBottom={20}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Pressable
          // Redirigir al Home
            onPress={() => navigation.navigate("HomeBuda")}
            style={{
              width: 300,
              height: 250,
              borderWidth: 1, // Añadir borde
              borderColor: '#D9D9D9', // Color del borde
              borderRadius: 10, // Borde redondeado
              overflow: 'hidden', // Para asegurar que el borde se muestre correctamente
            }}
          >
            <Image
              source={require('../../assets/images/budaLogo.jpg')}
              style={{ width: '100%', height: '100%', borderRadius: 10 }}
            />
          </Pressable>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Pressable 
            // Redirigir a vista Abonos y Retiros
            onPress={() => navigation.navigate("Abonos y Retiros")}
            style={{ width: 300, height: 220 }}
          >
            <Image 
              source={require('../../assets/images/indicadoresEco.png')}
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
