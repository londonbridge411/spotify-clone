import { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient";
import { authUserID } from "../../main";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
import "./Account/AccountPage.css";
import "./MyPlaylistPage.css";
import { SwitchToPopup } from "../../PopupControl";

export default function MyPlaylistPage() {
  const [list, setList] = useState([null]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id")
      .eq("owner_id", authUserID)
      .eq("type", "Playlist")
      .then(async (result) => {
        var array = [];
        var myData = result.data;

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
    supabase
      .from("Users")
      .select("subscribed_playlists")
      .eq("id", authUserID)
      .then(async (result) => {
        // Collection of Playlist IDs
        let resultList = result.data?.at(0)?.subscribed_playlists;

        var array: any[] = [];

        if (resultList != null || resultList?.length == 0) {
          for (let i = 0; i < resultList.length; i++) {
            await supabase
              .from("Playlists")
              .select("privacy_setting")
              .eq("id", resultList.at(i))
              .then((result2) => {
                if (result2.data?.at(0)?.privacy_setting != "Private") {
                  array.push(resultList.at(i));
                }
              });
          }

          setSharedList(array);
        }
      });
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
              <h2> My Playlists</h2>
              <div className="myAlbums">
                <li className="addPlaylist">
                  <img
                    src="../../../src/assets/circle-plus-solid.svg"
                    style={{
                      width: "150px",
                      height: "100px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      SwitchToPopup("Popup_UploadPlaylist");
                    }}
                  />
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
