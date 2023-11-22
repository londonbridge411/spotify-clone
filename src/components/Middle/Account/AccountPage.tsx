import { useEffect, useState, useTransition } from "react";
import { User_GetFollowerCount, User_IsVerified } from "../../../User Controls";
import { email, isVerified, username } from "../../../main";
import "./AccountPage.css";
import Popup from "../../Containers/Popup";

/*
Want to display icon, username, bio, followers, isVerified, upload song.
*/

export default function AccountPage() {
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
          <h1>Account</h1>
        </header>
        <main>
          <h2> Username: {username}</h2>
          <p> Verified: {`${isVerified}`}</p>
          <p> Followers: {getFollowers}</p>
          <div> Email: {email}</div>

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
            html={<div>Upload Song</div>}
            requiresVerification={true}
          ></Popup>
        </main>
      </div>
    </>
  );
}
