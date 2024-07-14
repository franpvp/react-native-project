import React, { useState } from "react";
import { VStack, Center, Pressable } from "native-base";
import {View, Image, StyleSheet} from 'react-native';
import { ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';


const VistaHome = () => {
  const [hover, setHover] = useState(false);
  const navigation = useNavigation();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack alignItems="center" paddingBottom={10}>
        <Center mt={5} w="90%" h="40" bg="indigo.300" rounded="md" shadow={3}>
          <Pressable
            onPressIn={() => setHover(true)}
            onPressOut={() => setHover(false)}
          >
          </Pressable>
          <Image
            source={require('../../assets/images/budaLogo.jpg')}
            style={{ width: '100%', height: '100%', borderRadius: hover ? 20 : 10 }}
          />
        </Center>
        <Center mt={5} w="90%" h="40" bg="indigo.300" rounded="md" shadow={3}>
          <Image 
            source={require('../../assets/images/indicadoresEco.png')}
            style={{ width: '100%', height: '100%', borderRadius: hover ? 20 : 10 }} />
        </Center>
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  stretch: {
    width: 50,
    height: 200,
    resizeMode: 'stretch',
  },
});


export default VistaHome;