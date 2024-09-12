import { useEffect, useState } from "react";

import "./SupportHome.css";
import ArtistContainer from "../components/Containers/Artist Containers/ArtistsContainer";
import supabase from "../config/supabaseClient";

/*
SHOULD CONTAIN:
* Search bar
* recently played playlists.
* recently played songs.
* what friends have listened too
* new songs/albums by followed artists
*/
export default function Home() {
  const [top10, setTop10] = useState([]);

  useEffect(() => {
    supabase.rpc("selecttop10artists").then((result) => {
      let data = result.data;
      let arr = [];

      for (let i = 0; i < data.length; i++) {
        arr.push(data[i]?.id);
      }
      setTop10(arr as any);
    });
  }, []);

  return (
    <div className="home-page">
      <div className="home-layout">
        <h1>Home</h1>
        <section>
          <h2>Top 10 Artists</h2>
          <ul className="ArtistListContainer">
            {top10?.map((item: any) => {
              return (
                <li key={item}>
                  <ArtistContainer artist_id={item} />
                </li>
              );
            })}
          </ul>
        </section>

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
