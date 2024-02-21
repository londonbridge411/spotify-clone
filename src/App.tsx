import { Outlet, useNavigate } from "react-router-dom";
import { createContext, useEffect } from "react";
import { isLoggedIn } from "./main";
import Sidebar from "./components/Left/Sidebar";
import MusicControl from "./components/Music Control";
import "./App.css";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import PopupControl from "./PopupControl";

export default function App() {
  const navigate = useNavigate();
  const player = useSelector((state: RootState) => state.player);

  useEffect(() => {
    if (isLoggedIn == false) {
      navigate("/login");
    }
  });

  useEffect(() => {
    document.documentElement.style.setProperty(`--playback`, (player.hasLoaded) ? "none" : "hidden");
  }, [player.hasLoaded])

  window.onkeydown = function (e) {
    if ((e.key == " " || e.code == "Space" || e.keyCode == 32) && e.target == document.body) {
      e.preventDefault();
    }
  };
  return (
    <div className="App root-layout">
      <section id="page">
        <nav>
          <Sidebar />
        </nav>
        <main>
          <Outlet />
        </main>
        <footer>
          <MusicControl />
        </footer>
      </section>
      <PopupControl />
    </div>
  );
}
