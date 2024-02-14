import React, { useEffect, useState } from "react";

function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchInput.length > 0) {
      const l = list.filter((item) => {
        return (
          item.id.match(searchInput) ||
          item.username.match(searchInput) ||
          item.name.match(searchInput)
        );
      });
      setSearchResults(l as any);
    }
  }, [searchInput]);

  // This will be in supabase
  const list = [
    { id: "123", username: "londythehammer", name: "London Bowen" },
    { id: "789", username: "londonbridge411", name: "London Bowen" },
    { id: "456", username: "zboster", name: "Zach Boster" },
  ];

  return (
    <div>
      <input
        type="search"
        placeholder="Search by email or ID"
        onChange={(e) => {
          e.preventDefault();
          setSearchInput(e.target.value);
        }}
        value={searchInput}
      />

      <ul>
        {searchResults.map((item: any) => {
          return <li key={item.id}>{item.username}</li>;
        })}
      </ul>
    </div>
  );
}

export default SearchBar;
