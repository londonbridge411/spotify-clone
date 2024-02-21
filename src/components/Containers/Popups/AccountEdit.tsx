import { useEffect, useState } from "react";
import "./PlaylistCreation.css";
import PlaylistContainerHorizontal from "../Playlist Containers/PlaylistContainerHorizontal";
import supabase from "../../../config/supabaseClient";
import { email } from "../../../main";
import * as uuid from "uuid";
import Popup from "../Popup";
import { useParams } from "react-router-dom";
import testbg from "../../../assets/test_bg.jpg";

export default function AccountEdit() {
  const { userID } = useParams();

  if (userID == null) return;

  function UpdateName() {
    console.log("Updating Name");

    var account_name = document.getElementById(
      "edit-account-name"
    ) as HTMLInputElement;

    var account_name_text = account_name?.value;

    if (account_name_text != "") {
      const update = async () => {
        await supabase
          .from("Users")
          .update({ username: account_name_text })
          .eq("id", userID);
      };
      update();
    }
  }
  function UpdateCover() {
    var cover_url = "";

    const update = async () => {
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
    };

    update();
  }


  function SaveSettings() {
    UpdateName();
    UpdateCover();
    window.location.reload();
  }
  const [useLocalCover, setLocalCover] = useState(false);
  const [useLocalBG, setLocalBG] = useState(false);

  const handleLocalCover = () => {
    setLocalCover(!useLocalCover);
  };

  return (
    <>
      <div id="edit-account-menu" style={{ width: "400px" }}>
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
      </div>
      <button
        style={{
          display: "flex",
          alignContent: "center",
          marginBottom: "15px",
        }}
        onClick={SaveSettings}
      >
        Update Profile
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
