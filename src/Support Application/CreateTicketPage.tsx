import { useState } from "react";
import CustomInputField from "../components/CustomInputField";
import supabase from "../config/supabaseClient";
import { authUserID } from "../main";

export function CreateTicketPage() {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const handleCategory = () => {
    const category_value = (
      document.getElementById("ticket-category") as HTMLSelectElement
    )?.value;

    setCategory(category_value);

    console.log(category_value);
  };

  const handleSubCategory = () => {
    const subcategory_value = (
      document.getElementById("ticket-subcategory") as HTMLSelectElement
    )?.value;

    setSubcategory(subcategory_value);
  };

  function SubmitTicket() {
    const subject = (
      document.getElementById("set-ticket-subject") as HTMLInputElement
    )?.value;

    const desc = (
      document.getElementById("set-ticket-desc") as HTMLTextAreaElement
    )?.value;

    // Guard statement
    if (category == "" || subcategory == "" || subject == "" || desc == "")
      return;

    const insertTicket = async () => {
      await supabase
        .from("Tickets")
        .insert({
          created_by: authUserID,
          subject: subject,
          description: desc,
          category: category,
          subcategory: subcategory,
        })
        .then(() => document.location.reload());
    };

    insertTicket();
  }

  return (
    <>
      <div className="account-page">
        <div className="account-layout">
          <header>
            <h1>New Ticket</h1>
          </header>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <label style={{ color: "rgb(197, 197, 197)", fontWeight: "500" }}>
              Category:
            </label>

            <select
              defaultValue={""}
              id="ticket-category"
              onChange={handleCategory}
            >
              <option value=""></option>
              <option value="Account">Account</option>
              <option value="Report">Report</option>
              <option value="Question">Question</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <label style={{ color: "rgb(197, 197, 197)", fontWeight: "500" }}>
              Subcategory:
            </label>

            <select
              defaultValue={""}
              id="ticket-subcategory"
              onChange={handleSubCategory}
            >
              <option value=""></option>
              <option hidden={category == "Other"} value="General">
                General
              </option>
              <option hidden={category != "Account"} value="Account Locked">
                Account Locked
              </option>
              <option
                hidden={category != "Account"}
                value="Account Compromised"
              >
                Account Compromised
              </option>
              <option
                hidden={category != "Account"}
                value="Account Verification"
              >
                Account Verification
              </option>
              <option hidden={category != "Account"} value="Password Reset">
                Password Reset
              </option>
              <option hidden={category != "Report"} value="Copyright">
                Copyright
              </option>
              <option hidden={category != "Report"} value="Bug/Issue">
                Bug/Issue
              </option>
              <option
                hidden={category != "Report"}
                value="Inappropriate Behavior/Content"
              >
                Inappropriate Behavior/Content
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div
            hidden={subcategory != "Account Verification"}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
              color: "#E34234",
            }}
          >
            * For verification, you will need to include links or send an email
            to umuse.support@gmail.com with 2-3 files of your work and uMuse
            User ID for review. Please do not include anything offensive. You
            will be banned. If you fail to include your work, this ticket will
            be closed and you will remain unverified.
          </div>

          <main>
            <CustomInputField
              inputType={"url"}
              placeholder={"Ex) Can't Login"}
              label={"Brief Description:"}
              inputID={"set-ticket-subject"}
              setType={"none"}
            />
            <CustomInputField
              inputType={"textarea"}
              placeholder={"Describe your issue"}
              label={"Description:"}
              inputID={"set-ticket-desc"}
              setType={"none"}
              textAreaRows={20}
              textAreaCols={150}
            />

            <button
              onClick={SubmitTicket}
              style={{ width: "100px", alignSelf: "center" }}
            >
              Submit
            </button>
          </main>
        </div>
      </div>
    </>
  );
}
