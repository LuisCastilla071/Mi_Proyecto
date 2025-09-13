import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from "expo-constants";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";

const extra = Constants?.expoConfig?.extra ?? {};
console.log("Extra Firebase Config:", extra); // 👈 Para depurar

// Configuración Web de Firebase
const firebaseConfig = {
  apiKey: extra.FIREBASE_API_KEY,
  authDomain: extra.FIREBASE_AUTH_DOMAIN,
  projectId: extra.FIREBASE_PROJECT_ID,
  storageBucket: extra.FIREBASE_STORAGE_BUCKET, // 👈 agregado
  messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.FIREBASE_APP_ID,
  measurementId: extra.FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };