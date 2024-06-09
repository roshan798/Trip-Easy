// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: "trip-easy-c69e6.firebaseapp.com",
  projectId: "trip-easy-c69e6",
  storageBucket: "trip-easy-c69e6.appspot.com",
  messagingSenderId: "929091329613",
  appId: "1:929091329613:web:912f84ee48249993dc4604"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);