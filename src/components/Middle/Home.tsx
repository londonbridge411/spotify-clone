import { useEffect, useState } from "react";
import PlaylistList from "../Containers/Playlist Containers/PlaylistList";
import SearchBar from "../SearchBar";
import { NavLink } from "react-router-dom";
import SongRow from "../Containers/SongRow";

import "./Home.css";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
import supabase from "../../config/supabaseClient";
/*
SHOULD CONTAIN:
* Search bar
* recently played playlists.
* recently played songs.
* what friends have listened too
* new songs/albums by followed artists
*/
export default function Home() {
  return (
    <div className="home-page">
      <div className="home-layout">
        <h1>Home</h1>

        <section>
          <h2>Keep Listening</h2>
        </section>

        <section>
          <h2>New</h2>
        </section>

        <section>
          <h2>Recommended Songs</h2>
        </section>
      </div>
    </div>
  );
}
