import { useEffect, useState } from "react";
import "./PlaylistCreation.css";
import PlaylistContainerHorizontal from "../Playlist Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import { email } from "../../../main";
import * as uuid from "uuid";
import Popup from "../Popup";
import { useParams } from "react-router-dom";
import testbg from "../../../assets/test_bg.jpg";

export default function PlaylistEdit(props: any) {
  const { playlistID } = useParams();

  if (playlistID == null) return;

  function UpdateName() {
    console.log("Updating Name");

    var playlist_name = document.getElementById(
      "edit-playlist-name"
    ) as HTMLInputElement;

    var playlist_name_text = playlist_name?.value;

    if (playlist_name_text != "") {
      const update = async () => {
        await supabase
          .from("Playlists")
          .update({ name: playlist_name_text })
          .eq("id", playlistID);

        props.setName(playlist_name_text);
      };
      update();
    }
  }
  function UpdateCover() {
    var cover_url = "";

    const update = async () => {
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

      props.setCover(
        cover_url == "" ? "../../../src/assets/small_record.svg" : cover_url
      );
    };

    update();
  }
  function UpdateBG() {
    var background_url = "";

    const update = async () => {
      if (useLocalBG) {
        const uploaded_bg = (
          document.getElementById(
            "edit-playlist-background"
          ) as HTMLInputElement
        ).files![0];

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
              .getPublicUrl("pictures/backgrounds/" + playlistID)
              .data.publicUrl;
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

      props.setBG(background_url);
    };

    update();
  }

  function UpdateVisibility() {
    let dropdown = document.getElementById(
      "playlist-privacy-setting"
    ) as HTMLSelectElement;

    const update = async () => {
      if (dropdown.value == "") return;
      props.setPrivacy(dropdown.value);
      await supabase
        .from("Playlists")
        .update({ privacy_setting: dropdown.value })
        .eq("id", playlistID);
    };

    update();
  }

  function ClearInput() {
    // Cover
    (document.getElementById("edit-playlist-cover") as HTMLInputElement).value =
      "";
    (document.getElementById("url-playlist-cover") as HTMLInputElement).value =
      "";

    // Background
    (
      document.getElementById("edit-playlist-background") as HTMLInputElement
    ).value = "";

    (
      document.getElementById("url-playlist-background") as HTMLInputElement
    ).value = "";

    // Name

    (document.getElementById("edit-playlist-name") as HTMLInputElement).value =
      "";

    // Privacy
    (
      document.getElementById("playlist-privacy-setting") as HTMLSelectElement
    ).value = "";
  }

  function SaveSettings() {
    UpdateName();
    UpdateCover();
    UpdateBG();
    UpdateVisibility();
    ClearInput();
    //close();
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
      <div id="edit-playlist-menu" style={{ width: "400px" }}>
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
      </div>
      <button
        style={{
          display: "flex",
          alignContent: "center",
          marginBottom: "15px",
        }}
        onClick={SaveSettings}
      >
        Save Settings
      </button>
    </>
  );
}

export function CustomInputField(props: any) {
  return (
    <div hidden={props.hidden}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <label>{props.label}</label>
        <input
          id={props.inputID}
          type={props.inputType}
          placeholder={props.placeholder}
          style={{
            padding: "7.5px",
            borderRadius: "10px",
            border: "none",
          }}
          accept={props.accept} // Happens only if type is set to file
        />

        <button hidden={props.setType != "button"} onClick={props.OnSet}>
          Set
        </button>
      </div>
    </div>
  );
}