import "../components/Left/Sidebar.css";
import logo from "../assets/react.svg";
import gear from "../assets/gear-solid.svg";
import house from "../assets/house-solid.svg";
import add from "../assets/circle-plus-solid.svg";
import music from "../assets/music-solid.svg";
import user from "../assets/user-solid.svg";
import { NavLink } from "react-router-dom";
import SidebarButton from "../components/Containers/SidebarButton";


export default function SupportSidebar() {

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
        <SidebarButton label="Home" to="home" icon={house} />
        <SidebarButton label="All Tickets" to={"tickets"} icon={user} />
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
