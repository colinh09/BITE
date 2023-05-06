import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBUrUM9dipv4UariU4BH31A8e9W5j03rbg",
  authDomain: "bite-273f9.firebaseapp.com",
  projectId: "bite-273f9",
  storageBucket: "bite-273f9.appspot.com",
  messagingSenderId: "881057718512",
  appId: "1:881057718512:web:4d49112f6ed07ec532a235"
};

const app = initializeApp(firebaseConfig);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
