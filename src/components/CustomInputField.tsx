export default function CustomInputField(props: any) {
  return (
    <>
      <div hidden={props.hidden}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <label>{props.label}</label>
          <input
            id={props.inputID}
            type={props.inputType}
            placeholder={props.placeholder}
            style={{
              padding: "7.5px",
              borderRadius: "10px",
              border: "none",
            }}
            accept={props.accept} // Happens only if type is set to file
          />

          <button hidden={props.setType != "button"} onClick={props.OnSet}>
            Set
          </button>
        </div>
      </div>
    </>
  );
}
