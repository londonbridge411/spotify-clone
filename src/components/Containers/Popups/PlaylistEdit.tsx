import { useEffect, useState } from "react";
import "./PlaylistCreation.css";
import PlaylistContainerHorizontal from "../Playlist Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import { email } from "../../../main";
import * as uuid from "uuid";
import Popup from "../Popup";
import { useParams } from "react-router-dom";
import testbg from "../../../assets/test_bg.jpg";
import { useDispatch } from "react-redux";
import { setPopup } from "../../../PopupSlice";
import CustomInputField from "../../CustomInputField";

export default function PlaylistEdit() {
  const { playlistID } = useParams();

  if (playlistID == null) return;

  const [isLoading, setLoading] = useState(false);

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
    var cover_url = "";

    if (useLocalCover) {
      const uploaded_cover = (
        document.getElementById("edit-playlist-cover") as HTMLInputElement
      ).files![0];

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
      cover_url = (
        document.getElementById("url-playlist-cover") as HTMLInputElement
      )?.value;

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
    var background_url = "";

    if (useLocalBG) {
      const uploaded_bg = (
        document.getElementById("edit-playlist-background") as HTMLInputElement
      ).files![0];
      console.log(uploaded_bg);

      if (uploaded_bg == null) console.log("IS NULL");

      //          .update("/pictures/backgrounds/" + playlistID, uploaded_bg, {

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
      background_url = (
        document.getElementById("url-playlist-background") as HTMLInputElement
      )?.value;

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
    let dropdown = document.getElementById(
      "playlist-privacy-setting"
    ) as HTMLSelectElement;

    if (dropdown?.value == "") return;

    await supabase
      .from("Playlists")
      .update({ privacy_setting: dropdown.value })
      .eq("id", playlistID);
  }

  function SaveSettings() {
    // Can't do this because it causes the other stuff to go missing
    // dispatch(setPopup("uploadingWait"));

    setLoading(true);
    let update = async () => {
      await UpdateVisibility();
      await UpdateName();
      await UpdateCover();
      await UpdateBG();
      window.location.reload();
    };

    update();
  }
  const [useLocalCover, setLocalCover] = useState(false);
  const [useLocalBG, setLocalBG] = useState(false);

  const handleLocalCover = () => {
    setLocalCover(!useLocalCover);
  };

  const handleLocalBG = () => {
    setLocalBG(!useLocalBG);
  };

  return (
    <>
      <div hidden={isLoading}>
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
          />

          <CustomInputField
            hidden={!useLocalCover}
            inputType={"file"}
            inputID={"edit-playlist-cover"}
            setType={"none"}
            OnSet={UpdateCover}
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
          />

          <CustomInputField
            hidden={!useLocalBG}
            inputType={"file"}
            inputID={"edit-playlist-background"}
            setType={"none"}
            OnSet={UpdateBG}
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

      <div hidden={!isLoading}>
        <img
          src="https://i.gifer.com/ZZ5H.gif"
          style={{ height: "35px", width: "35px" }}
        />
      </div>
    </>
  );
}
