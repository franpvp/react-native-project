import React, { useState, useEffect } from "react";
import { Center, Avatar, Text, Box, Button, VStack, TextArea } from "native-base";
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, SafeAreaView, StatusBar } from 'react-native';
import CustomInput from '@/components/CustomInput';
import * as DocumentPicker from 'expo-document-picker';
import Ionicons from "@expo/vector-icons/Ionicons";

import { db, authFirebase, storageFirebase } from "@/database/firebase"; 

export default function Contacto() {

    const user = authFirebase.currentUser;
    const [asunto, setAsunto] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [pdfUri, setPdfUri] = useState('');

    const storage = storageFirebase;

    const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            const uri = result.assets[0].uri;
            const name = result.assets[0].name
        
            console.log("name ", result.assets[0].name);
            console.log("uri ", result.assets[0].uri);
        
            if (!result.canceled) {
                const userUid = user.uid;
                await uploadPDF(uri, name, userUid);
            } else {
                Alert.alert('Error', 'No se seleccionó ningún archivo');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Error al seleccionar el documento: ' + err.message);
        }
    };

    const uploadPDF = async (uri, name, userUid) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
    
            const pdfRef = ref(storage, `pdfs/${userUid}/${name}`);
            const uploadTask = uploadBytesResumable(pdfRef, blob);
    
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error('Error subiendo PDF: ', error);
                    Alert.alert('Error', 'Error subiendo PDF: ' + error.message);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        setPdfUri(downloadURL); // Ensure setPdfUri is defined and accessible
                        Alert.alert('Éxito', 'PDF subido exitosamente');
                    } catch (e) {
                        console.error('Error obteniendo URL de descarga: ', e);
                        Alert.alert('Error', 'Error obteniendo URL de descarga: ' + e.message);
                    }
                }
            );
        } catch (error) {
            console.error('Error subiendo PDF: ', error);
            Alert.alert('Error', 'Error subiendo PDF: ' + error.message);
        }
    };

    const guardarMensajeFirestore = async (pdfUrl) => {
        try {
            await db.collection('MensajeUsuariosContacto').add({
                usuario: user.uid,
                asunto: asunto,
                mensaje: mensaje,
                pdfUrl: pdfUrl
            });
            Alert.alert('Mensaje guardado exitosamente');
        } catch (error) {
            // Guardar en Crashlytics un log
            console.error('Error guardando mensaje: ', error.message);
        }
    };

    const handleSubmit = async () => {
        if (!asunto.trim() || !mensaje.trim()) {
            Alert.alert('Error', 'Por favor, complete todos los campos.');
            return;
        }

        try {
            if (pdfUri) {
                await guardarMensajeFirestore(pdfUri);
            } else {
                await guardarMensajeFirestore(null);
            }
        } catch (error) {
            console.error('Error guardando mensaje: ', error.message);
        }
    };

    return (
        <ScrollView showsHorizontalScrollIndicator={false}>
            <VStack paddingBottom={10}>
                <Box style={styles.containerLabel}>
                    <View style={styles.containerContacto}>
                        <Center>
                            <TextInput
                                value={asunto}
                                onChangeText={setAsunto}
                                placeholder="Asunto"
                                autoCapitalize='none'
                                style={styles.input}
                            ></TextInput>
                        </Center>
                        <Center>
                            <TextInput
                                value={mensaje}
                                onChangeText={setMensaje}
                                placeholder="Mensaje"
                                autoCapitalize='none'
                                style={styles.input}
                            ></TextInput>
                        </Center>
                    </View>
                    
                </Box>
                <Box alignSelf="center" marginBottom='20px' marginTop={5}>
                    <TouchableOpacity onPress={pickDocument} style={styles.uploadButton}>
                        <Ionicons name="cloud-upload-outline" size={24} color="white" style={styles.icon} />
                        <Text style={styles.textButton}>Subir archivo</Text>
                    </TouchableOpacity>
                </Box>
                <Center>
                    <TouchableOpacity onPress={handleSubmit} style={styles.enviarButton}>
                        <Text style={styles.text}>Enviar</Text>
                    </TouchableOpacity>
                </Center>
            </VStack>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 20,
    },
    containerContacto: {
        marginTop: 50,
    },
    inputContainer: {
        width: '100%',
        alignItems:'center'
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 45,
        color: 'black',
        fontWeight: '500',
        marginTop: 20
    },
    customInput: {
        justifyContent: 'center',
        backgroundColor: '#e2e8f0',
        borderColor: '#D9D9D9',
        width: '80%',
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 4,
        color: 'gray',
    },
    input: {
        height: 45,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 12,
        fontSize: 16,
        color: 'black',
        width: '80%',
    },
    saveButton: {
        width: '80%',
        padding: 10,
        marginTop: 10,
        justifyContent:'center',
        backgroundColor: '#0e7490',
        borderRadius: 30,
    },
    enviarButton: {
        width: '80%',
        padding: 10,
        marginTop: 10,
        justifyContent:'center',
        backgroundColor: '#0e7490',
        borderRadius: 30,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 16
    },
    logoutButton: {
        width: '100%',
        padding: 10,
        marginTop: 50,
        justifyContent:'center',
        backgroundColor: 'red',
        borderRadius: 30,
    },
    textButton: {
        color: '#fff',
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center', 
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5, 
    },
        icon: {
        marginRight: 10, 
    },
    textButton: {
        color: 'white',
        fontSize: 16, 
    },
});
