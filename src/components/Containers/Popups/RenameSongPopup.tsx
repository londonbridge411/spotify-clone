import { useEffect, useRef, useState } from "react";
import supabase from "../../../config/supabaseClient";
import SearchBar from "../../SearchBar";
import Popup from "../Popup";
import * as uuid from "uuid";
import { useLocation, useParams } from "react-router-dom";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { authUserID, username } from "../../../main";
import CustomInputField from "../../CustomInputField";
import { SwitchToPopup } from "../../../PopupControl";
import { targ } from "../ContextMenus/SongContextMenu";

export function RenameSongPopup() {
  // Get Playlist ID

  function RenameSong() {
    let a = async () => {
      var new_name: string = (
        document.getElementById("rename-song-name") as HTMLInputElement
      )?.value;

      await supabase
        .from("Songs")
        .update({ title: new_name })
        .eq("id", targ)
        .then(() => window.location.reload());
    };

    a();
  }

  return (
    <>
      <div
        id="rename-song-menu"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          Rename Song
        </h2>
        <CustomInputField
          inputType={"url"}
          placeholder={"Some name"}
          label={"Name:"}
          inputID={"rename-song-name"}
        />

        <button style={{ marginBottom: "17.5px" }} onClick={RenameSong}>
          Rename
        </button>
      </div>
    </>
  );
}
