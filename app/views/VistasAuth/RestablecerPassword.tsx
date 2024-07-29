import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const RestablecerPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Por favor ingresa tu correo electrónico.');
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
        <TextInput
            style={styles.input}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
    />
        <Button
            title={loading ? "Enviando..." : "Restablecer Contraseña"}
            onPress={handlePasswordReset}
            disabled={loading}
        />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
});

export default RestablecerPassword;