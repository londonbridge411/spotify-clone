import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSongList, setSongID, setIsPlaying } from "../../PlayerSlice";
import supabase from "../../config/supabaseClient";
import { RootState } from "../../store";
import SongContextMenu, {
  ViewSongContextMenu,
} from "./ContextMenus/SongContextMenu";
import ContextMenuOption from "./ContextMenuOption";
import { NavLink } from "react-router-dom";

interface Artist {
  id: string;
  username: string;
}
// Song Row
export default function SongRow(props: any) {
  const [songName, setSongName] = useState("");
  const [artists, setArtists] = useState([] as Artist[]);
  const [albumName, setAlbumName] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [albumCoverURL, setAlbumCoverURL] = useState(
    "../../../src/assets/small_record.svg"
  );
  useEffect(() => {
    //update
  }, [albumCoverURL]);

  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  //var coverURL = se"../../../src/assets/record-vinyl-solid.svg";
  /*albumCoverID != ""
      ? supabase.storage
          .from("music-files")
          .getPublicUrl("pictures/covers/" + albumCoverID).data.publicUrl
      : "../../../src/assets/record-vinyl-solid.svg";*/

  const [albumID, setAlbumID] = useState();
  useEffect(() => {
    if (props.song_id != null) {
      supabase
        .from("Songs")
        .select(
          "title, artist_ids, created_at, album_id, Playlists(id, name, cover_url)"
        )
        .eq("id", props.song_id)
        .then(async (result) => {
          var row = result.data?.at(0);
          var playlistData: any = row?.Playlists;

          if (row != null) {
            setSongName(row.title);
            setDateCreated(row.created_at);

            setAlbumID(row.album_id);

            let myList = [] as Artist[];
            for (let i = 0; i < row.artist_ids.length; i++) {
              await supabase
                .from("Users")
                .select("username")
                .eq("id", row.artist_ids[i])
                .then((r) => {
                  let art: Artist = {
                    id: row?.artist_ids[i],
                    username: r.data?.at(0)?.username,
                  };
                  myList.push(art);
                });
            }
            console.log(myList);
            setArtists(myList);

            if (playlistData.cover_url != "")
              setAlbumCoverURL(playlistData.cover_url);

            setAlbumName(playlistData.name);
          }
        });
    }
  }, [props.forceUpdate]); // forceUpdate is a collection of states from the playlist. The idea is that whenever the cover or name updates, it updates in the song row.

  useEffect(() => {
    if (props.song_id == null) return;
    let nameArea = document.getElementById(props.song_id);

    if (player.song_id == nameArea?.id) {
      (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
        "src",
        "https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif"
      );
      (nameArea?.children[0].children[0] as HTMLElement).classList.add(
        "audioGIF",
        "smallIcon"
      );
    } else {
      (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
        "src",
        albumCoverURL
      );
      (nameArea?.children[0].children[0] as HTMLElement).classList.remove(
        "audioGIF",
        "smallIcon"
      );
    }
    //.filter =
    //player.song_id == nameArea?.id ? "brightness(50%)" : "none";

    (nameArea?.children[1].children[0] as HTMLElement).style.color =
      player.song_id == nameArea?.id ? "#8DFFFF" : "#FFFFFF";
  }, [player.song_id]);

  useEffect(() => {
    if (props.song_id == null) return;
    let nameArea = document.getElementById(props.song_id);

    if (player.song_id == nameArea?.id) {
      if (player.isPlaying) {
        (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
          "src",
          "https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f5eb96f2.gif"
        );
      } else {
        (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
          "src",
          "../../../src/assets/small-play.svg"
        );
      }
    }
  }, [player.isPlaying]);

  return (
    <>
      <div
        id={props.song_id}
        className="song-row"
        // On right click
        onContextMenu={(e) => {
          e.preventDefault();

          // Don't even have to do this. Just send the song_id to state
          ViewSongContextMenu("Song_ContextMenu", e);
        }}
        // On left click
        onDoubleClick={() => {
          let nameArea = document.getElementById(props.song_id);
          if (player.song_id != nameArea?.id) {
            dispatch(setSongList(props.song_list));
            dispatch(setSongID(props.song_id));
          } else {
            let a = document.getElementById("audioControl") as HTMLAudioElement;
            a.currentTime = 0;
            a.play();
          }
        }}
        onMouseEnter={() => {
          if (props.song_id == null) return;

          let nameArea = document.getElementById(props.song_id);
          if (player.song_id != nameArea?.id) {
            (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
              "src",
              "../../../src/assets/small-play.svg"
            );

            (nameArea?.children[0].children[0] as HTMLElement).classList.add(
              "smallIcon"
            );
          }
        }}
        onMouseLeave={() => {
          if (props.song_id == null) return;

          let nameArea = document.getElementById(props.song_id);
          if (player.song_id != nameArea?.id) {
            (nameArea?.children[0].children[0] as HTMLElement).setAttribute(
              "src",
              albumCoverURL
            );

            (nameArea?.children[0].children[0] as HTMLElement).classList.remove(
              "smallIcon"
            );
          }
        }}
      >
        <div
          onClick={() => {
            let nameArea = document.getElementById(props.song_id);
            let a = document.getElementById("audioControl") as HTMLAudioElement;
            if (player.song_id == nameArea?.id) {
              if (player.isPlaying) a.pause();
              else a.play();
              //setPlayIcon(play);
            } else {
              a.play();
              dispatch(setSongList(props.song_list));
              dispatch(setSongID(props.song_id));
              dispatch(setIsPlaying(!player.isPlaying));
            }
          }}
        >
          <img
            src={
              player.song_id != props.song_id
                ? albumCoverURL
                : "../../../src/assets/small-play.svg"
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
                    <NavLink to={"../account/" + item.id}>
                      {item.username}
                    </NavLink>
                  </li>
                );
              })}
            </div>
          </div>
        </div>
        <div className="song-row-album">
          <NavLink to={"../playlist/" + albumID}>{albumName}</NavLink>
        </div>
        <div className="song-row-date">{dateCreated}</div>
      </div>

      <SongContextMenu
      // About to leave but a thought is to store the selected song in a state
      //requiresVerification={() => playlistType != "Playlist"}
      />
    </>
  );
}
