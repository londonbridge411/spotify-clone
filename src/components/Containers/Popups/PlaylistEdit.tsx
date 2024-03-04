import { useEffect, useRef, useState } from "react";
import "./PlaylistCreation.css";
import PlaylistContainerHorizontal from "../Playlist Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import { email } from "../../../main";
import * as uuid from "uuid";
import Popup from "../Popup";
import { useParams } from "react-router-dom";
import testbg from "../../../assets/test_bg.jpg";
import { useDispatch } from "react-redux";
import CustomInputField from "../../CustomInputField";
import { SwitchToPopup } from "../../../PopupControl";

export default function PlaylistEdit() {
  const { playlistID } = useParams();

  if (playlistID == null) return;

  async function UpdateName() {
    console.log("Updating Name");

    var playlist_name = document.getElementById(
      "edit-playlist-name"
    ) as HTMLInputElement;

    var playlist_name_text = playlist_name?.value;

    if (playlist_name_text != "") {
      await supabase
        .from("Playlists")
        .update({ name: playlist_name_text })
        .eq("id", playlistID);
    }
  }

  async function UpdateCover() {
    if (useLocalCover) {
      // Update Cover
      await supabase.storage
        .from("music-files")
        .upload("/pictures/covers/" + playlistID, uploaded_cover, {
          cacheControl: "1",
          upsert: true,
        })
        .then((result) => {
          if (result.error == null) {
            cover_url = supabase.storage
              .from("music-files")
              .getPublicUrl("pictures/covers/" + playlistID).data.publicUrl;
          }
        });
    } else {
      if (cover_url == "") return;

      await supabase.storage
        .from("music-files")
        .remove(["/pictures/covers/" + playlistID]);
    }

    await supabase
      .from("Playlists")
      .update({ cover_url: cover_url })
      .eq("id", playlistID);
  }
  async function UpdateBG() {
    if (useLocalBG) {
      if (uploaded_bg == null) console.log("IS NULL");

      // Update Cover
      await supabase.storage
        .from("music-files")
        .upload("pictures/backgrounds/" + playlistID, uploaded_bg, {
          cacheControl: "1",
          upsert: true,
        })
        .then((result) => {
          background_url = supabase.storage
            .from("music-files")
            .getPublicUrl("pictures/backgrounds/" + playlistID).data.publicUrl;
        });
    } else {
      if (background_url == "") return;

      await supabase.storage
        .from("music-files")
        .remove(["/pictures/backgrounds/" + playlistID]);
    }

    await supabase
      .from("Playlists")
      .update({ bg_url: background_url })
      .eq("id", playlistID);
  }

  async function UpdateVisibility() {
    if (dropdown_value == "") return;

    await supabase
      .from("Playlists")
      .update({ privacy_setting: dropdown_value })
      .eq("id", playlistID);
  }

  function SaveSettings() {
    // Can't do this because it causes the other stuff to go missing
    // dispatch(setPopup("uploadingWait"));

    // UPDATE: Ignore the above. On input change, I save the file/url to a variable
    // so whenever the popup changes, the variables remain the same.

    SwitchToPopup("uploadingWait");
    //setLoading(true);
    let update = async () => {
      await UpdateName(); // I can do this here because the query is so fast.
      await UpdateVisibility();
      await UpdateCover();
      await UpdateBG();
      window.location.reload();
    };

    update();
  }

  var uploaded_cover: File;
  var uploaded_bg: File;
  var cover_url: string = "";
  var background_url: string = "";
  var dropdown_value: string = "";

  // Handlers (For OnChange)
  const [useLocalCover, setLocalCover] = useState(false);
  const [useLocalBG, setLocalBG] = useState(false);

  const handleLocalCover = () => {
    setLocalCover(!useLocalCover);
  };

  const handleLocalBG = () => {
    setLocalBG(!useLocalBG);
  };

  const handleCoverFile = () => {
    uploaded_cover = (
      document.getElementById("edit-playlist-cover") as HTMLInputElement
    ).files![0];

    //console.log("change cover file");
  };

  const handleBGFile = () => {
    uploaded_bg = (
      document.getElementById("edit-playlist-background") as HTMLInputElement
    ).files![0];

    //console.log("change background file");
  };

  const handleCoverURL = () => {
    cover_url = (
      document.getElementById("url-playlist-cover") as HTMLInputElement
    )?.value;

    //console.log("change cover url");
  };

  const handleBGURL = () => {
    background_url = (
      document.getElementById("url-playlist-background") as HTMLInputElement
    )?.value;

    //console.log("change background url");
  };

  const handleName = () => {
    background_url = (
      document.getElementById("url-playlist-background") as HTMLInputElement
    )?.value;

    //console.log("change name");
  };

  const handleDropdown = () => {
    dropdown_value = (
      document.getElementById("playlist-privacy-setting") as HTMLSelectElement
    )?.value;

    //console.log("change vis");
  };

  return (
    <>
      <div>
        <div
          id="edit-playlist-menu"
          style={{ display: "flex", flexDirection: "column", width: "400px" }}
        >
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            Edit Playlist
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <label>Set Visibility:</label>

            <select
              defaultValue={""}
              id="playlist-privacy-setting"
              style={{
                padding: "7.5px",
                borderRadius: "10px",
                border: "none",
              }}
              onChange={handleDropdown}
            >
              <option value=""></option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Unlisted">Unlisted</option>
            </select>
          </div>

          <CustomInputField
            inputType={"url"}
            placeholder={"Some name"}
            label={"Name:"}
            inputID={"edit-playlist-name"}
            setType={"none"}
            OnSet={UpdateName}
            onChange={handleName}
          />

          <div style={{ paddingLeft: "150px" }}>
            <label>Use local file</label>
            <input
              type="checkbox"
              checked={useLocalCover}
              onChange={handleLocalCover}
            />
          </div>

          <CustomInputField
            hidden={useLocalCover}
            label={"Cover URL:"}
            inputType={"url"}
            placeholder={"www.somesite.com/img.png"}
            inputID={"url-playlist-cover"}
            accept=".jpg, .jpeg, .png"
            setType={"none"}
            OnSet={UpdateCover}
            onChange={handleCoverURL}
          />

          <CustomInputField
            hidden={!useLocalCover}
            inputType={"file"}
            inputID={"edit-playlist-cover"}
            setType={"none"}
            OnSet={UpdateCover}
            onChange={handleCoverFile}
            accept=".jpg, .jpeg, .png"
          />

          <div style={{ paddingLeft: "150px" }}>
            <label>Use local file</label>
            <input
              type="checkbox"
              checked={useLocalBG}
              onChange={handleLocalBG}
            />
          </div>

          <CustomInputField
            hidden={useLocalBG}
            label={"Background URL:"}
            inputID={"url-playlist-background"}
            placeholder={"www.somesite.com/img.png"}
            setType={"none"}
            OnSet={UpdateBG}
            onChange={handleBGURL}
          />

          <CustomInputField
            hidden={!useLocalBG}
            inputType={"file"}
            inputID={"edit-playlist-background"}
            setType={"none"}
            OnSet={UpdateBG}
            onChange={handleBGFile}
            accept=".jpg, .jpeg, .png"
          />

          <div
            hidden={!useLocalCover && !useLocalBG}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
              color: "#E34234",
            }}
          >
            * If it does not update automatically, give up to 1 minute and then
            reload the page.
          </div>

          <button
            style={{
              display: "flex",
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "center",
              marginBottom: "15px",
            }}
            onClick={SaveSettings}
          >
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
}
