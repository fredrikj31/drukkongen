import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { DicesPage } from "./pages/dices/index.tsx";
import { CoinFlipPage } from "./pages/coinflip/index.tsx";

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
getPerformance(app);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dices",
    element: <DicesPage />,
  },
  {
    path: "/coinflip",
    element: <CoinFlipPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
