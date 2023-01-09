/*
We had the option of using either the Firebase JS SDK or React Native Firebase.
We went with the JS SDK because it's cross platform and simpler to get started.
*/


import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {

  apiKey: "AIzaSyDGAVkVYF_sbdu2JEtPaGA3r4_7VwOgAkA",

  authDomain: "imagemorpher-mobile.firebaseapp.com",

  databaseURL: "https://imagemorpher-mobile-default-rtdb.firebaseio.com",

  projectId: "imagemorpher-mobile",

  storageBucket: "imagemorpher-mobile.appspot.com",

  messagingSenderId: "1040911673649",

  appId: "1:1040911673649:web:6d9201cf6f69eb7e392810",

  measurementId: "G-CZ79HDFPPR"

};



const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export default app;
