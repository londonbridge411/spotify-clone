import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";

export default function ContextOption_AddToPlaylist() {
  // I am mapping ForceClose to the subs array as "addToPlaylist"
  // The reason I use a map is to avoid repeats.

  return (
    <>
      <div className="contextButton">
        <div
          onClick={() => {
            CloseSongContextMenu();
            SwitchToPopup("AddToPlaylist");
          }}
        >
          Add to Playlist
        </div>
      </div>
    </>
  );
}
