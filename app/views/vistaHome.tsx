import React, { useState } from "react";
import { VStack, Center, Box } from "native-base";
import {View, Image, StyleSheet, Button, Pressable} from 'react-native';
import { ScrollView } from "react-native";

export default function VistaHome({ navigation }: any) {

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack alignItems="center" paddingBottom={30} style={{ flex: 1 }}>
          <View style={styles.centeredView}>
            <Pressable
              onPress={() => navigation.navigate("HomeBuda")}
              style={styles.pressable}
            >
              <Image
                source={require('../../assets/images/budaLogo.jpg')}
                style={styles.image}
              />
            </Pressable>
          </View>
          <View style={styles.centeredView}>
            <Pressable
              onPress={() => navigation.navigate("Abonos y Retiros")}
              style={styles.pressableSmaller}
            >
              <Image
                source={require('../../assets/images/indicadoresEco.png')}
                style={styles.image}
              />
            </Pressable>
          </View>
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 10,
  },
});