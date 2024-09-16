import "./Music Control.css";
import "./Marquee.css";
import "./../Links.css";
import "./../tooltip.css";
import "./../mobile.css";
import play from "../assets/circle-play-solid.svg";
import pause from "../assets/circle-pause-solid.svg";
import prev from "../assets/backward-step-solid.svg";
import next from "../assets/forward-step-solid.svg";
import bars from "../assets/bars-solid.svg";
import shuffle from "../assets/shuffle-solid.svg";
import repeat from "../assets/repeat-solid.svg";
import exitFS from "../assets/exit_fullscreen.svg";
import enterFS from "../assets/enter_fullscreen.svg";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../store";
import {
  ClearPlayer,
  LoadPlayer,
  nextSong,
  prevSong,
  setIsPlaying,
  setLooping,
  setSongID,
  setVolume,
} from "../PlayerSlice";
import supabase from "../config/supabaseClient";
import { NavLink } from "react-router-dom";
import { Artist } from "./Containers/Popups/UploadSongPopup";
import { authUserID, getCookies, isLoggedIn } from "../main";
import { SwitchToPopup } from "../PopupControl";

var changingTime = false;
var prevPlayState = false;
var changeTimeInterval = null;
var changeTimeIntervalResize = null;

export function ResetPlayer() {
  changingTime = false;
  prevPlayState = false;
  clearInterval(changeTimeInterval!);
  clearInterval(changeTimeIntervalResize!);
  store.dispatch(ClearPlayer());
}

export default function MusicControl() {
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [currentTime, setCurrentTime] = useState("--:--");
  const [maxTime, setMaxTime] = useState("--:--");
  const [viewCount, setViewCount] = useState(0);
  const [playIcon, setPlayIcon] = useState(play);
  const [imgURL, setImgURL] = useState("../../../src/assets/small_record.svg");
  const [artists, setArtists] = useState([] as Artist[]);
  const [albumID, setAlbumID] = useState("");
  const [likeState, setLikeState] = useState(
    "../../../src/assets/star-regular.svg"
  );

  const [volIconState, SetVolIconState] = useState(
    "../../../src/assets/vol-none.png"
  );

  const [backgroundUrl, setBG_URL] = useState("");

  useEffect(() => {
    if (player.song_id != "" && document.fullscreenElement) {
      supabase
        .from("Songs")
        .select("album_id")
        .eq("id", player.song_id)
        .then((result) => {
          let albumID = result.data?.at(0)?.album_id;

          supabase
            .from("Playlists")
            .select("bg_url")
            .eq("id", albumID)
            .then((result2) => {
              setBG_URL(result2.data?.at(0)?.bg_url);

              document.getElementById("page")!.style.transition =
                "all 0.25s ease-in; opacity: 100%";
              document.getElementById("page")!.style.backgroundImage =
                "url(" + result2.data?.at(0)?.bg_url + ")";
            });
        });
    } else {
      window.document.getElementById("page")!.style.backgroundImage = "none";
      if (document.fullscreenElement) window.document.exitFullscreen();
    }
  }, [player.song_id, document.fullscreenElement]);

  // Use to track the time the song has been listened to uninterrupted. Not 100% accurate, but not too inaccurate.
  const [timeListened, setTimeListened] = useState(0);
  useInterval(() => {
    // Your custom logic here
    if (timeListened == 30) {
      let update = async () => {
        await supabase
          .from("Songs")
          .update({ view_count: viewCount + 1 })
          .eq("id", player.song_id);
      };

      update();
    }
    if (player.isPlaying) setTimeListened(timeListened + 1);
  }, 1000);

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
    var clickPercent = event.clientX / window.innerWidth;
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

  function UpdateVolume() {
    let audio = document.getElementById("audioControl") as HTMLAudioElement;
    let num = audio.volume * 100;

    // Set in player
    dispatch(setVolume(num.toString()));

    // Change Icon
    let icon_path: string = "";

    if (num == 0) {
      icon_path = "../../../src/assets/vol-muted.png";
    } else if (num > 0 && num <= 32) {
      // Vol Low
      icon_path = "../../../src/assets/vol-low.png";
    } else if (num >= 32 && num <= 66) {
      // Vol Med
      icon_path = "../../../src/assets/vol-mid.png";
    } else if (num >= 63 && num <= 100) {
      // Vol High
      icon_path = "../../../src/assets/vol-high.png";
    }

    SetVolIconState(icon_path);
  }

  // Storage and Effects
  var audioUrl = supabase.storage
    .from("music-files")
    .getPublicUrl("audio-files/" + player.song_id);

  var audio: HTMLAudioElement;
  useEffect(() => {
    const getSong = async () => {
      setCurrentTime("--:--");
      setMaxTime("--:--");
      await supabase
        .from("Songs")
        .select("title, view_count, artist_data, album_id")
        .eq("id", player.song_id)
        .then((result) => {
          //console.log(result.data)
          var row = result.data?.at(0);

          if (row != null) {
            setName(row.title);
            setViewCount(row.view_count);

            // Fill In artists"
            let myList = [] as Artist[];
            for (let i = 0; i < row.artist_data.length; i++) {
              let art: Artist = {
                id: row?.artist_data[i].id,
                username: row?.artist_data[i].username,
              };
              myList.push(art);
            }
            setArtists(myList);
            supabase
              .from("Users")
              .select("liked_songs")
              .eq("id", authUserID)
              .then((result) => {
                if (result.data?.at(0)?.liked_songs.includes(player.song_id))
                  setLikeState("../../../src/assets/star-solid.svg");
                else setLikeState("../../../src/assets/star-regular.svg");
              });
            // Cover URL
            let albumID = result.data?.at(0)?.album_id;
            setAlbumID(albumID);

            supabase
              .from("Playlists")
              .select("cover_url")
              .eq("id", albumID)
              .then((result) => {
                let cover = result.data?.at(0)?.cover_url;
                setImgURL(
                  cover == "" ? "../../../src/assets/small_record.svg" : cover
                );
              });

            // Audio
            audio = document.getElementById("audioControl") as HTMLAudioElement;
            audio.load();

            let cookies = getCookies();
            audio.onloadedmetadata = () => {
              setCurrentTime("0:00"); // Maybe delete this? It's meant to fix a bug
              MarqueeCheck();

              changeTimeInterval = setInterval(() => {
                if (player.isPlaying) {
                  ChangeProgress((audio.currentTime / audio.duration) * 100);
                  setCurrentTime(CalculateTime(audio.currentTime));
                }
              }, 0);

              window.onresize = () => {
                changeTimeIntervalResize = setInterval(() => {
                  if (player.isPlaying) {
                    ChangeProgress((audio.currentTime / audio.duration) * 100);
                    setCurrentTime(CalculateTime(audio.currentTime));
                  }
                }, 0);
              };

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
                UpdateVolume();
              };

              audio.onended = () => {
                dispatch(nextSong());
              };

              // Volume Cookie
              let cookie_volume = cookies["volume"];

              if (cookie_volume != undefined && !Number.isNaN(cookie_volume)) {
                audio.volume = parseInt(cookie_volume!) / 100; //Causes error????
                UpdateVolume();
              }

              // Loop Cookie

              let cookie_loop = cookies["loop"];

              if (cookie_loop != undefined) {
                let cookie_value: boolean = cookie_loop === "true";
                dispatch(setLooping(cookie_value));
              }

              setMaxTime(CalculateTime(audio.duration));

              dispatch(setIsPlaying(true));
              setPlayIcon(pause);

              if (!player.hasLoaded) dispatch(LoadPlayer());
            };
          }
        });
    };
    setTimeListened(0);
    if (player.song_id != "") getSong();
  }, [player.song_id]);

  useEffect(() => {}, [player.song_id]);
  document.body.onkeyup = function (e) {
    if (
      (e.key == " " || e.code == "Space" || e.keyCode == 32) &&
      e.target == document.body
    ) {
      TogglePlay();
    }
  };

  // Allows play/pause on mouse click whenever full screen as long as it's not on the control bar.
  document.onpointerdown = (e) => {
    if (document.fullscreenElement) {
      var container = document.getElementById("main-fullscreen");
      var clickedHTML = e.target as HTMLElement;

      if (container?.contains(clickedHTML)) {
        TogglePlay();
      }
    }
  };

  window.onresize = MarqueeCheck;

  function MarqueeCheck() {
    let name_area = document.getElementById("player-name-area") as HTMLElement;

    let name_text_element = document.getElementById(
      "name-area-text"
    ) as HTMLDivElement;
    name_text_element.classList.remove("marquee");

    if (
      name_area.scrollHeight > name_area.clientHeight ||
      name_area.scrollWidth > name_area.clientWidth
    ) {
      // The reason I hide it is because auto makes it go to a scrollbar.
      name_area.style.overflow = "hidden";
      name_text_element.classList.add("marquee");
    } else {
      name_area.style.overflow = "auto";
      name_text_element.classList.remove("marquee");
    }
  }

  function LikeSong() {
    const insertIntoTable = async () => {
      // Now we need to append ID to array in playlist

      await supabase
        .from("Users")
        .select("liked_songs")
        .eq("id", authUserID)
        .then(async (result) => {
          var array: string[] = result.data?.at(0)?.liked_songs;

          let icon = "";
          // Guard Statement
          if (array.includes(player.song_id)) {
            // Unlike
            array.splice(array.indexOf(player.song_id as string), 1);
            icon = "../../../src/assets/star-regular.svg";
          } else {
            // Like
            array.push(player.song_id as string);
            icon = "../../../src/assets/star-solid.svg";
          }

          await supabase
            .from("Users")
            .update({ liked_songs: array })
            .eq("id", authUserID)
            .then(() => setLikeState(icon));
        });
    };

    insertIntoTable();
  }

  function ToggleMute() {
    let audio = document.getElementById("audioControl") as HTMLAudioElement;
    audio.volume = audio.volume > 0 ? 0 : 0.5;
    //UpdateVolume();
  }
  onpointerup = () => {
    //console.log(changingTime);
    if (changingTime && player.hasLoaded) {
      changingTime = false;
      let a = document.getElementById("audioControl") as HTMLAudioElement;

      if (prevPlayState == true) a.play();
    }
  };

  onpointermove = (event) => {
    if (player.hasLoaded && isLoggedIn) {
      let handle: any = document.getElementById("progress-bar-handle");
      if (changingTime) {
        handle.style.visibility = "visible";
        ClickProgressBar(event);
      } else {
        handle!.style.visibility = "hidden";
      }
    }
  };
  return (
    <div>
      <audio id="audioControl" preload="metadata" autoPlay>
        <source src={audioUrl.data.publicUrl} />
      </audio>

      <div
        id="progress-bar-container-touch"
        draggable="false"
        onPointerDown={(event) => {
          prevPlayState = player.isPlaying;
          changingTime = true;
          let a = document.getElementById("audioControl") as HTMLAudioElement;
          a.pause();
          //setPlayIcon(play);
          ClickProgressBar(event);
        }}
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

        <div id="name-area-parent">
          <div id="player-name-area" style={{ overflow: "auto" }}>
            <div className="name-area-content">
              <div>
                <NavLink className="customLink" to={"/app/playlist/" + albumID}>
                  <img src={imgURL} />
                </NavLink>
              </div>

              <div className="name-area-content-text">
                <div
                  id="name-area-text"
                  className="overflow-ellipsis text-bigger text-bold"
                >
                  <span>{name}</span>
                </div>
                <div>
                  <div className="song-row-artists">
                    {artists.map((item: any) => {
                      return (
                        <li key={item.id}>
                          <NavLink
                            className="customLink"
                            to={"/app/account/" + item.id}
                          >
                            {item.username}
                          </NavLink>
                        </li>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tooltip">
            <img
              id="control-like-btn"
              onClick={() => LikeSong()}
              src={likeState}
            />
            <span
              className="tooltiptext tt-top"
              style={{ marginLeft: "20%", bottom: "65px" }}
            >
              {likeState == "../../../src/assets/star-solid.svg"
                ? "Unlike"
                : "Like"}
            </span>
          </div>
        </div>
        <div className="controls">
          <span id="current-time" className="time mobile-hidden">
            {currentTime}
          </span>
          <div className="tooltip">
            <img
              id="prev-btn"
              className="control-btn"
              onClick={() => {
                if (
                  parseInt(
                    document.documentElement.style.getPropertyValue(
                      `--progress`
                    )
                  ) < 3 &&
                  player.listPosition > 0
                ) {
                  dispatch(prevSong());
                } else {
                  let a = document.getElementById(
                    "audioControl"
                  ) as HTMLAudioElement;
                  a.currentTime = 0;
                  a.play();

                  // start time
                }
              }}
              src={prev}
            />
            <span className="tooltiptext tt-top" style={{ marginLeft: "-50%" }}>
              Previous
            </span>
          </div>

          <div className="tooltip">
            <img
              id="play-btn"
              className="control-btn"
              onClick={() => TogglePlay()}
              src={playIcon}
            />
            <span className="tooltiptext tt-top" style={{ marginLeft: "0%" }}>
              {player.isPlaying ? "Pause" : "Play"}
            </span>
          </div>

          <div className="tooltip">
            <img
              id="next-btn"
              className="control-btn"
              onClick={() => {
                dispatch(nextSong());
              }}
              src={next}
            />
            <span className="tooltiptext tt-top" style={{ marginLeft: "0%" }}>
              Next
            </span>
          </div>

          <span id="max-time" className="time mobile-hidden">
            {maxTime}
          </span>
        </div>

        <div className="volume-control-container mobile-hidden">
          <div className="tooltip mobile-hidden">
            <img
              id="loop-button"
              onClick={() => {
                dispatch(setLooping(!player.isLooping));
              }}
              src={repeat}
            />
            <span className="tooltiptext tt-top">
              {player.isLooping ? "Stop Repeat" : "Repeat"}
            </span>
          </div>

          <div className="tooltip">
            <img
              className="fullscreen-button"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                  document.getElementById("page")!.style.backgroundImage =
                    "url(" + backgroundUrl + ")";
                } else if (document.exitFullscreen) {
                  document.getElementById("page")!.style.backgroundImage = "";
                  document.exitFullscreen();
                }
              }}
              src={document.fullscreenElement ? exitFS : enterFS} // This is backwards for some reason but it works
            />
            <span className="tooltiptext tt-top">
              {document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen"}
            </span>
          </div>

          <div className="tooltip">
            <img
              className="queue-button"
              onClick={() => SwitchToPopup("queue")}
              src={bars}
            />
            <span className="tooltiptext tt-top">View Queue</span>
          </div>

          <div className="tooltip">
            <img
              className="volume-button"
              onClick={ToggleMute}
              src={volIconState}
            />
            <span className="tooltiptext tt-top">
              {parseInt(player.volume) == 0 ? "Unmute" : "Mute"}
            </span>
          </div>

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
    </div>
  );
}

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      (savedCallback as any).current(); //Needs ()
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
