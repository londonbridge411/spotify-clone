import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../config/supabaseClient";

import "./Playlist.css";

import Popup from "../Containers/Popup";
import { authUserID, email } from "../../main";
import * as uuid from "uuid";
import { setSongID, setSongList, shufflePlay } from "../../PlayerSlice";
import { useDispatch } from "react-redux";
import SongRow from "../Containers/SongRow";
import ContextMenuOption from "../Containers/ContextMenuOption";
import SongContextMenu from "../Containers/ContextMenus/SongContextMenu";
import PlaylistEdit from "../Containers/Popups/PlaylistEdit";

export default function Playlist() {
  const dispatch = useDispatch();

  const { playlistID } = useParams();

  if (playlistID == null) return;

  const [isOwner, setOwner] = useState(false);

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("owner_id")
      .eq("id", playlistID)
      .then((result) => {
        setOwner(authUserID == result.data?.at(0)?.owner_id);
        if (isOwner) console.log("I own this");
      });
  }, [playlistID]);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistAuthor, setPlaylistAuthor] = useState("");
  const [playlistOwner, setPlaylistOwner] = useState("");
  const [playlistType, setPlaylistType] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [songContextID, setSongContextID] = useState("");

  const [hideTable, setHideTable] = useState(true);

  const [backgroundUrl, setBG_URL] = useState("");
  const [coverUrl, setCover_URL] = useState(
    "../../../src/assets/small_record.svg"
  );

  const [popupActive_UploadingWait, setPopupState_UploadingWait] =
    useState(false);

  const [popupActive_Edit, setPopupState_Edit] = useState(false);

  const [popupActive_UploadSong, setPopupState_UploadSong] = useState(false);
  useEffect(() => {
    console.log("Updating");
    supabase
      .from("Playlists")
      .select("*")
      .eq("id", playlistID)
      .then((result) => {
        var row = result.data?.at(0);
        if (row != null) {
          setPlaylistName(row.name);
          setPlaylistType(row.type);
          setBG_URL(row.bg_url);
          setCover_URL(
            row.cover_url == ""
              ? "../../../src/assets/small_record.svg"
              : row.cover_url
          );

          //setPlaylistOwner(row.owner);

          supabase
            .from("Users")
            .select("username")
            .eq("id", row.owner_id)
            .then((result) => setPlaylistAuthor(result.data?.at(0)?.username));
        }
      });
  }, [playlistID]);

  useEffect(() => {
    supabase
      .from("Users")
      .select("subscribed_playlists")
      .eq("id", authUserID)
      .then((result) => {
        setIsFollowing(
          result.data?.at(0)?.subscribed_playlists.includes(playlistID)
        );
      });
  }, [playlistID]);

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
          if (myData.length == 0) {
            setHideTable(true);
          } else {
            setHideTable(false);
            setList(myData);
          }
        }
      });
  }, [playlistID]);

  /*const coverUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/covers/" + playlistID);*/

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
            owner_id: (await supabase.auth.getUser()).data.user?.id,
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

  function FollowPlaylist() {
    if (isFollowing == false && isOwner == false) {
      // Add subscribed user into user row
      supabase
        .from("Users")
        .select("subscribed_playlists")
        .eq("id", authUserID)
        .then(async (result) => {
          let list: string[] = result.data?.at(0)?.subscribed_playlists;

          list.push(playlistID as string);

          await supabase
            .from("Users")
            .update({ subscribed_playlists: list })
            .eq("id", authUserID);
        });

      setIsFollowing(true);
    }
  }

  function UnfollowPlaylist() {
    if (isFollowing == true && isOwner == false) {
      // Remove user as a sub
      supabase
        .from("Users")
        .select("subscribed_playlists")
        .eq("id", authUserID)
        .then(async (result) => {
          let list: string[] = result.data?.at(0)?.subscribed_playlists;

          list.splice(list.indexOf(playlistID as string), 1);

          await supabase
            .from("Users")
            .update({ subscribed_playlists: list })
            .eq("id", authUserID);
        });

      setIsFollowing(false);
    }
  }

  //list = [""]
  return (
    <>
      <div
        className="playlist-page"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,1)), " +
            "url(" +
            backgroundUrl +
            ")",
        }}
      >
        <div className="Playlist-Layout">
          <header className="playlistHeader">
            <img src={coverUrl} />
            <div className="info">
              <h1>{playlistName}</h1>
              <h2>{playlistAuthor}</h2>
              <h2>{playlistType}</h2>
            </div>
          </header>
          <button
            hidden={!isOwner}
            onClick={() => {
              setPopupState_Edit(true);
            }}
          >
            Edit
          </button>
          <button
            hidden={!isOwner || playlistType == "Playlist"}
            onClick={() => setPopupState_UploadSong(isOwner)}
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

          <button
            hidden={isOwner || isFollowing}
            onClick={() => {
              FollowPlaylist();
            }}
          >
            Follow
          </button>

          <button
            hidden={!isFollowing}
            onClick={() => {
              UnfollowPlaylist();
            }}
          >
            Unfollow
          </button>
          <main>
            <div hidden={hideTable} className="playlist-content">
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
            </div>
            <div
              hidden={!hideTable}
              style={{
                textAlign: "center",
                marginTop: "25vh",
              }}
            >
              <h2>No music</h2>
            </div>
          </main>
        </div>
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
      <Popup
        id="uploadPlaylistEdit"
        active={popupActive_Edit}
        setActive={setPopupState_Edit}
        canClose={true}
        html={
          <PlaylistEdit
            setName={setPlaylistName}
            setCover={setCover_URL}
            setBG={setBG_URL}
          />
        }
        requiresVerification={() => playlistType != "Playlist"}
      ></Popup>
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
