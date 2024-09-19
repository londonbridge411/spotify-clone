import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import supabase from "../../config/supabaseClient";

import "./Playlist.css";
import Popup from "../Containers/Popup";
import { authUserID, email, username } from "../../main";
import * as uuid from "uuid";
import {
  setIsPlaying,
  enqueue,
  setProperQueue,
  setSongID,
  shufflePlay,
  clearFullQueue,
} from "../../PlayerSlice";
import { useDispatch } from "react-redux";
import SongRow from "../Containers/SongRow";
import "../Containers/SongTable.css";
import { SwitchToPopup } from "../../PopupControl";
import MobileSongRow from "../Containers/MobileSongRow";
import FastSongRow from "../Containers/FastSongRow";

export var setListRef: any;

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

  const [hideTable, setHideTable] = useState(true);
  const [loading, setLoading] = useState(true);

  const [backgroundUrl, setBG_URL] = useState("");
  const [coverUrl, setCover_URL] = useState(
    "../../../src/assets/small_record.svg"
  );
  const [list, setList] = useState([]);

  //----------------------------------------------------
  const [fastList, setFastList] = useState([] as any[]);

  // Inital Set
  useEffect(() => {
    let fetch = async () => {
      await supabase
        .from("Playlists")
        .select(
          "song_ids, owner_id, cover_url, name, type, bg_url, Users!Playlists_owner_id_fkey(username)"
        )
        .eq("id", playlistID)
        .then(async (result) => {
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
            setOwner(authUserID == row.owner_id);
            setList(row.song_ids);

            await supabase
              .rpc("getsongs", {
                song_ids: result.data?.at(0)?.song_ids,
              })
              .then(async (result2) => {
                //console.log(result2);
                setFastList(result2.data);

                setLoading(false);
                if (result2.data.length == 0) {
                  setHideTable(true);
                } else {
                  setHideTable(false);
                }
              });
          }
        });
    };

    fetch();
  }, []);

  // On song order change
  useEffect(() => {
    let fetch = async () => {
      supabase
        .rpc("getsongs", {
          song_ids: list,
        })
        .then(async (result2) => {
          setFastList(result2.data);
        });
    };

    fetch();
  }, [list]);

  //----------------------------------------------------

  useEffect(() => {
    let fetch = async () => {
      await supabase
        .from("Subscribed_Playlists")
        .select("*")
        .eq("subscriber", authUserID)
        .eq("playlist_id", playlistID)
        .then((result) => {
          setIsFollowing(result.data?.length! > 0);
        });
    };

    fetch();
  }, [playlistID]);

  // Song List
  setListRef = setList;

  function FollowPlaylist() {
    if (isFollowing == false && isOwner == false) {
      // Add subscribed user into user row
      supabase
        .from("Subscribed_Playlists")
        .insert({ subscriber: authUserID, playlist_id: playlistID })
        .then(() => {
          setIsFollowing(true);
        });
    }
  }

  function UnfollowPlaylist() {
    if (isFollowing == true && isOwner == false) {
      // Remove user as a sub
      supabase
        .from("Subscribed_Playlists")
        .delete()
        .eq("subscriber", authUserID)
        .eq("playlist_id", playlistID)
        .then(() => {
          setIsFollowing(false);
        });
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
              className="mobile-hidden"
              src="../../../src/assets/edit_button.png"
              hidden={!isOwner}
              onClick={() => {
                SwitchToPopup("uploadPlaylistEdit");
              }}
            />

            <img
              className="mobile-hidden"
              src="../../../src/assets/add_button.png"
              hidden={!isOwner || playlistType == "Playlist"}
              onClick={() => {
                SwitchToPopup("uploadSongPopup");
              }}
            />

            <img
              src="../../../src/assets/play_button.png"
              onClick={() => {
                if (list != null) dispatch(clearFullQueue());

                dispatch(setProperQueue(list));
                dispatch(setSongID(list[0]));

                dispatch(setIsPlaying(true));
              }}
            />

            <img
              src="../../../src/assets/shuffle_button.png"
              onClick={() => {
                //dispatch(setPlaylistSongs(list as string[]));
                dispatch(clearFullQueue());
                //for (let i = 0; i < list.length; i++) {
                //  dispatch(addToEndOfQueue(list[i]));
                //}
                dispatch(setProperQueue(list as string[]));
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
              hidden={playlistPrivacy == "Private"}
              src="../../../src/assets/share.png"
              onClick={() => {
                SwitchToPopup("sharePlaylist");
                const url = location.href;
                navigator.clipboard.writeText(url);
              }}
            />
          </div>
          <main>
            <table className="song-table playlist-content mobile-hidden">
              <thead>
                <tr>
                  <th>
                    <p style={{ color: "rgba(0, 0, 0, 0)", padding: "0" }}>p</p>
                  </th>
                  <th>Name</th>
                  <th>Views</th>
                  <th>Album</th>
                  <th>Created</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                </tr>

                {fastList.map((item) => {
                  //Do list.map if doing OG <SongRow>
                  // item broke somehow
                  return (
                    // <SongRow
                    //   key={item}
                    //   song_id={item}
                    //   song_list={list}
                    //   forceUpdate={[coverUrl, playlistName, playlistPrivacy]}
                    // />
                    <FastSongRow
                      key={item.song_id}
                      song_data={item}
                      song_list={list}
                      forceUpdate={[coverUrl, playlistName, playlistPrivacy]}
                    />
                  );
                })}
              </tbody>
            </table>

            <div className="mobile-view mobile-song-view">
              {fastList.map((item) => {
                // item broke somehow
                return (
                  <MobileSongRow
                    key={item.song_id + "-mobile"}
                    song_data={item}
                    song_list={list}
                    forceUpdate={[coverUrl, playlistName, playlistPrivacy]}
                  />
                );
              })}
            </div>
            <div
              hidden={!hideTable}
              style={{
                textAlign: "center",
                marginTop: "25vh",
              }}
            >
              <img
                hidden={!loading}
                src="https://i.gifer.com/ZZ5H.gif"
                style={{ height: "35px", width: "35px" }}
              />
              <h2 hidden={loading}>No music</h2>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
