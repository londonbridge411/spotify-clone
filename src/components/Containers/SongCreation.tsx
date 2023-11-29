import { useState } from "react";
import "./SongCreation.css";

export default function SongCreation() {
  const [search, setSearch] = useState(``);
  /*const [list, setList] = useState([
    "Go to the store",
    "Wash the dishes",
    "Learn some code",
  ]);*/

  // Make this where the playlists go
  const [list, setList] = useState([
    "Go to the store",
    "Wash the dishes",
    "Learn some code",
  ]);

  const addItem = (e: any) => {
    e.preventDefault();
    const item = e.target.newItem.value;
    if (item) setList([...list, item]);
    e.target.reset();
  };

  const handleDelete = (item: any) => {
    setList(list.filter((li) => li !== item));
  };

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
        <input
          type="text"
          className="input"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
        />
        <ul>
          {list
            .filter((li) => li.toLowerCase().includes(search.toLowerCase()))
            .map((item, key) => (
              <li key={key}>
                {item}{" "}
                <span className="delete" onClick={() => handleDelete(item)} />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
