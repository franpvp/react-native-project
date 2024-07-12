import React from "react";
import { VStack, Center, Image } from "native-base";
import { ScrollView } from "react-native";

const VistaHome = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack alignItems="center" paddingBottom={10}>
          <Center mt={5} w="90%" h="40" bg="indigo.300" rounded="md" shadow={3}>
            <Image source={{ uri: '' }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
          </Center>
          <Center mt={5} w="90%" h="40" bg="indigo.300" rounded="md" shadow={3}>
            <Image source={{ uri: '' }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
          </Center>
          <Center mt={5} w="90%" h="40" bg="indigo.300" rounded="md" shadow={3} mb={10}>
            <Image source={{ uri: '' }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
          </Center>
        </VStack>
      </ScrollView>
    );
  };

export default VistaHome;