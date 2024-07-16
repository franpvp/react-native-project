import React, { useState } from "react";
import { VStack, Center, Avatar, Text, Box } from "native-base";
import {View, Image, StyleSheet, Button, Pressable, ScrollView} from 'react-native';
import { Link } from "expo-router";

export default function VistaSideMeny({ navigation }: any) {

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box
          bg="primary.700"
          padding={10}
          alignSelf="center"
          w= '100%'
          height='40%'
        >
          <Avatar
            bg="purple.600"
            alignSelf="center"
            size="2xl"
            source={{
              uri: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
            }}
          >
          </Avatar>
          <Center>
            <Text>Francisca Valdivia</Text>
          </Center>
          <Box
            bg="muted.500"
            padding={5}
            borderRadius={100} // Redondear el Box
            alignSelf="center"
            marginTop={5}
          >
            Texto
          </Box>
        </Box>
        
        
      </ScrollView>
    );
  };