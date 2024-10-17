import { useParams } from "react-router-dom";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { useEffect, useState } from "react";
import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

var isPlaylistOwner: boolean = false;
var playlistType: string = "undefined";

export var DeleteSong_Exported: any;

export default function ContextOption_RemoveDeleteSong() {
  const { playlistID } = useParams();
  const songContext = useSelector((state: RootState) => state.songContext);

  DeleteSong_Exported = DeleteSong;

  const [deleteHidden, hideDelete] = useState(true);
  const [removeHidden, hideRemove] = useState(true);

  //console.log(songContext.currentSongID);

  let run = () => {
    // Why is songContext.currentSongID breaking everything????????????????
    supabase
      .from("Playlists")
      .select("owner_id, type")
      .eq("id", playlistID)
      .then((result) => {
        isPlaylistOwner = result.data?.at(0)?.owner_id == authUserID;
        playlistType = result.data?.at(0)?.type;

        if (isPlaylistOwner) {
          if (playlistType == "Album") {
            hideRemove(true);
            hideDelete(false);
          } else if (playlistType == "Playlist") {
            hideRemove(false);
            hideDelete(true);
          }
        }
      });

    //console.log("\nupdating: " + songContext.currentSongID);
  };

  if (playlistID != "" && playlistID != null) {
    run();
  }

  // Use effect is causing the crash
  // useEffect(() => {
  //   //run();
  // }, [songContext.currentSongID]);

  // Removes the song from the playlist
  function RemoveSong(song_id: string) {
    if (isPlaylistOwner && playlistType == "Playlist") {
      let remove = async () => {
        // Fix ordering in playlist
        await supabase
          .from("Songs_Playlists")
          .select("*")
          .eq("playlist_id", playlistID)
          .order("order")
          .then(async (result) => {
            if (result.data != null) {
              let index = result.data?.findIndex(
                (item) => songContext.currentSongID == item.song_id
              );

              for (let i = index + 1; i < result.data?.length; i++) {
                await supabase
                  .from("Songs_Playlists")
                  .update({ order: i })
                  .eq("song_id", (result.data[i] as any).song_id--)
                  .eq("playlist_id", playlistID);
              }
            }
          });

        // Delete
        await supabase
          .from("Songs_Playlists")
          .delete()
          .eq("playlist_id", playlistID)
          .eq("song_id", song_id)
          .then(async (result) => {
            //setListRef(songs);
            window.location.reload();
            CloseSongContextMenu();
          });
      };

      remove();
    } else {
      // Safeguard from modifying
      alert("Violation");
      window.location.reload();
    }
  }

  // Removes song from everything and deletes files.
  function DeleteSong() {
    //console.log("gay: " + songContext.currentSongID);
    let del = async () => {
      if (isPlaylistOwner && playlistType == "Album") {
        SwitchToPopup("uploadingWait");

        // Get every playlist this is a part of.
        // await supabase
        //   .from("Songs_Playlists")
        //   .select("playlist_id")
        //   .eq("song_id", songContext.currentSongID)
        //   .then(async (result) => {
        //     console.log(result);

        //     if (result.data != null)
        //     {
        //       // Iterate over every playlist
        //       for (let i = 0; i < result.data.length; i++)
        //       {
        //         let pid = result.data[i].playlist_id;

        //         // Fetch the playlist
        //         await supabase
        //         .from("Songs_Playlists")
        //         .select("*")
        //         .eq("playlist_id", pid)
        //         .order("order")
        //         .then(async (result) => {
        //           console.log(result);

        //           if (result.data != null) {
        //             let index = result.data?.findIndex(
        //               (item) => songContext.currentSongID == item.song_id
        //             );
        //             console.log(index);

        //             // Decrement all above values
        //             for (let j = index + 1; j < result.data?.length; j++) {
        //               await supabase
        //                 .from("Songs_Playlists")
        //                 .update({ order: j })
        //                 .eq("song_id", (result.data[j] as any).song_id--)
        //                 .eq("playlist_id", pid);
        //             }
        //           }
        //         }).;
        //       }
        //     }
        //   });
        // Get selected playist

        // Delete from Song table
        await supabase
          .from("Songs")
          .delete()
          .eq("id", songContext.currentSongID)
          .then(async () => {
            // Remove file associated with it.
            await supabase.storage
              .from("music-files")
              .remove(["audio-files/" + songContext.currentSongID]);

            window.location.reload();
          });
      } else {
        // Sometimes happens if the page hasn't fully loaded
        // Safeguard from modifying
        alert("Violation");
        window.location.reload();
      }
    };

    del();
  }

  return (
    <>
      <div
        className="contextButton"
        hidden={playlistType == "undefined" || !isPlaylistOwner}
      >
        <div>
          <div
            id="RemoveSong_Button"
            hidden={removeHidden}
            onClick={() => RemoveSong(songContext.currentSongID)}
          >
            Remove Song
          </div>
          <div
            id="DeleteSong_Button"
            hidden={deleteHidden}
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
