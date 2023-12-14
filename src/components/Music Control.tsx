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
import {
  LoadPlayer,
  nextSong,
  prevSong,
  setIsPlaying,
  setSongID,
  setVolume,
} from "../PlayerSlice";
import supabase from "../config/supabaseClient";

export default function MusicControl() {
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [playIcon, setPlayIcon] = useState(play);
  const [imgID, setImgID] = useState(null);

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

  function ClickProgressBar(event: any) {
    var a = document.getElementById("audioControl") as HTMLAudioElement;
    var clickPercent = event.nativeEvent.offsetX / window.innerWidth;
    console.log("Percent: " + clickPercent);
    a.currentTime = clickPercent * a.duration;

    ChangeProgress(clickPercent);
  }

  function TogglePlay() {
    dispatch(setIsPlaying(!player.isPlaying));
    let a = document.getElementById("audioControl") as HTMLAudioElement;

    if (player.isPlaying) {
      a.pause();
      setPlayIcon(play);
    } else {
      a.play();
      setPlayIcon(pause);
    }
  }

  // Storage and Effects
  var audioUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("audio-files/" + player.song_id);

  var imageUrl =
    imgID != null
      ? supabase.storage
          .from("music-files")
          .getPublicUrl("pictures/covers/" + imgID)
      : null;

  var audio: HTMLAudioElement;
  useEffect(() => {
    const getSong = async () => {
      await supabase
        .from("Songs")
        .select("*")
        .eq("id", player.song_id)
        .then((result) => {
          var row = result.data?.at(0);

          if (row != null) {
            setName(row.title);

            supabase
              .from("Songs")
              .select("album_id")
              .eq("id", player.song_id)
              .then((result) => {
                let albumID = result.data?.at(0)?.album_id;

                supabase
                  .from("Playlists")
                  .select("image_id")
                  .eq("id", albumID)
                  .then((result2) => setImgID(result2.data?.at(0)?.image_id));
              });

            audio = document.getElementById("audioControl") as HTMLAudioElement;
            audio.load();

            audio.onloadedmetadata = () => {
              setInterval(() => {
                ChangeProgress((audio.currentTime / audio.duration) * 100);
                setCurrentTime(CalculateTime(audio.currentTime));
              }, 0);

              audio.onpause = () => {
                dispatch(setIsPlaying(false));
                audio.pause();
                setPlayIcon(play);
              };

              audio.onplaying = () => {
                dispatch(setIsPlaying(true));
                audio.play();
                setPlayIcon(pause);
              };

              audio.onvolumechange = () => {
                let num = audio.volume * 100;
                dispatch(setVolume(num.toString()));
              };

              let cookie_volume = document.cookie.split("volume=").at(1);

              if (cookie_volume != undefined) {
                //console.log("AAA " + cookie_volume);
                audio.volume = parseInt(cookie_volume) / 100; //Causes error????
              }
              setMaxTime(CalculateTime(audio.duration));

              dispatch(setIsPlaying(true));
              setPlayIcon(pause);

              if (!player.hasLoaded) dispatch(LoadPlayer());
            };
          }
        });
    };

    if (player.song_id != "") getSong();
  }, [player.song_id]);

  document.body.onkeyup = function (e) {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      TogglePlay();
    }
  };

  return (
    <>
      <audio id="audioControl" preload="metadata" autoPlay>
        <source src={audioUrl.data.publicUrl} />
      </audio>

      <div
        id="progress-bar-container-touch"
        onClick={(event) => ClickProgressBar(event)}
      >
        <div id="progress-bar-container">
          <div id="progress-bar"></div>
          <div id="progress-bar-handle"></div>
        </div>
      </div>

      <div id="Soundbar">
        <audio id="audioControl" preload="metadata" autoPlay>
          <source src={audioUrl.data.publicUrl} />
        </audio>

        <div className="name-area">
          <div className="name-area-content">
            <img src={imageUrl?.data.publicUrl} />
            <div className="name-area-content-text">
              <div className="overflow-ellipsis text-bigger text-bold">
                {name}
              </div>
              <div>Artist</div>
            </div>
          </div>
        </div>

        <div className="controls">
          <span id="current-time" className="time">
            {currentTime + " / " + maxTime}
          </span>
          <img
            id="prev-btn"
            className="control-btn"
            onClick={() => {
              if (
                parseInt(
                  document.documentElement.style.getPropertyValue(`--progress`)
                ) < 15
              ) {
                dispatch(prevSong());
              } else {
                let a = document.getElementById(
                  "audioControl"
                ) as HTMLAudioElement;
                a.currentTime = 0;
              }
            }}
            src={prev}
          />
          <img
            id="play-btn"
            className="control-btn"
            onClick={() => TogglePlay()}
            src={playIcon}
          />
          <img
            id="next-btn"
            className="control-btn"
            onClick={() => dispatch(nextSong())}
            src={next}
          />
        </div>

        <div className="volume-control-container">
          <input
            id="volume-control"
            type="range"
            min="0"
            max="100"
            value={player.volume}
            onChange={(e) => {
              let audio = document.getElementById(
                "audioControl"
              ) as HTMLAudioElement;
              audio.volume = parseInt(e.target.value) / 100;
            }}
          />
        </div>
      </div>
    </>
  );
}
