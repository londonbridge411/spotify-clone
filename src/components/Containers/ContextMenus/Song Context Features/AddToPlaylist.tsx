import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";

export default function ContextOption_AddToPlaylist(props: any) {
  // I am mapping ForceClose to the subs array as "addToPlaylist"
  // The reason I use a map is to avoid repeats.

  return (
    <>
      <div className="contextButton">
        <div
          onClick={() => {
            props.onClick();
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
