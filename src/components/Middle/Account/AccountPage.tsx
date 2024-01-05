import { useEffect, useState, useTransition } from "react";
import "./AccountPage.css";
import Popup from "../../Containers/Popup";
import PlaylistCreation from "../../Containers/Popups/PlaylistCreation";
import supabase from "../../../config/supabaseClient";
import PlaylistContainer from "../../Containers/Playlist Containers/PlaylistContainer";
import { useParams } from "react-router-dom";
import { authUserID, email, isVerified } from "../../../main";

/*
Want to display icon, username, bio, followers, isVerified, upload song.
*/

export default function AccountPage() {
  const { userID } = useParams();

  if (userID == null) return;

  let isOwner: boolean = false;
  isOwner = userID == authUserID;

  if (isOwner) console.log("I am the owner");
  // Account stuff
  const [getFollowers, setFollowers] = useState(0);
  const [userVerified, setVerified] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    supabase
      .from("Users")
      .select("followers, is_verified, username")
      .eq("id", userID)
      .then((result) => {
        setFollowers(result.data?.at(0)?.followers);
        setVerified(result.data?.at(0)?.is_verified);
        setUsername(result.data?.at(0)?.username);
      });
  }, [userID]);

  const [list, setList] = useState([null]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id")
      .eq("owner_id", userID)
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
  }, [userID]);

  const [popupActive_Verification, setPopupState_Verification] =
    useState(false);

  const [popupActive_UploadPlaylist, setPopupState_UploadPlaylist] =
    useState(false);

  useEffect(() => {
    if (userVerified) {
      setPopupState_Verification(false);
    }
  }, [popupActive_Verification]);

  useEffect(() => {
    if (userVerified) {
      setPopupState_Verification(false);
    }
  }, [popupActive_UploadPlaylist]);

  return (
    <>
      <div className="account-layout">
        <header>
          <h1>{username}</h1>
        </header>
        <main>
          <div className="profileStats">
            <p> Verified: {`${userVerified}`}</p>
            <p> Followers: {getFollowers}</p>
          </div>

          <button
            hidden={isOwner}
            onClick={() => {
              // Do following stuff
            }}
          >
            Follow
          </button>

          {/*Changes depending on verification level*/}
          <button
            hidden={userVerified || !isOwner}
            onClick={() => {
              setPopupState_Verification(!userVerified);
            }}
          >
            Get Verified
          </button>

          <button
            hidden={!userVerified || !isOwner}
            onClick={() => {
              setPopupState_UploadPlaylist(userVerified);
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
        blockElement={!isOwner}
      ></Popup>

      <Popup
        id="Popup_UploadPlaylist"
        active={popupActive_UploadPlaylist}
        setActive={setPopupState_UploadPlaylist}
        canClose={true}
        html={<PlaylistCreation playlistType={"Album"} />}
        requiresVerification={true}
        blockElement={!isOwner}
      ></Popup>
    </>
  );
}
