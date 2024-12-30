import { authUserID, isVerified } from "../../../main";
import "./PlaylistContextMenu.css";
import "./ContextButton.css";
import ContextOption_DeletePlaylist from "./Playlist Context Features/DeletePlaylist";
import ContextOption_FollowPlaylist from "./Playlist Context Features/FollowPlaylist";
import { useState } from "react";
import supabase from "../../../config/supabaseClient";
import ContextOption_RenamePlaylist from "./Playlist Context Features/RenamePlaylist";

let ID: string;
let runExported: any;

export function ClosePlaylistContextMenu() {
  const menu = window.document.getElementById(ID) as HTMLElement;
  menu?.style.setProperty("display", "none");
}

export default function PlaylistContextMenu(props: any) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setOwnership] = useState(true);

  const run = async () => {
    // There might be a possible join to do, but it ain't easy

    if (props.playlistID == null)
      return;

    await supabase
      .from("Playlists")
      .select("id, owner_id")
      .eq("owner_id", authUserID)
      .eq("id", props.playlistID)
      .then((result) => {
        if (result != null)
          if (result.data != null)
            setOwnership(result.data.length > 0);
      });

    await supabase
      .from("Subscribed_Playlists")
      .select("*")
      .eq("subscriber", authUserID)
      .eq("playlist_id", props.playlistID)
      .then((result) => {
        if (result != null)
          if (result.data != null)
            setIsFollowing(result.data.length > 0);
      });
  };
  run();
  runExported = run;

  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  //const [isOwner, setIsOwner] = useState(false);
  //setIsPlaylist(document.location.href.includes("playlist"))
  // Clicking outside the context container sets it inactive
  window.onmouseup = function (e) {
    // ID SOMETIMES GETS STUCK CAUSING IT FREEZE???

    //console.log("click: " + ID);
    const container = window.document.getElementById(ID);
    const clickedHTML = e.target as HTMLElement;

    if (!container?.contains(clickedHTML)) {
      ClosePlaylistContextMenu();
      // Calls every subscriber this is closed.
      //console.log("true");
    } else {
      //console.log("false");
    }
  };

  ID = "PlaylistContext_" + props.playlistID;
  // If you save and then press the button it will not work because the page gets screwed up.
  return (
    <>
      <div
        //alert={() => run()}
        id={ID}
        className="Playlist-context-box"
      >
        <div className="Playlist-context-content">
          <ContextOption_FollowPlaylist
            target={props.playlistID}
            isOwner={isOwner}
            isFollowing={isFollowing}
          />

          <ContextOption_RenamePlaylist
            target={props.playlistID}
            isOwner={isOwner}
          />

          <ContextOption_DeletePlaylist
            target={props.playlistID}
            isOwner={isOwner}
          />
        </div>
      </div>
    </>
  );
}

// Moves the
export function ViewPlaylistContextMenu(id: string, event: any) {
  runExported();
  ClosePlaylistContextMenu(); // Maybe fixed the issue of freezing?
  //console.log("View " + id);
  const menu = document.getElementById(id) as HTMLElement;

  ID = id;

  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");
}
