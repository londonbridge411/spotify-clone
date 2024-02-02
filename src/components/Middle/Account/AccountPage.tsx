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

  //if (isOwner) console.log("I am the owner");
  // Account stuff
  const [getFollowerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userVerified, setVerified] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    supabase
      .from("Users")
      .select("subscribers, is_verified, username")
      .eq("id", userID)
      .then((result) => {
        setFollowerCount(result.data?.at(0)?.subscribers.length);
        setVerified(result.data?.at(0)?.is_verified);
        setUsername(result.data?.at(0)?.username);

        setIsFollowing(result.data?.at(0)?.subscribers.includes(authUserID));
      });
  }, [userID]);

  const [albumList, setAlbumList] = useState([null]);

  const [playlistList, setPlaylistList] = useState([null]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id, type, private")
      .eq("owner_id", userID)
      .then((result) => {
        var albums = [];
        var playlists = [];
        var myData = result.data;

        if (myData != null) {
          for (let i = 0; i < myData.length; i++) {
            // If private ignore
            if (myData.at(i)?.private) continue;

            if (myData.at(i)?.type == "Album") {
              albums.push(myData.at(i)?.id);
            } else if (myData.at(i)?.type == "Playlist") {
              playlists.push(myData.at(i)?.id);
            }
          }

          setAlbumList(albums);
          setPlaylistList(playlists);
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
      <div className="account-layout">
        <header>
          <h1>{username}</h1>
        </header>
        <main>
          <div className="profileStats">
            <p> Verified: {`${userVerified}`}</p>
            <p> Followers: {getFollowerCount}</p>
          </div>

          <button
            hidden={isOwner || isFollowing}
            onClick={() => {
              FollowUser();
            }}
          >
            Follow
          </button>

          <button
            hidden={!isFollowing}
            onClick={() => {
              UnfollowUser();
            }}
          >
            Unfollow
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

          <section>
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
                  style={{ width: "150px", height: "100px", cursor: "pointer" }}
                  hidden={!userVerified || !isOwner}
                  onClick={() => {
                    setPopupState_UploadPlaylist(userVerified);
                  }}
                />
              </li>
            </ul>
          </section>

          <section>
            <h2>Public Playlists:</h2>
            <ul className="myAlbums">
              {playlistList.map((item) => (
                <li key={item}>
                  <PlaylistContainer playlist_id={item} />
                </li>
              ))}

              <li className="addPlaylist">
                <img
                  src="../../../src/assets/circle-plus-solid.svg"
                  style={{ width: "150px", height: "100px", cursor: "pointer" }}
                  hidden={!userVerified || !isOwner}
                  onClick={() => {
                    setPopupState_UploadPlaylist(userVerified);
                  }}
                />
              </li>
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
