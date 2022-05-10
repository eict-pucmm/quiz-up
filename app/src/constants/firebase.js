import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import "firebase/storage";

const firebaseConfig = {
    apiKey: 'AIzaSyCgFbQna2xIfywtc8zKW0B5PSsXwWZpnos',
    authDomain: 'quiz-up-a8fa0.firebaseapp.com',
    databaseURL: 'https://quiz-up-a8fa0.firebaseio.com',
    projectId: 'quiz-up-a8fa0',
    storageBucket: 'quiz-up-a8fa0.appspot.com',
    messagingSenderId: '485409107985',
    appId: '1:485409107985:web:17ca39c240b6d8e6d081b0',
    measurementId: 'G-2S6C8X0KPD',
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const storage = firebase.storage();