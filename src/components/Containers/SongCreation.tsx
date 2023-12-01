import { useEffect, useState } from "react";
import "./SongCreation.css";
import PlaylistContainerHorizontal from "./PlaylistContainerHorizontal";
import supabase from "../../config/supabaseClient";
import { email } from "../../main";

export default function SongCreation() {
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
