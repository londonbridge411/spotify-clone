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

          // Delete followers
          await supabase
            .from("Users")
            .select("id, subscribed_playlists")
            .contains("subscribed_playlists", [props.target])
            .then(async (result) => {
              const subs = result.data;

              if (subs != null) {
                //console.log(subs);
                for (let i = 0; i < subs?.length; i++) {
                  //console.log(subs.at(i)?.subscribed_playlists);

                  const subbed_playlists: string[] =
                    subs.at(i)?.subscribed_playlists;

                  subbed_playlists.splice(
                    subbed_playlists.indexOf(props.target),
                    1
                  );

                  //console.log(subbed_playlists);
                  console.log("Passed"); //Good
                  await supabase
                    .from("Users")
                    .update({ subscribed_playlists: subbed_playlists })
                    .eq("id", subs.at(i)?.id);
                }
              }
            });

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

    await supabase
      .from("Playlists")
      .select("id, song_ids")
      .contains("song_ids", [song_id])
      .then(async (result) => {
        const playlists_with_song: object[] = result.data!;

        for (let i = 0; i < playlists_with_song.length; i++) {
          // Printing out the first list
          const songs: any = playlists_with_song[i];
          songs.song_ids.splice(songs.song_ids.indexOf(song_id), 1); // Remove the song from the index

          await supabase
            .from("Playlists")
            .update({ song_ids: songs.song_ids })
            .eq("id", songs.id);
        }

        // Remove Song from Songs Table
        await supabase.from("Songs").delete().eq("id", song_id);

        // Remove file associated with it.
        supabase.storage.from("music-files").remove(["audio-files/" + song_id]);

        //window.location.reload();
      });
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
