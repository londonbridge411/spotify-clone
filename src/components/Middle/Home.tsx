import { useState } from "react";
import PlaylistList from "../Containers/Playlist Containers/PlaylistList";
import SearchBar from "../SearchBar";
import { NavLink } from "react-router-dom";
import SongRow from "../Containers/SongRow";

import "./Home.css";
import PlaylistContainer from "../Containers/Playlist Containers/PlaylistContainer";
/*
SHOULD CONTAIN:
* Search bar
* recently played playlists.
* recently played songs.
* what friends have listened too
* new songs/albums by followed artists
*/
export default function Home() {
  const [searchResults_Users, setSearchResults_Users] = useState([]);
  const [searchResults_Songs, setSearchResults_Songs] = useState([]);
  const [searchResults_Albums, setSearchResults_Albums] = useState([]);
  const [searchResults_Playlists, setSearchResults_Playlists] = useState([]);

  return (
    <div className="home-page">
      <div className="home-layout">
        <SearchBar
          setSearchResults_Users={setSearchResults_Users}
          setSearchResults_Songs={setSearchResults_Songs}
          setSearchResults_Albums={setSearchResults_Albums}
          setSearchResults_Playlists={setSearchResults_Playlists}
        />

        <div hidden={searchResults_Songs.length == 0}>
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
        </div>

        <h2 hidden={searchResults_Users?.length == 0}>Users</h2>
        <ul>
          {searchResults_Users?.map((item: any) => {
            return (
              <li key={item.id}>
                <NavLink className="customLink" to={"../account/" + item.id}>
                  {item.username}
                </NavLink>
              </li>
            );
          })}
        </ul>

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
      </div>
    </div>
  );
}
