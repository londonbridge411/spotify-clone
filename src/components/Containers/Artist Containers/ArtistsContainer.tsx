import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./ArtistsContainer.css";
import supabase from "../../../config/supabaseClient";

export default function ArtistContainer(props: any) {
  const [pfpURL, setPfpURL] = useState("../../../src/assets/default_user.png");
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    supabase
      .from("Users")
      .select("*")
      .eq("id", props.artist_id)
      .then((result) => {
        //console.log(result.data);
        setArtistName(result.data?.at(0)?.username);
        setPfpURL(
          result.data?.at(0)?.pfp_url == "" ||
            result.data?.at(0)?.pfp_url == null
            ? "../../../src/assets/default_user.png"
            : result.data?.at(0)?.pfp_url
        );
      });
  }, []);
  return (
    <>
      <NavLink to={"/app/account/" + props.artist_id}>
        <div className="ArtistContainer">
          <img src={pfpURL} />
          <div className="pl-container-name_holder">{artistName}</div>
        </div>
      </NavLink>
    </>
  );
}
