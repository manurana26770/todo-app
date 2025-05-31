// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6N-zTAsJ7HPuWnq5gM1Q6Vt3NF4UF_4Y",
  authDomain: "todo-app-f5067.firebaseapp.com",
  projectId: "todo-app-f5067",
  storageBucket: "todo-app-f5067.appspot.com",
  messagingSenderId: "861471893779",
  appId: "YOUR_APP_ID" // <-- Find this in Firebase Console > Project Settings
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
