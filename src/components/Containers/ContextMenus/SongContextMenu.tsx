import { useEffect, useLayoutEffect, useState } from "react";
import { authUserID, email, isVerified } from "../../../main";
import "./SongContextMenu.css";
import Popup from "../Popup";
import supabase from "../../../config/supabaseClient";
import PlaylistList from "../Playlist Containers/PlaylistList";
import { useParams } from "react-router-dom";
import ContextOption_RemoveDeleteSong from "./Song Context Features/RemoveDeleteSong";
import ContextOption_AddToPlaylist from "./Song Context Features/AddToPlaylist";

export var targ: string = "";

// Used to mimic the event system found in C#. It's a map to avoid React duplicating items. A simple includes() does not do the job
export var ContextCloseSubs = new Map<string, any>();

export function CloseSongContextMenu() {
  var menu = document.getElementById("Song_ContextMenu") as HTMLElement;
  menu?.style.setProperty("display", "none");
}

export default function SongContextMenu(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  // Clicking outside the context container sets it inactive
  document.onmouseup = function (e) {
    var container = document.getElementById("Song_ContextMenu");
    var clickedHTML = e.target as HTMLElement;

    if (!container?.contains(clickedHTML)) {
      CloseSongContextMenu();

      // Calls every subscriber this is closed.
      ContextCloseSubs.forEach((value: boolean) => (value as any)());
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
          <>
            <ContextButton html={<ContextOption_AddToPlaylist />} />

            <ContextButton html={"Go to artist"} />
            <ContextButton html={"Favorite"} />
            <ContextButton html={"Add to queue"} />
            <ContextButton html={"Move Up"} />
            <ContextButton html={"Move Down"} />

            <ContextButton
              html={<ContextOption_RemoveDeleteSong targ={targ} />}
            />
          </>
        </div>
      </div>
    </>
  );
}

function ContextButton(props: any) {
  return (
    <>
      <div className="contextButton">{props.html}</div>
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
