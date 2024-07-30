import React, { useState, useEffect } from "react";
import { Center, Avatar, Text, Box, VStack } from "native-base";
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from "@expo/vector-icons/Ionicons";
import { db, authFirebase, storageFirebase } from "@/database/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { ref, getDownloadURL  } from 'firebase/storage';

export default function Perfil({ navigation }) {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState('');
  const [transferred, setTransferred] = useState('');
  const auth = authFirebase;
  const storage = storageFirebase;
  const userAuth = auth.currentUser;

  if (userAuth) {
    const uidUser = userAuth.uid;
  
    db.collection('usuarios').doc(uidUser).get()
      .then((doc) => {
        if (doc.exists) {
          const phone = doc.data().phoneNumber;
          setPhone(phone);
        } else {
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.error('Error getting document:', error);
      });
  } else {
    console.log('User not authenticated');
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchPhotoURL(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchPhotoURL = async (uid) => {
    try {
      const doc = await db.collection('usuarios').doc(uid).get();
      if (doc.exists) {
        setImage(doc.data().photoURL);
      } else {
        console.log("No matching documents found.");
      }
    } catch (error) {
      console.error("Error fetching photoURL ", error.message);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      await saveImage(imageUri);
    }
  };

  const saveImage = async (imageUri) => {
    try {
      const url = await uploadImageToFirebase(imageUri);
      await db.collection('usuarios').doc(userAuth.uid).update({
        photoURL: url
      });
      await fetchPhotoURL(userAuth.uid);
      // Alert.alert("Imagen guardada", "La imagen se guardó correctamente");
    } catch (error) {
      console.error("Error guardando imagen: ", error.message);
      // Alert.alert("Error", "Error guardando imagen: " + error.message);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    if (!uri) {
      throw new Error("La URI de la imagen es nula");
    }

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = storage.ref().child(`profileImages/${userAuth.uid}/${filename}`);
    const uploadTask = storageRef.put(blob);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTransferred(Math.round(progress));
      }, error => {
        console.error(error);
        reject(error);
      }, async () => {
        try {
          const downloadURL = await storageRef.getDownloadURL();
          resolve(downloadURL);
        } catch (e) {
          console.error(e);
          reject(e);
        }
      });
    });
  };


  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <VStack alignItems="center" paddingBottom={10}>
        {userAuth ? (
          <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Box bg="primary.700" paddingTop={14} alignSelf="center" w='450px' h='160px' borderBottomRadius={22}>
                <Avatar
                  bg="gray.200"
                  alignSelf="center"
                  size="200px"
                  borderWidth={5}
                  borderColor='#cbd5e1'
                  source={{ uri: image || 'https://via.placeholder.com/200' }}
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
            <Box alignSelf="center" marginTop='90px' marginBottom='30px'>
              <Text style={styles.textoPerfil}>{userAuth.displayName}</Text>
            </Box>
            <Box alignSelf="center" marginBottom='30px'>
              <Text style={styles.titlePerfil}>Mis datos</Text>
            </Box>
            <Box alignSelf="center" w="85%" padding={5} paddingLeft={10} paddingRight={10} marginBottom={4} bg="muted.200" borderRadius={10}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text style={styles.label}>Email</Text>
                <Text style={styles.email}>{userAuth.email}</Text>
              </Box>
            </Box>
            <Box alignSelf="center" w="85%" padding={5} paddingLeft={10} paddingRight={10} bg="muted.200" borderRadius={10}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text style={styles.label}>Teléfono</Text>
                <Text style={styles.email}>{phone}</Text>
              </Box>
            </Box>
            <Pressable
              onPress={() => navigation.navigate("Restablecer")}
              width='85%'
            >
              <Box alignSelf="center" w="100%" padding={5} paddingLeft={10} paddingRight={10} bg="muted.200" borderRadius={10} marginTop={4}>
                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Text style={styles.label}>Restablecer contraseña</Text>
                  <Ionicons name="chevron-forward" size={24} color="gray" />
                </Box>
              </Box>
            </Pressable>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={() => auth.signOut()} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={24} color="white" style={styles.icon} />
                <Text style={styles.textButton}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>Usuario no autenticado</Text>
        )}
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },
  titlePerfil: {
    fontSize: 20,
    fontWeight: '700'
  },
  textoPerfil: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  btnSubirFoto: {
    position: 'absolute',
    justifyContent: 'center',
    padding: 12,
    width: '100px',
    height: '100px',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 200,
    left: 55
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6347', 
    padding: 15,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 40,
    marginTop: 40
  },
  textButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
  },
  icon: {
    marginRight: 10,
  }
});