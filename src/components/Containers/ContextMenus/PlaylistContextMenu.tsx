import { useEffect, useState } from "react";
import { isVerified } from "../../../main";

var targ: string = "";
export default function PlaylistContextMenu(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see

  // If you save and then press the button it will not work because the page gets screwed up.
  return <></>;
}

export function ViewPlaylistContextMenu(id: string, event: any) {
  let selectedID = event.currentTarget.getAttribute("id");
  console.log("ID is " + selectedID);

  var menu = document.getElementById(id) as HTMLElement;
  console.log(event.currentTarget);
  targ = selectedID;

  //menu.setAttribute("display", "block");
  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");
}
