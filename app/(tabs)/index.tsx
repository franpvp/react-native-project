import React, { useEffect, useState } from 'react';
import { Container, HStack, NativeBaseProvider } from 'native-base';
import 'react-native-gesture-handler';
// Drawer
import MenuDrawer from '@/components/MenuDrawer';

export default function HomeScreen() {

  return (<NativeBaseProvider>
      <MenuDrawer />
  </NativeBaseProvider>

  );
}

