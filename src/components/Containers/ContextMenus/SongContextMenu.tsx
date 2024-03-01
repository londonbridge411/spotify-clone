import { isVerified } from "../../../main";
import "./SongContextMenu.css";
import "./ContextButton.css";
import ContextOption_RemoveDeleteSong from "./Song Context Features/RemoveDeleteSong";
import ContextOption_AddToPlaylist from "./Song Context Features/AddToPlaylist";

export var targ: string = "";
var ID: string;
export function CloseSongContextMenu() {
  var menu = document.getElementById(ID) as HTMLElement;
  menu?.style.setProperty("display", "none");
}

export default function SongContextMenu(props: any) {
  // This is to avoid people from accessing states and popups they shouldn't be able to see
  if (props.active && props.requiresVerification && !isVerified) {
    return;
  }

  //setIsPlaylist(document.location.href.includes("playlist"))
  // Clicking outside the context container sets it inactive
  document.onmouseup = function (e) {
    var container = document.getElementById(ID);
    var clickedHTML = e.target as HTMLElement;

    if (!container?.contains(clickedHTML)) {
      CloseSongContextMenu();
      // Calls every subscriber this is closed.
      //ContextCloseSubs.forEach((value: boolean) => (value as any)());
    }
  };

  ID = "SongContext_" + props.songID;
  targ = props.songID;
  // If you save and then press the button it will not work because the page gets screwed up.
  return (
    <>
      <div
        //alert={() => run()}
        id={ID}
        className="song-context-box"
      >
        <div className="song-context-content">
          <ContextOption_AddToPlaylist
            onClick={() => {
              targ = props.songID;
            }}
          />
          <ContextOption_RemoveDeleteSong target={props.songID} />
        </div>
      </div>
    </>
  );
}

// Moves the
export function ViewSongContextMenu(id: string, event: any) {
  var menu = document.getElementById(id) as HTMLElement;

  ID = id;
  menu.style.setProperty("display", "block");
  menu.style.setProperty("--mouse-x", event.clientX + "px");
  menu.style.setProperty("--mouse-y", event.clientY + "px");
}
