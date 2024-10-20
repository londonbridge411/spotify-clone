import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSongID,
  setIsPlaying,
  enqueue,
  setProperQueue,
  clearFullQueue,
} from "../../PlayerSlice";
import supabase from "../../config/supabaseClient";
import { RootState, store } from "../../store";
import { NavLink } from "react-router-dom";
import { Artist } from "./Popups/UploadSongPopup";
import "../../Links.css";
import "../../mobile.css";
import { OpenSongContextMenu } from "../../SongContextSlice";
import SongContextControl, {
  ViewSongContextMenu,
} from "./ContextMenus/SongContextMenu";
// Song Row
export default function MobileSongRow(props: any) {
  const [songName, setSongName] = useState("");
  const [artists, setArtists] = useState([] as Artist[]);
  const [albumName, setAlbumName] = useState("");
  const [albumID, setAlbumID] = useState();

  const [albumCoverURL, setAlbumCoverURL] = useState(
    "../../../src/assets/small_record.svg"
  );

  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  // Set the states for the row
  useEffect(() => {
    //console.log("Loading: " + props.song_data.song_id);
    if (props.song_data != null) {
      setAlbumName(props.song_data.album_title);
      setAlbumID(props.song_data.album_id);
      setSongName(props.song_data.title);

      if (props.song_data.cover_url != "")
        setAlbumCoverURL(props.song_data.cover_url);

      let arr: string[] = props.song_data?.contributors;

      let myList = [] as Artist[];
      for (let i = 0; i < (arr as string[]).length; i++) {
        let s = arr[i] as string;
        let info = s.split("=");

        let art: Artist = {
          id: info[0],
          username: info[1],
        };

        myList.push(art);
      }
      setArtists(myList);
    }
  }, [props.forceUpdate]); // forceUpdate is a collection of states from the playlist. The idea is that whenever the cover or name updates, it updates in the song row.

  // Change play icon
  useEffect(() => {
    if (props.song_data.song_id == null) return;
    //let nameArea = document.getElementById(props.song_data.song_id);
    let nameAreas = document.getElementsByClassName("mobile-song-row");
    let nameArea = nameAreas.namedItem(props.song_data.song_id);

    if (player.song_id == nameArea?.id) {
      (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
        "src",
        "../../../src/assets/audio.gif"
      );
      (nameArea?.children[0].children[0] as HTMLElement).classList.add(
        "audioGIF"
      );
    } else {
      (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
        "src",
        albumCoverURL
      );
      (nameArea?.children[0].children[0] as HTMLElement).classList.remove(
        "audioGIF"
      );
    }

    (nameArea?.children[1].children[0] as HTMLElement).style.color =
      player.song_id == nameArea?.id ? "#8DFFFF" : "#FFFFFF";
  }, [player.song_id]);

  // Change play icon
  useEffect(() => {
    if (props.song_data.song_id == null) return;
    let nameAreas = document.getElementsByClassName("mobile-song-row");
    let nameArea = nameAreas.namedItem(props.song_data.song_id);

    if (player.song_id == nameArea?.id) {
      if (player.isPlaying) {
        (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
          "src",
          "../../../src/assets/audio.gif"
        );
      } else {
        (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
          "src",
          "../../../src/assets/play-row.svg"
        );
      }
    }
  }, [player.isPlaying]);

  return (
    <>
      <div
        id={props.song_data.song_id}
        className="mobile-song-row"
        // On right click
        onContextMenu={(e) => {
          e.preventDefault();

          // Don't even have to do this. Just send the song_id to state
          ViewSongContextMenu(props.song_data.song_id, e);
        }}
        // On left click
        onDoubleClick={() => {
          let nameArea = document.getElementById(props.song_data.song_id);
          if (player.song_id != nameArea?.id) {
            if (props.song_list != null) dispatch(clearFullQueue());

            dispatch(setProperQueue(props.song_list));
            dispatch(setSongID(props.song_data.song_id));
          } else {
            let a = document.getElementById("audioControl") as HTMLAudioElement;
            a.currentTime = 0;
            a.play();
          }
        }}
        onMouseEnter={() => {
          if (props.song_data.song_id == null) return;

          let nameArea = document.getElementById(props.song_data.song_id);
          if (player.song_id != nameArea?.id) {
            (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
              "src",
              "../../../src/assets/play-row.svg"
            );
          }
        }}
        onMouseLeave={() => {
          if (props.song_data.song_id == null) return;

          let nameArea = document.getElementById(props.song_data.song_id);
          if (player.song_id != nameArea?.id) {
            (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
              "src",
              albumCoverURL
            );
          }
        }}
      >
        <div
          onClick={() => {
            let nameArea = document.getElementById(props.song_data.song_id);
            let a = document.getElementById("audioControl") as HTMLAudioElement;
            if (player.song_id == nameArea?.id) {
              if (player.isPlaying) a.pause();
              else a.play();
              //setPlayIcon(play);
            } else {
              a.play();
              if (props.song_list != null) {
                dispatch(clearFullQueue());

                //for (let i = 0; i < props.song_list.length; i++) {
                //  dispatch(addToEndOfQueue(props.song_list[i]));
                //}

                dispatch(setProperQueue(props.song_list));
                //dispatch(setPlaylistSongs(props.song_list));
              }

              dispatch(setSongID(props.song_data.song_id));
              dispatch(setIsPlaying(!player.isPlaying));
            }
          }}
        >
          <img
            src={
              player.song_id != props.song_data.song_id
                ? albumCoverURL
                : "../../../src/assets/play-row.svg"
            }
          />
        </div>
        <div className="grid-item song-row-name">
          <div className="overflow-ellipsis text-bigger text-bold">
            {songName}
          </div>

          <div>
            <div className="song-row-artists">
              {artists.map((item: any) => {
                return (
                  <li key={item.id}>
                    <NavLink
                      className="customLink"
                      to={"../account/" + item.id}
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
    </>
  );
}
