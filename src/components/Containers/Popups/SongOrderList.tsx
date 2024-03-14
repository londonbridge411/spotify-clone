import { useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";
import { authUserID } from "../../../main";
import { useDispatch } from "react-redux";
import { ClosePopup, SwitchToPopup } from "../../../PopupControl";
import { useLocation, useParams } from "react-router-dom";
import "./SongOrderList.css";
import { setListRef } from "../../Middle/Playlist";
import { setSongList } from "../../../PlayerSlice";

export default function SongOrderList() {
  const [list, setList] = useState([]);

  const { playlistID } = useParams();

  const [selectedItem, selectItem] = useState("");
  const location = useLocation();
  const [hasLoaded, setLoaded] = useState(false);

  const dispatch = useDispatch();

  //console.log(playlistID);
  useEffect(() => {
    supabase
      .rpc("get_playlist_songs_edit", { uid: playlistID })
      .then((result) => {
        //console.log(result.data);
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
    let element = document.getElementsByClassName(
      "songOrderItem-Follow"
    )[0] as HTMLDivElement;

    if (element == null) return;

    element.classList.remove("songOrderItem-Follow");
    event.target.classList.add("songOrderItem-Follow");

    let item: any = list.find((i: any) => i?.id == selectedItem);

    let arr: any[] = [...list];

    let oldIndex = arr.indexOf(item);

    arr.splice(oldIndex, 1);
    arr.splice(index, 0, item);

    let elem: any = document.getElementById("songOrderContainer");

    let boundary = elem.getBoundingClientRect();

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
    let update = async () => {
      let uploadList: string[] = [];
      for (let i = 0; i < list.length; i++) {
        uploadList.push((list[i] as any).id);
      }

      SwitchToPopup("uploadingWait");
      //console.log(uploadList);
      await supabase
        .from("Playlists")
        .update({ song_ids: uploadList })
        .eq("id", playlistID)
        .then(() => {
          setListRef(uploadList as any);
          // Works, but think about a case where you are listening to one song, edit another playlist and then it updates. This would cause issues.
          //dispatch(setSongList(uploadList));
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
                SelectItem(item.id, e);

                //console.log("holding: " + item.id);
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
