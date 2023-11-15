import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Authentication from "./AuthProvider";
import {
  BrowserRouter,
  Route,
  Router,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AuthProvider from "./AuthProvider";
import supabase from "./config/supabaseClient.js";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import App from "./App.tsx";
import AccountPage from "./components/Middle/AccountPage.tsx";
import Home from "./components/Middle/Home.tsx";

export var isLoggedIn: Boolean =
  (await supabase.auth.getSession()).data.session != null;

export var username: String = "jim.pickens";

export function getUsername() {
  isLoggedIn;
}

export function SetLoginStatus(b: Boolean) {
  isLoggedIn = b;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<AuthProvider />}></Route>
      <Route path="login" element={<Login />}></Route>
      <Route path="signup" element={<Signup />}></Route>
      <Route path="app" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="account" element={<AccountPage />} />
      </Route>
    </Route>
  )
);

console.log("Status " + isLoggedIn);
//console.log((await supabase.auth.getSession()).data.session);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
