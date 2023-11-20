import { useEffect, useState } from "react";
import { User_GetFollowerCount, User_IsVerified } from "../../../User Controls";
import { email, username } from "../../../main";
import "./AccountPage.css";
import Popup from "../../Containers/Popup";

/*
Want to display icon, username, bio, followers, isVerified, upload song.
*/

export default function AccountPage() {
  const [getFollowers, setFollowers] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [popupActive, setPopupState] = useState(false);

  useEffect(() => {
    User_GetFollowerCount(email).then((result) => setFollowers(result));

    User_IsVerified(email).then((result) => setIsVerified(result));
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
          <button hidden={isVerified}>Get Verified</button>
          <button hidden={!isVerified} onClick={() => setPopupState(true)}>
            Upload Song
          </button>
          <Popup
            active={popupActive}
            setActive={setPopupState}
            html={<div>Put Popup Here</div>}
          ></Popup>
        </main>
      </div>
    </>
  );
}
