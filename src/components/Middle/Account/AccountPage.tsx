import { useEffect, useState, useTransition } from "react";
import { User_GetFollowerCount, User_IsVerified } from "../../../User Controls";
import { email, isVerified, username } from "../../../main";
import "./AccountPage.css";
import Popup from "../../Containers/Popup";
import PlaylistCreation from "../../Containers/PlaylistCreation";
import PlaylistContainerHorizontal from "../../Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import PlaylistContainer from "../../Containers/PlaylistContainer";

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

  useEffect(() => {
    console.log("poop");
    if (!isVerified) {
      setPopupState_UploadSong(false);
    }
  }, [popupActive_UploadSong]);

  useEffect(() => {
    console.log("poop");
    if (isVerified) {
      setPopupState_Verification(false);
    }
  }, [popupActive_Verification]);

  useEffect(() => {
    User_GetFollowerCount(email).then((result) => setFollowers(result));
  }, []);

  console.log(isVerified);

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
            html={<div>Get Verified</div>}
            requiresVerification={false}
          ></Popup>
          <Popup
            id="Popup_UploadSong"
            active={popupActive_UploadSong}
            setActive={setPopupState_UploadSong}
            html={<PlaylistCreation />}
            requiresVerification={true}
          ></Popup>
    </>
  );
}
