import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqVxiaVeTpJ0V4bOAgHOIL5vMR5MEtsTg",
  authDomain: "finalprojectraiham.firebaseapp.com",
  projectId: "finalprojectraiham",
  storageBucket: "finalprojectraiham.appspot.com",
  messagingSenderId: "628719563822",
  appId: "1:628719563822:web:cc45c67e3901407c13dbbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
