// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWAQvk3a-42R3dDy1IjbT5QqzCt9o0nhs",
  authDomain: "tcg-maker-backend.firebaseapp.com",
  projectId: "tcg-maker-backend",
  storageBucket: "tcg-maker-backend.appspot.com",
  messagingSenderId: "882921117330",
  appId: "1:882921117330:web:01ca3e0743b2f38237f84b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
