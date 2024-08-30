import { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import { authUserID, email } from "../../../main";
import PlaylistContainerHorizontal from "./PlaylistContainerHorizontal";
import "./PlaylistList.css";
import { CloseSongContextMenu } from "../ContextMenus/SongContextMenu";
import { useDispatch, useSelector } from "react-redux";
import { ClosePopup } from "../../../PopupControl";
import { RootState } from "../../../store";

export default function PlaylistList(props: any) {
  const [list, setList] = useState([]);
  const songContext = useSelector((state: RootState) => state.songContext);

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id")
      .eq("owner_id", authUserID)
      .eq("type", "Playlist")
      .then((result) => {
        var array = [];
        var myData = result.data;

        if (myData != null) {
          for (let i = 0; i < myData.length; i++) {
            array.push(myData.at(i)?.id);
          }

          setList(array as any);
        }
      });
  }, []);

  function AddToPlaylist(playlist_id: string, song_id: string) {
    const insertIntoTable = async () => {
      // Now we need to append ID to array in playlist

      await supabase
        .from("Playlists")
        .select("song_ids")
        .eq("id", playlist_id)
        .then(async (result) => {
          var array: string[] = result.data?.at(0)?.song_ids;

          console.log(array);
          console.log("ID: " + song_id);
          // Guard Statement
          if (array.includes(song_id)) return;

          console.log("Can add");
          array.push(song_id as string);

          await supabase
            .from("Playlists")
            .update({ song_ids: array })
            .eq("id", playlist_id);
        });
    };

    insertIntoTable();
    CloseSongContextMenu();
    ClosePopup();
  }
  return (
    <>
      <ul>
        {list.map((item) => (
          <li key={item}>
            <PlaylistContainerHorizontal
              onClick={() => AddToPlaylist(item!, songContext.currentSongID)}
              playlist_id={item}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
