import { useEffect, useState } from "react";
import "./PlaylistCreation.css";
import PlaylistContainerHorizontal from "../Playlist Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import { email } from "../../../main";
import * as uuid from "uuid";
import Popup from "../Popup";

export default function PlaylistCreation(props: any) {
  const [popupActive_UploadingWait, setPopupActive_UploadingWait] =
    useState(false);
  function UploadPlaylist() {
    setPopupActive_UploadingWait(true);

    let id = uuid.v4();

    const insertIntoTable = async () => {
      var playlist_name = document.getElementById(
        "upload-playlist-name"
      ) as HTMLInputElement;

      var playlist_name_text = playlist_name?.value;

      var cover_url = "";
      var bg_url = "";

      // Guard Statement
      if (playlist_name_text == "") return;

      if (useCustom) {
        if (useLocalCover) {
          const uploaded_cover = (
            document.getElementById("upload-playlist-cover") as HTMLInputElement
          ).files![0];

          // Upload the Cover
          await supabase.storage
            .from("music-files")
            .upload("/pictures/covers/" + id, uploaded_cover, {
              cacheControl: "3600",
              upsert: false,
            });

          cover_url = supabase.storage
            .from("music-files")
            .getPublicUrl("pictures/covers/" + id).data.publicUrl;
        } else {
          cover_url = (
            document.getElementById("url-playlist-cover") as HTMLInputElement
          )?.value;
        }

        if (useLocalBG) {
          const uploaded_bg = (
            document.getElementById(
              "upload-playlist-background"
            ) as HTMLInputElement
          ).files![0];

          await supabase.storage
            .from("music-files")
            .upload("/pictures/backgrounds/" + id, uploaded_bg, {
              cacheControl: "3600",
              upsert: false,
            });

          bg_url = supabase.storage
            .from("music-files")
            .getPublicUrl("pictures/backgrounds/" + id).data.publicUrl;
        } else {
          bg_url = (
            document.getElementById(
              "url-playlist-background"
            ) as HTMLInputElement
          )?.value;
        }
      } else {
        console.log("Default");
        cover_url = ""; //default
        bg_url = ""; //default*/
      }

      await supabase
        .from("Playlists")
        .insert({
          id: id,
          name: playlist_name_text,
          owner_id: (await supabase.auth.getUser()).data.user?.id,
          song_ids: [],
          type: props.playlistType, //Figure out a way to change this
          created_at: new Date(),
          cover_url: cover_url,
          bg_url: bg_url,
          privacy_setting: (document.getElementById(
            "playlist-privacy-setting"
          ) as HTMLSelectElement).value,
        })
        .then(async (result) => {
          if (result.error == null) {
            setPopupActive_UploadingWait(false);

            window.location.reload();
          } else {
            console.log(result.error);
          }
        });
    };

    insertIntoTable();
  }

  const [useCustom, setCustom] = useState(false);
  const [useLocalCover, setLocalCover] = useState(false);
  const [useLocalBG, setLocalBG] = useState(false);

  const handleCustom = () => {
    setCustom(!useCustom);
  };

  const handleLocalCover = () => {
    setLocalCover(!useLocalCover);
  };

  const handleLocalBG = () => {
    setLocalBG(!useLocalBG);
  };

  return (
    <>
      <div id="upload-playlist-menu">
        <label>Set Visibility:</label>

        <select id="playlist-privacy-setting">
          <option value="Public">Public</option>
          <option value="Private">Private</option>
          <option value="Unlisted">Unlisted</option>
        </select>

        <div>
          <label>Name</label>
          <input id="upload-playlist-name" />
        </div>

        <div>
          <label>Custom Images</label>
          <input type="checkbox" checked={useCustom} onChange={handleCustom} />
        </div>

        <div hidden={!useCustom}>
          <div>
            <label>Use local file</label>
            <input
              type="checkbox"
              checked={useLocalCover}
              onChange={handleLocalCover}
            />
          </div>
          <div hidden={useLocalCover}>
            <label>Cover URL</label>
            <input id="url-playlist-cover" />
          </div>

          <div hidden={!useLocalCover}>
            <label>Upload Cover</label>
            <input
              id="upload-playlist-cover"
              type="file"
              accept=".jpg, .jpeg, .png"
            />
          </div>

          <div>
            <label>Use local file</label>
            <input
              type="checkbox"
              checked={useLocalBG}
              onChange={handleLocalBG}
            />
          </div>

          <div hidden={useLocalBG}>
            <label>Background URL</label>
            <input id="url-playlist-background" />
          </div>

          <div hidden={!useLocalBG}>
            <label>Upload Background</label>
            <input
              id="upload-playlist-background"
              type="file"
              accept=".jpg, .jpeg, .png"
            />
          </div>
        </div>

        <button onClick={UploadPlaylist}>Create</button>
      </div>

      <Popup
        id="uploadingWait"
        active={popupActive_UploadingWait}
        setActive={setPopupActive_UploadingWait}
        canClose={false}
        html={<div>Creating Playlist</div>}
        //requiresVerification={() => playlistType != "Playlist"}
      ></Popup>
    </>
  );
}
