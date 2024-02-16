import { useEffect, useRef, useState } from "react";
import supabase from "../../../config/supabaseClient";
import SearchBar from "../../SearchBar";
import Popup from "../Popup";
import { CustomInputField } from "./AccountEdit";
import * as uuid from "uuid";
import { useParams } from "react-router-dom";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { authUserID, username } from "../../../main";

export interface Artist {
  id: string;
  username: string;
}

export function UploadSongPopup(props: any) {
  // Get Playlist ID
  const { playlistID } = useParams();
  if (playlistID == null) return;

  // States
  const [popupActive_UploadingWait, setPopupState_UploadingWait] =
    useState(false);

  const [artists, setArtists] = useState([] as Artist[]);
  const list: Artist[] = [];

  // Functions

  // Adds user to list
  function AddUser() {
    let identifier = (
      document.getElementById("upload-song-artists") as HTMLInputElement
    ).value;

    let fetch = async () => {
      await supabase
        .from("Users")
        .select("id, username")
        .eq("id", identifier)
        .then((result) => {
          console.log(identifier);
          // Have to do it this way, otherwise you can inject a song/playlist identifier and it will pass
          if (result.data?.at(0)!.id == identifier) {
            console.log(identifier + " passed");
            let item = result.data?.at(0);

            for (let i = 0; i < artists.length; i++) {
              if (artists[i].id == item?.id) {
                return;
              }
            }

            console.log("got here");

            // This is retarded, but if I do setArtists(list), the list literally goes back to empty
            list.push(item as Artist);
            setArtists(artists.concat(list));
          }
        });
    };

    fetch();
  }

  // Uploads the song
  function UploadSong() {
    const uploaded_song = (
      document.getElementById("uploaded_song") as HTMLInputElement
    ).files![0];

    let id = uuid.v4();

    if (uploaded_song != null) {
      setPopupState_UploadingWait(true);
      const insertIntoTable = async () => {
        var song_name = document.getElementById(
          "upload-song-name"
        ) as HTMLInputElement;

        var song_name_text = song_name?.value;

        await supabase
          .from("Songs")
          .insert({
            id: id,
            title: song_name_text,
            owner_id: (await supabase.auth.getUser()).data.user?.id,
            album_id: playlistID!,
            created_at: new Date(),
            artist_data: hasMultipleArtists
              ? artists
              : [{ id: authUserID, username: username }],
          })
          .then((result) => console.log(result.error));

        await supabase.storage
          .from("music-files")
          .upload("/audio-files/" + id, uploaded_song, {
            cacheControl: "3600",
            upsert: false,
          });

        props.setActive(false);

        // Now we need to append ID to array in playlist

        await supabase
          .from("Playlists")
          .select("song_ids")
          .eq("id", playlistID)
          .then(async (result) => {
            var array: string[] = result.data?.at(0)?.song_ids;

            array.push(id as string);

            await supabase
              .from("Playlists")
              .update({ song_ids: array })
              .eq("id", playlistID);

            window.location.reload();
          });
      };

      insertIntoTable();
    }
  }
  const [hasMultipleArtists, setMultipleArtists] = useState(false);
  const handleMultipleArtists = () => {
    setMultipleArtists(!hasMultipleArtists);
    setArtists([]);
  };

  return (
    <>
      <div id="upload-song-menu">
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          Upload Song
        </h2>

        <CustomInputField
          inputType={"file"}
          placeholder={"Some name"}
          label={"Choose file:"}
          inputID={"uploaded_song"}
          accept="audio/mp3"
        />
        <CustomInputField
          inputType={"url"}
          placeholder={"Some name"}
          label={"Name:"}
          inputID={"upload-song-name"}
        />

        <div style={{}}>
          <label>{"Has Multiple/Different Artist(s)"}</label>
          <input
            type="checkbox"
            checked={hasMultipleArtists}
            onChange={handleMultipleArtists}
          />
        </div>

        <CustomInputField
          hidden={!hasMultipleArtists}
          inputType={"url"}
          placeholder={"Enter ID"}
          label={"Artist(s):"}
          inputID={"upload-song-artists"}
          setType={"button"}
          OnSet={() => {
            AddUser();
            // Clear input
            (
              document.getElementById("upload-song-artists") as HTMLInputElement
            ).value = "";
          }}
        />
        <div
          hidden={!hasMultipleArtists}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
            color: "#E34234",
          }}
        >
          * If you are one of the artists, you need to insert your ID too. The
          ID can be found at the end of the profile's URL. Ex:
          "f6b4dg3d-93b5-4dfa-849d-67cs142t9r7z"
        </div>
        <ul style={{ margin: 0 }}>
          {artists.map((item: any) => {
            return <li key={item.id}>{item.username}</li>;
          })}
        </ul>

        <button onClick={() => UploadSong()}>Upload</button>
      </div>

      <Popup
        id="uploadingWait"
        active={popupActive_UploadingWait}
        setActive={setPopupState_UploadingWait}
        canClose={false}
        html={<div>Uploading Song...</div>}
      />
    </>
  );
}
