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
  useNavigate,
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

export var email: String = (await supabase.auth.getUser()).data.user
  ?.email as String;

export var username: String = (
  await supabase.from("Users").select("username").eq("email", email)
).data?.at(0)?.username;

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
console.log("Auth Status: " + isLoggedIn);

//console.log((await supabase.auth.getSession()).data.session);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

export async function goHomePage() {
  console.log("Updating info");
  email = (await supabase.auth.getUser()).data.user?.email as String;
  username = (
    await supabase.from("Users").select("username").eq("email", email)
  ).data?.at(0)?.username;

  console.log("Username: " + username);
  console.log("Email: " + email);
}
