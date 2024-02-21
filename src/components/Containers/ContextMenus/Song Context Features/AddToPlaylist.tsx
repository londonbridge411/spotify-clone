import { useParams } from "react-router-dom";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { useEffect, useState } from "react";
import Popup from "../../Popup";
import PlaylistList from "../../Playlist Containers/PlaylistList";
import { useDispatch } from "react-redux";
import { setPopup } from "../../../../PopupSlice";
import { CloseSongContextMenu } from "../SongContextMenu";

export default function ContextOption_AddToPlaylist() {
  const dispatch = useDispatch();
  // I am mapping ForceClose to the subs array as "addToPlaylist"
  // The reason I use a map is to avoid repeats.

  return (
    <>
      <div className="contextButton">
        <div
          onClick={() => {
            CloseSongContextMenu();
            dispatch(setPopup("AddToPlaylist"));
          }}
        >
          Add to Playlist
        </div>
      </div>
    </>
  );
}
