import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { setPopup } from "./PopupSlice";
import Popup from "./components/Containers/Popup";
import PlaylistCreation from "./components/Containers/Popups/PlaylistCreation";
import AccountEdit from "./components/Containers/Popups/AccountEdit";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { UploadSongPopup } from "./components/Containers/Popups/UploadSongPopup";
import PlaylistEdit from "./components/Containers/Popups/PlaylistEdit";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { UnfollowUser_Exported } from "./components/Middle/Account/AccountPage";
import { targ as songContextTarg } from "./components/Containers/ContextMenus/SongContextMenu";
import { DeleteSongs_Exported } from "./components/Containers/ContextMenus/Song Context Features/RemoveDeleteSong";
import PlaylistList from "./components/Containers/Playlist Containers/PlaylistList";

// Used for things in-line here.
var dispatchRef:
  | Dispatch<UnknownAction>
  | ((arg0: { payload: any; type: "popup/setPopup" }) => void);

export function ClosePopup() {
  dispatchRef(setPopup(""));
}

export function SwitchToPopup(key: string) {
  dispatchRef(setPopup(key));
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
              <button onClick={() => DeleteSongs_Exported(songContextTarg)}>
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
]);

export default function PopupControl() {
  const popup = useSelector((state: RootState) => state.popup);
  const dispatch = useDispatch();
  dispatchRef = dispatch;

  const location = useLocation();

  useEffect(() => {
    dispatch(setPopup(""));
  }, [location]);

  return (
    <>
      <div>{POPUP_MAP.get(popup.currentPopup)}</div>
    </>
  );
}
