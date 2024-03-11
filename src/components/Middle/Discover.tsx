/*
This page should contain reccomended songs, artists, playlists.
AND recently played songs Search bar is here and in in discover
*/

import { useState } from "react";
import "./Discover.css";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
import { NavLink } from "react-router-dom";
import SongRow from "../Containers/SongRow";
import SearchBar from "../SearchBar";

export default function Discover() {
  const [searchResults_Users, setSearchResults_Users] = useState([]);
  const [searchResults_Songs, setSearchResults_Songs] = useState([]);
  const [searchResults_Albums, setSearchResults_Albums] = useState([]);
  const [searchResults_Playlists, setSearchResults_Playlists] = useState([]);
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

          <section hidden={searchResults_Songs.length == 0}>
            <h2>Songs</h2>

            <ul className="song-table">
              <div style={{ color: "rgba(0, 0, 0, 0)" }}>
                ?<hr></hr>
              </div>
              <div className="text-bold">
                Name <hr></hr>
              </div>
              <div className="text-bold">
                Views <hr></hr>
              </div>
              <div className="text-bold">
                Album <hr></hr>
              </div>
              <div className="text-bold">
                Created <hr></hr>
              </div>
              <div className="text-bold">
                Duration <hr></hr>
              </div>
              {searchResults_Songs?.map((item: any) => {
                return (
                  <SongRow key={item.id} song_id={item.id} song_list={null} />
                );
              })}
            </ul>
          </section>

          <section hidden={searchResults_Users?.length == 0}>
            <h2>Users</h2>
            <ul>
              {searchResults_Users?.map((item: any) => {
                return (
                  <li key={item.id}>
                    <NavLink
                      className="customLink"
                      to={"../account/" + item.id}
                    >
                      {item.username}
                    </NavLink>
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
