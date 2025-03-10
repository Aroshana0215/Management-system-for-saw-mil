// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrJEMG2srxm665yfJUJolYSiYX5Pj95vU",
  authDomain: "dts-client.firebaseapp.com",
  projectId: "dts-client",
  storageBucket: "dts-client.appspot.com",
  messagingSenderId: "880085947366",
  appId: "1:880085947366:web:ee8010f84df7588733bc27",
  measurementId: "G-BBWE0Q93CP",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp); 
