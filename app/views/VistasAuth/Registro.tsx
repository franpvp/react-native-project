import React, { useEffect, useState } from "react";
import { VStack, Center, Text } from "native-base";
import {View, Image, StyleSheet, Button, Pressable, TextInput, TouchableOpacity, Alert} from 'react-native';
import { ScrollView } from "react-native";
import { ActivityIndicator, useTheme } from 'react-native-paper';
import * as Crypto from 'expo-crypto';
import { authFirebase } from "@/database/firebase";
import { analyticsFirebase } from "@/database/firebase";
import { db } from "@/database/firebase";

const Registro = () => {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [repPassword, setRepPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = authFirebase;
    const analytics = analyticsFirebase;
    
    useEffect(() => {
        const logScreenView = async () => {
            await analytics.logScreenView({
                screen_name: 'Registro',
                screen_class: 'Registro'
            });
        };
        
        logScreenView();
    }, []);

    const validateEmail = (email: string ) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(String(email).toLowerCase());
    };

    const registrarse = async () => {
        await analytics.logEvent('intento_de_registro');

        if (!nombre || !email || !telefono || !password || !repPassword) {
            Alert.alert('Advertencia', 'Todos los campos son requeridos');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Ingrese un correo válido');
            return;
        }
        if (telefono.length !== 9) {
            Alert.alert('Error', 'El teléfono debe tener exactamente 9 dígitos');
            return;
        }
        if (password !== repPassword) {
            await analytics.logEvent('registro_contraseñas_no_coinciden')
            Alert.alert("Advertencia", "Las contraseñas no coinciden");
            return;
        }
        setLoading(true);

        try {
            const response = auth.createUserWithEmailAndPassword(email, password);
            const user = (await response).user;
            // Actualiza el perfil del usuario
            await user.updateProfile({
                displayName: nombre,
                photoURL: null
            });

            const encryptedPassword = await encryptPassword(password);

            // Guardar el número de teléfono en la base de datos Firestore
            await db.collection('usuarios').doc(user.uid).set({
                displayName: nombre,
                email: email,
                password: encryptedPassword,
                phoneNumber: telefono,
                photoURL: null
            });

            // Registra un evento si el registro es exitoso
            await analytics.logEvent('registration_success', {
                userId: user.uid,
                userEmail: email,
            });

            alert("Registro exitoso, revisa tu correo!");
        } catch (error: any) {
            // Registra un evento si hay un error durante el registro
            await analytics.logEvent('registration_error', {
                errorMessage: error.message,
            });
            console.log(error);
            alert("Registro fallido: " + error.message);
        } finally {
            setLoading(false);
        }
    }
    // Encriptar contraseña
    const encryptPassword = async (password: string) => {
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            password
        );
        return digest;
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>
                    <Text style={styles.titleLogin} paddingTop={10} paddingBottom={10}>Registro</Text>
                </View>
                <View>
                    <Text style={styles.label}>Nombre</Text>
                    <Center>
                        <TextInput
                            value={nombre}
                            onChangeText={setNombre}
                            placeholder="Ingrese su nombre"
                            autoCapitalize='none'
                            style={styles.input}
                        ></TextInput>
                    </Center>
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
                    <Text style={styles.label}>Telefono</Text>
                    <Center>
                        <TextInput
                            value={telefono}
                            onChangeText={setTelefono}
                            placeholder="Telefono"
                            keyboardType="phone-pad"
                            maxLength={9}
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
                </View>
                <View>
                    <Text style={styles.label}>Reingrese Contraseña</Text>
                    <Center>
                        <TextInput
                            value={repPassword}
                            onChangeText={setRepPassword}
                            placeholder="Reingrese Contraseña"
                            secureTextEntry={true}
                            style={styles.input}
                        ></TextInput>
                    </Center>
                </View>
                {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <TouchableOpacity onPress={registrarse} style={styles.registroButton}>
                        <Text style={styles.registroText}>Registrarse</Text>
                    </TouchableOpacity>
                )}
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
    loginButton: {
        backgroundColor: '#0e7490',
        alignItems: 'center',
        width: '80%'
    },
    registroButton: {
        alignSelf: 'center',
        marginTop: 20,
        padding: 14,
        backgroundColor: '#0369a1',
        alignItems: 'center',
        width: '80%',
        borderRadius: 20,
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
        fontSize: 14
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
});

export default Registro;