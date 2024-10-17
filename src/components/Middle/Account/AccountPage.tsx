import { useEffect, useState, useTransition } from "react";
import "./AccountPage.css";
import "../../AddPlaylistButton.css";
import Popup from "../../Containers/Popup";
import PlaylistCreation from "../../Containers/Popups/PlaylistCreation";
import supabase from "../../../config/supabaseClient";
import PlaylistContainer from "../../Containers/Playlist Containers/PlaylistContainer";
import { useParams } from "react-router-dom";
import { authUserID } from "../../../main";
import SongRow from "../../Containers/SongRow";
import { SwitchToPopup } from "../../../PopupControl";
import "../../../mobile.css";
import MobileSongRow from "../../Containers/MobileSongRow";
import FastSongRow from "../../Containers/FastSongRow";

/*
Want to display icon, username, bio, followers, isVerified, upload song.
*/

export var UnfollowUser_Exported: any;

export default function AccountPage() {
  const { userID } = useParams();

  if (userID == null) return;

  let isOwner: boolean = false;
  isOwner = userID == authUserID;

  // Account stuff
  const [getFollowerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userVerified, setVerified] = useState(false);
  const [username, setUsername] = useState("");
  const [pfpUrl, setPfpUrl] = useState("../../../src/assets/default_user.png");
  const [popularSongsList, setPopularSongsList] = useState([] as string[]);
  const [hideEverything, setHideEverything] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([] as any[]);

  useEffect(() => {
    let get = async () => {
      await supabase
        .from("Users")
        .select(
          "is_verified, username, pfp_url, sub_to:Subscribed_Artists!Subscribed_Artists_subscribed_to_fkey(subscribed_to), sub:Subscribed_Artists!Subscribed_Artists_subscriber_fkey(subscriber)"
        )

        //Subscribed_Artists!Subscribed_Artists_subscriber_fkey
        .eq("id", userID)
        .then((result) => {
          let row = result.data?.at(0);
          setFollowerCount((row?.sub_to as any[]).length);
          setVerified(row?.is_verified);
          setUsername(row?.username);

          setPfpUrl(
            row?.pfp_url != null && row?.pfp_url != ""
              ? row?.pfp_url
              : "../../../src/assets/default_user.png"
          );
        });
    };

    get();
  }, [userID, username]);

  // Set whether we are subscribed or not.
  useEffect(() => {
    let get = async () => {
      await supabase
        .from("Subscribed_Artists")
        .select("*")
        .eq("subscriber", authUserID)
        .eq("subscribed_to", userID)
        .then((result) => {
          setIsFollowing(result.data?.length! > 0);
        });
    };

    get();
  }, [userID, username]);

  // Exports the function so the popup control can see it.
  UnfollowUser_Exported = UnfollowUser;

  useEffect(() => {
    let update = async () => {
      setLoading(true);
      setHideEverything(true);
      setPopularSongsList([]);

      //user_id: '[{"id":' + userID + "}]" "{ user_id: a }"
      await supabase
        .rpc("selecttop5songs", { uid: userID })
        .then(async (result) => {
          var songs: string[] = [];

          for (let i = 0; i < result.data.length; i++) {
            songs.push(result.data?.at(i).songid);
          }

          setPopularSongsList(songs as string[]);

          await supabase
            .rpc("getsongs", {
              song_ids: songs,
            })
            .then(async (result2) => {
              setDataList(result2.data);
            });
        });

      setLoading(false);
      setHideEverything(false);
    };

    update();
  }, [userID, username]);

  const [albumList, setAlbumList] = useState([null]);

  const [playlistList, setPlaylistList] = useState([null]);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("id, type, privacy_setting")
      .eq("owner_id", userID)
      .order("created_at")
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
  }, [userID, username]);

  function FollowUser() {
    let push = async () => {
      if (isFollowing == false && isOwner == false) {
        await supabase
          .from("Subscribed_Artists")
          .insert({ subscriber: authUserID, subscribed_to: userID });

        setIsFollowing(true);
        SwitchToPopup("Popup_FollowingUser");
      }
    };

    push();
  }

  function UnfollowUser() {
    let remove = async () => {
      if (isFollowing == true && isOwner == false) {
        await supabase
          .from("Subscribed_Artists")
          .delete()
          .eq("subscriber", authUserID)
          .eq("subscribed_to", userID);

        setIsFollowing(false);
      }
    };

    remove();
  }

  return (
    <>
      <div className="account-page">
        <div className="account-layout" hidden={hideEverything}>
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
                SwitchToPopup("account-edit");
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
              onClick={() => SwitchToPopup("Popup_UnfollowingUser")}
            />

            <img
              src="../../../src/assets/share.png"
              onClick={() => {
                SwitchToPopup("shareAccount");
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
                SwitchToPopup("Popup_Verification");
              }}
            >
              Get Verified
            </button>

            {/*Popular Songs*/}
            <section hidden={popularSongsList.length == 0}>
              <h2>Popular Songs</h2>
              <div
                className="playlist-content mobile-hidden"
                style={{ display: "flex" }}
              >
                <table style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th>
                        <p
                          style={{
                            color: "rgba(0, 0, 0, 0)",
                            padding: "0 5px",
                          }}
                        >
                          p
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                    </tr>

                    {popularSongsList.map((item, index) => {
                      return (
                        <tr key={index + 1}>
                          <td>{index + 1}.</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <table className="song-table playlist-content mobile-hidden">
                  <thead>
                    <tr>
                      <th>
                        <p style={{ color: "rgba(0, 0, 0, 0)", padding: "0" }}>
                          p
                        </p>
                      </th>
                      <th>Name</th>
                      <th>Views</th>
                      <th>Album</th>
                      <th>Created</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                    </tr>
                    {dataList.map((item, index) => {
                      return (
                        <>
                          <FastSongRow
                            key={item.song_id}
                            song_data={item}
                            song_list={popularSongsList}
                          />
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mobile-view mobile-song-view">
                {dataList.map((item) => {
                  // item broke somehow
                  return (
                    <MobileSongRow
                      key={item.song_id + "-mobileA"}
                      song_data={item}
                      song_list={popularSongsList}
                    />
                  );
                })}
              </div>
            </section>

            {/*Albums*/}
            <section hidden={albumList.length == 0}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h2> Albums</h2>
                <img
                  className="addPlaylist mobile-hidden"
                  src="../../../src/assets/circle-plus-solid.svg"
                  hidden={!userVerified || !isOwner}
                  onClick={() => {
                    SwitchToPopup("Popup_UploadAlbum");
                  }}
                />
              </div>
              <div className="myAlbums">
                {albumList.map((item) => (
                  <li key={item}>
                    <PlaylistContainer playlist_id={item} />
                  </li>
                ))}
              </div>
            </section>
            {/*Public Playlists*/}
            <section hidden={playlistList.length == 0}>
              <h2>Public Playlists</h2>
              <div className="myAlbums">
                {playlistList.map((item) => (
                  <li key={item}>
                    <PlaylistContainer playlist_id={item} />
                  </li>
                ))}
              </div>
            </section>
          </main>
        </div>
        <div
          hidden={!hideEverything}
          style={{
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <img
            hidden={!loading}
            src="https://i.gifer.com/ZZ5H.gif"
            style={{ height: "35px", width: "35px" }}
          />
          <h2 hidden={loading}>No music</h2>
        </div>
      </div>
    </>
  );
}
