// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-fgYOYKh-zAmvWMBYhXwRJ7MWP8ERiUk",
  authDomain: "smart-exam-saas.firebaseapp.com",
  projectId: "smart-exam-saas",
  storageBucket: "smart-exam-saas.appspot.com",
  messagingSenderId: "397606803692",
  appId: "1:397606803692:web:a1af241575df9de930adc9",
  databaseURL: "https://smart-exam-saas-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth(app)

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { app, auth, database }