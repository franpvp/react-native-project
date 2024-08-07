import React, { useEffect, useState } from "react";
import { Center, Text } from "native-base";
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Pressable } from 'react-native';
import { authFirebase } from "@/database/firebase";
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { analyticsFirebase } from "@/database/firebase";

const Login = ( {navigation}: any ) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = authFirebase;
    const analytics = analyticsFirebase;

    useEffect(() => {
        const logScreenView = async () => {
            await analytics.logScreenView({
                screen_name: 'Login',
                screen_class: 'Login'
            });
        };
        
        logScreenView();
    }, []);

    const logearse = async () => {
        setLoading(true);
        try {
            const response =  await auth.signInWithEmailAndPassword(email, password);
            console.log(response);

            // Registrar el evento de inicio de sesión exitoso en Firebase Analytics
            analytics.logEvent('inicio_sesion_exitoso', {
                screen_view: 'Login', // Vista donde ocurrió el evento
                method: 'email', // Método de inicio de sesión
                mensaje: 'Inicio de sesión correcto' 
            });
            console.log("Inicio de sesión correcto");

        } catch (error: any) {
            console.log(error);
            alert("Inicio de sesión fallido: " + error.message);

            await analytics.logEvent('inicio_sesion_fallido', {
                screen: 'Login', // Vista donde ocurrió el evento
                method: 'email', // Método de inicio de sesión
                error: error.message, // Mensaje de error
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <Text style={styles.titleLogin} paddingTop={10} paddingBottom={10}>Iniciar Sesión</Text>
                </View>
                <View>
                    <Text style={styles.label}>Email</Text>
                    <Center>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            autoCapitalize='none'
                            style={styles.input}
                        ></TextInput>
                    </Center>
                </View>
                <View>
                    <Text style={styles.label}>Contraseña</Text>
                    <Center>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Contraseña"
                            secureTextEntry={true}
                            style={styles.input}
                        ></TextInput>
                        
                    </Center>
                    <Pressable
                        onPress={() => navigation.navigate("Restablecer")}
                    >
                            <Text style={styles.restText} marginBottom={5}>Restablecer contraseña</Text>
                    </Pressable>
                </View>
                <Center>
                    { loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <>
                            <TouchableOpacity onPress={logearse} style={[styles.button, styles.loginButton]}>
                                <Text style={styles.loginText} >Login</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity onPress={() => navigation.navigate("Registro")} style={[styles.button, styles.registroButton]}>
                        <Text style={styles.registroText}>Registro</Text>
                    </TouchableOpacity>
                </Center>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center'
        
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 45,
        color: 'white',
        fontWeight: '500'
    },
    titleLogin: {
        fontSize: 30,
        color: 'white',
        fontWeight: '700'
    },
    input: {
        height: 45,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 12,
        fontSize: 16,
        color: 'black',
        width: '80%',
        borderWidth: 1
    },
    button: {
        justifyContent: 'center',
        marginTop: 10,
        padding: 10,
        borderRadius: 20,
        width: '80%',
    },
    loginButton: {
        backgroundColor: '#0e7490',
        alignItems: 'center',
        width: '80%'
    },
    registroButton: {
        marginTop: 18,
        backgroundColor: '#0369a1',
        alignItems: 'center',
        width: '80%'
    },
    loginText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 17,
    },
    registroText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 17,
    },
    restText: {
        color: '#e0f2fe',
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
});

export default Login;