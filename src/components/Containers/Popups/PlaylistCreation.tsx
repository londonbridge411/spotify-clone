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
    const uploaded_cover = (
      document.getElementById("upload-playlist-cover") as HTMLInputElement
    ).files![0];

    const uploaded_bg = (
      document.getElementById("upload-playlist-background") as HTMLInputElement
    ).files![0];

    // Guard Statement
    if (uploaded_bg == null || uploaded_cover == null) return;

    setPopupActive_UploadingWait(true);

    let id = uuid.v4();

    const insertIntoTable = async () => {
      var playlist_name = document.getElementById(
        "upload-playlist-name"
      ) as HTMLInputElement;

      var playlist_name_text = playlist_name?.value;

      await supabase
        .from("Playlists")
        .insert({
          id: id,
          name: playlist_name_text,
          owner_id: (await supabase.auth.getUser()).data.user?.id,
          song_ids: [],
          type: props.playlistType, //Figure out a way to change this
          private: false,
          created_at: new Date(),
        })
        .then(async (result) => {
          if (result.error == null) {
            // Upload the BG
            await supabase.storage
              .from("music-files")
              .upload("/pictures/backgrounds/" + id, uploaded_bg, {
                cacheControl: "3600",
                upsert: false,
              });

            // Upload the Cover
            await supabase.storage
              .from("music-files")
              .upload("/pictures/covers/" + id, uploaded_cover, {
                cacheControl: "3600",
                upsert: false,
              });

            setPopupActive_UploadingWait(false);

            window.location.reload();
          } else {
            console.log(result.error);
          }
        });
    };

    insertIntoTable();
  }

  const [checked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <>
      <div id="upload-playlist-menu">
        <div>
          <label>Name</label>
          <input id="upload-playlist-name" />
        </div>

        <div>
          <label>Use local files</label>
          <input type="checkbox" checked={checked} onChange={handleChange} />
        </div>

        <div hidden={checked}>
          <label>Cover URL</label>
          <input id="url-playlist-cover" />

          <label>Background URL</label>
          <input id="url-playlist-background" />
        </div>

        <div hidden={!checked}>
          <label>Upload Cover</label>
          <input
            id="upload-playlist-cover"
            type="file"
            accept=".jpg, .jpeg, .png"
          />
          <label>Upload Background</label>
          <input
            id="upload-playlist-background"
            type="file"
            accept=".jpg, .jpeg, .png"
          />
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
