import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isLoggedIn } from "../main";
import "./SupportApp.css";
import PopupControl from "../PopupControl";
import SongContextControl from "../components/Containers/ContextMenus/SongContextMenu";
import SupportSidebar from "./SupportSidebar";

export default function SupportApp() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn == false) {
      navigate("/login");
    }
  });

  return (
    <div className="SupportApp root-layout">
      <section id="page">
        <nav>
          <SupportSidebar />
        </nav>
        <main id="main-reg">
          <Outlet />
        </main>
        <main id="main-fullscreen">
          <div></div>
        </main>
      </section>
      <PopupControl />
      <SongContextControl />
    </div>
  );
}
