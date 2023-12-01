import { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import "./PlaylistContainer.css";

export default function PlaylistContainer(props: any) {
  const [picID, setPicID] = useState(1);
  const [playlistName, setPlaylistName] = useState(null);

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

  //
  return (
    <>
      <div className="PlaylistContainer">
        <img src={publicUrl.data.publicUrl} />
        <div>
          <span>{playlistName}</span>
        </div>
      </div>
    </>
  );
}
