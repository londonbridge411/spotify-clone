import { Outlet, useNavigate } from "react-router-dom";
import { createContext, useEffect, useRef, useState } from "react";
import { isLoggedIn } from "../main";
import Sidebar from "../components/Left/Sidebar";
import MusicControl from "../components/Music Control";
import "./SupportApp.css";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import PopupControl from "../PopupControl";
import SongContextControl from "../components/Containers/ContextMenus/SongContextMenu";
import supabase from "../config/supabaseClient";
import SupportSidebar from "./SupportSidebar";

var idleTimer = null;

export default function SupportApp() {
  const navigate = useNavigate();
  const player = useSelector((state: RootState) => state.player);

  return (
    <div className="SupportApp root-layout">
      <section id="page">
        <nav>
          <SupportSidebar />
        </nav>
        <main id="main-reg">
          <Outlet />
        </main>
        <main id="main-fullscreen">
          <div></div>
        </main>
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
