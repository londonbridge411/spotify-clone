/*
This page should contain reccomended songs, artists, playlists.
AND recently played songs Search bar is here and in in discover
*/

import { useEffect, useState } from "react";
import "./Artists.css";
import "./MyPlaylistPage.css";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
import supabase from "../../config/supabaseClient";
import { authUserID } from "../../main";
import ArtistContainer from "../Containers/Artist Containers/ArtistsContainer";

export default function Artists() {
  const [artists, setArtists] = useState([]); // List of IDs
  const [newestAlbums, setNewestAlbums] = useState([]); // List of items

  useEffect(() => {
    supabase.rpc("getsubsnewestalbums").then((result) => {
      const arr = [];

      for (let i = 0; i < result.data!.length; i++) {
        arr.push(result.data?.at(i)?.id);
      }

      setNewestAlbums(arr as any);
    });
  }, []);

  useEffect(() => {
    const get = async () => {
      await supabase
        .from("Subscribed_Artists")
        .select("subscribed_to")
        .eq("subscriber", authUserID)
        .then((result) => {
          const arr = [];

          for (let i = 0; i < result.data!.length; i++) {
            arr.push(result.data?.at(i)?.subscribed_to);
          }

          setArtists(arr as any);
        });
    };

    get();
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
                <li key={item}>
                  <PlaylistContainer playlist_id={item} />
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
