// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAPrLS1OtYR6B7vfN__fh_Ao60oW7s7Co",
  authDomain: "blockchain-smart-exam-1.firebaseapp.com",
  databaseURL: "https://blockchain-smart-exam-1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blockchain-smart-exam-1",
  storageBucket: "blockchain-smart-exam-1.appspot.com",
  messagingSenderId: "693215143933",
  appId: "1:693215143933:web:9ccac2be489017d8641b94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'blockchain_1');

//initialize firebase auth
const auth = getAuth(app)

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, auth, database }