import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export const firebaseConfig = {
    apiKey: "AIzaSyDjjQz0tNW45KB8RIxanTTFPzeJntjnEaY",
    authDomain: "restaurante-fukui.firebaseapp.com",
    projectId: "restaurante-fukui",
    storageBucket: "restaurante-fukui.appspot.com",
    messagingSenderId: "310991952782",
    appId: "1:310991952782:web:92ea35cc3fed1749e562df",
    measurementId: "G-P4S174MCVK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 