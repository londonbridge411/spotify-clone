import { useEffect, useState } from "react";
import "./PlaylistCreation.css";
import PlaylistContainerHorizontal from "./PlaylistContainerHorizontal";
import supabase from "../../config/supabaseClient";
import { email } from "../../main";

export default function PlaylistCreation() {
  return (
    <>
      <div id="upload-song-menu">
        <div>
          <label>Name</label>
          <input />
        </div>

        <label>Upload Song</label>
        <input type="file" accept="audio/mp3" />

        <label>Album</label>
      </div>
    </>
  );
}
