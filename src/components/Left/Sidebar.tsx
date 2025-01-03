import { NavLink, useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import { SetLoginStatus, authUserID, username } from "../../main";
import SidebarButton from "../Containers/SidebarButton";
import "./Sidebar.css";
import logo from "../../assets/react.svg";
import bars from "../../assets/bars-solid.svg";
import gear from "../../assets/gear-solid.svg";
import house from "../../assets/house-solid.svg";
import search from "../../assets/magnifying-glass-solid.svg";
import music from "../../assets/music-solid.svg";
import user from "../../assets/user-solid.svg";
import question from "../../assets/circle-question-regular.svg";
import exit from "../../assets/right-from-bracket-solid.svg";
import { ResetPlayer } from "../Music Control";

export default function Sidebar() {
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
        <div className="regbar">
          <NavLink to="home">
            <div className="SidebarLogo">
              <img src={logo} />
              <h2>uMuse</h2>
            </div>
          </NavLink>

          <hr></hr>

          <SidebarButton label="Home" to="home" icon={house} />
          <SidebarButton label="Discover" to="discover" icon={search} />
          <SidebarButton label="Artists" to="artists" icon={music} />
          <SidebarButton label="Playlists" to="playlists" icon={bars} />

          <SidebarButton
            label={username}
            to={"account/" + authUserID}
            icon={user}
          />
          <SidebarButton label="Settings" icon={gear} />
          <SidebarButton label="Logout" icon={exit} onClick={Logout} />
        </div>

        <div
          className="supbar mobile-hidden"
          style={{ display: "flex", alignContent: "flex-end" }}
        >
          <hr></hr>
          <SidebarButton label="Support" to="../support" icon={question} />
        </div>
      </div>
    </>
  );
}
