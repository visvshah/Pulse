import firebase from "firebase/app"
import { initializeApp } from "firebase/app";
import "firebase/auth"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { env } from "~/env.js";

const firebaseConfig = {
    apiKey:"AIzaSyDmPys9pcGJocmolSPAm2OW2p0jQdL5zu0",
    authDomain: "auth-development-f2bc9.firebaseapp.com",
    projectId: "auth-development-f2bc9",
    storageBucket: "auth-development-f2bc9.appspot.com",
    messagingSenderId: "194734484673",
    appId: "1:194734484673:web:7c63ab4113eb52e418b840"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);