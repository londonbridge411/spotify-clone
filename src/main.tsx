import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import AuthProvider from "./AuthProvider";
import supabase from "./config/supabaseClient.js";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import App from "./App.tsx";
import AccountPage from "./components/Middle/Account/AccountPage.tsx";
import Home from "./components/Middle/Home.tsx";
import Discover from "./components/Middle/Discover.tsx";
import Playlist from "./components/Middle/Playlist.tsx";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import playerSlice from "./PlayerSlice.ts";
import { store } from "./store.ts";
import MyPlaylistPage from "./components/Middle/MyPlaylistPage.tsx";
import Artists from "./components/Middle/Artists.tsx";
import PasswordUpdatePage from "./PasswordUpdatePage.tsx";
import PasswordResetPage from "./PasswordResetPage.tsx";

export var isLoggedIn: boolean =
  (await supabase.auth.getSession()).data.session != null;

export var email: string = (await supabase.auth.getUser()).data.user
  ?.email as string;

export var username: String = (
  await supabase.from("Users").select("username").eq("email", email)
).data?.at(0)?.username;

export var authUserID: String = (
  await supabase.from("Users").select("id").eq("email", email)
).data?.at(0)?.id;

export var isVerified: boolean = (
  await supabase.from("Users").select("is_verified").eq("email", email)
).data?.at(0)?.is_verified;

export function SetLoginStatus(b: boolean) {
  isLoggedIn = b;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<AuthProvider />}></Route>
      <Route path="login" element={<Login />}></Route>
      <Route path="signup" element={<Signup />}></Route>
      <Route path="reset-password" element={<PasswordResetPage />}></Route>
      <Route path="update-password" element={<PasswordUpdatePage />}></Route>

      <Route path="app" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="account/:userID" element={<AccountPage />} />
        <Route path="discover" element={<Discover />} />
        <Route path="artists" element={<Artists />} />
        <Route path="playlists" element={<MyPlaylistPage />} />
        <Route path="playlist/:playlistID" element={<Playlist />} />
      </Route>
    </Route>
  )
);
console.log("Auth Status: " + isLoggedIn);

//console.log((await supabase.auth.getSession()).data.session);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

export async function getInfo() {
  console.log("Updating info");
  email = (await supabase.auth.getUser()).data.user?.email as string;

  username = (
    await supabase.from("Users").select("username").eq("email", email)
  ).data?.at(0)?.username;

  isVerified = (
    await supabase.from("Users").select("is_verified").eq("email", email)
  ).data?.at(0)?.is_verified;

  authUserID = (
    await supabase.from("Users").select("id").eq("email", email)
  ).data?.at(0)?.id;
  //console.log("Username: " + username);
  //console.log("Email: " + email);
}
