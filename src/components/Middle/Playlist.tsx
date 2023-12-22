import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../config/supabaseClient";

import "./Playlist.css";

import Popup from "../Containers/Popup";
import { email } from "../../main";
import * as uuid from "uuid";
import { setSongID, setSongList, shufflePlay } from "../../PlayerSlice";
import { useDispatch } from "react-redux";
import SongRow from "../Containers/SongRow";
import ContextMenuOption from "../Containers/ContextMenuOption";
import SongContextMenu from "../Containers/ContextMenus/SongContextMenu";

export default function Playlist() {
  const dispatch = useDispatch();

  const { playlistID } = useParams();

  if (playlistID == null) return;
  const [playlistName, setPlaylistName] = useState(null);
  const [playlistAuthor, setPlaylistAuthor] = useState(null);
  const [playlistEmail, setPlaylistEmail] = useState(null);
  const [playlistType, setPlaylistType] = useState(null);

  const [songContextID, setSongContextID] = useState("");

  const [popupActive_UploadingWait, setPopupState_UploadingWait] =
    useState(false);

  const [popupActive_UploadSong, setPopupState_UploadSong] = useState(false);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("*")
      .eq("id", playlistID)
      .then((result) => {
        var row = result.data?.at(0);

        if (row != null) {
          setPlaylistName(row.name);
          setPlaylistType(row.type);
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
  const [list, setList] = useState([]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("song_ids")
      .eq("id", playlistID)
      .then((result) => {
        var myData = result.data?.at(0)?.song_ids;

        if (myData != null) {
          setList(myData);
        }
      });
  }, []);

  const coverUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/covers/" + playlistID);

  const backgroundUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/backgrounds/" + playlistID);

  function UploadSong() {
    const uploaded_song = (
      document.getElementById("uploaded_song") as HTMLInputElement
    ).files![0];

    let id = uuid.v4();

    if (uploaded_song != null) {
      setPopupState_UploadingWait(true);
      const insertIntoTable = async () => {
        var song_name = document.getElementById(
          "upload-song-name"
        ) as HTMLInputElement;

        var song_name_text = song_name?.value;

        await supabase
          .from("Songs")
          .insert({
            id: id,
            title: song_name_text,
            owner: email,
            album_id: playlistID!,
            created_at: new Date(),
          })
          .then((result) => console.log(result.error));

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

            array.push(id as string);

            await supabase
              .from("Playlists")
              .update({ song_ids: array })
              .eq("id", playlistID);

            window.location.reload();
          });
      };

      insertIntoTable();
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

          <button
            onClick={() => {
              dispatch(setSongList(list as string[]));
              dispatch(setSongID(list[0]));
            }}
          >
            Play
          </button>

          <button
            onClick={() => {
              dispatch(setSongList(list as string[]));
              dispatch(shufflePlay());
            }}
          >
            Shuffle
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
                // item broke somehow
                return <SongRow key={item} song_id={item} song_list={list} />;
              })}
            </ul>
          </main>
        </div>

        <Popup
          id="uploadSongPopup"
          active={popupActive_UploadSong}
          setActive={setPopupState_UploadSong}
          canClose={true}
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

      <Popup
        id="uploadingWait"
        active={popupActive_UploadingWait}
        setActive={setPopupState_UploadingWait}
        canClose={false}
        html={<div>Uploading Song</div>}
        requiresVerification={() => playlistType != "Playlist"}
      ></Popup>
    </>
  );
}

/*
 Goes in on right click

          var menu = document.getElementById(
            "Song_ContextMenu-" + props.id
          ) as HTMLElement;
          menu.style.setProperty("display", "block");
          menu.style.setProperty("--mouse-x", e.clientX + "px");
          menu.style.setProperty("--mouse-y", e.clientY + "px");




      <ContextMenu
        songName={songName}
        id={"Song_ContextMenu-" + props.id}
        html={
          <>
            <ContextMenuOption html={<div>Add to playlist</div>} />

            <div>Favorite</div>
            <div>Remove from playlist</div>
            <div>Move Up</div>
            <div>Move Down</div>
            <div>Delete Song</div>
          </>
        }
        //requiresVerification={() => playlistType != "Playlist"}
      ></ContextMenu>


  */
