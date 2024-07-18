import React, { useState } from "react";
import { Center, Avatar, Text, Box, Button } from "native-base";
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import CustomInput from '@/components/CustomInput';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { db, storage } from '../../../database/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Perfil() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [pdfUri, setPdfUri] = useState(null);

  const pickDocument = async () => {
        try {
            let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            const uri = result.assets[0].uri;
            const name = result.assets[0].name

            console.log("name ", result.assets[0].name);
            console.log("uri ", result.assets[0].uri);

            if (!result.canceled) {
                uploadPDF(uri, name);
            } else {
                Alert.alert('Error', 'No se seleccionó ningún archivo');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Error al seleccionar el documento: ' + err.message);
        }
    };

    const uploadPDF = async (uri, name) => {
      try {
          // Convertir el URI a un blob
          const response = await fetch(uri);
          const blob = await response.blob();

          // Crear una referencia en Firebase Storage
          const pdfRef = ref(storage, `pdfs/${name}`);

          // Subir el blob a Firebase Storage
          const uploadTask = uploadBytesResumable(pdfRef, blob);

          // Monitorizar el progreso de la subida
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
                  // Obtener la URL de descarga del PDF subido
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  setPdfUri(downloadURL);
                  Alert.alert('Éxito', 'PDF subido exitosamente');
              }
          );

      } catch (error) {
          console.error('Error subiendo PDF: ', error);
          Alert.alert('Error', 'Error subiendo PDF: ' + error.message);
      }
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await saveImage(result.assets[0].uri);
    }
  };

  const saveImage = async (imageUri) => {
    try {
      setImage(imageUri);
      uploadImageToFirebase(imageUri);
    } catch (error) {
      console.error("Error guardando imagen: ", error);
      Alert.alert("Error", "Error guardando imagen: " + error.message);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    if (!uri) {
      throw new Error("La URI de la imagen es nula");
    }

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setTransferred(Math.round(progress));
    });

    try {
      await uploadTask;
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const saveUserDataToFirestore = async () => {
    try {
      const userDataArray = [nombreCompleto, email];
      await db.collection('listasDatosUsuarios').add({ datosLista: userDataArray });
      Alert.alert('Datos guardados exitosamente');
    } catch (error) {
      Alert.alert('Error guardando los datos: ' + error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: 'blue.700' }} showsVerticalScrollIndicator={false}>
      <Box bg="primary.700" padding={8} alignSelf="center" w='100%' height='140px'>
        <Avatar
          bg="gray.200"
          alignSelf="center"
          size="200px"
          borderWidth={5}
          borderColor='#cbd5e1'
          source={{ uri: image }}
        />
        <Center>
          <TouchableOpacity onPress={pickImage}>
            <Text color='blue.700'>Subir foto</Text>
          </TouchableOpacity>
          <View style={styles.button}>
            <TouchableOpacity>
              <Button
                title="Subir archivo"
                w={100}
                height={5}
                onPress={pickDocument}
              />
            </TouchableOpacity>
          </View>
        </Center>
        <Center>
          <Text style={styles.textoPerfil}>Francisca Valdivia</Text>
        </Center>
        <View style={styles.inputContainer}>
          <Text style={styles.label} mt={5}>Nombre Completo</Text>
          <CustomInput
            value={nombreCompleto}
            onChangeText={setNombreCompleto}
            placeholder="Ingrese su nombre completo"
            style={styles.customInput}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <CustomInput
            value={email}
            onChangeText={setEmail}
            placeholder="Ingrese email"
            style={styles.customInput}
          />
        </View>
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
    backgroundColor: '#fff',
  },
  progressBarContainer: {
    marginTop: 20,
  },
});