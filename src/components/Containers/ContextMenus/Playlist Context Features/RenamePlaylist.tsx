import { useLocation, useParams } from "react-router-dom";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { useEffect, useState } from "react";
import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";
import { setListRef } from "../../../Middle/Playlist";
import { ClosePlaylistContextMenu } from "../PlaylistContextMenu";

export var RenamePlaylist_Exported: any;

export default function ContextOption_RenamePlaylist(props: any) {
  const [id, setID] = useState(""); // Used in onclick to update the props.target. For some reason, I need this

  function RenamePlaylist() {
    let run = async () => {
      var new_name: string = (
        document.getElementById("rename-playlist-name") as HTMLInputElement
      )?.value;

      await supabase
        .from("Playlists")
        .update({ name: new_name })
        .eq("id", props.target)
        .then(() => window.location.reload());
    };

    run();
  }

  // Removes the song from the playlist
  RenamePlaylist_Exported = RenamePlaylist;

  return (
    <>
      <div
        className="contextButton"
        hidden={!props.isOwner}
        onClick={() => {
          setID(props.target);
          ClosePlaylistContextMenu();
          SwitchToPopup("RenamePlaylist");
        }}
      >
        Rename Playlist
      </div>
    </>
  );
}
