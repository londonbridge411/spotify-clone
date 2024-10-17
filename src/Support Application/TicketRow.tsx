import { NavLink } from "react-router-dom";
import "./TicketRow.css";

export default function TicketRow(props: any) {
  let date = new Date(props.data.created_at);
  return (
    <>
      <tr>
        <td>
          <NavLink to={"/support/ticket/" + props.data.id}>
            {props.data.id}
          </NavLink>
        </td>

        <td>{date.toLocaleDateString()}</td>
        <td>{props.data.category}</td>
        <td>{props.data.subcategory}</td>
        <td>{props.data.status}</td>
        <td>{props.data.subject}</td>
      </tr>
    </>
  );
}
