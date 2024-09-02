// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyA-RcYT-OS4WdZDgs1b7ONAlOpGtwfW4TE",
//     authDomain: "pickupwebapp.firebaseapp.com",
//     projectId: "pickupwebapp",
//     storageBucket: "pickupwebapp.appspot.com",
//     messagingSenderId: "734308678102",
//     appId: "1:734308678102:web:13b6cfbba00b736fe30c77"
//   };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);


import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA-RcYT-OS4WdZDgs1b7ONAlOpGtwfW4TE",
    authDomain: "pickupwebapp.firebaseapp.com",
    projectId: "pickupwebapp",
    storageBucket: "pickupwebapp.appspot.com",
    messagingSenderId: "734308678102",
    appId: "1:734308678102:web:13b6cfbba00b736fe30c77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
