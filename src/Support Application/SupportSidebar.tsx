import "../components/Left/Sidebar.css";
import logo from "../assets/react.svg";
import bars from "../assets/bars-solid.svg";
import gear from "../assets/gear-solid.svg";
import house from "../assets/house-solid.svg";
import search from "../assets/magnifying-glass-solid.svg";
import add from "../assets/circle-plus-solid.svg";
import music from "../assets/music-solid.svg";
import user from "../assets/user-solid.svg";
import exit from "../assets/right-from-bracket-solid.svg";
import { NavLink, useNavigate } from "react-router-dom";
import { ResetPlayer } from "../components/Music Control";
import SidebarButton from "../components/Containers/SidebarButton";
import supabase from "../config/supabaseClient";
import { SetLoginStatus, username, authUserID } from "../main";

export default function SupportSidebar() {
  const navigate = useNavigate();

  function Logout() {
    ResetPlayer();
    supabase.auth.signOut();
    SetLoginStatus(false);

    navigate("/");
  }

  return (
    <>
      <div className="Sidebar">
        <NavLink to="home">
          <div className="SidebarLogo">
            <img src={logo} />
            <h2>uMuse Support</h2>
          </div>
        </NavLink>

        <hr></hr>
        <SidebarButton label="Start Here" to="home" icon={house} />
        <SidebarButton
          label="My Tickets"
          to={"tickets/" + authUserID}
          icon={user}
        />
        <SidebarButton
          className="addButtonSidebar"
          label="Create Ticket"
          to="new-ticket"
          icon={add}
        />

        <SidebarButton label="Settings" icon={gear} />
        <SidebarButton label="App" to="../app/home" icon={music} />
      </div>
    </>
  );
}
