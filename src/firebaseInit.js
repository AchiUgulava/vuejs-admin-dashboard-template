   // src/firebaseInit.js
   import firebase from "firebase/compat/app";
      import "firebase/compat/firestore";

   const firebaseConfig = {
    apiKey: "AIzaSyCt6WZYH26zNkqR23ikNYdnpUQmb-CuCKU",
    authDomain: "chatftw-37283.firebaseapp.com",
    projectId: "chatftw-37283",
    storageBucket: "chatftw-37283.appspot.com",
    messagingSenderId: "398245006379",
    appId: "1:398245006379:web:1489102792e9f71f562e6e",
    measurementId: "G-4T766T4558",
  };

   // Initialize Firebase
   firebase.initializeApp(firebaseConfig);

   export const db = firebase.firestore();
