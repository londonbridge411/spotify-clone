import { authUserID, isVerified } from "../../../main";
import "./SongContextMenu.css";
import "./ContextButton.css";
import ContextOption_RemoveDeleteSong from "./Song Context Features/RemoveDeleteSong";
import ContextOption_AddToPlaylist from "./Song Context Features/AddToPlaylist";
import ContextOption_AddToQueue from "./Song Context Features/AddToQueue";
import ContextOption_RenameSong from "./Song Context Features/RenameSong";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { OpenSongContextMenu } from "../../../SongContextSlice";
import supabase from "../../../config/supabaseClient";

export function CloseSongContextMenu() {
  store.dispatch(OpenSongContextMenu("")); // This is being called and getting rid of the id.
  var menu = document.getElementById("song-context-control") as HTMLElement;
  menu?.style.setProperty("display", "none");
}

export function ViewSongContextMenu(id: string, event: any) {
  store.dispatch(OpenSongContextMenu(id));

  var menu = document.getElementById("song-context-control") as HTMLElement;
  //console.log(menu);
  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");
}

export default function SongContextControl() {
  const songContext = useSelector((state: RootState) => state.songContext);
  const location = useLocation();

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    CloseSongContextMenu();
  }, [location]);

  useEffect(() => {
    let run = async () => {
      if (songContext.currentSongID != "") {
        await supabase
          .from("Songs")
          .select("owner_id")
          .eq("id", songContext.currentSongID)
          .then((result) => {
            setIsOwner(result.data?.at(0)?.owner_id == authUserID);
          });
      }
    };

    run();
  }, [songContext.currentSongID]);

  document.onmouseup = function (e) {
    var container = document.getElementById("song-context-control");
    var clickedHTML = e.target as HTMLElement;

    // HERE'S THE ISSUE WITH SONG ID GOING AWAY!!!!!
    if (!container?.contains(clickedHTML)) {
      //CloseSongContextMenu();
    }
  };

  return (
    <>
      <div id="song-context-control" className="song-context-box">
        <div className="song-context-content">
          {songContext.currentSongID}
          <ContextOption_AddToQueue />
          <ContextOption_AddToPlaylist />
          <ContextOption_RenameSong isOwner={isOwner} />
          <ContextOption_RemoveDeleteSong />
        </div>
      </div>
    </>
  );
}
