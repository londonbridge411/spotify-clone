import { useEffect, useLayoutEffect, useState } from "react";
import { authUserID, email, isVerified } from "../../../main";
import "./SongContextMenu.css";
import "./ContextButton.css";

import Popup from "../Popup";
import supabase from "../../../config/supabaseClient";
import PlaylistList from "../Playlist Containers/PlaylistList";
import { useParams } from "react-router-dom";
import ContextOption_RemoveDeleteSong from "./Song Context Features/RemoveDeleteSong";
import ContextOption_AddToPlaylist from "./Song Context Features/AddToPlaylist";

export var targ: string = "";
var isInPlaylist = document.location.href.includes("playlist");

export function CloseSongContextMenu() {
  var menu = document.getElementById("Song_ContextMenu") as HTMLElement;
  menu?.style.setProperty("display", "none");
}

export default function SongContextMenu(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  // Run this so it updates. I don't use useState because it crashes due to infinite looping
  isInPlaylist = document.location.href.includes("playlist");

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
          <ContextOption_AddToPlaylist />

          <div hidden={!isInPlaylist}>
            <ContextOption_RemoveDeleteSong targ={targ} />
          </div>
        </div>
      </div>
    </>
  );
}

export function ViewSongContextMenu(id: string, event: any) {
  let selectedID = event.currentTarget.getAttribute("id");
  //console.log("ID is " + selectedID);

  var menu = document.getElementById(id) as HTMLElement;

  targ = selectedID;
  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");
}
