import { firebase } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import storage from '@react-native-firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAWVa34jFkHCl0ExprvOzBireAqM9ii-zE",
    authDomain: "react-project-2da93.firebaseapp.com",
    projectId: "react-project-2da93",
    storageBucket: "react-project-2da93.appspot.com",
    messagingSenderId: "535682666753",
    appId: "1:535682666753:web:ee07ab290885cee4110b00",
    measurementId: "G-5ENS292T0E"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firestore();
const authFirebase = auth();
const analyticsFirebase = analytics();
const storageFirebase = storage();

export { db, authFirebase, storageFirebase, analyticsFirebase };

