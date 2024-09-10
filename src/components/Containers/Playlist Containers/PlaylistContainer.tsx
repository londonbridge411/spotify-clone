import { useEffect, useState } from "react";
import supabase from "../../../config/supabaseClient";
import "./PlaylistContainer.css";
import "../../../Links.css";
import "../../../mobile.css";
import { NavLink, useNavigate } from "react-router-dom";
import PlaylistContextMenu, {
  ViewPlaylistContextMenu,
} from "../ContextMenus/PlaylistContextMenu";

export default function PlaylistContainer(props: any) {
  if (props.playlist_id == null) return;

  const [playlistName, setPlaylistName] = useState("Loading...");
  const [artistName, setArtistName] = useState("Loading...");
  const [artistID, setArtistID] = useState("");
  const [coverUrl, setCover_URL] = useState(
    "../../../src/assets/small_record.svg"
  );

  const navigate = useNavigate();
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("name, owner_id, cover_url, Users(username)")
      .eq("id", props.playlist_id)
      .then((result) => {
        setPlaylistName(result.data?.at(0)?.name);
        setCover_URL(
          result.data?.at(0)?.cover_url == ""
            ? "../../../src/assets/small_record.svg"
            : result.data?.at(0)?.cover_url
        );
        setArtistID(result.data?.at(0)?.owner_id);

        var userData: any = result.data?.at(0)?.Users;
        setArtistName(userData.username);
      });
  }, []);

  //
  return (
    <>
      <NavLink
        className="PlaylistContainerParent"
        to={"/app/playlist/" + props.playlist_id}
      >
        <div
          className="PlaylistContainer"
          id={props.playlist_id}
          onContextMenu={(e) => {
            e.preventDefault();

            // Don't even have to do this. Just send the song_id to state
            ViewPlaylistContextMenu("PlaylistContext_" + props.playlist_id, e);
          }}
        >
          <div className="pl-container-content">
            <img src={coverUrl} />
            <div className="pl-container-name_holder">{playlistName}</div>
            <div
              className="customLink"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigate("../account/" + artistID);
              }}
            >
              {artistName}
            </div>
          </div>
        </div>
      </NavLink>

      <PlaylistContextMenu playlistID={props.playlist_id} />
    </>
  );
}
