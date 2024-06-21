import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import supabase from "../../config/supabaseClient";

import "./Playlist.css";

import Popup from "../Containers/Popup";
import { authUserID, email, username } from "../../main";
import * as uuid from "uuid";
import {
  setIsPlaying,
  addToEndOfQueue,
  setSongID,
  shufflePlay,
} from "../../PlayerSlice";
import { useDispatch } from "react-redux";
import SongRow from "../Containers/SongRow";
import { SwitchToPopup } from "../../PopupControl";

export var setListRef: any;

export default function Playlist() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [hideTable, setHideTable] = useState(true);
  const [loading, setLoading] = useState(true);

  const [backgroundUrl, setBG_URL] = useState("");
  const [coverUrl, setCover_URL] = useState(
    "../../../src/assets/small_record.svg"
  );

  // Song List
  const [list, setList] = useState([]);

  setListRef = setList;
  // Make it so songs in private (not unlisted playlists) are hidden
  useEffect(() => {
    let update = async () => {
      setHideTable(true);
      setLoading(true);

      /*
      Get list of songs in playlist that are public.
      If current user is owner, show even if priv
      */

      let userID_JSON = JSON.stringify(authUserID);
      await supabase
        .rpc("getlikedsongs", {
          user_id: userID_JSON,
        })
        .then((result) => {
          console.log(result);

          setLoading(false);

          if (result.data.length == 0) {
            setHideTable(true);
          } else {
            setHideTable(false);

            let arr = [];
            for (let i = 0; i < result.data.length; i++) {
              arr.push(result.data[i].songid);
            }
            setList(arr as any);
          }
        });
    };

    update();
  }, []);

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
              <h1>Liked Songs</h1>
            </div>
          </header>

          <div className="playlist-button-bar">
            <img
              src="../../../src/assets/play_button.png"
              onClick={() => {
                //dispatch(setPlaylistSongs(list as string[]));
                for (let i = 0; i < list.length; i++) {
                  dispatch(addToEndOfQueue(list[i]));
                }
                dispatch(setSongID(list[0]));
                dispatch(setIsPlaying(true));
              }}
            />

            <img
              src="../../../src/assets/shuffle_button.png"
              onClick={() => {
                //dispatch(setPlaylistSongs(list as string[]));
                for (let i = 0; i < list.length; i++) {
                  dispatch(addToEndOfQueue(list[i]));
                }
                dispatch(shufflePlay());
              }}
            />
          </div>
          <main>
            <div hidden={hideTable} className="playlist-content">
              <div className="song-table">
                <div style={{ color: "rgba(0, 0, 0, 0)" }}>
                  ?<hr></hr>
                </div>
                <div className="text-bold">
                  Name <hr></hr>
                </div>
                <div className="text-bold">
                  Views <hr></hr>
                </div>
                <div className="text-bold">
                  Album <hr></hr>
                </div>
                <div className="text-bold">
                  Created <hr></hr>
                </div>
                <div className="text-bold">
                  Duration <hr></hr>
                </div>

                {list.map((item) => {
                  // item broke somehow
                  return <SongRow key={item} song_id={item} song_list={list} />;
                })}
              </div>
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
