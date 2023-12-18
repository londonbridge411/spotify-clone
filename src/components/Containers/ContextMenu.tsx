import { useEffect, useState } from "react";
import "./ContextMenu.css";
import { isVerified } from "../../main";

var targ:string = "";
export default function ContextMenu(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  // Clicking outside the context container sets it inactive
  document.onmouseup = function (e) {
    var container = document.getElementById(props.id);
    var clickedHTML = e.target as HTMLElement;

    if (!container?.contains(clickedHTML)) {
      var menu = document.getElementById(props.id) as HTMLElement;
      menu?.style.setProperty("display", "none");
    }
  };

  // If you save and then press the button it will not work because the page gets screwed up.
  return (
    <>
      <div id={props.id} className="context-box">
        <div className="context-content">
          {props.id}
          {props.html}
          <button onClick={() => console.log(targ)}>Click</button>
        </div>
      </div>
    </>
  );
}

export function ViewContextMenu(id: string, event: any) {
  let selectedID = event.currentTarget.getAttribute("id");
  //console.log("ID is " + selectedID);

  var menu = document.getElementById(id) as HTMLElement;
  //console.log(menu);
  targ = selectedID;
  menu.setAttribute("display", "block");
  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");
}
