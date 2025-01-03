import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSongID,
  setIsPlaying,
  setProperQueue,
  clearFullQueue,
} from "../../PlayerSlice";
import { RootState } from "../../store";
import { NavLink } from "react-router-dom";
import { Artist } from "./Popups/UploadSongPopup";
import "../../Links.css";
import "../../mobile.css";
import { ViewSongContextMenu } from "./ContextMenus/SongContextMenu";

import Record from "../../../src/assets/small_record.svg";
import AudioGIF from "../../../src/assets/audio.gif";
import PlayRow from "../../../src/assets/play-row.svg";

// Song Row
export default function MobileSongRow(props: any) {
  const [songName, setSongName] = useState("");
  const [artists, setArtists] = useState([] as Artist[]);

  const [albumCoverURL, setAlbumCoverURL] = useState(Record);

  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  // Set the states for the row
  useEffect(() => {
    //console.log("Loading: " + props.song_data.song_id);
    if (props.song_data != null) {
      setSongName(props.song_data.title);

      if (props.song_data.cover_url != "")
        setAlbumCoverURL(props.song_data.cover_url);

      const arr: string[] = props.song_data?.contributors;

      const myList = [] as Artist[];
      for (let i = 0; i < (arr as string[]).length; i++) {
        const s = arr[i] as string;
        const info = s.split("=");

        const art: Artist = {
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
    const nameAreas = document.getElementsByClassName("mobile-song-row");
    const nameArea = nameAreas.namedItem(props.song_data.song_id);

    if (player.song_id == nameArea?.id) {
      (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
        "src",
        AudioGIF
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
    const nameAreas = document.getElementsByClassName("mobile-song-row");
    const nameArea = nameAreas.namedItem(props.song_data.song_id);

    if (player.song_id == nameArea?.id) {
      if (player.isPlaying) {
        (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
          "src",
          AudioGIF
        );
      } else {
        (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
          "src",
          PlayRow
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
          const nameArea = document.getElementById(props.song_data.song_id);
          if (player.song_id != nameArea?.id) {
            if (props.song_list != null) dispatch(clearFullQueue());

            dispatch(setProperQueue(props.song_list));
            dispatch(setSongID(props.song_data.song_id));
          } else {
            const a = document.getElementById(
              "audioControl"
            ) as HTMLAudioElement;
            a.currentTime = 0;
            a.play();
          }
        }}
        onMouseEnter={() => {
          if (props.song_data.song_id == null) return;

          const nameArea = document.getElementById(props.song_data.song_id);
          if (player.song_id != nameArea?.id) {
            (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
              "src",
              PlayRow
            );
          }
        }}
        onMouseLeave={() => {
          if (props.song_data.song_id == null) return;

          const nameArea = document.getElementById(props.song_data.song_id);
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
            const nameArea = document.getElementById(props.song_data.song_id);
            const a = document.getElementById(
              "audioControl"
            ) as HTMLAudioElement;
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
                : PlayRow
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
