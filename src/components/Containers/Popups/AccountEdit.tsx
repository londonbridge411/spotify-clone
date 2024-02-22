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

export default function AccountEdit() {
  const { userID } = useParams();

  if (userID == null) return;
  const [isLoading, setLoading] = useState(false);

  async function UpdateName() {
    console.log("Updating Name");

    var account_name = document.getElementById(
      "edit-account-name"
    ) as HTMLInputElement;

    var account_name_text = account_name?.value;

    if (account_name_text != "") {
      await supabase
        .from("Users")
        .update({ username: account_name_text })
        .eq("id", userID);
    }
  }
  async function UpdateCover() {
    var cover_url = "";

    if (useLocalCover) {
      const uploaded_cover = (
        document.getElementById("edit-account-cover") as HTMLInputElement
      ).files![0];

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
      cover_url = (
        document.getElementById("url-account-cover") as HTMLInputElement
      )?.value;

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
    setLoading(true);

    let update = async () => {
      await UpdateName();
      await UpdateCover();
      window.location.reload();
    };

    update();
  }
  const [useLocalCover, setLocalCover] = useState(false);
  const [useLocalBG, setLocalBG] = useState(false);

  const handleLocalCover = () => {
    setLocalCover(!useLocalCover);
  };

  return (
    <>
      <div
        id="edit-account-menu"
        hidden={isLoading}
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
        />

        <CustomInputField
          hidden={!useLocalCover}
          inputType={"file"}
          inputID={"edit-account-cover"}
          setType={"none"}
          OnSet={UpdateCover}
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
          Update Profile
        </button>
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
