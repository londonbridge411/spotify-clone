import { useEffect, useState } from "react";
import "./ContextMenu.css";
import { isVerified } from "../../main";

/*
IGNORE ALL OF THIS FOR RIGHT NOW
*/
export default function ContextMenuOption(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see

  // Clicking outside the context container sets it inactive
  document.onmouseenter = function (e) {
    var container = document.getElementById(props.id);
    var clickedHTML = e.target as HTMLElement;

    /*
    console.log("Poop 2123 12");
    if (!container?.contains(clickedHTML)) {
      console.log("Poop");

      //var menu = document.getElementById(props.id) as HTMLElement;
      //menu?.style.setProperty("display", "none");
    }
    */
  };

  return (
    <>
      <div
        id={props.id}
        className="extended-context-box"
        onMouseEnter={(e) => ViewSubContextMenu(e)}
      >
        <div className="extended-context-content">{props.html}</div>
      </div>
    </>
  );
}

export function ViewSubContextMenu(event: any) {
  let selectedID = event.currentTarget.getAttribute("id");
  console.log("ID is " + selectedID);

  var menu = document.getElementById(selectedID) as HTMLElement;
  console.log(menu);
  //targ = selectedID;

  //menu.setAttribute("display", "block");
  //menu.style.setProperty("background-color", "#FFFF");
  //menu.style.setProperty("--mouse-x", event.clientX + "px");
  //menu.style.setProperty("--mouse-y", event.clientY + "px");
}
