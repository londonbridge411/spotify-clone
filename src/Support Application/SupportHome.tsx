import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { authUserID } from "../main";
import "./SupportHome.css";
import TicketRow from "./TicketRow";
import "./TicketTable.css";

export function SupportHome() {
  const [list, setList] = useState([] as any[]);

  useEffect(() => {
    const fetch = async () => {
      await supabase
        .from("Tickets")
        .select("*")
        .eq("created_by", authUserID)
        .then((response) => {
          const data = response.data as any[];

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
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Status</th>
                  <th>Brief Description</th>
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
