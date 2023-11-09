import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";
import { SetLoginStatus } from "../../main";
import SidebarButton from "../Containers/SidebarButton";
import "./Sidebar.css";
export default function Sidebar() {
  return (
    <>
      <div className="Sidebar">
        <ul>
          <li></li>
          <li>
            <p></p>
          </li>
        </ul>
        <ul>
          <li>
            <SidebarButton label="Home" />
          </li>
          <li>
            <SidebarButton label="Discover" />
          </li>
          <li>
            <SidebarButton label="Artists" />
          </li>
          <li>
            <SidebarButton label="Playlists" />
          </li>
          <li>
            <SidebarButton label="My Music" />
          </li>
          <li>
            <SidebarButton label="Settings" />
          </li>
          <li>
            <button
              onClick={() => {
                //.
                const navigate = useNavigate();
                supabase.auth.signOut();
                SetLoginStatus(false);
                //navigate("/");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
