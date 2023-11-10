import { useNavigate } from "react-router-dom";
import React from "react";
import supabase from "../../config/supabaseClient";
import { SetLoginStatus } from "../../main";
import SidebarButton from "../Containers/SidebarButton";
import "./Sidebar.css";
import logo from "../../assets/react.svg";
import bars from "../../assets/bars-solid.svg";
import gear from "../../assets/gear-solid.svg";
import house from "../../assets/house-solid.svg";
import search from "../../assets/magnifying-glass-solid.svg";
import music from "../../assets/music-solid.svg";
import user from "../../assets/user-solid.svg";
import exit from "../../assets/right-from-bracket-solid.svg";

export default function Sidebar() {
  const navigate = useNavigate();

  function Logout() {
    supabase.auth.signOut();
    SetLoginStatus(false);
    navigate("/");
  }

  return (
    <>
      <div className="Sidebar">
        <img className="SidebarLogo" src={logo} />
        <SidebarButton label="Home" icon={house} onClick={navigate("/app")} />
        <SidebarButton label="Discover" icon={search} />
        <SidebarButton label="Artists" icon={music} />
        <SidebarButton label="Playlists" icon={bars} />
        <SidebarButton label="[username]" icon={user} />
        <SidebarButton
          label="Settings"
          icon={gear}
          onClick={() => console.log("aaa")}
        />
        <SidebarButton label="Logout" icon={exit} onClick={Logout} />
      </div>
    </>
  );
}
