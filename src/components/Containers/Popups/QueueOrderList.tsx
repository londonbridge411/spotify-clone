import { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import { authUserID } from "../../../main";
import { useDispatch, useSelector } from "react-redux";
import { ClosePopup, SwitchToPopup } from "../../../PopupControl";
import { enqueue, setNextQueue, setProperQueue } from "../../../PlayerSlice";
import { useLocation, useParams } from "react-router-dom";
import "./SongOrderList.css";
import { setListRef } from "../../Middle/Playlist";
import { RootState } from "../../../store";

export default function QueueOrderList() {
  const { playlistID } = useParams();
  const [properList, setProperList] = useState([]);
  const [nextList, setNextList] = useState([]);
  const [selectedItem, selectItem] = useState("");
  const [hasLoaded, setLoaded] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [hideNext, setHideNext] = useState(true);

  enum QueueType {
    NONE,
    PROPER,
    NEXT,
  }

  const [selectedQueue, setSelectedQueue] = useState(QueueType.NONE);
  const [hoveredQueue, setHoveredQueue] = useState(QueueType.NONE);

  const location = useLocation();
  const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  useEffect(() => {
    setHideNext(player.nextQueue.length == 0);
  }, [player.nextQueue]);

  // Current Song
  useEffect(() => {
    supabase
      .from("Songs")
      .select("title")
      .eq("id", player.song_id)
      .then((result) => setCurrentSong(result.data?.at(0) as any));
  }, [player.song_id]);

  // Next Queue
  useEffect(() => {
    supabase.rpc("getqueueinfo", { queue: player.nextQueue }).then((result) => {
      setNextList(result.data as any);
    });
  }, [location, player.song_id, player.nextQueue]);

  // Proper Queue
  useEffect(() => {
    supabase
      .rpc("getqueueinfo", { queue: player.properQueue })
      .then((result) => {
        setLoaded(true);

        let tempList = result.data.slice(player.listPosition + 1);
        setProperList(tempList as any);
      });
  }, [location, player.song_id, player.properQueue]);

  // ---------------------------------------------------------- //

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

    console.log(event.target);
    selectItem("");
    element.classList.remove("songOrderItem-Follow");
    //event.target.style.setProperty("background-color", "black");
  }

  function SwapPosition(event: any, index: number) {
    let element = document.getElementsByClassName(
      "songOrderItem-Follow"
    )[0] as HTMLDivElement;

    if (element == null) return;
    console.log("Holding: " + element.children[1].textContent);
    console.log("Hovered Over: " + event.target.children[1].textContent);

    element.classList.remove("songOrderItem-Follow");
    event.target.classList.add("songOrderItem-Follow");

    // --------------------------------------------------------------------------------------

    // Make sure the lists are the same
    if (selectedQueue == hoveredQueue) {
      // Check list
      let chosenList =
        selectedQueue == QueueType.PROPER ? properList : nextList;

      // Get Clicked Item
      let clickedItem: any = chosenList.find(
        (i: any) => i?.song_id == selectedItem
      );

      // Get arr version of toList
      let arr: any[] = [...chosenList]; // Not string[], song[]

      let oldIndex = arr.indexOf(clickedItem);

      arr.splice(oldIndex, 1);
      arr.splice(index, 0, clickedItem);

      // Bunch of boundary checking and moving
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

      let songIdArr: string[] = [];
      for (let i = 0; i < arr.length; i++) {
        songIdArr.push(arr[i].song_id);
      }

      if (chosenList == properList) {
        setProperList(arr as any);
        dispatch(setProperQueue(songIdArr));
      } else if (chosenList == nextList) {
        setNextList(arr as any);
        dispatch(setNextQueue(songIdArr));
      }
    }
  }

  /*
   Removes a song with a given ID (string).
  */
  function RemoveSong(item_id: string) {
    // Chooses the queue to remove song from.
    let queue: any[] = hoveredQueue == QueueType.NEXT ? nextList : properList;

    // Gets the index of the song in that queue
    let index = queue.findIndex((x) => x.song_id == item_id);

    // Copies queue into modifiable array. Then remove elem at index.
    let newArr: any[] = [...queue];
    newArr.splice(index, 1);

    // Take the ids from queue (any[]) and put into a string[] that the player slice can read.
    let convertedArr: string[] = [];

    for (let i = 0; i < newArr.length; i++) {
      convertedArr.push(newArr[i].song_id);
    }

    // Update queues
    if (queue == nextList) {
      setNextList(newArr as any);
      dispatch(setNextQueue(convertedArr));
    } else if (queue == properList) {
      setProperList(newArr as any);
      dispatch(setProperQueue(convertedArr));
    }
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
        }}
      >
        <h3>Playing</h3>
        <div className="currentSong">{(currentSong as any)?.title}</div>

        <div id="songOrderContainer" style={{ width: "500px", height: "" }}>
          <h3 hidden={hideNext} style={{ marginBottom: "0px" }}>
            Next from Queue
          </h3>
          <span
            hidden={hideNext}
            id="nextQueueBox"
            onMouseEnter={(e) => {
              setHoveredQueue(QueueType.NEXT);
            }}
          >
            {nextList.map((item: any, index) => (
              <div>
                <li
                  key={index}
                  className="songOrderItem"
                  onMouseDown={(e) => {
                    setSelectedQueue(QueueType.NEXT);
                    SelectItem(item.song_id, e);
                  }}
                  onMouseEnter={(e) => {
                    if (selectedItem != "") {
                      SwapPosition(e, index);
                    }
                  }}
                >
                  <div className="number">{index + 1 + "."}</div>
                  <div className="title">{item.title}</div>
                  <div className="x" onClick={() => RemoveSong(item.song_id)}>
                    x
                  </div>
                </li>
              </div>
            ))}
          </span>

          <h3 style={{ marginBottom: "0px" }}>Next from Playlist</h3>
          <p style={{ margin: "0px", color: "rgb(197, 197, 197)" }}>
            Double-click to enqueue
          </p>
          <span
            id="properQueueBox"
            onMouseEnter={(e) => {
              setHoveredQueue(QueueType.PROPER);
            }}
          >
            {properList.map((item: any, index) => (
              <div>
                <li
                  key={index}
                  className="songOrderItem"
                  onMouseDown={(e) => {
                    setSelectedQueue(QueueType.PROPER);
                    SelectItem(item.song_id, e);
                  }}
                  onDoubleClick={(e) => {
                    // Add to queue
                    dispatch(enqueue(item.song_id));
                  }}
                  onMouseEnter={(e) => {
                    if (selectedItem != "") {
                      SwapPosition(e, index);
                    }
                  }}
                >
                  <div className="number">{index + 1 + "."}</div>
                  <div className="title">{item.title}</div>
                  <div className="x" onClick={() => RemoveSong(item.song_id)}>
                    x
                  </div>
                </li>
              </div>
            ))}
          </span>
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
