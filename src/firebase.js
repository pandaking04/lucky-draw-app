
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBIFkBXQbizbLJljFawyTeRLFvBRyAL-Mk",
  authDomain: "lucky-number-6e896.firebaseapp.com",
  databaseURL: "https://lucky-number-6e896-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lucky-number-6e896",
  storageBucket: "lucky-number-6e896.appspot.com",
  messagingSenderId: "713628912040",
  appId: "1:713628912040:web:769e66e0bb45c8f4f3f59d"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);



export const db = getFirestore(firebase);