// MenuDrawer.js
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaVolumenMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';
import TabNavigator from '@/components/navigation/TabNavigator';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import VistaHome from '@/app/views/VistaHome';
import VistaHomeBuda from '@/app/views/VistasBudaApi/VistaHomeBuda';

const Drawer = createDrawerNavigator();

export function MenuDrawer() {
return (
    <Drawer.Navigator
        // drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            drawerStyle: styles.drawer,
            drawerActiveTintColor: '#e91e63',
            drawerInactiveTintColor: '#000',
        }}
    >
        <Drawer.Screen name="Home" component={VistaHome} />
        <Drawer.Screen name="Buda API" component={VistaHomeBuda} />
        <Drawer.Screen name="Estado Mercado" component={VistaEstadoMercado} />
        <Drawer.Screen name="Abonos y Retiros" component={VistaAbonoRetiro} />
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