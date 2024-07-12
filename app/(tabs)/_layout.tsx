// app/TabLayout.js
import { Tabs, useNavigation } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();


  return (
    <Tabs
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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vistaHome"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'apps' : 'apps-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}