import { useState } from "react";
import "./PlaylistCreation.css";
import supabase from "../../../config/supabaseClient";
import * as uuid from "uuid";
import CustomInputField from "../../CustomInputField";
import { ClosePopup } from "../../../PopupControl";

export default function PlaylistCreation(props: any) {
  let uploaded_cover: File;
  let uploaded_bg: File;
  let cover_url: string = "";
  let background_url: string = "";
  let dropdown_value: string = "";

  function UploadPlaylist() {
    const id = uuid.v4();

    handleDropdown();
    const insertIntoTable = async () => {
      const playlist_name = document.getElementById(
        "upload-playlist-name"
      ) as HTMLInputElement;

      const playlist_name_text = playlist_name?.value;

      // Guard Statement
      if (playlist_name_text == "") return;

      // Upload Cover and BG
      await UploadCover(id);
      await UpdateBG(id);

      if (dropdown_value == "") return;
      console.log(playlist_name_text);
      await supabase
        .from("Playlists")
        .insert({
          id: id,
          name: playlist_name_text,
          owner_id: (await supabase.auth.getUser()).data.user?.id,
          type: props.playlistType, //Figure out a way to change this
          created_at: new Date(),
          cover_url: cover_url,
          bg_url: background_url,
          privacy_setting: (
            document.getElementById(
              "playlist-privacy-setting"
            ) as HTMLSelectElement
          ).value,
        })
        .then(async (result) => {
          if (result.error == null) {
            ClosePopup();

            window.location.reload();
          } else {
            console.log(result.error);
          }
        });
    };

    insertIntoTable();
  }

  async function UploadCover(playlistID: string) {
    if (useLocalCover) {
      // Update Cover
      await supabase.storage
        .from("music-files")
        .upload("pictures/covers/" + playlistID, uploaded_cover, {
          cacheControl: "3600",
          upsert: true,
        })
        .then((result) => {
          if (result.error == null) {
            cover_url = supabase.storage
              .from("music-files")
              .getPublicUrl("pictures/covers/" + playlistID).data.publicUrl;
          }
        });
    }
  }

  async function UpdateBG(playlistID: string) {
    if (useLocalBG) {
      if (uploaded_bg == null) console.log("IS NULL");

      // Update Cover
      await supabase.storage
        .from("music-files")
        .upload("pictures/backgrounds/" + playlistID, uploaded_bg, {
          cacheControl: "3600",
          upsert: true,
        })
        .then(() => {
          background_url = supabase.storage
            .from("music-files")
            .getPublicUrl("pictures/backgrounds/" + playlistID).data.publicUrl;
        });
    }
  }

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
      document.getElementById("upload-playlist-cover") as HTMLInputElement
    ).files![0];

    //console.log("change cover file");
  };

  const handleBGFile = () => {
    uploaded_bg = (
      document.getElementById("upload-playlist-background") as HTMLInputElement
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
          id="upload-playlist-menu"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "400px",
          }}
        >
          <h2
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {"Create " + props.playlistType}
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
            <label style={{ color: "rgb(197, 197, 197)", fontWeight: "500" }}>
              Set Visibility:
            </label>

            <select
              defaultValue={"Public"}
              id="playlist-privacy-setting"
              style={{
                padding: "7.5px",
                borderRadius: "10px",
                border: "none",
              }}
              onChange={handleDropdown}
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Unlisted">Unlisted</option>
            </select>
          </div>

          <div style={{ alignItems: "flex-end" }}>
            <CustomInputField
              inputType={"url"}
              placeholder={"Some name"}
              label={"Name:"}
              inputID={"upload-playlist-name"}
              setType={"none"}
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
              onChange={handleCoverURL}
            />
            <CustomInputField
              hidden={!useLocalCover}
              inputType={"file"}
              inputID={"upload-playlist-cover"}
              setType={"none"}
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
              onChange={handleBGURL}
            />
            <CustomInputField
              hidden={!useLocalBG}
              inputType={"file"}
              inputID={"upload-playlist-background"}
              setType={"none"}
              onChange={handleBGFile}
              accept=".jpg, .jpeg, .png"
            />
          </div>

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
            onClick={UploadPlaylist}
          >
            Create
          </button>
        </div>
      </div>
    </>
  );
}
