/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./AddPlaylistButton.css";
import ViewPlaylistContextMenu from "./Containers/ContextMenus/PlaylistContextMenu";
import Record from "../../../src/assets/circle-plus-solid.svg";

export default function AddPlaylistButton(props: any) {
  const [playlistName] = useState(null);
  const [coverUrl] = useState(Record);
  if (props.playlist_id == null) return;

  //
  return (
    <>
      <div
        className="PlaylistContainer"
        id={props.playlist_id}
        onContextMenu={(e) => {
          e.preventDefault();

          // Don't even have to do this. Just send the song_id to state
          ViewPlaylistContextMenu("Playlist_ContextMenu");
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
