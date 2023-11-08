import { Link, useNavigate } from "react-router-dom";
import supabase from "./config/supabaseClient";
import { useEffect } from "react";
import { SetLoginStatus, isLoggedIn } from "./main";
import Sidebar from "./components/Left/Sidebar";
import Album from "./components/Middle/Album";
import Comments from "./components/Right/Comments";
import MusicControl from "./components/Music Control";
import "./Home.css";
import MainView from "./components/Middle/Main View";
function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn == false) {
      navigate("/login");
    }
  });

  function Logout() {
    supabase.auth.signOut();
    SetLoginStatus(false);
    navigate("/");
    /*const logout = async () =>
       {
          let {error} = await supabase.auth.signOut();
          
          /*console.log(error);
          if (error == null)
          {


          }
       };*/
  }

  return (
    <>
      <div id="main">
        <div className="section-row">
          <div className="section-column">
            <Sidebar />
          </div>
          <div className="section-column">
            <MainView />
          </div>
          <div className="section-column">
            <Comments />
          </div>
        </div>
      </div>
      <div className="section-row">
        <MusicControl />
      </div>
    </>
  );
}

export default Home;
