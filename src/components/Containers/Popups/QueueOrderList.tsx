import { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import { authUserID } from "../../../main";
import { useDispatch, useSelector } from "react-redux";
import { ClosePopup, SwitchToPopup } from "../../../PopupControl";
import { addToQueue, clearQueue } from "../../../PlayerSlice";
import { useLocation, useParams } from "react-router-dom";
import "./SongOrderList.css";
import { setListRef } from "../../Middle/Playlist";
import { RootState } from "../../../store";

export default function QueueOrderList() {
  const { playlistID } = useParams();
  const [list, setList] = useState([]);
  const [viewableList, setViewableList] = useState([]);
  const [selectedItem, selectItem] = useState("");
  const [hasLoaded, setLoaded] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  const location = useLocation();
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.rpc("getqueueinfo", { queue: player.queue }).then((result) => {
      setLoaded(true);

      setList(result.data as any);

      setCurrentSong(result.data[player.listPosition]);
      let tempList = result.data.slice(player.listPosition + 1);
      setViewableList(tempList as any);
    });
  }, [location, player.song_id]);

  function SelectItem(item_id: string, event: any) {
    //console.log(item_id);
    selectItem(item_id);

    let element = event.target as HTMLDivElement;

    // In case we click the text and not the box
    if (!element.classList.contains("songOrderItem")) {
      element = element.parentElement as HTMLDivElement;
    }
    element.classList.add("songOrderItem-Follow");
  }

  function DeselectItem(event: any) {
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
    let element = document.getElementsByClassName(
      "songOrderItem-Follow"
    )[0] as HTMLDivElement;

    if (element == null) return;
    // console.log("Holding: " + element.children[1].textContent);
    // console.log("Hovered Over: " + event.target.children[1].textContent);
    element.classList.remove("songOrderItem-Follow");
    event.target.classList.add("songOrderItem-Follow");

    let item: any = viewableList.find((i: any) => i?.song_id == selectedItem);

    //console.log(item);
    let arr: any[] = [...viewableList];

    let oldIndex = arr.indexOf(item);

    arr.splice(oldIndex, 1);
    arr.splice(index, 0, item);

    let elem: any = document.getElementById("songOrderContainer");

    let boundary = elem.getBoundingClientRect();

    if (
      event.clientY > boundary.bottom * 0.9 ||
      event.clientY * 0.85 < boundary.top
    ) {
      if (selectedItem != "") {
        (event.target as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }

    let alreadyplayed: any = list.slice(0, player.listPosition);
    let newArray = alreadyplayed.concat(currentSong, arr); // Appends previous songs, currentSong, and the viewable list (songs that haven't been played yet)

    setList(newArray as any);
    dispatch(clearQueue());

    for (let i = 0; i < newArray.length; i++) {
      dispatch(addToQueue(newArray[i].song_id));
    }

    setViewableList(arr as any);
  }

  document.onmouseup = (e) => {
    DeselectItem(e);
  };

  return (
    <>
      <div
        hidden={!hasLoaded}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          justifySelf: "center",
          width: "500px",
          height: "500px",
        }}
      >
        <h2>Up Next</h2>

        <li className="currentSong">
          <div>{(currentSong as any)?.title}</div>
        </li>

        <div id="songOrderContainer">
          {viewableList.map((item: any, index) => (
            <li
              key={index}
              className="songOrderItem"
              onMouseDown={(e) => {
                //console.log(item.song_id);
                SelectItem(item.song_id, e);

                //console.log("Selecting: " + item.title);
              }}
              onMouseEnter={(e) => {
                if (selectedItem != "") {
                  SwapPosition(e, index);
                }
              }}
            >
              <div>{index + 1 + "."}</div>
              <div>{item.title}</div>
            </li>
          ))}
        </div>
      </div>

      <img
        hidden={hasLoaded}
        src="https://i.gifer.com/ZZ5H.gif"
        style={{ height: "35px", width: "35px" }}
      />
    </>
  );
}
