/*
This page should contain reccomended songs, artists, playlists.
AND recently played songs Search bar is here and in in discover
*/

import { useEffect, useState } from "react";
import "./Discover.css";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
import SearchBar from "../SearchBar";
import ArtistContainer from "../Containers/Artist Containers/ArtistsContainer";
import FastSongRow from "../Containers/FastSongRow";
import MobileSongRow from "../Containers/MobileSongRow";
import supabase from "../../config/supabaseClient";

export default function Discover() {
  const [searchResults_Users, setSearchResults_Users] = useState([]);
  const [searchResults_Songs, setSearchResults_Songs] = useState([] as any[]);
  const [searchResults_Albums, setSearchResults_Albums] = useState([]);
  const [searchResults_Playlists, setSearchResults_Playlists] = useState([]);

  const [songList, setSongList] = useState([] as any);

  useEffect(() => {
    const fetch = async () => {
      // Takes the stuff from the search results and puts it in an array
      const arr = [];
      for (let i = 0; i < searchResults_Songs.length; i++) {
        arr.push(searchResults_Songs[i].id);
      }

      await supabase.rpc("getsongs", { song_ids: arr }).then((result) => {
        setSongList(result.data);
      });
    };

    fetch();
  }, [searchResults_Songs]);

  return (
    <>
      <div className="discover-page">
        <div className="discover-layout">
          <h1>Discover</h1>
          <SearchBar
            setSearchResults_Users={setSearchResults_Users}
            setSearchResults_Songs={setSearchResults_Songs}
            setSearchResults_Albums={setSearchResults_Albums}
            setSearchResults_Playlists={setSearchResults_Playlists}
          />

          <section hidden={songList.length == 0}>
            <h2>Songs</h2>
            <div
              className="playlist-content mobile-hidden"
              style={{ display: "flex" }}
            >
              <table className="song-table playlist-content mobile-hidden">
                <thead>
                  <tr>
                    <th>
                      <p style={{ color: "rgba(0, 0, 0, 0)", padding: "0" }}>
                        p
                      </p>
                    </th>
                    <th>Name</th>
                    <th>Views</th>
                    <th>Album</th>
                    <th>Created</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                  </tr>
                  {songList?.map((item: any) => {
                    //console.log(item);
                    return (
                      <>
                        <FastSongRow
                          key={item.song_id}
                          song_data={item}
                          song_list={null}
                        />
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mobile-view mobile-song-view">
              {songList.map((item: any) => {
                // item broke somehow
                return (
                  <MobileSongRow
                    key={item.song_id + "-mobileA"}
                    song_data={item}
                    song_list={null}
                  />
                );
              })}
            </div>
          </section>

          <section hidden={searchResults_Users?.length == 0}>
            <h2>Users</h2>
            <ul className="ArtistListContainer">
              {searchResults_Users?.map((item: any) => {
                return (
                  <li key={item.id}>
                    <ArtistContainer artist_id={item.id}>
                      {item.username}
                    </ArtistContainer>
                  </li>
                );
              })}
            </ul>
          </section>

          <section hidden={searchResults_Albums?.length == 0}>
            <h2>Albums</h2>
            <div className="myAlbums">
              {searchResults_Albums?.map((item: any) => (
                <li key={item.id}>
                  <PlaylistContainer playlist_id={item.id} />
                </li>
              ))}
            </div>
          </section>

          <section hidden={searchResults_Playlists?.length == 0}>
            <h2>Playlists</h2>
            <div className="myAlbums">
              {searchResults_Playlists?.map((item: any) => (
                <li key={item.id}>
                  <PlaylistContainer playlist_id={item.id} />
                </li>
              ))}
            </div>
          </section>

          <h3
            hidden={
              !(
                searchResults_Users?.length == 0 &&
                searchResults_Songs?.length == 0 &&
                searchResults_Albums?.length == 0 &&
                searchResults_Playlists?.length == 0
              )
            }
          >
            No results
          </h3>
        </div>
      </div>
    </>
  );
}
