import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import { SetLoginStatus, username } from "../../main";
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
        <SidebarButton label="Home" to="home" icon={house} />
        <SidebarButton label="Discover" to="discover" icon={search} />
        <SidebarButton label="Artists" to="account" icon={music} />
        <SidebarButton label="Playlists" to="account" icon={bars} />

        <SidebarButton label={username} to="account" icon={user} />
        <SidebarButton label="Settings" icon={gear} />
        <SidebarButton label="Logout" icon={exit} onClick={Logout} />
      </div>
    </>
  );
}
