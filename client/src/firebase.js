// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "payments-links-55688.firebaseapp.com",
  projectId: "payments-links-55688",
  storageBucket: "payments-links-55688.appspot.com",
  messagingSenderId: "734347292007",
  appId: "1:734347292007:web:ab74ac1663591e374713c2",
  measurementId: "G-6X2MD0XX0Z"
};

// Initialize Firebase
export const firebaseInit = initializeApp(firebaseConfig);

// Set up authentication
export const auth = getAuth(firebaseInit);
export const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Optional: Handle user and token (e.g., send token to backend)
      return { user, token };
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error);
      throw error;
    });
};
