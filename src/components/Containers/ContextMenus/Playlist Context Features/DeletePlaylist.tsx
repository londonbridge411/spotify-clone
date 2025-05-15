import supabase from "../../../../config/supabaseClient";
import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";
import { useState } from "react";

export let DeletePlaylist_Exported: any;

export default function ContextOption_DeletePlaylist(props: any) {
  DeletePlaylist_Exported = DeletePlaylist;

  const [id, setID] = useState("");
  // Removes song from everything and deletes files.
  function DeletePlaylist() {
    if (props.isOwner) {
      // Remove from each playlist that has it.

      //console.log("Deleting: " + props.target);
      SwitchToPopup("uploadingWait");
      supabase
        .from("Playlists")
        .select("*")
        .eq("id", props.target)
        .then(async (result) => {
          // Get the data
          const data = result.data?.at(0);

          //Delete images
          if (data.cover_url != "" || data.bg_url != "") {
            // Will throw error if wrong image. Ignore it

            // Remove cover
            await supabase.storage
              .from("music-files")
              .remove(["pictures/covers/" + props.target]);

            // Remove background
            await supabase.storage
              .from("music-files")
              .remove(["pictures/backgrounds/" + props.target]);
          }

          // Delete Each Song
          await supabase
            .from("Songs_Playlists")
            .select("song_id")
            .eq("playlist_id", props.target)
            .then(async (result) => {
              if (result?.data != null)
              {
                for (let i = 0; i < result.data.length; i++)
                  await DeleteSong(result.data[i].song_id);
              }

            })
          //

          // Delete Row
          console.log(props.target);
          await supabase
            .from("Playlists")
            .delete()
            .eq("id", props.target)
            .then(() => window.location.reload());
        });
    } else {
      // Sometimes happens if the page hasn't fully loaded
      // Safeguard from modifying
      alert("Violation");
      window.location.reload();
    }
  }

  async function DeleteSong(song_id: string) {
    // Remove from each playlist that has it.

    await supabase.storage.from("music-files").remove(["audio-files/" + song_id]);
  }

  return (
    <>
      <div className="contextButton" hidden={props.isOwner == false}>
        <div>
          <div
            onClick={() => {
              setID(props.target);
              console.log(id);
              CloseSongContextMenu();
              SwitchToPopup("DeletePlaylist");
            }}
          >
            Delete Playlist
          </div>
        </div>
      </div>
    </>
  );
}
