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
  const [coverUrl, setCover_URL] = useState(
    "../../../src/assets/record-vinyl-solid.svg"
  );

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("name, cover_url")
      .eq("id", props.playlist_id)
      .then((result) => {
        setPlaylistName(result.data?.at(0)?.name);
        setCover_URL(
          result.data?.at(0)?.cover_url == ""
            ? "../../../src/assets/record-vinyl-solid.svg"
            : result.data?.at(0)?.cover_url
        );
      });
  }, []);

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
          <img src={coverUrl} />

          <div>
            <span>{playlistName}</span>
          </div>
        </div>
      </NavLink>

      <PlaylistContextMenu />
    </>
  );
}
