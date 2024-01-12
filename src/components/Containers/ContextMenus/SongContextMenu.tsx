import { useEffect, useLayoutEffect, useState } from "react";
import { authUserID, email, isVerified } from "../../../main";
import "./SongContextMenu.css";
import Popup from "../Popup";
import supabase from "../../../config/supabaseClient";
import PlaylistList from "../Playlist Containers/PlaylistList";
import { useParams } from "react-router-dom";

export var targ: string = "";
var isPlaylistOwner: boolean = false;
var playlistType: string = "undefined";

export default function SongContextMenu(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }
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

    //console.log(playlistType == "Album" ? "delete" : "remove");
  };

  run();

  useEffect(() => {
    console.log("Change albums");
    run();
  }, [playlistID]);

  const [popupActive_AddToPlaylist, setPopupState_AddToPlaylist] =
    useState(false);

  const [popupActive_DeleteSong, setPopupActive_DeleteSong] = useState(false);

  // Clicking outside the context container sets it inactive
  document.onmouseup = function (e) {
    var container = document.getElementById("Song_ContextMenu");
    var clickedHTML = e.target as HTMLElement;

    if (!container?.contains(clickedHTML)) {
      var menu = document.getElementById("Song_ContextMenu") as HTMLElement;
      menu?.style.setProperty("display", "none");
    }
  };

  // Removes the song from the playlist
  function RemoveSong(song_id: string) {
    if (isPlaylistOwner && playlistType == "Playlist") {
      supabase
        .from("Playlists")
        .select("song_ids")
        .eq("id", playlistID)
        .then(async (result) => {
          let songs: string[] = result.data?.at(0)?.song_ids;
          //delete songs[songs.indexOf(targ)];
          songs.splice(songs.indexOf(song_id), 1); // Remove the song from the index
          console.log(songs);

          await supabase
            .from("Playlists")
            .update({ song_ids: songs })
            .eq("id", playlistID);

          window.location.reload();
        });
      console.log("yay");
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
          console.log(playlists_with_song);

          for (let i = 0; i < playlists_with_song.length; i++) {
            // Printing out the first list
            let songs: any = playlists_with_song[i];
            console.log(songs.song_ids);
            songs.song_ids.splice(songs.song_ids.indexOf(song_id), 1); // Remove the song from the index
            console.log(songs.song_ids);

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
      console.log("yay");
    } else {
      // Sometimes happens if the page hasn't fully loaded
      // Safeguard from modifying
      alert("Violation");
      window.location.reload();
    }
  }

  // If you save and then press the button it will not work because the page gets screwed up.
  return (
    <>
      <div
        //alert={() => run()}
        id="Song_ContextMenu"
        className="song-context-box"
      >
        <div className="song-context-content">
          <>
            <div onClick={() => setPopupState_AddToPlaylist(true)}>
              Add to Playlist
            </div>
            <div>Go to Artist</div>
            <div>Favorite</div>
            <div>Add to queue</div>
            <div>Move Up</div>
            <div>Move Down</div>
            <div id="RemoveSong_Button" onClick={() => RemoveSong(targ)}>
              Remove Song
            </div>
            <div
              id="DeleteSong_Button"
              onClick={() => setPopupActive_DeleteSong(true)}
            >
              Delete Song
            </div>
          </>
          <button onClick={() => run()}>Click</button>
        </div>
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
              }}
            >
              <h2>Are you sure?</h2>
              <div>
                This will permanently delete the song and remove it from the
                platform.
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <button onClick={() => DeleteSong(targ)}>Yes</button>
                <button onClick={() => setPopupActive_DeleteSong(false)}>
                  No
                </button>
              </div>
            </div>
          </>
        }
      />
    </>
  );
}

export function ViewSongContextMenu(id: string, event: any) {
  let selectedID = event.currentTarget.getAttribute("id");
  //console.log("ID is " + selectedID);

  var menu = document.getElementById(id) as HTMLElement;

  targ = selectedID;
  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");
}
