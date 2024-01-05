import { useEffect, useState } from "react";
import "./Popup.css";
import { isVerified } from "../../main";

export default function Popup(props: any) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(props.active);
  }, [props.active]);

  if (props.blockElement) return;
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  return props.active ? (
    <>
      <div id={props.id} className={fadeIn ? "popup-box fadeIn" : "popup-box"}>
        <div className="popup-content">{props.html}</div>
        <button
          hidden={!props.canClose}
          onClick={() => {
            props.setActive(false);
          }}
        >
          Close
        </button>
      </div>
    </>
  ) : (
    ""
  );
}
