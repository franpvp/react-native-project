import React, { useState } from "react";
import { Center, Avatar, Text, Box, Button, VStack } from "native-base";
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, SafeAreaView, StatusBar } from 'react-native';
import CustomInput from '@/components/CustomInput';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Crypto from 'expo-crypto';
import Icon from 'react-native-vector-icons/Ionicons';

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

  const [message, setMessage] = useState('');

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
      const response = await fetch(uri);
      const blob = await response.blob();

      const pdfRef = ref(storage, `pdfs/${name}`);

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
      console.error("Error guardando imagen: ", error.message);
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
      await db.collection('listasDatosUsuarios').add({ 
        datosLista: userDataArray
      });
      Alert.alert('Datos guardados exitosamente');
    } catch (error) {
      Alert.alert('Error guardando los datos: ' + error.message);
    }
  };

  const encryptMessage = async (message) => {
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message
    );
    return digest;
  };

  const saveMessageToFirestore = async (encryptedMessage) => {
    try {
      await db.collection('TablaDataEncriptada').add({
        data: encryptedMessage
      });
      Alert.alert('Mensaje guardado exitosamente');
    } catch (error) {
      console.error('Error guardando mensaje: ', error.message);
    }
  };

  const handlePress = async () => {
    const encryptedMessage = await encryptMessage(message);
    await saveMessageToFirestore(encryptedMessage);
  };

  return (
      <ScrollView>
        <VStack alignItems="center" paddingBottom={10}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Box bg="primary.700" paddingTop={14} alignSelf="center" w='500px' h='150px'>
              <Avatar
                    bg="gray.200"
                    alignSelf="center"
                    size="200px"
                    borderWidth={5}
                    borderColor='#cbd5e1'
                    source={{ uri: image }}
              />
            </Box>
            
          </View>
          <Box alignSelf="center">
            <TouchableOpacity onPress={pickImage}>
              <Box style={styles.btnSubirFoto}>
                <Icon name="camera" size={20} color="black" />
              </Box>
            </TouchableOpacity>
          </Box>
          <Box alignSelf="center" marginTop='80px' marginBottom='15px' >
            <TouchableOpacity>
              <Button onPress={pickDocument} color='blue.700'>Subir PDF</Button>
            </TouchableOpacity>
          </Box>
          
          <Box>
            <Text style={styles.textoPerfil}>Francisca Valdivia</Text>
          </Box>
          <View style={styles.inputContainer}>
            <Text style={styles.label} mt={5}>Nombre Completo</Text>
            <CustomInput
              value={nombreCompleto}
              onChangeText={setNombreCompleto}
              placeholder="Ingrese su nombre completo"
              style={styles.customInput}
            />
          </View>
          <View style={styles.inputContainer} marginBottom='20'>
            <Text style={styles.label}>Email</Text>
            <CustomInput
              value={email}
              onChangeText={setEmail}
              placeholder="Ingrese email"
              style={styles.customInput}
            />
            <TouchableOpacity onPress={saveUserDataToFirestore} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Guardar Datos</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer} marginBottom='20'>
            <Box marginTop={5} marginBottom={20}>
                <CustomInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Ingrese mensaje a encriptar"
                  style={styles.encryptInput}
                />
                <Center>
                  <TouchableOpacity onPress={handlePress} style={styles.saveEncryptButton}>
                    <Text style={styles.encryptButton}>Encriptar</Text>
                  </TouchableOpacity>
                </Center>
                
              </Box>
          </View>
        </VStack>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  scrollView: {
    marginHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems:'center'
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
    color: '#000',
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
  encryptInput: {
    justifyContent: 'center',
    backgroundColor: '#e2e8f0',
    borderColor: '#D9D9D9',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
    width:'100%',
    color: 'gray',
  },
  textoPerfil: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  saveButton: {
    width: '80%',
    padding: 10,
    marginTop: 10,
    justifyContent:'center',
    backgroundColor: '#0e7490',
    borderRadius: 30,
  },
  saveEncryptButton: {
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
  encryptButton: {
  color: '#fff',
  fontWeight: 'bold',
  alignItems: 'center',
  textAlign: 'center'
},
  scrollView: {
  flex: 1,
  backgroundColor: '#fff',
  },
  progressBarContainer: {
  marginTop: 20,
  },
  btnSubirFoto:{
    position: 'absolute',
    justifyContent: 'center',
    padding: 12,
    width:'100px',
    height:'100px',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: '50%',
    left: 55
    
  }
});