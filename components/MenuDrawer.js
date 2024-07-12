import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Views
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import VistaVolumenMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';

// Componentes
import CustomDrawerContent from '@/components/CustomDrawerContent';
import VistaHome from '@/app/(tabs)/vistaHome';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MenuDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerStyle: styles.drawer,
                drawerActiveTintColor: '#e91e63',
                drawerInactiveTintColor: '#000',
            }}
        >
            {/* Vista Principal de app */}
            <Drawer.Screen name="Vista Home Apis" component={VistaHome} />
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

export default MenuDrawer;