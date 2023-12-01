import { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import "./PlaylistContainerHorizontal.css";

export default function PlaylistContainerHorizontal(props: any) {
  const [picID, setPicID] = useState(1);
  const [playlistName, setPlaylistName] = useState(1);

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("name, image_id")
      .eq("id", props.playlist_id)
      .then((result) => {
        setPicID(result.data?.at(0)?.image_id);
        setPlaylistName(result.data?.at(0)?.name);
      });
  }, []);

  console.log("asasdf " + picID);

  const publicUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/" + picID);

  return (
    <>
      <div className="PlaylistContainerHorizontal">
        <img src={publicUrl.data.publicUrl} />
        <p>{playlistName}</p>
      </div>
    </>
  );
}
