// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLUVBS9j8q53Tq6XloLjqbvAd4pm1vqcc",
  authDomain: "daily-expense-tracker-ap-6aa8c.firebaseapp.com",
  projectId: "daily-expense-tracker-ap-6aa8c",
  storageBucket: "daily-expense-tracker-ap-6aa8c.appspot.com",
  messagingSenderId: "412127527450",
  appId: "1:412127527450:web:59cadab1a13736122787a3",
  measurementId: "G-P6JQ2BNY59",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const analytics = getAnalytics(app);

export { app, auth, db };
