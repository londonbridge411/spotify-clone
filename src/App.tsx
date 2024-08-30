import { Outlet, useNavigate } from "react-router-dom";
import { createContext, useEffect, useRef, useState } from "react";
import { isLoggedIn } from "./main";
import Sidebar from "./components/Left/Sidebar";
import MusicControl from "./components/Music Control";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import PopupControl from "./PopupControl";
import SongContextControl from "./components/Containers/ContextMenus/SongContextMenu";
import supabase from "./config/supabaseClient";

var idleTimer = null;

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

  document.onkeydown = function (e) {
    if (
      (e.key == " " || e.code == "Space" || e.keyCode == 32) &&
      e.target == document.body
    ) {
      e.preventDefault();
      setIdleTime(0);
      clearInterval(idleTimer!);
      document
        .getElementById("soundbar-container")
        ?.classList.remove("slidedown");
      document.getElementById("soundbar-container")?.classList.add("slideup");
      document.getElementById("root")!.style.cursor = "auto";
    }
  };

  document.onmousemove = function (e) {
    if (document.fullscreenElement) {
      setIdleTime(0);
      clearInterval(idleTimer!);
      document
        .getElementById("soundbar-container")
        ?.classList.remove("slidedown");
      document.getElementById("soundbar-container")?.classList.add("slideup");
      document.getElementById("root")!.style.cursor = "auto";
    }
  };

  const [idleTime, setIdleTime] = useState(0);
  useInterval(() => {
    setIdleTime(idleTime + 1);

    if (
      idleTime >= 5 &&
      document.fullscreenElement &&
      player.isPlaying == true
    ) {
      document
        .getElementById("soundbar-container")
        ?.classList.remove("slideup");
      document.getElementById("soundbar-container")?.classList.add("slidedown");
      document.getElementById("root")!.style.cursor = "none";
    }
  }, 1000);

  document.onload = () => {
    idleTimer = setInterval(() => {}, 0);
  };

  document.onfullscreenchange = () => {
    document
      .getElementById("soundbar-container")
      ?.classList.remove("slidedown");
    document.getElementById("soundbar-container")?.classList.remove("slideup");
    document.getElementById("root")!.style.cursor = "auto";
  };

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
        <footer id="soundbar-container">
          <MusicControl />
        </footer>
      </section>
      <PopupControl />
      <SongContextControl />
    </div>
  );
}

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      (savedCallback as any).current(); //Needs ()
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
