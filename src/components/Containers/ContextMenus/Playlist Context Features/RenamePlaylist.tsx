import supabase from "../../../../config/supabaseClient";
import { useState } from "react";
import { SwitchToPopup } from "../../../../PopupControl";
import { ClosePlaylistContextMenu } from "../PlaylistContextMenu";

export let RenamePlaylist_Exported: any;

export default function ContextOption_RenamePlaylist(props: any) {
  const [id, setID] = useState(""); // Used in onclick to update the props.target. For some reason, I need this

  function RenamePlaylist() {
    const run = async () => {
      const new_name: string = (
        document.getElementById("rename-playlist-name") as HTMLInputElement
      )?.value;

      if (new_name == "")
        return;
        
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
          console.log(id);
          ClosePlaylistContextMenu();
          SwitchToPopup("RenamePlaylist");
        }}
      >
        Rename Playlist
      </div>
    </>
  );
}
