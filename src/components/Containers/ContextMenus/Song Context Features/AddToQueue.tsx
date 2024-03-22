import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";
import { addToQueue } from "../../../../PlayerSlice";
import { RootState, store } from "../../../../store";
import { useSelector } from "react-redux";

export default function ContextOption_AddToQueue(props: any) {
  // I am mapping ForceClose to the subs array as "addToPlaylist"
  // The reason I use a map is to avoid repeats.
  const player = useSelector((state: RootState) => state.player);

  return (
    <>
      <div className="contextButton">
        <div
          onClick={() => {
            store.dispatch(addToQueue(props.target));
            CloseSongContextMenu();
          }}
        >
          Add to Queue
        </div>
      </div>
    </>
  );
}
