import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "hirely-4dc29.firebaseapp.com",
  projectId: "hirely-4dc29",
  storageBucket: "hirely-4dc29.firebasestorage.app",
  messagingSenderId: "121152495833",
  appId: "1:121152495833:web:de20c81d409286c6971ec8",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, githubProvider, provider };
