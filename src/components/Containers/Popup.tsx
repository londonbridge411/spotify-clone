import "./Popup.css";

export default function Popup(props: any) {
  return props.active ? (
    <>
      <div className="popup-box">
        <div className="popup-content">{props.html}</div>
        <button onClick={() => props.setActive(false)}>close</button>
      </div>
    </>
  ) : (
    ""
  );
}
