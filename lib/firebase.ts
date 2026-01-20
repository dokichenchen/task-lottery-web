import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCRODb6jeBtLwlmY_T08MuDp99hDJJ6CY",
  authDomain: "task-lottery-app-8a441.firebaseapp.com",
  projectId: "task-lottery-app-8a441",
  storageBucket: "task-lottery-app-8a441.firebasestorage.app",
  messagingSenderId: "721188051500",
  appId: "1:721188051500:web:9fa81e13f3f6e0f9878f89",
  measurementId: "G-H74YZJTKML"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
