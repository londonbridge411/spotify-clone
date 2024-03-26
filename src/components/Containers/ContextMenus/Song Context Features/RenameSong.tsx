import { useLocation, useParams } from "react-router-dom";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { useEffect, useState } from "react";
import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";
import { setListRef } from "../../../Middle/Playlist";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

export default function ContextOption_RenameSong(props: any) {
  // Removes the song from the playlist

  return (
    <>
      <div
        className="contextButton"
        hidden={!props.isOwner}
        onClick={() => {
          CloseSongContextMenu();
          SwitchToPopup("RenameSong");
        }}
      >
        Rename Song
      </div>
    </>
  );
}
