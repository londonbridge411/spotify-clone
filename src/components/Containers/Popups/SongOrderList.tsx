import { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import { SwitchToPopup } from "../../../PopupControl";
import { useLocation, useParams } from "react-router-dom";
import "./SongOrderList.css";
//import { setListRef } from "../../Middle/Playlist";

export default function SongOrderList() {
  const [list, setList] = useState([]);

  const { playlistID } = useParams();

  const [selectedItem, selectItem] = useState("");
  const location = useLocation();
  const [hasLoaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .rpc("get_playlist_songs_edit", { playlistid: playlistID })
      .then((result) => {
        console.log(result.data);
        setLoaded(true);
        setList(result.data as any);
      });
  }, [location]);

  function SelectItem(item_id: string, event: any) {
    selectItem(item_id);
    //console.log(event.target.parentElement);

    let element = event.target as HTMLDivElement;

    // In case we click the text and not the box
    if (!element.classList.contains("songOrderItem")) {
      element = element.parentElement as HTMLDivElement;
    }
    element.classList.add("songOrderItem-Follow");
    //event.target.style.setProperty("background-color", "red");
  }

  function DeselectItem() {
    //console.log(event.target); //where it is at

    const element = document.getElementsByClassName(
      "songOrderItem-Follow"
    )[0] as HTMLDivElement;

    if (element == null) return;

    //console.log(event.target);
    selectItem("");
    element.classList.remove("songOrderItem-Follow");
    //event.target.style.setProperty("background-color", "black");
  }

  function SwapPosition(event: any, index: number) {
    const element = document.getElementsByClassName(
      "songOrderItem-Follow"
    )[0] as HTMLDivElement;

    if (element == null) return;

    element.classList.remove("songOrderItem-Follow");
    event.target.classList.add("songOrderItem-Follow");

    console.log(list);
    // let item: any = null;
    // for (let k = 0; k < list.length; k++) {
    //   console.log((list[k] as any).song_id);
    //   console.log(selectedItem);
    //   if ((list[k] as any).song_id == selectedItem) {
    //     item = list[k] as any;
    //     break;
    //   }
    // }
    const item: any = (list as any).find((i: any) => i?.song_id == selectedItem); // Should this not be song_id? For some reason song_id crashes it.
    console.log(item);
    const arr: any[] = [...list];

    const oldIndex = arr.indexOf(item);

    arr.splice(oldIndex, 1);
    arr.splice(index, 0, item);

    const elem: any = document.getElementById("songOrderContainer");

    const boundary = elem.getBoundingClientRect();

    //console.log("Top: " + boundary.top);
    //console.log("mosuer: " +  event.clientY * 0.85);
    if (
      event.clientY > boundary.bottom * 0.9 ||
      event.clientY * 0.85 < boundary.top
    ) {
      if (selectedItem != "") {
        //console.log("SCROLL");
        //elem?.scrollTo(0,event.clientY + 1)
        (event.target as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
    setList(arr as any);
  }

  function UpdateSongList() {
    const update = async () => {
      SwitchToPopup("uploadingWait");

      for (let i = 0; i < list.length; i++) {
        await supabase
          .from("Songs_Playlists")
          .update({ order: i })
          .eq("song_id", (list[i] as any).song_id)
          .eq("playlist_id", playlistID);
      }

      window.location.reload();
    };

    update();
  }

  document.onmouseup = () => {
    DeselectItem();
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
        <h2>Order</h2>
        <div id="songOrderContainer">
          {list.map((item: any, index) => (
            <li
              key={index}
              className="songOrderItem"
              onMouseDown={(e) => {
                SelectItem(item.song_id, e);

                //console.log("holding: " + item.id);
              }}
              onMouseEnter={(e) => {
                if (selectedItem != "") {
                  SwapPosition(e, index);
                }
              }}
            >
              <div className="number">{index + 1 + "."}</div>
              <div className="title">{item.title}</div>
            </li>
          ))}
        </div>

        <button
          style={{ marginTop: "25px", marginBottom: "25px" }}
          onClick={UpdateSongList}
        >
          Save
        </button>
      </div>

      <img
        hidden={hasLoaded}
        src="https://i.gifer.com/ZZ5H.gif"
        style={{ height: "35px", width: "35px" }}
      />
    </>
  );
}
