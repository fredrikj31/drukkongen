import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCB7dKZYtYrwA7SI6-BCVo44T4Y0oXjqn4",
  authDomain: "drukkongen.firebaseapp.com",
  projectId: "drukkongen",
  storageBucket: "drukkongen.appspot.com",
  messagingSenderId: "504945923966",
  appId: "1:504945923966:web:20901da31a526f314cc52f",
  measurementId: "G-S4QL8KDPLM",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
