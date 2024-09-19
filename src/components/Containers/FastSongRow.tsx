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
import "./SongRow.css";
import { OpenSongContextMenu } from "../../SongContextSlice";
import SongContextControl, {
  ViewSongContextMenu,
} from "./ContextMenus/SongContextMenu";

// Fast Song Row
/*
So a potential issue with this is that it is not as scalable as the regular song row.
*/
export default function FastSongRow(props: any) {
  const [songName, setSongName] = useState("");
  const [artists, setArtists] = useState([] as Artist[]);
  const [albumName, setAlbumName] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [views, setViews] = useState(0);
  const [duration, setDuration] = useState("");
  const [albumID, setAlbumID] = useState();

  const [albumCoverURL, setAlbumCoverURL] = useState(
    "../../../src/assets/small_record.svg"
  );

  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  // Set the states for the row
  useEffect(() => {
    //console.log("Loading: " + props.song_id);
    //console.log(props.song_data);
    if (props.song_data != null) {
      setSongName(props.song_data.title);
      setViews(props.song_data.view_count);
      setDuration(props.song_data.duration);
      setDateCreated(props.song_data.created_at);
      setAlbumName(props.song_data.name);
      setAlbumID(props.song_data.album_id);
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
    if (props.song_data == null) return;
    let nameArea = document.getElementById(props.song_data.song_id);

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
    let nameArea = document.getElementById(props.song_data.song_id);

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
      {
        <tr
          id={props.song_data.song_id}
          className="song-row"
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
              let a = document.getElementById(
                "audioControl"
              ) as HTMLAudioElement;
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
          <td
            onClick={() => {
              let nameArea = document.getElementById(props.song_data.song_id);
              let a = document.getElementById(
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
                  : "../../../src/assets/play-row.svg"
              }
            />
          </td>
          <td className="song-row-name">
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
          </td>
          <td className="song-row-views song-row-item mobile-hidden">
            {views}
          </td>
          <td className="song-row-album song-row-item mobile-hidden">
            <NavLink className="customLink" to={"../playlist/" + albumID}>
              {albumName}
            </NavLink>
          </td>
          <td className="song-row-date song-row-item mobile-hidden">
            {dateCreated}
          </td>
          <td className="song-row-duration song-row-item mobile-hidden">
            {duration}
          </td>
        </tr>
      }
    </>
  );
}
