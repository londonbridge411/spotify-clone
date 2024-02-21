import { useParams } from "react-router-dom";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { useEffect, useState } from "react";
import Popup from "../../Popup";
import { ContextCloseSubs } from "../SongContextMenu";

var isPlaylistOwner: boolean = false;
var playlistType: string = "undefined";

export default function ContextOption_RemoveDeleteSong(props: any) {
  const { playlistID } = useParams();

  if (playlistID == null) return;
  var removeBtn = document.getElementById("RemoveSong_Button") as HTMLElement;
  var deleteBtn = document.getElementById("DeleteSong_Button") as HTMLElement;

  removeBtn?.style.setProperty("display", "none");
  deleteBtn?.style.setProperty("display", "none");

  let run = async () => {
    removeBtn = document.getElementById("RemoveSong_Button") as HTMLElement;
    deleteBtn = document.getElementById("DeleteSong_Button") as HTMLElement;

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

  const [popupActive_DeleteSong, setPopupActive_DeleteSong] = useState(false);

  function ForceClose() {
    setPopupActive_DeleteSong(false);
  }

  ContextCloseSubs.set("deleteSong", ForceClose);

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

          window.location.reload();
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
      <div className="contextButton">
        <div>
          <div id="RemoveSong_Button" onClick={() => RemoveSong(props.targ)}>
            Remove Song
          </div>
          <div
            id="DeleteSong_Button"
            onClick={() => setPopupActive_DeleteSong(true)}
          >
            Delete Song
          </div>
        </div>

        <Popup
          id="DeleteSong"
          active={popupActive_DeleteSong}
          setActive={setPopupActive_DeleteSong}
          canClose={false}
          requiresVerification={true}
          html={
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "300px",
                  height: "125px",
                }}
              >
                <h2>Are you sure?</h2>
                <div>
                  This will permanently delete the song and remove it from the
                  platform.
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <button onClick={() => DeleteSong(props.targ)}>Yes</button>
                  <button onClick={() => setPopupActive_DeleteSong(false)}>
                    No
                  </button>
                </div>
              </div>
            </>
          }
        />
      </div>
    </>
  );
}

/*
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h2>Are you sure?</h2>
              <div>
                This will permanently delete the song and remove it from the
                platform.
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <button onClick={() => DeleteSong(props.targ)}>Yes</button>
                <button onClick={() => setPopupActive_DeleteSong(false)}>
                  No
                </button>
              </div>
            </div>
*/
