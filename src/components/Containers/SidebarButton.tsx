import { NavLink } from "react-router-dom";
import "./SidebarButton.css";
import "../../tooltip.css";

/*<button onClick={props.onClick}>{props.label}</button>*/
export default function SidebarButton(props: any) {
  return (
    <>
      <NavLink to={props.to}>
        <label className="SidebarButton" onClick={props.onClick}>
          <img src={props.icon} />
          <p>{props.label}</p>
        </label>
      </NavLink>
    </>
  );
}
