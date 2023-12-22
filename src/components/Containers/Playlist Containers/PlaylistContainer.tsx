import { useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";
import "./PlaylistContainer.css";
import { NavLink } from "react-router-dom";
import PlaylistContextMenu, {
  ViewPlaylistContextMenu,
} from "../ContextMenus/PlaylistContextMenu";
import ContextMenuOption from "../ContextMenuOption";

export default function PlaylistContainer(props: any) {
  if (props.playlist_id == null) return;

  const [playlistName, setPlaylistName] = useState(null);

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("name")
      .eq("id", props.playlist_id)
      .then((result) => {
        setPlaylistName(result.data?.at(0)?.name);
      });
  }, []);

  const publicUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/covers/" + props.playlist_id);

  //
  return (
    <>
      <NavLink to={"/app/playlist/" + props.playlist_id}>
        <div
          className="PlaylistContainer"
          id={props.playlist_id}
          onContextMenu={(e) => {
            e.preventDefault();

            // Don't even have to do this. Just send the song_id to state
            ViewPlaylistContextMenu("Playlist_ContextMenu", e);
          }}
        >
          <img src={publicUrl.data.publicUrl} />
          <div>
            <span>{playlistName}</span>
          </div>
        </div>
      </NavLink>

      <PlaylistContextMenu />
    </>
  );
}
