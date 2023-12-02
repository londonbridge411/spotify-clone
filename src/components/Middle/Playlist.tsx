import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../config/supabaseClient";

import "./Playlist.css";
import Popup from "../Containers/Popup";
import { email, isVerified } from "../../main";
import * as uuid from "uuid";

export default function Playlist() {
  const { playlistID } = useParams();
  const [picID, setPicID] = useState(null);
  const [bgID, setBgID] = useState(2);
  const [playlistName, setPlaylistName] = useState(null);
  const [playlistAuthor, setPlaylistAuthor] = useState(null);
  const [playlistEmail, setPlaylistEmail] = useState(null);
  const [playlistType, setPlaylistType] = useState(null);

  const [popupActive_UploadSong, setPopupState_UploadSong] = useState(false);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("*")
      .eq("id", playlistID)
      .then((result) => {
        var row = result.data?.at(0);

        if (row != null) {
          setPicID(row.image_id);
          setPlaylistName(row.name);
          setPlaylistType(row.type);
          setBgID(row.background_id);
          setPlaylistEmail(row.owner);

          supabase
            .from("Users")
            .select("username")
            .eq("email", row.owner)
            .then((result) => setPlaylistAuthor(result.data?.at(0)?.username));
        }
      });
  }, []);

  const coverUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/covers/" + picID);

  const backgroundUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/backgrounds/" + bgID);

  function UploadSong() {
    const uploaded_song = (
      document.getElementById("uploaded_song") as HTMLInputElement
    ).files![0];

    let id = uuid.v4();

    if (uploaded_song != null) {
      const a = async () => {
        var song_name = document.getElementById(
          "upload-song-name"
        ) as HTMLInputElement;
        var song_name_text = song_name?.value;
        await supabase.from("Songs").insert({
          id: id,
          title: song_name_text,
          owner: email,
          album_id: parseInt(playlistID!),
        });

        await supabase.storage
          .from("music-files")
          .upload("/audio-files/" + id, uploaded_song, {
            cacheControl: "3600",
            upsert: false,
          });

        setPopupState_UploadSong(false);

        /*
        await supabase
          .from("Playlists")
          .select("song_ids")
          .eq("id", parseInt(playlistID!)).then((result) => () result.data?.at(0)?.song_ids)
        */
       /*
              await supabase.from("Playlists").update({
                song_ids: 
            }).eq("id", parseInt(playlistID!))*/
      };

      a();
    }
  }

  return (
    <>
      <div
        className="playlist-page"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,1)), " +
            "url(" +
            backgroundUrl.data.publicUrl +
            ")",
        }}
      >
        <div className="Playlist-Layout">
          <div className="playlistHeader">
            <img src={coverUrl.data.publicUrl} />
            <div className="info">
              <h1>{playlistName}</h1>
              <h2>{playlistAuthor}</h2>
              <h2>{playlistType}</h2>
            </div>
          </div>

          <div className="playlist-content">
            <button
              hidden={email != playlistEmail}
              onClick={() => setPopupState_UploadSong(email == playlistEmail)}
            >
              Add Song
            </button>
          </div>
        </div>
        <Popup
          id="uploadSongPopup"
          active={popupActive_UploadSong}
          setActive={setPopupState_UploadSong}
          html={
            <div>
              <div id="upload-song-menu">
                <div>
                  <label>Name</label>
                  <input id="upload-song-name" />
                </div>

                <label>Upload Song</label>
                <input id="uploaded_song" type="file" accept="audio/mp3" />
                <button onClick={() => UploadSong()}>Upload</button>
              </div>
            </div>
          }
          requiresVerification={() => playlistType != "Playlist"}
        ></Popup>
      </div>
    </>
  );
}
