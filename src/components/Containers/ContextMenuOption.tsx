import { useEffect, useState } from "react";
import "./ContextMenu.css";
import { isVerified } from "../../main";

export default function ContextMenuOption(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see

  // Clicking outside the context container sets it inactive
  document.onmouseenter = function (e) {
    var container = document.getElementById(props.id);
    var clickedHTML = e.target as HTMLElement;

    if (!container?.contains(clickedHTML)) {
      console.log("Poop");

      //var menu = document.getElementById(props.id) as HTMLElement;
      //menu?.style.setProperty("display", "none");
    }
  };

  return <>{props.html}</>;
}
