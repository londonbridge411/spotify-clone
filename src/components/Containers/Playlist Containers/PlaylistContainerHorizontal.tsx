import { useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";
import "./PlaylistContainerHorizontal.css";

export default function PlaylistContainerHorizontal(props: any) {
  const [playlistName, setPlaylistName] = useState();

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("name")
      .eq("id", props.playlist_id)
      .then((result) => {
        setPlaylistName(result.data?.at(0)?.name);
      });
  }, []);

  console.log("asasdf " + playlistName);

  const publicUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/covers/" + props.playlist_id);

  return (
    <>
      <div className="PlaylistContainerHorizontal" onClick={props.onClick!}>
        <img src={publicUrl.data.publicUrl} />
        <p>{playlistName}</p>
      </div>
    </>
  );
}
