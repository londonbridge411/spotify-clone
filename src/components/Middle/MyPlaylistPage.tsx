import { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient";
import { authUserID } from "../../main";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
import "./Account/AccountPage.css";
import "./MyPlaylistPage.css";
import "../AddPlaylistButton.css";
import { SwitchToPopup } from "../../PopupControl";
import { useNavigate } from "react-router-dom";

export default function MyPlaylistPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([null]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id")
      .eq("owner_id", authUserID)
      .eq("type", "Playlist")
      .order("created_at")
      .then(async (result) => {
        const array = [];
        const myData = result.data;

        if (myData != null) {
          for (let i = 0; i < myData.length; i++) {
            array.push(myData.at(i)?.id);
          }

          setList(array);
        }
      });
  }, []);

  const [sharedList, setSharedList] = useState([null]);
  useEffect(() => {
    const get = async () => {
      await supabase
        .from("Subscribed_Playlists")
        .select(
          "playlist_id, privacy:Playlists!Subscribed_Playlists_playlist_id_fkey(privacy_setting)"
        )
        .eq("subscriber", authUserID)
        .then(async (result) => {
          // Collection of Playlist IDs
          const array: any[] = [];

          if (result.data!.length > 0) {
            for (let i = 0; i < result.data!.length; i++) {
              const row = result.data!.at(i) as any;

              if (row?.privacy.privacy_setting != "Private") {
                array.push(row?.playlist_id);
              }
            }

            setSharedList(array);
          }
        });
    };

    get();
  }, []);

  return (
    <>
      <div className="myPlaylists-page">
        <div className="myPlaylists-layout">
          <header>
            <h1>Playlists</h1>
          </header>

          <main>
            <section>
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <h2> My Playlists</h2>
                <img
                  className="addPlaylist"
                  src="../../../src/assets/circle-plus-solid.svg"
                  onClick={() => {
                    SwitchToPopup("Popup_UploadPlaylist");
                  }}
                />
              </div>

              <div className="myAlbums">
                <li className="addPlaylist">
                  <img
                    src="../../../src/assets/star-solid.svg"
                    style={{
                      width: "150px",
                      height: "100px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate("liked-songs/");
                    }}
                  />
                  <h3></h3>
                </li>
                {list.map((item) => (
                  <li key={item}>
                    <PlaylistContainer playlist_id={item} />
                  </li>
                ))}
              </div>
            </section>

            <section>
              <h2> Shared Playlists</h2>
              <div className="myAlbums">
                {sharedList.map((item) => (
                  <li key={item}>
                    <PlaylistContainer playlist_id={item} />
                  </li>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
