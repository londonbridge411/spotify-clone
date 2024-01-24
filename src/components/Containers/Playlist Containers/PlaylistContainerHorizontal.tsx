import { useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";
import "./PlaylistContainerHorizontal.css";

export default function PlaylistContainerHorizontal(props: any) {
  const [playlistName, setPlaylistName] = useState();
  const [coverUrl, setCover_URL] = useState("");

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("name, cover_url")
      .eq("id", props.playlist_id)
      .then((result) => {
        setPlaylistName(result.data?.at(0)?.name);
        setCover_URL(result.data?.at(0)?.cover_url);
      });
  }, []);

  console.log("asasdf " + playlistName);

  return (
    <>
      <div className="PlaylistContainerHorizontal" onClick={props.onClick!}>
        <img src={coverUrl} />
        <p>{playlistName}</p>
      </div>
    </>
  );
}
