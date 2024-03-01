import { isVerified } from "../../../main";
import "./SongContextMenu.css";
import "./ContextButton.css";
import ContextOption_RemoveDeleteSong from "./Song Context Features/RemoveDeleteSong";
import ContextOption_AddToPlaylist from "./Song Context Features/AddToPlaylist";
import { useEffect, useState } from "react";

export var targ: string = "";
var setTargRef: any;

export function CloseSongContextMenu() {
  var menu = document.getElementById("Song_ContextMenu") as HTMLElement;
  menu?.style.setProperty("display", "none");
}

export default function SongContextMenu(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  const [targState, setTargState] = useState("empty");
  setTargRef = setTargState;

  //setIsPlaylist(document.location.href.includes("playlist"))
  // Clicking outside the context container sets it inactive
  document.onmouseup = function (e) {
    var container = document.getElementById("Song_ContextMenu");
    var clickedHTML = e.target as HTMLElement;

    if (!container?.contains(clickedHTML)) {
      CloseSongContextMenu();
      // Calls every subscriber this is closed.
      //ContextCloseSubs.forEach((value: boolean) => (value as any)());
    }
  };

  // If you save and then press the button it will not work because the page gets screwed up.
  return (
    <>
      <div
        //alert={() => run()}
        id="Song_ContextMenu"
        className="song-context-box"
      >
        <div className="song-context-content">
          <p>{targState}</p>
          <ContextOption_AddToPlaylist />
          <ContextOption_RemoveDeleteSong targ={targ} />
        </div>
      </div>
    </>
  );
}

export function ViewSongContextMenu(id: string, event: any) {
  let selectedID = event.currentTarget.getAttribute("id");
  console.log("ID is " + selectedID);

  //setTargRef(selectedID);
  var menu = document.getElementById(id) as HTMLElement;

  targ = selectedID;

  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");

  setTargRef("asd");
}
