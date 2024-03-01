import "./Popup.css";
import { isVerified } from "../../main";
import { ClosePopup } from "../../PopupControl";

export default function Popup(props: any) {
  /*
  useEffect(() => {
    setFadeIn(props.active);
  }, [pop]);*/

  if (props.blockElement) return;
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  return (
    <>
      <div id={props.id} className="popup-box fadeIn">
        <div className="popup-content">
          {props.html}
          <button
            hidden={!props.canClose}
            onClick={() => {
              ClosePopup();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
