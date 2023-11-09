export default function SidebarButton(props: any) {
  return (
    <>
      <button onClick={props.onClick}>{props.label}</button>
    </>
  );
}
