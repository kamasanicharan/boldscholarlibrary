
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * These values are now synchronized with your Firebase Project: boldscholar-d3029
 * extracted from your screenshot.
 */
const firebaseConfig = {
  apiKey: "AIzaSyClCHn9uY2CYyeb5PIvY1X5ycqZH3-mo1M",
  authDomain: "boldscholar-d3029.firebaseapp.com",
  projectId: "boldscholar-d3029",
  storageBucket: "boldscholar-d3029.firebasestorage.app",
  messagingSenderId: "374687315074",
  appId: "1:374687315074:web:b59e8e248e2da3a0ed309b",
  measurementId: "G-W8KVMJ1N51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Drive permissions for the login popup.
 * Since you've enabled the Drive API in Google Cloud, these scopes
 * will now allow the app to interact with your Drive after login.
 */
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/drive.install');
googleProvider.addScope('https://www.googleapis.com/auth/drive.metadata.readonly');
