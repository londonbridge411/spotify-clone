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

//export var setListRef: any;

export default function Playlist() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [hideTable, setHideTable] = useState(true);
  const [loading, setLoading] = useState(true);

  const [list, setList] = useState([]);

  //----------------------------------------------------
  const [fastList, setFastList] = useState([] as any[]);

  // Inital Set
  useEffect(() => {
    let fetch = async () => {
      // Get liked song ids
      await supabase
        .from("Liked_Songs")
        .select()
        .eq("user_id", authUserID)
        .order("liked_at")
        .then(async (result: any) => {
          // Load ids into an array
          let id_arr = [];

          for (let i = 0; i < result.data?.length; i++) {
            id_arr.push(result.data[i].song_id);
          }

          await supabase
            .rpc("getsongs", {
              song_ids: id_arr,
            })
            .then(async (result2) => {
              setFastList(result2.data);

              let songIDs = [];

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
        });
    };

    fetch();
  }, []); // Maybe remove

  return (
    <>
      <div
        className="playlist-page"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,.6), rgba(0,0,0,1))",
        }}
      >
        <div className="Playlist-Layout">
          <header className="playlistHeader">
            <img src={"../../../src/assets/small_record.svg"} />
            <div className="info">
              <h1>Liked Songs</h1>
            </div>
          </header>

          <div className="playlist-button-bar">
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
                    forceUpdate={[]}
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
