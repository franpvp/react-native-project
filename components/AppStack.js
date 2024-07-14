// Views
import VistaHome from '@/app/views/VistaHome';
import VistaEstadoMercado from '@/app/views/VistasBudaApi/VistaEstadoMercado';
import VistaAbonoRetiro from '@/app/views/VistasBudaApi/VistaAbonoRetiro';
import VistaVolumenMercado from '@/app/views/VistasBudaApi/VistaVolumenMercado';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const AboutStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
            headerStyle: {
            backgroundColor: "6a51ae"
            },
                headerTintColor: "fff",
                headerTitleStyle: { fontWeight: "bold"},
            }
        }>
            <Stack.Screen 
                name='Home'
                component={VistaHome}
                options={{
                    title: "Estoy en el home",
                }}
            />
            <Stack.Screen 
                name='AbonosRetiros'
                component={VistaAbonoRetiro}
                options={{
                    title: "Abonos y Retiros"
                }}
            />
        </Stack.Navigator>
    );
}

export default function App(){
    return (
        <AboutStack />
    );
}