import { useParams } from "react-router-dom";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { useEffect, useState } from "react";
import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";
import { setListRef } from "../../../Middle/Playlist";

var isPlaylistOwner: boolean = false;
var playlistType: string = "undefined";

export var DeleteSong_Exported: any;

export default function ContextOption_RemoveDeleteSong(props: any) {
  const { playlistID } = useParams();

  if (playlistID == null) return;

  DeleteSong_Exported = DeleteSong;

  var removeBtnID = "RemoveSong_Button_" + props.target;
  var deleteBtnID = "DeleteSong_Button_" + props.target;

  var removeBtn = document.getElementById(removeBtnID) as HTMLElement;
  var deleteBtn = document.getElementById(deleteBtnID) as HTMLElement;

  removeBtn?.style.setProperty("display", "none");
  deleteBtn?.style.setProperty("display", "none");

  let run = async () => {
    removeBtn = document.getElementById(removeBtnID) as HTMLElement;
    deleteBtn = document.getElementById(deleteBtnID) as HTMLElement;

    //console.log("\nupdating");
    await supabase
      .from("Playlists")
      .select("owner_id, type")
      .eq("id", playlistID)
      .then((result) => {
        isPlaylistOwner = result.data?.at(0)?.owner_id == authUserID;
        playlistType = result.data?.at(0)?.type;
      });

    if (isPlaylistOwner) {
      if (playlistType == "Album") {
        removeBtn?.style.setProperty("display", "none");
        deleteBtn?.style.setProperty("display", "block");
      } else if (playlistType == "Playlist") {
        removeBtn?.style.setProperty("display", "block");
        deleteBtn?.style.setProperty("display", "none");
      }
    }
  };

  run();

  useEffect(() => {
    run();
  }, [playlistID]);

  // Removes the song from the playlist
  function RemoveSong(song_id: string) {
    if (isPlaylistOwner && playlistType == "Playlist") {
      supabase
        .from("Playlists")
        .select("song_ids")
        .eq("id", playlistID)
        .then(async (result) => {
          let songs: string[] = result.data?.at(0)?.song_ids;

          songs.splice(songs.indexOf(song_id), 1); // Remove the song from the index

          await supabase
            .from("Playlists")
            .update({ song_ids: songs })
            .eq("id", playlistID);

          setListRef(songs);
          CloseSongContextMenu();
        });
    } else {
      // Safeguard from modifying
      alert("Violation");
      window.location.reload();
    }
  }

  // Removes song from everything and deletes files.
  function DeleteSong(song_id: string) {
    if (isPlaylistOwner && playlistType == "Album") {
      // Remove from each playlist that has it.
      SwitchToPopup("uploadingWait");
      supabase
        .from("Playlists")
        .select("id, song_ids")
        .contains("song_ids", [song_id])
        .then(async (result) => {
          let playlists_with_song: object[] = result.data!;

          for (let i = 0; i < playlists_with_song.length; i++) {
            // Printing out the first list
            let songs: any = playlists_with_song[i];
            songs.song_ids.splice(songs.song_ids.indexOf(song_id), 1); // Remove the song from the index

            await supabase
              .from("Playlists")
              .update({ song_ids: songs.song_ids })
              .eq("id", songs.id);
          }

          // Remove Song from Songs Table
          await supabase.from("Songs").delete().eq("id", song_id);

          // Remove file associated with it.
          supabase.storage
            .from("music-files")
            .remove(["audio-files/" + song_id]);

          window.location.reload();
        });
    } else {
      // Sometimes happens if the page hasn't fully loaded
      // Safeguard from modifying
      alert("Violation");
      window.location.reload();
    }
  }

  return (
    <>
      <div
        className="contextButton"
        hidden={playlistType == "undefined" || !isPlaylistOwner}
      >
        <div>
          <div id={removeBtnID} onClick={() => RemoveSong(props.target)}>
            Remove Song
          </div>
          <div
            id={deleteBtnID}
            onClick={() => {
              CloseSongContextMenu();
              SwitchToPopup("DeleteSong");
            }}
          >
            Delete Song
          </div>
        </div>
      </div>
    </>
  );
}
