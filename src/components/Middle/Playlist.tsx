import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../config/supabaseClient";

import "./Playlist.css";

import Popup from "../Containers/Popup";
import { email, isVerified } from "../../main";
import * as uuid from "uuid";
import MusicControl from "../Music Control";
import { setSongID, setSongList, shufflePlay } from "../../PlayerSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import pause from "../assets/circle-pause-solid.svg";
import ContextMenu, { ViewContextMenu } from "../Containers/ContextMenu";
import ContextMenuOption from "../Containers/ContextMenuOption";

export default function Playlist() {
  const dispatch = useDispatch();

  const { playlistID } = useParams();

  if (playlistID == null) return;
  const [playlistName, setPlaylistName] = useState(null);
  const [playlistAuthor, setPlaylistAuthor] = useState(null);
  const [playlistEmail, setPlaylistEmail] = useState(null);
  const [playlistType, setPlaylistType] = useState(null);

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

      <ContextMenu
        // About to leave but a thought is to store the selected song in a state
        id={"Song_ContextMenu"}
        html={
          <>
            <div>Add to playlist</div>
            <div>Favorite</div>
            <div>Remove from playlist</div>
            <div>Move Up</div>
            <div>Move Down</div>
            <div>Delete Song</div>
          </>
        }
        //requiresVerification={() => playlistType != "Playlist"}
      ></ContextMenu>
    </>
  );
}

export function SongRow(props: any) {
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
          let selectedID = e.currentTarget.getAttribute("id");
          console.log("ID is " + selectedID);

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
