import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import "./AddPlaylistButton.css";
import { NavLink } from "react-router-dom";
import PlaylistContextMenu, {
  ViewPlaylistContextMenu,
} from "./Containers/ContextMenus/PlaylistContextMenu";

export default function AddPlaylistButton(props: any) {
  if (props.playlist_id == null) return;

  const [playlistName, setPlaylistName] = useState(null);
  const [coverUrl, setCover_URL] = useState(
    "../../../src/assets/circle-plus-solid.svg"
  );

  //
  return (
    <>
      <div
        className="PlaylistContainer"
        id={props.playlist_id}
        onContextMenu={(e) => {
          e.preventDefault();

          // Don't even have to do this. Just send the song_id to state
          ViewPlaylistContextMenu("Playlist_ContextMenu", e);
        }}
      >
        <img src={coverUrl} />

        <div>
          <span>{playlistName}</span>
        </div>
      </div>
    </>
  );
}
