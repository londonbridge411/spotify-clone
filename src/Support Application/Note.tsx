import { authUserID } from "../main";
import "./Note.css";

export default function Note(props: any) {
  console.log(props.data);
  return (
    <>
      <div className="Note">
        <textarea
          placeholder={"Comment"}
          rows={5}
          cols={150}
          defaultValue={props.data.content}
          disabled={authUserID != props.data.created_by}
        />
        <div className="note-buttons">
          <button
            onClick={() => {}}
            hidden={authUserID != props.data.created_by}
          >
            Update
          </button>
          <button onClick={() => {}}>Reply</button>
        </div>
      </div>
    </>
  );
}
