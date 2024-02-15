import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import supabase from "../../config/supabaseClient";

import "./Playlist.css";

import Popup from "../Containers/Popup";
import { authUserID, email, username } from "../../main";
import * as uuid from "uuid";
import { setSongID, setSongList, shufflePlay } from "../../PlayerSlice";
import { useDispatch } from "react-redux";
import SongRow from "../Containers/SongRow";
import ContextMenuOption from "../Containers/ContextMenuOption";
import SongContextMenu from "../Containers/ContextMenus/SongContextMenu";
import PlaylistEdit, {
  CustomInputField,
} from "../Containers/Popups/PlaylistEdit";
import SearchBar from "../SearchBar";
import { UploadSongPopup } from "../Containers/Popups/UploadSongPopup";

export default function Playlist() {
  const dispatch = useDispatch();

  const { playlistID } = useParams();

  if (playlistID == null) return;

  const [isOwner, setOwner] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("owner_id")
      .eq("id", playlistID)
      .then((result) => {
        setOwner(authUserID == result.data?.at(0)?.owner_id);
      });
  }, [playlistID]);

  const [playlistPrivacy, setPlaylistPrivacy] = useState("");

  useEffect(() => {
    supabase
      .from("Playlists")
      .select("privacy_setting, owner_id")
      .eq("id", playlistID)
      .then(async (result) => {
        var row = result.data?.at(0);
        if (row != null) {
          setPlaylistPrivacy(row.privacy_setting);
          if (row.owner_id != authUserID && row.privacy_setting == "Private") {
            navigate("/app/home");
          }
        }
      });
  }, [playlistID]);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistAuthor, setPlaylistAuthor] = useState("Loading...");
  const [playlistAuthorID, setPlaylistAuthorID] = useState("");
  const [playlistType, setPlaylistType] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  const [popupActive_Share, setPopupState_Share] = useState(false);
  const [hideTable, setHideTable] = useState(true);

  const [backgroundUrl, setBG_URL] = useState("");
  const [coverUrl, setCover_URL] = useState(
    "../../../src/assets/small_record.svg"
  );

  const [popupActive_Edit, setPopupState_Edit] = useState(false);

  const [popupActive_UploadSong, setPopupState_UploadSong] = useState(false);
  useEffect(() => {
    console.log("Updating");
    supabase
      .from("Playlists")
      .select("name, type, bg_url, cover_url, owner_id, Users(username)")
      .eq("id", playlistID)
      .then((result) => {
        var row = result.data?.at(0);
        var user_data: any = result.data?.at(0)?.Users;

        if (row != null) {
          setPlaylistName(row.name);
          setPlaylistType(row.type);
          setBG_URL(row.bg_url);
          setPlaylistAuthorID(row.owner_id);
          setCover_URL(
            row.cover_url == ""
              ? "../../../src/assets/small_record.svg"
              : row.cover_url
          );

          setPlaylistAuthor(user_data.username);
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

  // Make it so songs in private (not unlisted playlists) are hidden
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("song_ids")
      .eq("id", playlistID)
      .then(async (result) => {
        var myData = result.data?.at(0)?.song_ids;

        var songs: string[] = [];

        if (playlistType == "Playlist") {
          for (let i = 0; i < myData.length; i++) {
            await supabase
              .from("Songs")
              .select("album_id")
              .eq("id", myData.at(i))
              .then(async (result2) => {
                let albumID = result2.data?.at(0)?.album_id;

                await supabase
                  .from("Playlists")
                  .select("privacy_setting")
                  .eq("id", albumID)
                  .then((result3) => {
                    let setting = result3.data?.at(0)?.privacy_setting;

                    if (setting != "Private") {
                      songs.push(myData.at(i));
                    }
                  });
              });
          }
        } else {
          songs = myData;
        }

        if (songs.length == 0) {
          setHideTable(true);
        } else {
          setHideTable(false);
          setList(songs as any);
        }
      });
  }, [playlistID]);

  /*const coverUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("pictures/covers/" + playlistID);*/

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
            <div>{list.length}</div>
            <div className="info">
              <h1>{playlistName}</h1>
              <NavLink to={"../account/" + playlistAuthorID}>
                <h2>{playlistAuthor}</h2>
              </NavLink>
              <h2 className="text-regular">
                {playlistPrivacy + " " + playlistType}
              </h2>
            </div>
          </header>

          <div className="playlist-button-bar">
            <img
              src="../../../src/assets/edit_button.png"
              hidden={!isOwner}
              onClick={() => {
                setPopupState_Edit(true);
              }}
            />

            <img
              src="../../../src/assets/add_button.png"
              hidden={!isOwner || playlistType == "Playlist"}
              onClick={() => {
                setPopupState_UploadSong(isOwner);
              }}
            />

            <img
              src="../../../src/assets/play_button.png"
              onClick={() => {
                dispatch(setSongList(list as string[]));
                dispatch(setSongID(list[0]));
              }}
            />

            <img
              src="../../../src/assets/shuffle_button.png"
              onClick={() => {
                dispatch(setSongList(list as string[]));
                dispatch(shufflePlay());
              }}
            />

            <img
              src="../../../src/assets/bookmark_button.png"
              hidden={isOwner || isFollowing}
              onClick={FollowPlaylist}
            />

            <img
              src="../../../src/assets/unbookmark.png"
              hidden={!isFollowing}
              onClick={UnfollowPlaylist}
            />

            <img
              src="../../../src/assets/share.png"
              onClick={() => {
                setPopupState_Share(true);
                const url = location.href;
                navigator.clipboard.writeText(url);
              }}
            />
          </div>
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
                  return (
                    <SongRow
                      key={item}
                      song_id={item}
                      song_list={list}
                      forceUpdate={[coverUrl, playlistName, playlistPrivacy]}
                    />
                  );
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
        html={<UploadSongPopup setActive={setPopupState_UploadSong} />}
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
            setPrivacy={setPlaylistPrivacy}
            set
          />
        }
        requiresVerification={() => playlistType != "Playlist"}
      ></Popup>

      <Popup
        id="sharePlaylist"
        active={popupActive_Share}
        setActive={setPopupState_Share}
        canClose={true}
        html={<div>Copied link to clipboard.</div>}
      />
    </>
  );
}
