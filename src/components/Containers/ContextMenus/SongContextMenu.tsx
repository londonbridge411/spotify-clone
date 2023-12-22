import { useEffect, useState } from "react";
import { email, isVerified } from "../../../main";
import "./SongContextMenu.css";
import Popup from "../Popup";
import supabase from "../../../config/supabaseClient";
import PlaylistContainerHorizontal from "../Playlist Containers/PlaylistContainerHorizontal";
import PlaylistList from "../Playlist Containers/PlaylistList";

export var targ: string = "";
export default function SongContextMenu(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  const [popupActive_AddToPlaylist, setPopupState_AddToPlaylist] =
    useState(false);

  // Clicking outside the context container sets it inactive
  document.onmouseup = function (e) {
    var container = document.getElementById("Song_ContextMenu");
    var clickedHTML = e.target as HTMLElement;

    if (!container?.contains(clickedHTML)) {
      var menu = document.getElementById("Song_ContextMenu") as HTMLElement;
      menu?.style.setProperty("display", "none");
    }
  };
  // If you save and then press the button it will not work because the page gets screwed up.
  return (
    <>
      <div id="Song_ContextMenu" className="song-context-box">
        <div className="song-context-content">
          <>
            <div onClick={() => setPopupState_AddToPlaylist(true)}>
              Add to Playlist
            </div>
            <div>Favorite</div>
            <div>Add to queue</div>
            <div>Remove from playlist</div>
            <div>Move Up</div>
            <div>Move Down</div>
            <div>Delete Song</div>
          </>
          <button onClick={() => console.log(targ)}>Click</button>
        </div>
      </div>
      <Popup
        id="AddToPlaylist"
        active={popupActive_AddToPlaylist}
        setActive={setPopupState_AddToPlaylist}
        canClose={true}
        requiresVerification={false}
        html={
          <>
            <div className="AddToPlaylist-content">
              <PlaylistList setActive={setPopupState_AddToPlaylist} />
            </div>
          </>
        }
      />
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
