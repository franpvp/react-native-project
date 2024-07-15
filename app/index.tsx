import React, { useEffect, useState } from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { MenuDrawer } from '@/components/MenuDrawer';
import { NativeBaseProvider, extendTheme } from 'native-base';
// import MenuDrawer from '@/components/MenuDrawer';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Views
import VistaHome from '@/app/views/VistaHome';
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import VistaVolumenMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';
import VistaHomeBuda from './views/VistasBudaApi/VistaHomeBuda';

const Stack = createNativeStackNavigator();

export const AboutStack = () => {
  return (
      <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
          headerStyle: {
          backgroundColor: "6a51ae"
          },
              headerTintColor: "fff",
              headerTitleStyle: { fontWeight: "bold"},
          }
      }>
          <Stack.Screen 
              name='Home'
              component={VistaHome}
              options={{
                  title: "Home"
              }}
          />
          <Stack.Screen 
              name='HomeBuda'
              component={VistaHomeBuda}
              options={{
                  title: "Home Buda"
              }}
          />
          <Stack.Screen 
              name='Estado Mercado'
              component={VistaEstadoMercado}
              options={{
                  title: "Estado Mercado",
              }}
          />
          <Stack.Screen 
              name='Abonos y Retiros'
              component={VistaAbonoRetiro}
              options={{
                  title: "Abonos y Retiros"
              }}
          />
          <Stack.Screen 
              name='Volumen Mercado'
              component={VistaVolumenMercado}
              options={{
                  title: "Volumen Mercado"
              }}
          />
      </Stack.Navigator>
      
  );
}

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

