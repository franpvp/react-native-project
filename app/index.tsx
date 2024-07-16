import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NativeBaseProvider, extendTheme } from 'native-base';

import { TabNavigator } from '@/components/navigation/TabNavigator';


export default function App() {
    return (
    <NativeBaseProvider>
        <TabNavigator />
    </NativeBaseProvider>
    );
}


