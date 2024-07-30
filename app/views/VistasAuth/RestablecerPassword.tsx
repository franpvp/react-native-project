import React, { useState } from 'react';
import { Center, Text } from "native-base";
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';

const RestablecerPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Advertencia', 'Por favor ingresa tu correo electrónico.');
            return;
        }

        setLoading(true);

        try {
            await auth().sendPasswordResetEmail(email);
            Alert.alert('Éxito', 'Se ha enviado un correo electrónico para restablecer tu contraseña.');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Hubo un problema al intentar restablecer la contraseña. Verifica el correo electrónico e inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            <Center>
                <Text style={styles.title}>Restablecer Contraseña</Text>
            </Center>
            <Center>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </Center>
            
            <Center>
                <TouchableOpacity onPress={handlePasswordReset} style={[styles.button, styles.restablecerButton]}>
                    <Text style={styles.restablecerText}>Confirmar</Text>
                </TouchableOpacity>
            </Center>
        </ScrollView>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#1c1c1e',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 16,
        paddingHorizontal: 8,
        color: 'white',
        marginTop: 10
    },
    restablecerButton: {
        marginTop: 18,
        backgroundColor: '#0369a1',
        alignItems: 'center',
        width: '80%'
    },
    restablecerText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 17,
    },
    button: {
        justifyContent: 'center',
        marginTop: 10,
        padding: 10,
        borderRadius: 20,
        width: '80%',
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 500,
    }
});

export default RestablecerPassword;