import { useEffect, useState } from "react";
import CustomInputField from "../components/CustomInputField";
import supabase from "../config/supabaseClient";
import { authUserID } from "../main";
import "./SupportHome.css";
import TicketRow from "./TicketRow";
import "./TicketTable.css";

export default function AdminTickets() {
  const [list, setList] = useState([] as any[]);

  useEffect(() => {
    let fetch = async () => {
      await supabase
        .from("Tickets")
        .select("*")
        .eq("status", "Open")
        .then((response) => {
          let data = response.data as any[];

          setList(data);
        });
    };

    fetch();
  }, []);

  return (
    <>
      <div id="support-home" className="account-page">
        <div className="account-layout">
          <header>
            <h1>Support Home</h1>
          </header>

          <main>
            <section>
              <h2>My Tickets</h2>
              <table className="ticket-table">
                <tr>
                  <th>Ticket Number</th>
                  <th>Created</th>
                  <th>Brief Description</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Status</th>
                </tr>
                {list.map((item) => {
                  return <TicketRow data={item} />;
                })}
              </table>
            </section>
            <section>
              <h2>Common Questions</h2>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
