import "./SidebarButton.css";

/*<button onClick={props.onClick}>{props.label}</button>*/
export default function SidebarButton(props: any) {
  return (
    <>
      <label className="SidebarButton" onClick={props.onClick}>
        <img src={props.icon} />
        <p>{props.label}</p>
      </label>
    </>
  );
}
