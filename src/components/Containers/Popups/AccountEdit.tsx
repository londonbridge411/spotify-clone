import { useEffect, useState } from "react";
import "./PlaylistCreation.css";
import PlaylistContainerHorizontal from "../Playlist Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import { email } from "../../../main";
import * as uuid from "uuid";
import Popup from "../Popup";
import { useParams } from "react-router-dom";
import testbg from "../../../assets/test_bg.jpg";
import CustomInputField from "../../CustomInputField";
import { SwitchToPopup } from "../../../PopupControl";

export default function AccountEdit() {
  const { userID } = useParams();

  if (userID == null) return;

var uploaded_cover: File;
var cover_url: string = "";
  async function UpdateName() {
    console.log("Updating Name");

    var account_name = document.getElementById(
      "edit-account-name"
    ) as HTMLInputElement;

    var account_name_text = account_name?.value;

    if (account_name_text != "") {

      // Update the username in the users table
      await supabase
        .from("Users")
        .update({ username: account_name_text })
        .eq("id", userID);



      await supabase
        .from("Songs")
        .select("id, artist_data")
        .contains("artist_data", JSON.stringify([{ id: userID }]))
        .then(async (result) => {

          // Store the results
          let songs: any[] = result.data as any[];

          for (let i = 0; i < songs.length; i++) {

            // Get current song's artist_data
            let artistData: any[] = songs[i].artist_data;

            for (let j = 0; j < artistData.length; j++) {

              // When we find the position of the id
              if (artistData[j].id == userID) {

                // Update local objects username
                artistData[j].username = account_name_text;

                // Update the database username
                await supabase
                  .from("Songs")
                  .update({ artist_data: artistData })
                  .eq("id", songs[i].id);

                break;
              }
            }
          }
        });
    }
  }
  async function UpdateCover() {
    if (useLocalCover) {
      // Update Cover
      await supabase.storage
        .from("user-files")
        .upload("profile-pics/" + userID, uploaded_cover, {
          cacheControl: "1",
          upsert: true,
        })
        .then((result) => {
          if (result.error == null) {
            cover_url = supabase.storage
              .from("user-files")
              .getPublicUrl("profile-pics/" + userID).data.publicUrl;
          }
        });
    } else {

      if (cover_url == "") return;

      await supabase.storage
        .from("user-files")
        .remove(["profile-pics/" + userID]);
    }

    await supabase
      .from("Users")
      .update({ pfp_url: cover_url })
      .eq("id", userID);
  }

  function SaveSettings() {
    SwitchToPopup("uploadingWait");
    let update = async () => {
      await UpdateName();
      await UpdateCover();
      window.location.reload();
    };

    update();
  }
  const [useLocalCover, setLocalCover] = useState(false);
  //const [useLocalBG, setLocalBG] = useState(false);

  const handleLocalCover = () => {
    setLocalCover(!useLocalCover);
  };


  const handleCoverFile = () => {
    uploaded_cover = (
      document.getElementById("edit-account-cover") as HTMLInputElement
    ).files![0];

    console.log("change cover file");
  };

  const handleCoverURL = () => {
    cover_url = (
      document.getElementById("url-account-cover") as HTMLInputElement
    )?.value;

    console.log("change cover url");
  };

  return (
    <>
      <div
        id="edit-account-menu"
        style={{ display: "flex", flexDirection: "column", width: "400px" }}
      >
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          Edit Account
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        ></div>

        <CustomInputField
          inputType={"url"}
          placeholder={"Some name"}
          label={"Name:"}
          inputID={"edit-account-name"}
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
          label={"Profile Pic URL:"}
          inputType={"url"}
          placeholder={"www.somesite.com/img.png"}
          inputID={"url-account-cover"}
          accept=".jpg, .jpeg, .png"
          setType={"none"}
          OnSet={UpdateCover}
          onChange={handleCoverURL}
        />

        <CustomInputField
          hidden={!useLocalCover}
          inputType={"file"}
          inputID={"edit-account-cover"}
          setType={"none"}
          OnSet={UpdateCover}
          accept=".jpg, .jpeg, .png"
          onChange={handleCoverFile}
        />

        <div
          hidden={!useLocalCover}
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
          Update Profile
        </button>
      </div>
    </>
  );
}
