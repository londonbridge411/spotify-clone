import {
  Outlet,
  useNavigate
} from "react-router-dom";
import {  useEffect } from "react";
import {  isLoggedIn } from "./main";
import Sidebar from "./components/Left/Sidebar";
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
