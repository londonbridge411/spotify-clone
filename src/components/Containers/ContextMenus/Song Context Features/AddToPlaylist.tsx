import { useParams } from "react-router-dom";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { useEffect, useState } from "react";
import Popup from "../../Popup";
import PlaylistList from "../../Playlist Containers/PlaylistList";
import { ContextCloseSubs } from "../SongContextMenu";

export default function ContextOption_AddToPlaylist() {
  const [popupActive_AddToPlaylist, setPopupState_AddToPlaylist] =
    useState(false);

  function ForceClose() {
    setPopupState_AddToPlaylist(false);
  }

  // I am mapping ForceClose to the subs array as "addToPlaylist"
  // The reason I use a map is to avoid repeats.
  ContextCloseSubs.set("addToPlaylist", ForceClose);

  return (
    <>
      <div onClick={() => setPopupState_AddToPlaylist(true)}>
        Add to Playlist
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
