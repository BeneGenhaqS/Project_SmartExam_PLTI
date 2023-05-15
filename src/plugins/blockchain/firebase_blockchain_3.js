// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN9I1INspWnL5kQQFmHZJyFprCR5vGutA",
  authDomain: "blockchain-smart-exam-3.firebaseapp.com",
  databaseURL: "https://blockchain-smart-exam-3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blockchain-smart-exam-3",
  storageBucket: "blockchain-smart-exam-3.appspot.com",
  messagingSenderId: "70744000855",
  appId: "1:70744000855:web:c1070d272f51a317dd5612"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'blockchain_3');

//initialize firebase auth
const auth = getAuth(app)

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, auth, database }