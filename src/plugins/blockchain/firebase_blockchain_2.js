// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhEjsidMpjc5w41Dcna5PoussxQDUowis",
  authDomain: "blockchain-smart-exam-2.firebaseapp.com",
  databaseURL: "https://blockchain-smart-exam-2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blockchain-smart-exam-2",
  storageBucket: "blockchain-smart-exam-2.appspot.com",
  messagingSenderId: "221281788089",
  appId: "1:221281788089:web:aa0c1e56c3ec2628df7b68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'blockchain_2');

//initialize firebase auth
const auth = getAuth(app)

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, auth, database }