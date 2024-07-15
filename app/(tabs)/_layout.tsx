import React from 'react';
import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import VistaHome from '../views/VistaHome';
import VistaVistaAbonoRetiro from '../views/VistasBudaApi/VistaAbonoRetiro';
import VistaVolumenDeMercado from '../views/VistasBudaApi/VistaVolumenMercado';
import { NativeBaseProvider } from 'native-base';


const Tab = createBottomTabNavigator();
function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeBaseProvider>
      <Tab.Navigator
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
        name="VistaHome"
        component={VistaHome}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="VistaAbonoRetiro"
        component={VistaVistaAbonoRetiro}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="VistaVolumenMercado"
        component={VistaVolumenDeMercado}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home'} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    </NativeBaseProvider>
    
  );
}