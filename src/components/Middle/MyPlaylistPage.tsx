import { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient";
import { authUserID, email } from "../../main";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
import "./Account/AccountPage.css";
import "./MyPlaylistPage.css";
import Popup from "../Containers/Popup";
import PlaylistCreation from "../Containers/Popups/PlaylistCreation";
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
        let resultList = result.data?.at(0)?.subscribed_playlists;

        var array = [];

        if (resultList != null || resultList.length == 0) {
          for (let i = 0; i < resultList.length; i++) {
            array.push(resultList.at(i));
          }

          setSharedList(array);
        }
      });
  }, []);

  const [popupActive_UploadPlaylist, setPopupState_UploadPlaylist] =
    useState(false);

  return (
    <>
      <div className="myPlaylists-layout">
        <header>header</header>
        <main>
          <button
            onClick={() => {
              setPopupState_UploadPlaylist(true);
            }}
          >
            Create Playlist
          </button>
          <section>
            <h2> My Playlists:</h2>
            <ul className="myAlbums">
              {list.map((item) => (
                <li key={item}>
                  <PlaylistContainer playlist_id={item} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2> Shared Playlists:</h2>
            <ul className="myAlbums">
              {sharedList.map((item) => (
                <li key={item}>
                  <PlaylistContainer playlist_id={item} />
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      <Popup
        id="Popup_UploadPlaylist"
        active={popupActive_UploadPlaylist}
        setActive={setPopupState_UploadPlaylist}
        canClose={true}
        html={<PlaylistCreation playlistType={"Playlist"} />}
        requiresVerification={false}
      ></Popup>
    </>
  );
}
