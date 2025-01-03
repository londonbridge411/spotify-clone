import { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { enqueue, setNextQueue, setProperQueue } from "../../../PlayerSlice";
import { useLocation } from "react-router-dom";
import "./SongOrderList.css";
import { RootState } from "../../../store";

export default function QueueOrderList() {
  const [properList, setProperList] = useState([]);
  const [nextList, setNextList] = useState([]);
  const [selectedItem, selectItem] = useState("");
  const [hasLoaded, setLoaded] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [playlistCover, setPlaylistCover] = useState("");
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
      .select("title, album_id, Playlists!Songs_album_id_fkey(cover_url)")
      .eq("id", player.song_id)
      .then((result) => {
        console.log(result);
        setCurrentSong(result.data?.at(0) as any);
        const playlistData: any = result.data?.at(0)?.Playlists;

        setPlaylistCover(playlistData.cover_url);
      });
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

        const tempList = result.data.slice(player.listPosition + 1);
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
    const element = document.getElementsByClassName(
      "songOrderItem-Follow"
    )[0] as HTMLDivElement;

    if (element == null) return;

    console.log(event.target);
    selectItem("");
    element.classList.remove("songOrderItem-Follow");
    //event.target.style.setProperty("background-color", "black");
  }

  function SwapPosition(event: any, index: number) {
    const element = document.getElementsByClassName(
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
      const chosenList =
        selectedQueue == QueueType.PROPER ? properList : nextList;

      // Get Clicked Item
      const clickedItem: any = chosenList.find(
        (i: any) => i?.song_id == selectedItem
      );

      // Get arr version of toList
      const arr: any[] = [...chosenList]; // Not string[], song[]

      const oldIndex = arr.indexOf(clickedItem);

      arr.splice(oldIndex, 1);
      arr.splice(index, 0, clickedItem);

      // Bunch of boundary checking and moving
      const elem: any = document.getElementById("songOrderContainer");

      const boundary = elem.getBoundingClientRect();

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

      const songIdArr: string[] = [];
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
    const queue: any[] = hoveredQueue == QueueType.NEXT ? nextList : properList;

    // Gets the index of the song in that queue
    const index = queue.findIndex((x) => x.song_id == item_id);

    // Copies queue into modifiable array. Then remove elem at index.
    const newArr: any[] = [...queue];
    newArr.splice(index, 1);

    // Take the ids from queue (any[]) and put into a string[] that the player slice can read.
    const convertedArr: string[] = [];

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
          marginBottom: "30px",
        }}
      >
        <h3>Now Playing</h3>
        <img
          src={playlistCover}
          style={{
            display: "flex",
            maxWidth: "7.5vw",
            height: "auto",
            width: "auto/9",
            filter: "drop-shadow(0 0 0.75rem black)",
            outline: "thin solid rgb(42, 42, 42)",

            marginBottom: "30px",
          }}
        />
        <div className="currentSong">{(currentSong as any)?.title}</div>

        <div id="songOrderContainer" style={{ width: "500px", height: "35vh" }}>
          <h3 hidden={hideNext} style={{ marginBottom: "0px" }}>
            Next from Queue
          </h3>
          <span
            hidden={hideNext}
            id="nextQueueBox"
            onMouseEnter={() => {
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
            onMouseEnter={() => {
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
                  onDoubleClick={() => {
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
