/*
This page should contain reccomended songs, artists, playlists.
AND recently played songs Search bar is here and in in discover
*/

import { useEffect, useState } from "react";
import "./Artists.css";
import "./MyPlaylistPage.css";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
import { NavLink } from "react-router-dom";
import SongRow from "../Containers/SongRow";
import SearchBar from "../SearchBar";
import supabase from "../../config/supabaseClient";
import { authUserID } from "../../main";
import ArtistContainer from "../Containers/Artist Containers/ArtistsContainer";

export default function Artists() {
  const [artists, setArtists] = useState([]); // List of IDs
  const [newestAlbums, setNewestAlbums] = useState([]); // List of items

  useEffect(() => {
    supabase.rpc("getsubsnewestalbums").then((result) => {
      //console.log(result.data);
      setNewestAlbums(result.data);
    });
  }, []);

  useEffect(() => {
    supabase
      .from("Users")
      .select("subscribed_artists")
      .eq("id", authUserID)
      .then((result) => {
        //console.log(result.data?.at(0)?.subscribed_artists);
        setArtists(result.data?.at(0)?.subscribed_artists);
      });
    //setArtists();
  }, []);

  return (
    <>
      <div className="artists-page">
        <div className="artists-layout">
          <h1>Artists</h1>
          <section>
            <h2>Latest</h2>

            <ul className="myAlbums">
              {newestAlbums.map((item: any) => (
                <li key={item.id}>
                  <PlaylistContainer playlist_id={item.id} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Subscribed</h2>

            <ul className="ArtistListContainer">
              {artists?.map((item: any) => {
                return (
                  <li key={item}>
                    <ArtistContainer artist_id={item} />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
