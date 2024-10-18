import "./CustomInputField.css";

export default function CustomInputField(props: any) {
  return (
    <>
      <div className="customInput" hidden={props.hidden}>
        <div className="customInputText">
          <label>{props.label}</label>
        </div>
        <div className="customInputBox">
          <input
            onChange={props.onChange}
            id={props.inputType != "textarea" ? props.inputID : ""}
            type={props.inputType}
            placeholder={props.placeholder}
            hidden={props.inputType == "textarea"}
            accept={props.accept} // Happens only if type is set to file
          />

          <textarea
            id={props.inputType == "textarea" ? props.inputID : ""}
            placeholder={props.placeholder}
            hidden={props.inputType != "textarea"}
            onClick={props.OnSet}
            rows={props.textAreaRows}
            cols={props.textAreaCols}
          />

          <button hidden={props.setType != "button"} onClick={props.OnSet}>
            Set
          </button>
        </div>
      </div>
    </>
  );
}
