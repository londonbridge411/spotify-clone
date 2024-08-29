import { Outlet, useNavigate } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { isLoggedIn } from "./main";
import Sidebar from "./components/Left/Sidebar";
import MusicControl from "./components/Music Control";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import PopupControl from "./PopupControl";
import SongContextControl from "./components/Containers/ContextMenus/SongContextMenu";
import supabase from "./config/supabaseClient";

export default function App() {
  const navigate = useNavigate();
  const player = useSelector((state: RootState) => state.player);

  useEffect(() => {
    if (isLoggedIn == false) {
      navigate("/login");
    }
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      `--playback`,
      player.hasLoaded ? "none" : "hidden"
    );
  }, [player.hasLoaded]);

  window.onkeydown = function (e) {
    if (
      (e.key == " " || e.code == "Space" || e.keyCode == 32) &&
      e.target == document.body
    ) {
      e.preventDefault();
    }
  };

  //window.document.getElementById("page")!.style.backgroundImage = "";
  //window.document.exitFullscreen();

  // window.document.onfullscreenchange = () =>
  //   {
  //     if (e.code == "F11" && e.target == document.body) {

  //       /*if (document.fullscreenElement) {
  //         console.log("ASdjhushdfuiasdfoiajfiausdhfaouisdfhj");
  //         document.getElementById("page")!.style.backgroundImage = "";
  //         document.exitFullscreen();
  //       }*/

  //   }
  return (
    <div className="App root-layout">
      <section id="page">
        <nav>
          <Sidebar />
        </nav>
        <main id="main-reg">
          <Outlet />
        </main>
        <main id="main-fullscreen">
          <div></div>
        </main>
        <footer>
          <MusicControl />
        </footer>
      </section>
      <PopupControl />
      <SongContextControl />
    </div>
  );
}
