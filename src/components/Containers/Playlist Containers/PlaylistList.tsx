import { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import { authUserID } from "../../../main";
import PlaylistContainerHorizontal from "./PlaylistContainerHorizontal";
import "./PlaylistList.css";
import { CloseSongContextMenu } from "../ContextMenus/SongContextMenu";
import { useSelector } from "react-redux";
import { ClosePopup } from "../../../PopupControl";
import { RootState } from "../../../store";

export default function PlaylistList() {
  const [list, setList] = useState([]);
  const songContext = useSelector((state: RootState) => state.songContext);

  const song_id = songContext.currentSongID;
  CloseSongContextMenu();

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id")
      .eq("owner_id", authUserID)
      .eq("type", "Playlist")
      .then((result) => {
        const array = [];
        const myData = result.data;

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
        .from("Songs_Playlists")
        .select("*")
        .eq("playlist_id", playlist_id)
        .then(async (result) => {
          const dataCount = result.data?.length;
          const pos = dataCount != null && dataCount != 0 ? dataCount : 0;

          await supabase
            .from("Songs_Playlists")
            .insert({
              song_id: song_id,
              playlist_id: playlist_id,
              order: pos,
            })
            .then(() => {
              CloseSongContextMenu();
              ClosePopup();
            });
        });
    };

    insertIntoTable();
  }

  return (
    <>
      <ul>
        {list.map((item) => (
          <PlaylistContainerHorizontal
            key={item}
            onClick={() => AddToPlaylist(item!, song_id)}
            playlist_id={item}
          />
        ))}
      </ul>
    </>
  );
}
