import {
  Link,
  Outlet,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import supabase from "./config/supabaseClient";
import { useCallback, useEffect } from "react";
import { SetLoginStatus, isLoggedIn } from "./main";
import Sidebar from "./components/Left/Sidebar";
import Album from "./components/Middle/Album";
import Comments from "./components/Right/Comments";
import MusicControl from "./components/Music Control";
import "./App.css";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn == false) {
      navigate("/login");
    }
  });

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
    </div>
  );
}
