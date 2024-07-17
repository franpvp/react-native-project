import React, { useState } from "react";
import { VStack, Center, Avatar, Text, Box } from "native-base";
import { View, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import CustomInput from '@/components/CustomInput';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

import db from '../../../database/firebase';

export default function Perfil() {
  // Estados para manejar los inputs
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [image, setImage] = useState(null);

  const uploadImage = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requieren permisos para acceder a la cámara.');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1
      });

      if (!result.cancelled) {
        await saveImage(result.uri);
      }

    } catch (error) {
      alert("Error subiendo imagen: " + error);
      console.error("Error subiendo imagen: ", error);
    }
  }

  const saveImage = async (image) => {
    try {
      setImage(image);

      // Subir la imagen a Firebase Storage y obtener la URL
      const imageUrl = await uploadImageToFirebase(image);
      // Guardar la URL de la imagen en Firestore
      await saveImageUrlToFirestore(imageUrl);

    } catch (error) {
      console.error("Error guardando imagen: ", error);
    }
  }

  const uploadImageToFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = db.storage().ref().child(new Date().toISOString());
    await ref.put(blob);
    const url = await ref.getDownloadURL();
    return url;
  }

  const saveImageUrlToFirestore = async (url) => {
    await db.collection('userImagesTable').add({
      profilePicture: url,
      timestamp: db.FieldValue.serverTimestamp()
    });
  };

  const saveUserDataToFirestore = async () => {
    try {
      // Guardar en firestore una lista (agregar user_id)
      const userDataArray = [nombreCompleto, email];

      await db.collection('listasDatosUsuarios').add({
        datosLista: userDataArray
      });
      
      alert('Datos guardados exitosamente');
    } catch (error) {
      alert('Error guardando los datos: ' + error);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <Box
          bg="primary.700"
          padding={8}
          alignSelf="center"
          w='100%'
          height='120px'
        >
          <Avatar
            bg="purple.600"
            alignSelf="center"
            size="200px"
            borderWidth={5}
            borderColor='#cbd5e1'
            source={{
              uri: image ? image : "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
            }}
          />
          <Center>
            <TouchableOpacity onPress={uploadImage}>
              <Text color='blue.700'>Subir foto</Text>
            </TouchableOpacity>
          </Center>
          <Center>
            <Text style={styles.textoPerfil}>Francisca Valdivia</Text>
          </Center>
          {/* Input Nombre Completo */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nombre Completo</Text>
              <CustomInput
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
                placeholder="Ingrese su nombre completo"
                style={styles.customInput}
              />
            </View>
          {/* Input Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <CustomInput
                value={email}
                onChangeText={setEmail}
                placeholder="Ingrese email"
                style={styles.customInput}
              />
            </View>
          {/* Input Telefono */}
            {/* <View style={styles.inputContainer}>
              <Text style={styles.label}>Telefono</Text>
              <CustomInput
                value={telefono}
                onChangeText={setTelefono}
                placeholder="Ingrese telefono"
                style={styles.customInput}
              />
            </View> */}

          {/* Botón para guardar datos en firestore*/}
          <Center>
            <TouchableOpacity onPress={saveUserDataToFirestore} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Guardar Datos</Text>
            </TouchableOpacity>
          </Center>
        </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    marginBottom: 5,
    marginLeft: 5,
    color: '#000',
  },
  customInput: {
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
    borderColor: '#D9D9D9',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
    color: 'gray',
  },
  textoPerfil: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 22
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#0e7490',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff', // Asegura que el fondo del scroll sea blanco
  },
});