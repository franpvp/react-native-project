import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { HeaderBackButton } from '@react-navigation/elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { User, onAuthStateChanged } from 'firebase/auth';


// Vistas
import VistaHome from '@/app/views/VistaHome';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import VistaVolumenDeMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';
import VistaHomeBuda from '@/app/views/VistasBudaApi/VistaHomeBuda';
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaPerfil from '@/app/views/VistaPerfil/Perfil';
import Login from '@/app/views/VistasAuth/Login';
import Registro from '@/app/views/VistasAuth/Registro';
import { authFirebase } from '@/database/firebase';

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const HomeBudaStack = createStackNavigator();
const MenuStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator
        screenOptions={({ navigation }) => ({
            headerStyle: {
                backgroundColor: '#0e7490',
                height: 140,
                borderWidth: 0,
                elevation: 0,
                shadowOpacity: 0,

            },
            headerTintColor: '#fff', // Color del texto del encabezado
            headerTitleStyle: {
                fontWeight: 'bold', // Estilo del título del encabezado
            },
            })}
    >
        <HomeStack.Screen name="Home" component={VistaHome} />
        <HomeStack.Screen name="HomeBuda" component={VistaHomeBuda} />
    </HomeStack.Navigator>
);

const HomeBudaStackScreen = () => (
    <HomeBudaStack.Navigator 
        screenOptions={({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#0e7490',
            height: 140,
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
        <HomeBudaStack.Screen 
            name="Estado Mercado" 
            component={VistaEstadoMercado}
            options={{
                title: 'Estado Mercado',
            }}
        />
        <HomeBudaStack.Screen 
            name="Abonos y Retiros" 
            component={VistaAbonoRetiro}
            options={{
                title: 'Abonos y Retiros',
            }}
        />
        <HomeBudaStack.Screen 
            name="Volumen Mercado" 
            component={VistaVolumenDeMercado} 
            options={{
                title: 'Volumen Mercado',
            }}
        />
    </HomeBudaStack.Navigator>
);

const MenuStackScreen = () => (
    <MenuStack.Navigator
        screenOptions={({ navigation }) => ({
        headerStyle: {
            backgroundColor: '#0e7490',
            height: 140,
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
            title: 'Mi Perfil',
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
            height: 99,
            width: '100%',
            position: 'absolute',
            borderColor: '#D9D9D9',
            backgroundColor: '#000e21',
            paddingTop: 20
        },
    }}
    >
        <Tab.Screen 
            name="Home" 
            component={HomeStackScreen} 
            options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color='#dbeafe' />
            ),
            }} 
        />
        <Tab.Screen 
            name="HomeBuda" 
            component={HomeBudaStackScreen} 
            options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'search' : 'search-outline'} color='#dbeafe' />
            ),
            }} 
        />
        <Tab.Screen 
            name="Perfil" 
            component={MenuStackScreen}
            options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'person-circle' : 'person-circle-outline'} color='#dbeafe' />
            ),
            }} 
        />
    </Tab.Navigator>
    );
};



export default function App() {

    const auth = authFirebase;
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log('user ', user);
            setUser(user);
        });
    }, []);

    return (
    <NativeBaseProvider>
        {user ? (
        <TabNavigator />
    ) : (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )}
    </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
    marginLeft: 5,
    padding: 10,
    color: 'transparent',
    },
});


