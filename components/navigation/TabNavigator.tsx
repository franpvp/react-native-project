import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme, StyleSheet } from 'react-native';

// Vistas
import VistaHome from '@/app/views/VistaHome';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import VistaVolumenDeMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';
import VistaHomeBuda from '@/app/views/VistasBudaApi/VistaHomeBuda';
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaPerfil from '@/app/views/VistaPerfil/Perfil';
import Login from '@/app/views/VistasAuth/Login';
import Registro from '@/app/views/VistasAuth/Registro';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeStack = createStackNavigator();
const HomeBudaStack = createStackNavigator();
const MenuStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Home" component={VistaHome} />
    <HomeStack.Screen name="HomeBuda" component={VistaHomeBuda} />
  </HomeStack.Navigator>
);

const HomeBudaStackScreen = () => (
  <HomeBudaStack.Navigator>
    <HomeBudaStack.Screen name="Estado Mercado" component={VistaEstadoMercado} />
    <HomeBudaStack.Screen name="Abonos y Retiros" component={VistaAbonoRetiro} />
    <HomeBudaStack.Screen name="Volumen Mercado" component={VistaVolumenDeMercado} />
  </HomeBudaStack.Navigator>
);

const MenuStackScreen = () => (
  <MenuStack.Navigator
    screenOptions={({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#0e7490',
        height: 80,
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,

      },
      headerTintColor: '#fff', // Color del texto del encabezado
      headerTitleStyle: {
        fontWeight: 'bold', // Estilo del título del encabezado
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <HeaderBackButton 
            tintColor="#fff" // Color del botón de retroceso
            style={styles.buttonContainer} 
          />
        </TouchableOpacity>
      ),
    })}
  >
    <MenuStack.Screen 
      name="Perfil" 
      component={VistaPerfil}
      options={{
        title: 'Mi Perfil'
      }}
    />
  </MenuStack.Navigator>
);

const TabNavigator = () => {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
      initialRouteName="Login"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          borderWidth: 1,
          borderColor: '#D9D9D9',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackScreen} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="HomeBuda" 
        component={HomeBudaStackScreen} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings'} color={color} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={MenuStackScreen} 
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'menu' : 'menu'} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginLeft: 5, // Ajusta el margen izquierdo según sea necesario
    padding: 10,
    color: 'transparent',// Ajusta el padding según sea necesario
  },
});