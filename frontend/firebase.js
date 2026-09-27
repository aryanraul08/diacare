import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAItEqXA4qFqVLfJeH27f-JZH-7pgf3-M",
  authDomain: "diacare-a9b66.firebaseapp.com",
  projectId: "diacare-a9b66",
  storageBucket: "diacare-a9b66.firebasestorage.app",
  messagingSenderId: "939356919757",
  appId: "1:939356919757:web:f3e01543e9b600cacb9684",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app); // ⬅️ This was missing — fixes the TrackScreen error

export default app;
