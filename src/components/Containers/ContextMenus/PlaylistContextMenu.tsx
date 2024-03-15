import { authUserID, isVerified } from "../../../main";
import "./PlaylistContextMenu.css";
import "./ContextButton.css";
import ContextOption_RemoveDeleteSong from "./Song Context Features/RemoveDeleteSong";
import ContextOption_AddToPlaylist from "./Song Context Features/AddToPlaylist";
import ContextOption_DeletePlaylist from "./Playlist Context Features/DeletePlaylist";
import ContextOption_FollowPlaylist from "./Playlist Context Features/FollowPlaylist";
import { useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";

var ID: string;
var runExported: any;

export function ClosePlaylistContextMenu() {
  var menu = window.document.getElementById(ID) as HTMLElement;
  menu?.style.setProperty("display", "none");
}

export default function PlaylistContextMenu(props: any) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setOwnership] = useState(true);

  let run = async () => {
    //targetPlaylist = props.playlistID;
    await supabase
      .rpc("checkfollowingownership", {
        userid: authUserID,
        playlistid: props.playlistID,
      })
      .then((result) => {
        let data = result.data.at(0);
        setOwnership(data.isowner);
        setIsFollowing(data.isfollowing);
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
    var container = window.document.getElementById(ID);
    var clickedHTML = e.target as HTMLElement;

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
  var menu = document.getElementById(id) as HTMLElement;

  ID = id;

  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");
}
