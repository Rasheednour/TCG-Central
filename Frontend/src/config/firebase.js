// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUHVyDB-g5ovxYwqWy1ul5xykXnrJ2EVI",
  authDomain: "tcg-central-backend.firebaseapp.com",
  projectId: "tcg-central-backend",
  storageBucket: "tcg-central-backend.appspot.com",
  messagingSenderId: "31567552027",
  appId: "1:31567552027:web:31b5bdf3bbd74f6471a2be",
  measurementId: "G-6WLPJ8YJCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);