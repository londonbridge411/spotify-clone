import { useLocation, useParams } from "react-router-dom";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { useEffect, useState } from "react";
import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";
import { setListRef } from "../../../Middle/Playlist";

export default function ContextOption_RenameSong(props: any) {
  const [isSongOwner, setIsOwner] = useState(false);

  let run = async () => {
    await supabase
      .from("Songs")
      .select("owner_id")
      .eq("id", props.target)
      .then((result) => {
        setIsOwner(result.data?.at(0)?.owner_id == authUserID);
      });
  };

  run();

  useEffect(() => {
    run();
  }, []);

  // Removes the song from the playlist

  return (
    <>
      <div
        className="contextButton"
        hidden={!isSongOwner}
        onClick={() => {
          props.onClick();
          CloseSongContextMenu();
          SwitchToPopup("RenameSong");
        }}
      >
        Rename Song
      </div>
    </>
  );
}
