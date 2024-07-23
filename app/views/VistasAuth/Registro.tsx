import React, { useState } from "react";
import { VStack, Center, Text } from "native-base";
import {View, Image, StyleSheet, Button, Pressable, TextInput, TouchableOpacity} from 'react-native';
import { ScrollView } from "react-native";
import { authFirebase } from "@/database/firebase";
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/database/firebase';

const Registro = () => {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repPassword, setRepPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = authFirebase;
    const user = auth.currentUser;

    const registrarse = async () => {
        setLoading(true);
        try {
            const response =  await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;
            // Actualiza el perfil del usuario
            await updateProfile(user, {
                displayName: nombre,
                photoURL: ""
            });
            console.log("Perfil actualizado: ", user);
            alert("Registro exitoso, revisa tu correo!");
        } catch (error: any) {
            console.log(error);
            alert("Registro fallido: " + error.message);
        } finally {
            setLoading(false);
        }
    }

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
                    <Text style={styles.label}>Contraseña</Text>
                    <Center>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Contraseña"
                            secureTextEntry={true}
                            style={styles.input}
                        ></TextInput>
                        <Text style={styles.restText} marginBottom={5}>Restablecer contraseña</Text>
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
                        <Text style={styles.restText} marginBottom={5}>Restablecer contraseña</Text>
                    </Center>
                </View>
                <Center>
                    <TouchableOpacity onPress={registrarse} style={[styles.button, styles.loginButton]}>
                        <Text style={styles.loginText} >Registrarse</Text>
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
        fontSize: 14
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
});

export default Registro;