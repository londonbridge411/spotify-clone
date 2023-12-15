import { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import "./PlaylistContainer.css";
import { NavLink } from "react-router-dom";

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
        <div className="PlaylistContainer">
          <img src={publicUrl.data.publicUrl} />
          <div>
            <span>{playlistName}</span>
          </div>
        </div>
      </NavLink>
    </>
  );
}
