import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import supabase from "../../config/supabaseClient";

import "./Playlist.css";
import { authUserID } from "../../main";
import {
  setIsPlaying,
  setProperQueue,
  setSongID,
  shufflePlay,
  clearFullQueue,
} from "../../PlayerSlice";
import { useDispatch } from "react-redux";
import "../Containers/SongTable.css";
import { SwitchToPopup } from "../../PopupControl";
import MobileSongRow from "../Containers/MobileSongRow";
import FastSongRow from "../Containers/FastSongRow";

import EditPlaylistBtn from "../../../src/assets/edit_button.png";
import AddButton from "../../../src/assets/add_button.png";
import ShareBtn from "../../../src/assets/share.png";
import BookmarkBtn from "../../../src/assets/bookmark_button.png";
import UnbookmarkBtn from "../../../src/assets/unbookmark.png";
import ShuffleBtn from "../../../src/assets/shuffle_button.png";
import PlayBtn from "../../../src/assets/play_button.png";

//export var setListRef: any;

export default function Playlist() {
  const dispatch = useDispatch();

  const { playlistID } = useParams();

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
        const row = result.data?.at(0);
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
    const fetch = async () => {
      await supabase
        .from("Playlists")
        .select(
          "owner_id, cover_url, name, type, bg_url, Users!Playlists_owner_id_fkey(username)"
        )
        .eq("id", playlistID)
        .then(async (result) => {
          const row = result.data?.at(0);
          const user_data: any = result.data?.at(0)?.Users;

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

            // Check that playlist order is normal (No jumps from deletion)
            await supabase
              .from("Songs_Playlists")
              .select()
              .eq("playlist_id", playlistID)
              .order("order")
              .then(async (result) => {
                //console.log(result);

                if (result.data != null) {
                  for (let i = 0; i < result.data.length; i++) {
                    // Means order mismatch from deletion/removal
                    if (result.data[i].order != i) {
                      console.log("MISMATCH at " + i + ". Fixing order");
                      // Decrement all above values
                      for (
                        let j = i, n = 0;
                        j < result.data?.length;
                        j++, n++
                      ) {
                        await supabase
                          .from("Songs_Playlists")
                          .update({ order: j + n })
                          .eq("song_id", (result.data[j] as any).song_id)
                          .eq("playlist_id", playlistID)
                          .order("order");
                      }
                    }
                  }
                }
              });

            // Get playlist song data
            await supabase
              .rpc("getsongs", {
                playlistid: playlistID,
              })
              .then(async (result2) => {
                setFastList(result2.data);

                const songIDs = [];

                for (let i = 0; i < result2.data.length; i++) {
                  songIDs.push(result2.data?.at(i).song_id);
                }

                setList(songIDs as any);
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
  }, [coverUrl, playlistName, playlistPrivacy]); // Maybe remove

  // On song order change
  useEffect(() => {
    const fetch = async () => {
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
    const fetch = async () => {
      await supabase
        .from("Subscribed_Playlists")
        .select("*")
        .eq("subscriber", authUserID)
        .eq("playlist_id", playlistID)
        .then((result) => {
          setIsFollowing(result.data!.length > 0);
        });
    };

    fetch();
  }, [playlistID]);

  if (playlistID == null) return;

  // Song List
  //setListRef = setList;

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
              src={EditPlaylistBtn}
              hidden={!isOwner}
              onClick={() => {
                SwitchToPopup("uploadPlaylistEdit");
              }}
            />

            <img
              className="mobile-hidden"
              src={AddButton}
              hidden={!isOwner || playlistType == "Playlist"}
              onClick={() => {
                SwitchToPopup("uploadSongPopup");
              }}
            />

            <img
              src={PlayBtn}
              onClick={() => {
                if (list != null) dispatch(clearFullQueue());

                dispatch(setProperQueue(list));
                dispatch(setSongID(list[0]));

                dispatch(setIsPlaying(true));
              }}
            />

            <img
              src={ShuffleBtn}
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
              src={BookmarkBtn}
              hidden={isOwner || isFollowing}
              onClick={FollowPlaylist}
            />

            <img
              src={UnbookmarkBtn}
              hidden={!isFollowing}
              onClick={UnfollowPlaylist}
            />

            <img
              hidden={playlistPrivacy == "Private"}
              src={ShareBtn}
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
                    />
                  );
                })}
              </tbody>
            </table>

            <div className="mobile-view mobile-song-view">
              {fastList.map((item) => {
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
