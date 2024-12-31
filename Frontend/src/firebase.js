// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "homesphere-b10cf.firebaseapp.com",
    projectId: "homesphere-b10cf",
    storageBucket: "homesphere-b10cf.appspot.com",
    messagingSenderId: "1040062576496",
    appId: "1:1040062576496:web:8ff95cbcf853b08d6f01b5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);