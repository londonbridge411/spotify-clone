import React from "react";
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
import { Provider } from "react-redux";
import { store } from "./store.ts";
import MyPlaylistPage from "./components/Middle/MyPlaylistPage.tsx";
import Artists from "./components/Middle/Artists.tsx";
import PasswordUpdatePage from "./PasswordUpdatePage.tsx";
import PasswordResetPage from "./PasswordResetPage.tsx";
import LikedSongsPlaylist from "./components/Middle/LikedSongsPlaylist.tsx";
import SupportApp from "./Support Application/SupportApp.tsx";
import { CreateTicketPage } from "./Support Application/CreateTicketPage.tsx";
import { SupportHome } from "./Support Application/SupportHome.tsx";
import AdminTickets from "./Support Application/AdminTickets.tsx";
import { Ticket } from "./Support Application/Ticket.tsx";

export let isLoggedIn: boolean;
export let email: string;
export let username: string;
export let authUserID: string;

export let isVerified: boolean;

async function LoadData() {
  isLoggedIn = (await supabase.auth.getSession()).data.session != null;
  email = (await supabase.auth.getUser()).data.user?.email as string;
  username = (
    await supabase.from("Users").select("username").eq("email", email)
  ).data?.at(0)?.username;

  authUserID = (
    await supabase.from("Users").select("id").eq("email", email)
  ).data?.at(0)?.id;

  isVerified = (
    await supabase.from("Users").select("is_verified").eq("email", email)
  ).data?.at(0)?.is_verified;
}

await LoadData();

export function SetLoginStatus(b: boolean) {
  isLoggedIn = b;
}

export const getCookies = () =>
  document.cookie
    .split(";")
    .map((str) => str.trim().split(/=(.+)/))
    .reduce((acc: any, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    }, {});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<AuthProvider />}></Route>
      <Route path="login" element={<Login />}></Route>
      <Route path="signup" element={<Signup />}></Route>
      <Route path="reset-password" element={<PasswordResetPage />}></Route>
      <Route path="update-password" element={<PasswordUpdatePage />}></Route>
      <Route path="support" element={<SupportApp />}>
        <Route path="home" element={<SupportHome />} />
        <Route path="tickets" element={<AdminTickets />} />
        <Route path="new-ticket" element={<CreateTicketPage />} />
        <Route path="artists" element={<Artists />} />
        <Route path="playlists" element={<MyPlaylistPage />} />
        <Route path="ticket/:ticketID" element={<Ticket />} />
        <Route path="playlists/liked-songs" element={<LikedSongsPlaylist />} />
      </Route>

      <Route path="app" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="account/:userID" element={<AccountPage />} />
        <Route path="discover" element={<Discover />} />
        <Route path="artists" element={<Artists />} />
        <Route path="playlists" element={<MyPlaylistPage />} />
        <Route path="playlist/:playlistID" element={<Playlist />} />
        <Route path="playlists/liked-songs" element={<LikedSongsPlaylist />} />
      </Route>
    </Route>
  )
);
//console.log("Auth Status: " + isLoggedIn);

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

export async function IsAdmin(): Promise<boolean> {
  const { data, error } = await supabase
    .from("Users")
    .select("is_admin")
    .eq("id", authUserID);

  if (error != null) {
    console.error(error);
    return false;
  } else {
    return data.at(0)?.is_admin;
  }
}
