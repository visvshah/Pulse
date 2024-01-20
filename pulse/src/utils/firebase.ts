import firebase from "firebase/app"
import { initializeApp } from "firebase/app";
import "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "auth-development-f2bc9.firebaseapp.com",
    projectId: "auth-development-f2bc9",
    storageBucket: "auth-development-f2bc9.appspot.com",
    messagingSenderId: "194734484673",
    appId: "1:194734484673:web:7c63ab4113eb52e418b840"
  };

export const app = initializeApp(firebaseConfig);