import { useSelector, useDispatch } from "react-redux";
import { RootState, store } from "./store";
import { setPopup } from "./PopupSlice";
import Popup from "./components/Containers/Popup";
import PlaylistCreation from "./components/Containers/Popups/PlaylistCreation";
import AccountEdit from "./components/Containers/Popups/AccountEdit";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { UploadSongPopup } from "./components/Containers/Popups/UploadSongPopup";
import PlaylistEdit from "./components/Containers/Popups/PlaylistEdit";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { UnfollowUser_Exported } from "./components/Middle/Account/AccountPage";
import { DeleteSong_Exported } from "./components/Containers/ContextMenus/Song Context Features/RemoveDeleteSong";
import PlaylistList from "./components/Containers/Playlist Containers/PlaylistList";
import SongOrderList from "./components/Containers/Popups/SongOrderList";
import { DeletePlaylist_Exported } from "./components/Containers/ContextMenus/Playlist Context Features/DeletePlaylist";
import { RenameSongPopup } from "./components/Containers/Popups/RenameSongPopup";
import CustomInputField from "./components/CustomInputField";
import { RenamePlaylist_Exported } from "./components/Containers/ContextMenus/Playlist Context Features/RenamePlaylist";

// Used for things in-line here.

export function ClosePopup() {
  //const dispatch = useDispatch();
  store.dispatch(setPopup(""));
}

export function SwitchToPopup(key: string) {
  //const dispatch = useDispatch();
  store.dispatch(setPopup(key));
}

// {keyName : HTML}
var POPUP_MAP = new Map<string, any>([
  ["", ""],
  [
    "Popup_Verification",
    <Popup
      id="Popup_Verification"
      canClose={true}
      html={<div>Get Verified</div>}
      requiresVerification={false}
    ></Popup>,
  ],
  [
    "Popup_UploadAlbum",
    <Popup
      id="Popup_UploadPlaylist"
      canClose={true}
      html={<PlaylistCreation playlistType={"Album"} />}
      requiresVerification={true}
    ></Popup>,
  ],
  [
    "Popup_FollowingUser",
    <Popup
      id="Popup_FollowingUser"
      canClose={true}
      html={<div>You are now following.</div>}
    ></Popup>,
  ],
  [
    "Popup_UnfollowingUser",
    <Popup
      id="Popup_UnfollowingUser"
      canClose={false}
      html={
        <>
          <div>Are you sure you want to unfollow?</div>
          <button
            onClick={() => {
              UnfollowUser_Exported();
              ClosePopup();
            }}
          >
            Yes
          </button>
          <button onClick={() => ClosePopup()}>No</button>
        </>
      }
    />,
  ],
  [
    "account-edit",
    <Popup
      id="account-edit"
      canClose={true}
      html={
        <>
          <AccountEdit />
        </>
      }
    />,
  ],
  [
    "shareAccount",
    <Popup
      id="shareAccount"
      canClose={true}
      html={<div>Copied link to clipboard.</div>}
    />,
  ],
  [
    "uploadSongPopup",
    <Popup id="uploadSongPopup" canClose={true} html={<UploadSongPopup />} />,
  ],
  [
    "uploadPlaylistEdit",
    <Popup
      id="uploadPlaylistEdit"
      canClose={true}
      html={<PlaylistEdit />}
    ></Popup>,
  ],
  [
    "sharePlaylist",
    <Popup
      id="sharePlaylist"
      canClose={true}
      html={<div>Copied link to clipboard.</div>}
    />,
  ],
  [
    "uploadingWait",
    <Popup
      id="uploadingWait"
      canClose={false}
      html={
        <img
          src="https://i.gifer.com/ZZ5H.gif"
          style={{ height: "35px", width: "35px" }}
        />
      }
    />,
  ],
  [
    "Popup_UploadPlaylist",
    <Popup
      id="Popup_UploadPlaylist"
      canClose={true}
      html={<PlaylistCreation playlistType={"Playlist"} />}
    />,
  ],
  [
    "DeletePlaylist",
    <Popup
      id="DeletePlaylist"
      canClose={false}
      html={
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "300px",
              height: "125px",
            }}
          >
            <h2>Are you sure?</h2>
            <div>
              This will permanently delete the playlist and remove it from the
              platform.
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button onClick={() => DeletePlaylist_Exported()}>Yes</button>
              <button onClick={() => ClosePopup()}>No</button>
            </div>
          </div>
        </>
      }
    />,
  ],
  [
    "DeleteSong",
    <Popup
      id="DeleteSong"
      canClose={false}
      html={
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "300px",
              height: "125px",
            }}
          >
            <h2>Are you sure?</h2>
            <div>
              This will permanently delete the song and remove it from the
              platform.
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button
                onClick={() => {
                  const songContext = useSelector(
                    (state: RootState) => state.songContext
                  );
                  DeleteSong_Exported(songContext.currentSongID);
                }}
              >
                Yes
              </button>
              <button onClick={() => ClosePopup()}>No</button>
            </div>
          </div>
        </>
      }
    />,
  ],
  [
    "AddToPlaylist",
    <Popup
      id="AddToPlaylist"
      canClose={true}
      requiresVerification={false}
      html={
        <>
          <div className="AddToPlaylist-content">
            <PlaylistList />
          </div>
        </>
      }
    />,
  ],
  [
    "EditPlaylistOrder",
    <Popup
      id="EditPlaylistOrder"
      canClose={true}
      html={
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              justifySelf: "center",
              width: "500px",
              height: "500px",
            }}
          >
            <div>
              <SongOrderList />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}></div>
          </div>
        </>
      }
    />,
  ],
  [
    "RenameSong",
    <Popup
      id="RenameSong"
      canClose={true}
      html={
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              justifySelf: "center",
            }}
          >
            <RenameSongPopup />
            <div style={{ display: "flex", flexDirection: "row" }}></div>
          </div>
        </>
      }
    />,
  ],
  [
    "RenamePlaylist",
    <Popup
      id="RenamePlaylist"
      canClose={true}
      html={
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              justifySelf: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              {" "}
              <div
                id="rename-playlist-menu"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Rename Playlist
                </h2>
                <CustomInputField
                  inputType={"url"}
                  placeholder={"Some name"}
                  label={"Name:"}
                  inputID={"rename-playlist-name"}
                />

                <button
                  style={{ marginBottom: "17.5px" }}
                  onClick={() => RenamePlaylist_Exported()}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        </>
      }
    />,
  ],
]);

export default function PopupControl() {
  const popup = useSelector((state: RootState) => state.popup);
  const location = useLocation();

  useEffect(() => {
    ClosePopup();
  }, [location]);

  return (
    <>
      <div>{POPUP_MAP.get(popup.currentPopup)}</div>
    </>
  );
}
