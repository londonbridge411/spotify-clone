import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { NavLink } from "react-router-dom";
import CustomInputField from "./CustomInputField";

enum Filter {
  USERS,
  SONGS,
  ALBUMS,
  PLAYLISTS,
  ALL,
}

function SearchBar(props: any) {
  const [searchInput, setSearchInput] = useState("");

  function ClearResults() {
    props.setSearchResults_Users([]);
    props.setSearchResults_Songs([]);
    props.setSearchResults_Albums([]);
    props.setSearchResults_Playlists([]);
  }

  const [filterBy, setFilter] = useState(Filter.ALL);

  useEffect(() => {
    ClearResults();
    if (searchInput.length > 0) {
      // console.log("Searching...: " + searchInput);

      let regex = searchInput + "%";
      let searchCriteria =
        "id.eq." + searchInput + ", username.eq." + searchInput;

      let getData = async () => {
        // Handle Filter

        if (filterBy == Filter.USERS || filterBy == Filter.ALL) {
          await supabase
            .rpc("searchusers", { input: searchInput, threshhold: 0.35 })
            .then((result) => {
              //console.log(result.data);

              props.setSearchResults_Users(result.data as any);
            });
        }

        if (filterBy == Filter.SONGS || filterBy == Filter.ALL) {
          /*Query selects all public songs with the matching regex*/
          await supabase
            .rpc("searchsongs", { input: searchInput, threshhold: 0.35 })
            .then((result) => {
              props.setSearchResults_Songs(result.data as any);
            });
        }

        if (filterBy == Filter.ALBUMS || filterBy == Filter.ALL) {
          let query = supabase.rpc("searchalbums", {
            input: searchInput,
            threshhold: 0.35,
          });

          const result = await query;

          //console.log(result.data);
          props.setSearchResults_Albums(result.data as any);
        }

        if (filterBy == Filter.PLAYLISTS || filterBy == Filter.ALL) {
          await supabase
            .rpc("searchplaylists", { input: searchInput, threshhold: 0.35 })
            .then((result) => {
              //console.log(result.data);

              props.setSearchResults_Playlists(result.data as any);
            });
        }
      };

      getData();
      //setSearchResults(l as any);
    } else {
      // Clear search results
      //console.log("Clearing");
      ClearResults();
    }
  }, [searchInput, filterBy]);

  const handleDropdown = () => {
    let dropdown_value = (
      document.getElementById("search-filter") as HTMLSelectElement
    )?.value;

    switch (dropdown_value) {
      case "All":
        setFilter(Filter.ALL);
        break;
      case "Users":
        setFilter(Filter.USERS);
        break;
      case "Songs":
        setFilter(Filter.SONGS);
        break;
      case "Albums":
        setFilter(Filter.ALBUMS);
        break;
      case "Playlists":
        setFilter(Filter.PLAYLISTS);
        break;
    }

    //console.log("Filtering by " + filterBy);
  };
  return (
    <>
      <div style={{ display: "flex", height: "30px" }}>
        <CustomInputField
          type="search"
          placeholder="Search by..."
          onChange={(e: any) => {
            e.preventDefault();
            setSearchInput(e.target.value);
          }}
          value={searchInput}
        />

        <select
          defaultValue={"All"}
          id="search-filter"
          style={{
            padding: "7.5px",
            borderRadius: "10px",
            border: "none",
          }}
          onChange={handleDropdown}
        >
          <option value="All">All</option>
          <option value="Songs">Songs</option>
          <option value="Users">Users</option>
          <option value="Albums">Albums</option>
          <option value="Playlists">Playlists</option>
        </select>
      </div>
    </>
  );
}

export default SearchBar;
