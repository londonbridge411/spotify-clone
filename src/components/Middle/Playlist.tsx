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

  // Song List
  const [list, setList] = useState([null]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("song_ids")
      .eq("owner", email)
      .then((result) => {
        var myData = result.data?.at(0)?.song_ids;

        if (myData != null) {
          setList(myData);
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
      const insertIntoTable = async () => {
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

        // Now we need to append ID to array in playlist

        await supabase
          .from("Playlists")
          .select("song_ids")
          .eq("id", playlistID)
          .then(async (result) => {
            var array: string[] = result.data?.at(0)?.song_ids;

            array.push(id);

            console.log(array);
            await supabase
              .from("Playlists")
              .update({ song_ids: array })
              .eq("id", playlistID);

            console.log(array);
          });
      };

      insertIntoTable();
    }
  }

  /*
                <div className="song-table-header">HEADR</div>
              <hr></hr>
              {list.map((item) => (
                <li key={item}>
                  <SongRow song_id={item} />
                </li>
              ))}
  */
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
          <header className="playlistHeader">
            <img src={coverUrl.data.publicUrl} />
            <div className="info">
              <h1>{playlistName}</h1>
              <h2>{playlistAuthor}</h2>
              <h2>{playlistType}</h2>
            </div>
          </header>
          <button
            hidden={email != playlistEmail}
            onClick={() => setPopupState_UploadSong(email == playlistEmail)}
          >
            Add Song
          </button>

          <main className="playlist-content">
            <ul className="song-table">
              <div style={{ color: "rgba(0, 0, 0, 0)" }}>
                ?<hr></hr>
              </div>
              <div className="text-bold">
                Name <hr></hr>
              </div>
              <div className="text-bold">
                Album <hr></hr>
              </div>
              <div className="text-bold">
                Created <hr></hr>
              </div>

              {list.map((item) => {
                console.log(item);
                // item broke somehow
                return <SongRow key={item} song_id={item} />;
              })}
            </ul>
          </main>
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

export function SongRow(props: any) {
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [albumCoverID, setAlbumCoverID] = useState("");

  var coverURL = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/covers/" + albumCoverID);
  coverURL.data.publicUrl;

  useEffect(() => {
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
            .select("image_id, name")
            .eq("id", row.album_id)
            .then((result) => {
              setAlbumCoverID(result.data?.at(0)?.image_id);
              setAlbumName(result.data?.at(0)?.name);
            });
        }
      });
  }, []);

  return (
    <div className="song-row">
      <div>
        <img src={coverURL.data.publicUrl} />
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
  );
}
