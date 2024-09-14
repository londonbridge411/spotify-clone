export default function TicketRow(props: any) {
  let date = new Date(props.data.created_at);
  return (
    <>
      <tr>
        <td>{props.data.id}</td>
        <td>{date.toLocaleDateString()}</td>
        <td>{props.data.subject}</td>
        <td>{props.data.category}</td>
        <td>{props.data.subcategory}</td>
        <td>{props.data.status}</td>
      </tr>
    </>
  );
}
