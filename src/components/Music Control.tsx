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
import { LoadPlayer, setIsPlaying, setSongID, setVolume } from "../PlayerSlice";
import supabase from "../config/supabaseClient";


export default function MusicControl() {
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [playIcon, setPlayIcon] = useState(play);

  // Changes Progress 
  function ChangeProgress(i: number) {
    document.documentElement.style.setProperty(`--progress`, i + "%");
  }

  function CalculateTime(secs: number) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  }


  var audioUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("audio-files/" + player.song_id);


  var audio: HTMLAudioElement;
  useEffect(() => {
    const getSong = async () => {
      await supabase
        .from("Songs")
        .select("*")
        .eq("id", player.song_id)
        .then((result) => {
          var row = result.data?.at(0);
          setName(row.title);
          audio = (document.getElementById("audioControl") as HTMLAudioElement);
          audio.load();

          console.log(audio.duration);

          audio.onloadedmetadata = () => {
            setInterval((() => {
              ChangeProgress(((audio.currentTime / audio.duration) * 100));
              setCurrentTime(CalculateTime(audio.currentTime));
            }), 0)
            //audio.ontimeupdate = 
            setMaxTime(CalculateTime(audio.duration));

            dispatch(setIsPlaying(true));
            setPlayIcon(pause);

            if (!player.hasLoaded) dispatch(LoadPlayer());
          };
        });
    };

    if (player.song_id != "") getSong();
  }, [player.song_id]);


  function ClickProgressBar(event: any) {
    var a = (document.getElementById("audioControl") as HTMLAudioElement);
    var clickPercent = event.nativeEvent.offsetX / window.innerWidth;
    console.log("Percent: " + clickPercent);
    a.currentTime = clickPercent * a.duration;

    ChangeProgress(clickPercent);
  }

  function TogglePlay() {
    console.log("gay");
    
    dispatch(setIsPlaying(!player.isPlaying));
    let a = (document.getElementById("audioControl") as HTMLAudioElement);

    if (player.isPlaying) {
      a.pause();
      setPlayIcon(play);
    }
    else {
      a.play();
      setPlayIcon(pause);
    }
  }

  document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
      TogglePlay()
    }
  }

  return (
    <>
      <div id="progress-bar-container" onClick={(event) => ClickProgressBar(event)}>
        <div id="progress-bar">
        </div>
        <div id="progress-bar-handle"></div>
      </div>
      
      <div id="Soundbar">
        <p>{name}</p>

        <audio id="audioControl" preload="metadata" autoPlay>
          <source src={audioUrl.data.publicUrl} />
        </audio>

        <span id="current-time" className="time">{currentTime + " / " + maxTime}</span>

        <div className="controls">
          <img className="control-btn" src={prev} />
          <img className="control-btn" onClick={() => TogglePlay()} src={playIcon} />
          <img className="control-btn" src={next} />
        </div>

        <div className="slidecontainer">
          <input type="range" min="1" max="100" value={player.volume} onChange={e => dispatch(setVolume(e.target.value))} />
        </div>
      </div>
    </>
  );
}
