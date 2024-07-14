import React, { useEffect, useState } from 'react';
import { Container, HStack, NativeBaseProvider } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

// Views
import VistaHome from '@/app/views/VistaHome';
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import VistaVolumenMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AboutStack from "@/components/AppStack";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { NavigationContainer } from '@react-navigation/native';
import MenuDrawer from '@/components/MenuDrawer';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    
  <NativeBaseProvider>
    <MenuDrawer />
  </NativeBaseProvider>

  );
}

const styles = StyleSheet.create({
  drawer: {
      backgroundColor: '#f0f0f0',
      width: '100%'
  },
});

