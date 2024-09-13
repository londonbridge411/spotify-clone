import { useState } from "react";
import CustomInputField from "../components/CustomInputField";
import supabase from "../config/supabaseClient";
import { authUserID } from "../main";

export function SupportHome() {
  return (
    <>
      <div className="account-page">
        <div className="account-layout">
          <header>
            <h1>Support Home</h1>
          </header>

          <main>
            <section>
              <h2>My Tickets</h2>
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
