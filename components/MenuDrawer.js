// MenuDrawer.js
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaVolumenMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';
import TabNavigator from '@/components/navigation/TabNavigator';

const Drawer = createDrawerNavigator();

export default function MenuDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: styles.drawer,
        drawerActiveTintColor: '#e91e63',
        drawerInactiveTintColor: '#000',
      }}
    >
      <Drawer.Screen name="Home" component={TabNavigator} />
      <Drawer.Screen name="Estado Mercado" component={VistaEstadoMercado} />
      <Drawer.Screen name="Volumen Mercado" component={VistaVolumenMercado} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: '#f0f0f0',
    width: '100%'
  },
});