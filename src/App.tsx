import { Link, useNavigate } from "react-router-dom";
import supabase from "./config/supabaseClient";
import { useCallback, useEffect } from "react";
import { SetLoginStatus, isLoggedIn } from "./main";
import Sidebar from "./components/Left/Sidebar";
import Album from "./components/Middle/Album";
import Comments from "./components/Right/Comments";
import MusicControl from "./components/Music Control";
import "./App.css";
import MainView from "./components/Middle/Main View";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn == false) {
      navigate("/login");
    }
  });

  return (
    <div className="App">
      <section id="page">
        <nav>
          <Sidebar />
        </nav>
        <main>
          <MainView />
        </main>
        <footer>
          <MusicControl />
        </footer>
      </section>
    </div>
  );
}

export default App;
