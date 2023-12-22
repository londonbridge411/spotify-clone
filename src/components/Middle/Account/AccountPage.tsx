import { useEffect, useState, useTransition } from "react";
import { User_GetFollowerCount, User_IsVerified } from "../../../User Controls";
import { email, isVerified, username } from "../../../main";
import "./AccountPage.css";
import Popup from "../../Containers/Popup";
import PlaylistCreation from "../../Containers/Popups/PlaylistCreation";
import PlaylistContainerHorizontal from "../../Containers/Playlist Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import PlaylistContainer from "../../Containers/Playlist Containers/PlaylistContainer";

/*
Want to display icon, username, bio, followers, isVerified, upload song.
*/

export default function AccountPage() {
  const [list, setList] = useState([null]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id")
      .eq("owner", email)
      .eq("type", "Album")
      .then((result) => {
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

  const [getFollowers, setFollowers] = useState(0);

  const [popupActive_Verification, setPopupState_Verification] =
    useState(false);
  const [popupActive_UploadSong, setPopupState_UploadSong] = useState(false);

  const [popupActive_UploadPlaylist, setPopupState_UploadPlaylist] =
    useState(false);

  useEffect(() => {
    if (!isVerified) {
      setPopupState_UploadSong(false);
    }
  }, [popupActive_UploadSong]);

  useEffect(() => {
    if (isVerified) {
      setPopupState_Verification(false);
    }
  }, [popupActive_Verification]);

  useEffect(() => {
    if (isVerified) {
      setPopupState_Verification(false);
    }
  }, [popupActive_UploadPlaylist]);

  useEffect(() => {
    User_GetFollowerCount(email).then((result) => setFollowers(result));
  }, []);

  return (
    <>
      <div className="account-layout">
        <header>
          <h1>{username}</h1>
        </header>
        <main>
          <div className="profileStats">
            <p> Verified: {`${isVerified}`}</p>
            <p> Followers: {getFollowers}</p>
          </div>

          {/*Changes depending on verification level*/}
          <button
            hidden={isVerified}
            onClick={() => {
              setPopupState_Verification(!isVerified);
            }}
          >
            Get Verified
          </button>
          <button
            hidden={!isVerified}
            onClick={() => {
              setPopupState_UploadSong(isVerified);
            }}
          >
            Upload Song
          </button>

          <button
            hidden={!isVerified}
            onClick={() => {
              setPopupState_UploadPlaylist(isVerified);
            }}
          >
            Create Album
          </button>

          <section>
            <h2> My Music:</h2>
            <ul className="myAlbums">
              {list.map((item) => (
                <li key={item}>
                  <PlaylistContainer playlist_id={item} />
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      <Popup
        id="Popup_Verification"
        active={popupActive_Verification}
        setActive={setPopupState_Verification}
        canClose={true}
        html={<div>Get Verified</div>}
        requiresVerification={false}
      ></Popup>

      <Popup
        id="Popup_UploadSong"
        active={popupActive_UploadSong}
        setActive={setPopupState_UploadSong}
        canClose={true}
        html={<PlaylistCreation />}
        requiresVerification={true}
      ></Popup>

      <Popup
        id="Popup_UploadPlaylist"
        active={popupActive_UploadPlaylist}
        setActive={setPopupState_UploadPlaylist}
        canClose={true}
        html={<PlaylistCreation playlistType={"Album"} />}
        requiresVerification={true}
      ></Popup>
    </>
  );
}
