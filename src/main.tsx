import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Authentication from "./AuthProvider";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import AuthProvider from "./AuthProvider";
import supabase from "./config/supabaseClient.js";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";

export var isLoggedIn: Boolean =
  (await supabase.auth.getSession()).data.session != null;

export function SetLoginStatus(b: Boolean) {
  isLoggedIn = b;
}

console.log("Status " + isLoggedIn);
//console.log((await supabase.auth.getSession()).data.session);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        Routes go here example:
        <Route path="/app" element={<App />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<AuthProvider />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
