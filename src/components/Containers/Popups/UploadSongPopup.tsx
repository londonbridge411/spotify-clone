import { useState } from "react";
import supabase from "../../../config/supabaseClient";
import * as uuid from "uuid";
import { useParams } from "react-router-dom";
import CustomInputField from "../../CustomInputField";
import { SwitchToPopup } from "../../../PopupControl";

export interface Artist {
  id: string;
  username: string;
}

export function UploadSongPopup() {
  // Get Playlist ID
  const { playlistID } = useParams();

  // States
  const [hasMultipleArtists, setMultipleArtists] = useState(false);
  const [artists, setArtists] = useState([] as Artist[]);
  const list: Artist[] = [];

  if (playlistID == null) return;

  // Adds user to list
  function AddUser() {
    const identifier = (
      document.getElementById("upload-song-artists") as HTMLInputElement
    ).value;

    const fetch = async () => {
      await supabase
        .from("Users")
        .select("id, username")
        .eq("id", identifier)
        .then((result) => {
          console.log(identifier);
          // Have to do it this way, otherwise you can inject a song/playlist identifier and it will pass
          if (result.data?.at(0)!.id == identifier) {
            console.log(identifier + " passed");
            const item = result.data?.at(0);

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

  let uploaded_song: File;
  // Uploads the song
  function UploadSong() {
    if (hasMultipleArtists && artists.length == 0) {
      alert(
        "Not allowed. When multiple artists is checked, you have to at least have one artists id inserted."
      );
      return;
    }

    uploaded_song = (
      document.getElementById("uploaded_song") as HTMLInputElement
    ).files![0];

    const id = uuid.v4();

    if (uploaded_song != null) {
      SwitchToPopup("uploadingWait");
      const insertIntoTable = async () => {
        const song_name = document.getElementById(
          "upload-song-name"
        ) as HTMLInputElement;

        const song_name_text = song_name?.value;
        let song_duration: string;

        await supabase.storage
          .from("music-files")
          .upload("/audio-files/" + id, uploaded_song, {
            cacheControl: "3600",
            upsert: false,
          })
          .then((result) => {
            const a = supabase.storage
              .from("music-files")
              .getPublicUrl(result.data!.path).data.publicUrl;

              const au = new Audio(a);

            au.onloadedmetadata = async () => {
              const minutes = Math.floor(au.duration / 60);
              const seconds = Math.floor(au.duration % 60);
              const returnedSeconds =
                seconds < 10 ? `0${seconds}` : `${seconds}`;
              song_duration = `${minutes}:${returnedSeconds}`;

              await supabase.from("Songs").insert({
                id: id,
                title: song_name_text,
                owner_id: (await supabase.auth.getUser()).data.user?.id,
                album_id: playlistID!,
                created_at: new Date(),
                duration: song_duration!,
              });

              // Now we need to add it to song artists

              if (hasMultipleArtists) {
                for (let i = 0; i < artists.length; i++)
                  await supabase
                    .from("Songs_Artists")
                    .insert({ song_id: id, user_id: artists[i].id });
              } else {
                await supabase.from("Songs_Artists").insert({
                  song_id: id,
                  user_id: (await supabase.auth.getUser()).data.user?.id,
                });
              }

              // Get Count
              await supabase
                .from("Songs_Playlists")
                .select("*")
                .eq("playlist_id", playlistID)
                .then(async (result) => {
                  const dataCount = result.data?.length;
                  const pos = dataCount != null && dataCount != 0 ? dataCount : 0;

                  console.log(dataCount + ", pos: " + pos);

                  await supabase
                    .from("Songs_Playlists")
                    .insert({
                      song_id: id,
                      playlist_id: playlistID,
                      order: pos,
                    })
                    .then(() => window.location.reload());
                });

              // Insert into Songs_Playlists at the appropriate position

              //.then(() => window.location.reload());
            };
          });
      };

      insertIntoTable();
    }
  }
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
          accept=".mp3, .wav, .m4a"
        />
        <CustomInputField
          inputType={"url"}
          placeholder={"Some name"}
          label={"Name:"}
          inputID={"upload-song-name"}
        />

        <div style={{}}>
          <label style={{ color: "rgb(197, 197, 197)", fontWeight: "500" }}>
            {"Has Multiple/Different Artist(s)"}
          </label>
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
    </>
  );
}
