import firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";

const  firebaseConfig = {
    apiKey: "AIzaSyCDgg-C2-CzIlKHasWvPeWEvG6v-FXM43g",
    authDomain: "quizup-c36c7.firebaseapp.com",
    databaseURL: "https://quizup-c36c7.firebaseio.com",
    projectId: "quizup-c36c7",
    storageBucket: "quizup-c36c7.appspot.com",
    messagingSenderId: "579170889757",
    appId: "1:579170889757:web:c3ccca910f4c3a7ea016f4",
    measurementId: "G-4V55R204MN"
  };


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth()
export const provider = new firebase.auth.GoogleAuthProvider();


