import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; 
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAWVa34jFkHCl0ExprvOzBireAqM9ii-zE",
    authDomain: "react-project-2da93.firebaseapp.com",
    projectId: "react-project-2da93",
    storageBucket: "react-project-2da93.appspot.com",
    messagingSenderId: "535682666753",
    appId: "1:535682666753:web:8b10bc6bc8e24309110b00",
    measurementId: "G-6W8CT210R9"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const storage = getStorage();

export { db, storage };