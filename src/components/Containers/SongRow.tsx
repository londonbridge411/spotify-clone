import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSongList, setSongID } from "../../PlayerSlice";
import supabase from "../../config/supabaseClient";
import { RootState } from "../../store";
import { ViewContextMenu } from "./ContextMenu";

// Song Row
export default function SongRow(props: any) {
    const [songName, setSongName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [albumName, setAlbumName] = useState("");
    const [dateCreated, setDateCreated] = useState("");
    const [albumCoverID, setAlbumCoverID] = useState("");
  
    const player = useSelector((state: RootState) => state.player);
    const dispatch = useDispatch();
  
    var coverURL =
      albumCoverID != ""
        ? supabase.storage
            .from("music-files")
            .getPublicUrl("pictures/covers/" + albumCoverID).data.publicUrl
        : "../../../src/assets/record-vinyl-solid.svg";
  
    useEffect(() => {
      if (props.song_id != null) {
        supabase
          .from("Songs")
          .select("*")
          .eq("id", props.song_id)
          .then(async (result) => {
            var row = result.data?.at(0);
  
            if (row != null) {
              setSongName(row.title);
              setDateCreated(row.created_at);
  
              await supabase
                .from("Playlists")
                .select("id, name")
                .eq("id", row.album_id)
                .then((result) => {
                  setAlbumCoverID(result.data?.at(0)?.id);
                  setAlbumName(result.data?.at(0)?.name);
                });
            }
          });
      }
    }, []);
  
    useEffect(() => {
      if (props.song_id == null) return;
      let nameArea = document.getElementById(props.song_id);
  
      if (player.song_id == nameArea?.id) {
        (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
          "src",
          "https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif"
        );
        (nameArea?.children[0].children[0] as HTMLElement).classList.add(
          "audioGIF"
        );
      } else {
        (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
          "src",
          coverURL
        );
        (nameArea?.children[0].children[0] as HTMLElement).classList.remove(
          "audioGIF"
        );
      }
      //.filter =
      //player.song_id == nameArea?.id ? "brightness(50%)" : "none";
  
      (nameArea?.children[1].children[0] as HTMLElement).style.color =
        player.song_id == nameArea?.id ? "#8DFFFF" : "#FFFFFF";
    }, [player.song_id]);
  
    useEffect(() => {
      if (props.song_id == null) return;
      let nameArea = document.getElementById(props.song_id);
  
      if (player.song_id == nameArea?.id) {
        if (player.isPlaying) {
          (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
            "src",
            "https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif"
          );
        } else {
          (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
            "src",
            "../../../src/assets/small-play.svg"
          );
        }
      }
    }, [player.isPlaying]);
  
    return (
      <>
        <div
          id={props.song_id}
          className="song-row"
          // On right click
          onContextMenu={(e) => {
            e.preventDefault();
  
            // Don't even have to do this. Just send the song_id to state
            ViewContextMenu("Song_ContextMenu", e);
          }}
          // On left click
          onClick={() => {
            dispatch(setSongList(props.song_list));
            dispatch(setSongID(props.song_id));
          }}
        >
          <div>
            <img
              src={
                player.song_id != props.song_id
                  ? coverURL
                  : "../../../src/assets/small-play.svg"
              }
            />
          </div>
          <div className="grid-item song-row-name">
            <div className="overflow-ellipsis text-bigger text-bold">
              {songName}
            </div>
            <div>Artist</div>
          </div>
          <div className="song-row-album">{albumName}</div>
          <div className="song-row-date">{dateCreated}</div>
        </div>
      </>
    );
  }