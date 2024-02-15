import { useEffect, useState, useTransition } from "react";
import "./AccountPage.css";
import Popup from "../../Containers/Popup";
import PlaylistCreation from "../../Containers/Popups/PlaylistCreation";
import supabase from "../../../config/supabaseClient";
import PlaylistContainer from "../../Containers/Playlist Containers/PlaylistContainer";
import { useParams } from "react-router-dom";
import { authUserID, email, isVerified } from "../../../main";
import AccountEdit from "../../Containers/Popups/AccountEdit";

/*
Want to display icon, username, bio, followers, isVerified, upload song.
*/

export default function AccountPage() {
  const { userID } = useParams();

  if (userID == null) return;

  let isOwner: boolean = false;
  isOwner = userID == authUserID;

  //if (isOwner) console.log("I am the owner");
  // Account stuff
  const [getFollowerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userVerified, setVerified] = useState(false);
  const [username, setUsername] = useState("");
  const [pfpUrl, setPfpUrl] = useState("../../../src/assets/default_user.png");
  const [popupActive_FollowingUser, setPopupActive_FollowingUser] =
    useState(false);

  const [popupActive_UnfollowingUser, setPopupActive_UnfollowingUser] =
    useState(false);

  const [popupActive_Edit, setPopupState_Edit] = useState(false);

  useEffect(() => {
    supabase
      .from("Users")
      .select("subscribers, is_verified, username, pfp_url")
      .eq("id", userID)
      .then((result) => {
        setFollowerCount(result.data?.at(0)?.subscribers.length);
        setVerified(result.data?.at(0)?.is_verified);
        setUsername(result.data?.at(0)?.username);

        setPfpUrl(
          result.data?.at(0)?.pfp_url != null &&
            result.data?.at(0)?.pfp_url != ""
            ? result.data?.at(0)?.pfp_url
            : "../../../src/assets/default_user.png"
        );
        setIsFollowing(result.data?.at(0)?.subscribers.includes(authUserID));
      });
  }, [userID, username]);

  const [albumList, setAlbumList] = useState([null]);

  const [playlistList, setPlaylistList] = useState([null]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id, type, privacy_setting")
      .eq("owner_id", userID)
      .then((result) => {
        var albums = [];
        var playlists = [];
        var myData = result.data;

        if (myData != null) {
          for (let i = 0; i < myData.length; i++) {
            //if ()
            // If private ignore
            //if (myData.at(i)?.privacy_setting == ) continue;

            if (
              (myData.at(i)?.privacy_setting == "Unlisted" ||
                myData.at(i)?.privacy_setting == "Private") &&
              isOwner == false
            ) {
              continue;
            }

            if (myData.at(i)?.type == "Album") {
              albums.push(myData.at(i)?.id);
            } else if (
              myData.at(i)?.type == "Playlist" &&
              myData.at(i)?.privacy_setting == "Public"
            ) {
              playlists.push(myData.at(i)?.id);
            }
          }

          setAlbumList(albums);
          setPlaylistList(playlists);
        }
      });
  }, [userID]);

  const [popupActive_Share, setPopupState_Share] = useState(false);

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

  function FollowUser() {
    if (isFollowing == false && isOwner == false) {
      // Add user as a sub
      supabase
        .from("Users")
        .select("subscribers")
        .eq("id", userID)
        .then(async (result) => {
          let subs: string[] = result.data?.at(0)?.subscribers;

          subs.push(authUserID as string);

          await supabase
            .from("Users")
            .update({ subscribers: subs })
            .eq("id", userID);
        });

      // Add subscribed user into user row
      supabase
        .from("Users")
        .select("subscribed_artists")
        .eq("id", authUserID)
        .then(async (result) => {
          let subbed_artists: string[] = result.data?.at(0)?.subscribed_artists;

          subbed_artists.push(userID as string);

          await supabase
            .from("Users")
            .update({ subscribed_artists: subbed_artists })
            .eq("id", authUserID);
        });

      setIsFollowing(true);
      setPopupActive_FollowingUser(true);
    }
  }

  function UnfollowUser() {
    if (isFollowing == true && isOwner == false) {
      // Remove user as a sub
      supabase
        .from("Users")
        .select("subscribers")
        .eq("id", userID)
        .then(async (result) => {
          let subs: string[] = result.data?.at(0)?.subscribers;

          subs.splice(subs.indexOf(authUserID as string), 1);

          await supabase
            .from("Users")
            .update({ subscribers: subs })
            .eq("id", userID);
        });

      // Remove subscribed user into user row
      supabase
        .from("Users")
        .select("subscribed_artists")
        .eq("id", authUserID)
        .then(async (result) => {
          let subbed_artists: string[] = result.data?.at(0)?.subscribed_artists;

          subbed_artists.splice(subbed_artists.indexOf(userID as string), 1);

          await supabase
            .from("Users")
            .update({ subscribed_artists: subbed_artists })
            .eq("id", authUserID);
        });

      setIsFollowing(false);
    }
  }

  return (
    <>
      <div className="account-page">
        <div className="account-layout">
          <header>
            <img
              style={{
                height: "150px",
                width: "150px",
                background: "black",
                filter: "drop-shadow(0 0 0.75rem black)",
                borderRadius: "50%",
              }}
              src={pfpUrl}
            />

            <div className="info">
              <div className="profileName">
                <h1>{username}</h1>
                <img
                  src="../../../src/assets/square-check-regular.svg"
                  style={{
                    width: "50px",
                    height: "50px",
                    filter: "sepia(79%) saturate(1000%) hue-rotate(86deg)",
                  }}
                  hidden={!userVerified}
                />
              </div>

              <h2>Followers: {getFollowerCount}</h2>
            </div>
          </header>
          <div className="playlist-button-bar">
            <img
              src="../../../src/assets/edit_button.png"
              hidden={!isOwner}
              onClick={() => {
                setPopupState_Edit(true);
              }}
            />

            <img
              src="../../../src/assets/add_person.png"
              hidden={isOwner || isFollowing}
              onClick={FollowUser}
            />

            <img
              src="../../../src/assets/unadd_person.png"
              hidden={!isFollowing}
              onClick={() => setPopupActive_UnfollowingUser(true)}
            />

            <img
              src="../../../src/assets/share.png"
              onClick={() => {
                setPopupState_Share(true);
                const url = location.href;
                navigator.clipboard.writeText(url);
              }}
            />
          </div>
          <main>
            {/*Changes depending on verification level*/}
            <button
              hidden={userVerified || !isOwner}
              onClick={() => {
                setPopupState_Verification(!userVerified);
              }}
            >
              Get Verified
            </button>

            <section hidden={albumList.length == 0}>
              <h2>Albums:</h2>
              <ul className="myAlbums">
                {albumList.map((item) => (
                  <li key={item}>
                    <PlaylistContainer playlist_id={item} />
                  </li>
                ))}

                <li className="addPlaylist">
                  <img
                    src="../../../src/assets/circle-plus-solid.svg"
                    style={{
                      width: "150px",
                      height: "100px",
                      cursor: "pointer",
                    }}
                    hidden={!userVerified || !isOwner}
                    onClick={() => {
                      setPopupState_UploadPlaylist(userVerified);
                    }}
                  />
                </li>
              </ul>
            </section>

            <section hidden={playlistList.length == 0}>
              <h2>Public Playlists:</h2>
              <ul className="myAlbums">
                {playlistList.map((item) => (
                  <li key={item}>
                    <PlaylistContainer playlist_id={item} />
                  </li>
                ))}
              </ul>
            </section>
          </main>
        </div>
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

      <Popup
        id="Popup_FollowingUser"
        active={popupActive_FollowingUser}
        setActive={setPopupActive_FollowingUser}
        canClose={true}
        html={<div>You are now following {username}.</div>}
      ></Popup>

      <Popup
        id="Popup_UnfollowingUser"
        active={popupActive_UnfollowingUser}
        setActive={setPopupActive_UnfollowingUser}
        canClose={false}
        html={
          <>
            <div>Are you sure you want to unfollow {username}?</div>
            <button
              onClick={() => {
                UnfollowUser();
                setPopupActive_UnfollowingUser(false);
              }}
            >
              Yes
            </button>
            <button onClick={() => setPopupActive_UnfollowingUser(false)}>
              No
            </button>
          </>
        }
      ></Popup>

      <Popup
        id="account-edit"
        active={popupActive_Edit}
        setActive={setPopupState_Edit}
        canClose={true}
        html={
          <>
            <AccountEdit setName={setUsername} setPFP={setPfpUrl} />
          </>
        }
        requiresVerification={() => isOwner == true}
      ></Popup>

      <Popup
        id="shareAccount"
        active={popupActive_Share}
        setActive={setPopupState_Share}
        canClose={true}
        html={<div>Copied link to clipboard.</div>}
      />
    </>
  );
}
