import { useEffect, useState } from "react";
import "./PlaylistCreation.css";
import PlaylistContainerHorizontal from "../Playlist Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import { email } from "../../../main";
import * as uuid from "uuid";
import Popup from "../Popup";
import { useParams } from "react-router-dom";

export default function PlaylistEdit(props: any) {
  const [popupActive_UploadingWait, setPopupActive_UploadingWait] =
    useState(false);

  const { playlistID } = useParams();

  if (playlistID == null) return;

  function UpdateName() {
    console.log("Updating Name");

    var playlist_name = document.getElementById(
      "edit-playlist-name"
    ) as HTMLInputElement;

    var playlist_name_text = playlist_name?.value;

    console.log("Text: " + playlistID);
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
          .update("/pictures/covers/" + playlistID, uploaded_cover, {
            cacheControl: "3600",
            upsert: true,
          })
          .then(() => {
            cover_url = supabase.storage
              .from("music-files")
              .getPublicUrl("pictures/covers/" + playlistID).data.publicUrl;
          });
      } else {
        await supabase.storage
          .from("music-files")
          .remove(["/pictures/covers/" + playlistID]);

        cover_url = (
          document.getElementById("url-playlist-cover") as HTMLInputElement
        )?.value;
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

        // Update Cover
        await supabase.storage
          .from("music-files")
          .update("/pictures/backgrounds/" + playlistID, uploaded_bg, {
            cacheControl: "3600",
            upsert: true,
          })
          .then(() => {
            background_url = supabase.storage
              .from("music-files")
              .getPublicUrl("pictures/backgrounds/" + playlistID)
              .data.publicUrl;
          });
      } else {
        await supabase.storage
          .from("music-files")
          .remove(["/pictures/backgrounds/" + playlistID]);

        background_url = (
          document.getElementById("url-playlist-background") as HTMLInputElement
        )?.value;
      }

      await supabase
        .from("Playlists")
        .update({ bg_url: background_url })
        .eq("id", playlistID);

      props.setBG(background_url);
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
      <div id="edit-playlist-menu">
        <h2>Edit Playlist</h2>
        <div>
          <label>Name</label>
          <input id="edit-playlist-name" />
        </div>

        <button onClick={UpdateName}>Set</button>

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
            id="edit-playlist-cover"
            type="file"
            accept=".jpg, .jpeg, .png"
          />
        </div>
        <button onClick={UpdateCover}>Set</button>
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
            id="edit-playlist-background"
            type="file"
            accept=".jpg, .jpeg, .png"
          />
        </div>
        <button onClick={UpdateBG}>Set</button>
      </div>

      <Popup
        id="uploadingWait"
        active={popupActive_UploadingWait}
        setActive={setPopupActive_UploadingWait}
        canClose={false}
        html={<div>Creating Playlist</div>}
      ></Popup>
    </>
  );
}

/*
          <div>
            <div>
              <label>Name</label>
              <input id="edit-playlist-name" />
              <button>Update</button>
            </div>

            <div>
              <label>Cover</label>
              <input id="edit-playlist-cover" />
              <button>Update</button>
            </div>

            <div>
              <label>Background</label>
              <input id="edit-playlist-bg" />
              <button>Update</button>
            </div>
          </div>
*/
