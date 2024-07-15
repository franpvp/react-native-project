// TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VistaHome from '@/app/views/VistaHome';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';

import VistaVolumenDeMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const colorScheme = useColorScheme();
  return (
    <Tab.Navigator
    initialRouteName='Home'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          height: 50,
          position: 'absolute',
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#D9D9D9'
        }
      }}
    >
      <Tab.Screen 
        name="Home"
        component={VistaHome}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Abono y Retiro"
        component={VistaAbonoRetiro}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings'} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Volumen Mercado"
        component={VistaVolumenDeMercado}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings'} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App(){
  return (
      <TabNavigator />
  );
}