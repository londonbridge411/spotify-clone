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

  const [playlistName, setPlaylistName] = useState("loading...");
  const [artistName, setArtistName] = useState("loading...");
  const [artistID, setArtistID] = useState("");
  const [coverUrl, setCover_URL] = useState(
    "../../../src/assets/small_record.svg"
  );

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("name, owner_id, cover_url")
      .eq("id", props.playlist_id)
      .then((result) => {
        setPlaylistName(result.data?.at(0)?.name);
        setCover_URL(
          result.data?.at(0)?.cover_url == ""
            ? "../../../src/assets/small_record.svg"
            : result.data?.at(0)?.cover_url
        );
        setArtistID(result.data?.at(0)?.owner_id);
        supabase
          .from("Users")
          .select("username")
          .eq("id", result.data?.at(0)?.owner_id)
          .then((result) => {
            setArtistName(result.data?.at(0)?.username);
          });
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
          <div className="pl-container-content">
            <img src={coverUrl} />
            <div className="pl-container-name_holder">{playlistName}</div>
            <NavLink to={"../account/" + artistID}>{artistName}</NavLink>
          </div>
        </div>
      </NavLink>

      <PlaylistContextMenu />
    </>
  );
}

/*
              <span>{playlistName}</span>

*/
