import { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient";
import { authUserID, email } from "../../main";
import { useDispatch } from "react-redux";
import { ClosePopup } from "../../PopupControl";
import { CloseSongContextMenu } from "./ContextMenus/SongContextMenu";
import { useLocation, useParams } from "react-router-dom";
import "./SongOrderList.css";
import { setListRef } from "../Middle/Playlist";

export default function SongOrderList(props: any) {
  const [list, setList] = useState([]);

  const { playlistID } = useParams();

  const [selectedItem, selectItem] = useState("");
  const location = useLocation();
  //console.log(playlistID);
  useEffect(() => {
    supabase
      .from("Playlists")
      .select("song_ids, Songs(title, id)")
      .eq("id", playlistID)
      .eq("owner_id", authUserID)
      .then((result) => {
        var array = [];
        var myData = result.data?.at(0);

        //console.log(myData);
        //setList(myData as any);
        if (myData != null) {
          for (let i = 0; i < myData.song_ids.length; i++) {
            let songID = myData.song_ids[i];
            let songTitleIndex = myData.Songs.findIndex(
              (song: any) => song.id == myData?.song_ids[i]
            );

            let item = {
              title: myData.Songs[songTitleIndex].title,
              id: songID,
            };
            array.push(item);
          }

          setList(array as any);
        }
      });
  }, [location]);

  function SelectItem(item_id: string, event: any) {
    selectItem(item_id);
    //console.log(event.target);

    let element = event.target as HTMLDivElement;
    element.classList.add("songOrderItem-Follow");
    //event.target.style.setProperty("background-color", "red");
  }

  function DeselectItem(event: any) {
    //console.log(event.target); //where it is at

    let element = document.getElementsByClassName(
      "songOrderItem-Follow"
    )[0] as HTMLDivElement;

    if (element == null) return;

    //console.log(event.target);
    selectItem("");
    element.classList.remove("songOrderItem-Follow");
    //event.target.style.setProperty("background-color", "black");
  }

  function SwapPosition(event: any, index: number) {
    //console.log(index);
    console.log(event.target);
    let element = document.getElementsByClassName(
      "songOrderItem-Follow"
    )[0] as HTMLDivElement;

    if (element == null) return;

    //console.log(event.target);
    element.classList.remove("songOrderItem-Follow");
    event.target.classList.add("songOrderItem-Follow");

    //let item = list.
    //console.log(list);
    //.splice(indexOf(selectedItem), 1);

    let item: any = list.find((i: any) => i?.id == selectedItem);

    let arr: any[] = [...list];

    let oldIndex = arr.indexOf(item);
    console.log("Index " + oldIndex);
    arr.splice(oldIndex, 1);
    arr.splice(index, 0, item);
    console.log(arr);

    setList(arr as any);
  }

  function UpdateSongList() {
    let update = async () => {
      let uploadList: string[] = [];
      for (let i = 0; i < list.length; i++) {
        uploadList.push((list[i] as any).id);
      }
      console.log(uploadList);
      await supabase
        .from("Playlists")
        .update({ song_ids: uploadList })
        .eq("id", playlistID)
        .then(() => {
          setListRef(uploadList as any);
          ClosePopup();
        });
    };

    update();
  }

  document.onmouseup = (e) => {
    DeselectItem(e);
  };
  return (
    <>
      <div className="songOrderContainer">
        {list.map((item: any, index) => (
          <li
            key={index}
            className="songOrderItem"
            onMouseDown={(e) => {
              SelectItem(item.id, e);
              //console.log("holding: " + item.id);
            }}
            onMouseEnter={(e) => {
              if (selectedItem != "") {
                SwapPosition(e, index);
              }
            }}
          >
            {item.title}
          </li>
        ))}
      </div>

      <button onClick={UpdateSongList}>Save</button>
    </>
  );
}
