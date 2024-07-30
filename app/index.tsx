import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useColorScheme, StyleSheet, LogBox } from 'react-native';
import { Colors } from '@/constants/Colors';
import { HeaderBackButton } from '@react-navigation/elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Vistas
import VistaHome from '@/app/views/VistaHome';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import VistaVolumenDeMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaPerfil from '@/app/views/VistaPerfil/Perfil';
import Login from '@/app/views/VistasAuth/Login';
import Registro from '@/app/views/VistasAuth/Registro';
import Contacto from './views/Contacto';

import { authFirebase, analyticsFirebase } from '@/database/firebase';
import VistaIndicadores from './views/VistasIndicadoresApi/VistaIndicadores';
import VistaTipoIndicador from './views/VistasIndicadoresApi/VistaTipoIndicador';
import VistaFechaTipoIndicador from './views/VistasIndicadoresApi/VistaFechaTipoIndicador';
import VistaAnioTipoIndicador from './views/VistasIndicadoresApi/VistaAñoTipoIndicador';
import RestablecerPassword from './views/VistasAuth/RestablecerPassword';

const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const PerfilStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ContactStack = createStackNavigator();

const auth = authFirebase;
const analytics = analyticsFirebase;


const HomeStackScreen = () => (
    <HomeStack.Navigator
        screenOptions={() => ({
            headerStyle: {
                backgroundColor: '#0e7490',
                height: 140,
                borderWidth: 0,
                elevation: 0,
                shadowOpacity: 0,

            },
            headerTintColor: '#fff', // Color del texto del encabezado
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 22,
            },
            headerTitleAlign: 'center',
        })}
    >
        <HomeStack.Screen name="Home" component={VistaHome} />
        <HomeStack.Screen name="Estado Mercado" component={VistaEstadoMercado} />
        <HomeStack.Screen name="Abonos y Retiros" component={VistaAbonoRetiro} />
        <HomeStack.Screen name="Volumen Mercado" component={VistaVolumenDeMercado} />
        <HomeStack.Screen name="Indicadores" component={VistaIndicadores} />
        <HomeStack.Screen name="Tipo Indicador" component={VistaTipoIndicador} />
        <HomeStack.Screen name="Fecha Tipo Indicador" component={VistaFechaTipoIndicador} />
        <HomeStack.Screen name="Año Tipo Indicador" component={VistaAnioTipoIndicador} />
        <HomeStack.Screen name="Contacto" component={Contacto} />
        <HomeStack.Screen name="Restablecer" component={RestablecerPassword} />
    </HomeStack.Navigator>
);

const ContactStackScreen = () => (
    <ContactStack.Navigator
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
            headerTitleAlign: 'center',
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
        <ContactStack.Screen name="Contacto" component={Contacto}/>
    </ContactStack.Navigator>
);

const PerfilStackScreen = () => (
    <PerfilStack.Navigator
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
            headerTitleAlign: 'center',
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
    <PerfilStack.Screen 
        name="Perfil" 
        component={VistaPerfil}
        options={{
            title: 'Mi Perfil',
        }}
    />
    </PerfilStack.Navigator>
);

const TabNavigator = ({navigation}: any) => {
    const colorScheme = useColorScheme();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
        });

        return unsubscribe;
    }, [navigation]);
    
    return (
    <Tab.Navigator
        screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarStyle: {
                height: 90,
                width: '100%',
                position: 'absolute',
                backgroundColor: '#000e21',
        },
    }}
    >
        <Tab.Screen 
            name="HomeTab" 
            component={HomeStackScreen} 
            options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name={focused ? 'home' : 'home-outline'} color='#dbeafe' />
            ),
            }} 
        />
        <Tab.Screen 
            name="ContactoTab" 
            component={ContactStackScreen}
            options={{
            tabBarShowLabel: false,
            tabBarIcon: ({ color, focused }) => (
                <TabBarIcon 
                    name={focused ? 'paper-plane' : 'paper-plane-outline'} 
                    color='#dbeafe'
                />
            ),
            }} 
        />
        
        <Tab.Screen 
            name="PerfilTab" 
            component={PerfilStackScreen}
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

    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

    useEffect(() => {
        const unsubscribe = authFirebase.onAuthStateChanged((user) => {
            console.log('user ', user); // Verifica si el usuario está siendo detectado aquí
            setUser(user);
        });
    
        // Limpia el suscriptor cuando el componente se desmonta
        return unsubscribe;
    }, []);

    useEffect(() => {
        LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.']);
    }, []);

    return (
    <NativeBaseProvider>
        <Stack.Navigator initialRouteName='Login'>
            {user ? (
                <Stack.Screen name='Home' component={TabNavigator} options={{ headerShown: false }}/>
            ) : (
                <><Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
                <Stack.Screen name="Restablecer" component={RestablecerPassword} options={{ headerShown: false }} /></>
                
            )}
        </Stack.Navigator>
        
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


