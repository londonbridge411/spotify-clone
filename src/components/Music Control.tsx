import "./Music Control.css";
import play from "../assets/circle-play-solid.svg";
import pause from "../assets/circle-pause-solid.svg";
import prev from "../assets/backward-step-solid.svg";
import next from "../assets/forward-step-solid.svg";
import shuffle from "../assets/shuffle-solid.svg";
import repeat from "../assets/repeat-solid.svg";
import {
  Component,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setSongID } from "../PlayerSlice";
import supabase from "../config/supabaseClient";

function UpdateSong(id: string) {}

export default function MusicControl() {
  const song_id = useSelector((state: RootState) => state.player.song_id);

  const [name, setName] = useState("");
  const [url, setURL] = useState("");

  var audioUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("audio-files/" + song_id);

  useEffect(() => {
    console.log("Super Gay");

    const getSong = async () => {
      await supabase
        .from("Songs")
        .select("*")
        .eq("id", song_id)
        .then((result) => {
          var row = result.data?.at(0);
          setName(row.title);
          setURL(audioUrl.data.publicUrl);
          (document.getElementById("audioControl") as HTMLAudioElement).load();
        });
    };

    if (song_id != "") getSong();
  }, [song_id]);

  return (
    <>
      <div id="Soundbar">
        <p>{name}</p>

        <audio id="audioControl" autoPlay controls>
          <source src={audioUrl.data.publicUrl} />
        </audio>

        <div className="controls">
          <img className="control-btn" src={prev} />
          <img className="control-btn" src={play} />
          <img className="control-btn" src={next} />
        </div>
      </div>
    </>
  );
}
