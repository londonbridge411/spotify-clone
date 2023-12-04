import { Outlet } from "react-router-dom";
import "./Main View.css";

export default function MainView() {
  return (
    <div id="MainView">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
