import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";


export default function ContextOption_RenameSong(props: any) {
  // Removes the song from the playlist

  return (
    <>
      <div
        className="contextButton"
        hidden={!props.isOwner}
        onClick={() => {
          CloseSongContextMenu();
          SwitchToPopup("RenameSong");
        }}
      >
        Rename Song
      </div>
    </>
  );
}
