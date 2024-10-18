import { useEffect, useState } from "react";
import CustomInputField from "../components/CustomInputField";
import supabase from "../config/supabaseClient";
import { authUserID, IsAdmin } from "../main";
import { useNavigate, useParams } from "react-router-dom";
import Note from "./Note";

export function Ticket() {
  const { ticketID } = useParams();
  const navigate = useNavigate();

  const [pageVisible, setPageVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("");
  const [creatorID, setCreatorID] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [notes, setNotes] = useState([] as any[]);

  // Get ticket data
  useEffect(() => {
    const fetch = async () => {
      await supabase
        .from("Tickets")
        .select("*, Users(first_name, last_name, email)")
        .eq("id", ticketID)
        .then(async (result) => {
          let info = result.data?.at(0) as any;

          // Find if is admin
          let isAdmin: boolean = await IsAdmin();

          // Check ownership or admin rights
          if (info["created_by"] == authUserID || isAdmin) {
            setPageVisible(true);

            // Set creator info
            setCreatorID(info["created_by"]);
            setEmail(info.Users["email"]);
            setFullName(
              info.Users["first_name"] + " " + info.Users["last_name"]
            );

            // Set Category
            let cat = document.getElementById(
              "ticket-category"
            ) as HTMLSelectElement;

            cat.value = info["category"];
            setCategory(info["category"]);

            // Set Subcategory
            let subCat = document.getElementById(
              "ticket-subcategory"
            ) as HTMLSelectElement;

            subCat.value = info["subcategory"];
            setSubcategory(info["subcategory"]);

            // Set Subcategory
            let status_value = document.getElementById(
              "ticket-status"
            ) as HTMLSelectElement;

            console.log(info["status"]);
            status_value.value = info["status"];
            setStatus(info["status"]);

            // Fetch Descriptions
            let subject = document.getElementById(
              "set-ticket-subject"
            ) as HTMLInputElement;

            subject.value = info["subject"];

            let desc = document.getElementById(
              "set-ticket-desc"
            ) as HTMLTextAreaElement;

            desc.value = info["description"];

            // Disable Buttons
            cat.disabled = !isAdmin;
            subCat.disabled = !isAdmin;
          } else {
            setPageVisible(false);
            window.alert("Access Violation");
            navigate("../support/home");
          }
        });

      // Fetch Notes
      await supabase
        .from("Ticket_Notes")
        .select()
        .eq("ticket_id", ticketID)
        .order("created_at")
        .then((result) => {
          setNotes(result.data!);
        });
    };

    fetch();
  }, []);

  // Ticket Modification
  const handleCategory = () => {
    let category_value = (
      document.getElementById("ticket-category") as HTMLSelectElement
    )?.value;

    setCategory(category_value);
  };

  const handleSubCategory = () => {
    let subcategory_value = (
      document.getElementById("ticket-subcategory") as HTMLSelectElement
    )?.value;

    setSubcategory(subcategory_value);
  };

  const handleStatus = () => {
    let status_value = (
      document.getElementById("ticket-status") as HTMLSelectElement
    )?.value;

    setSubcategory(status_value);
  };

  function UpdateTicket() {
    let subject = (
      document.getElementById("set-ticket-subject") as HTMLInputElement
    )?.value;

    let desc = (
      document.getElementById("set-ticket-desc") as HTMLTextAreaElement
    )?.value;

    // Guard statement
    if (category == "" || subcategory == "" || subject == "" || desc == "")
      return;

    let insertTicket = async () => {
      await supabase
        .from("Tickets")
        .update({
          subject: subject,
          description: desc,
          category: category,
          subcategory: subcategory,
          status: status,
        })
        .eq("id", ticketID)
        .then(() => document.location.reload());
    };

    insertTicket();
  }

  function PostNote() {
    // Get text
    let desc = (
      document.getElementById("add-ticket-note") as HTMLTextAreaElement
    )?.value;

    // Guard statement
    if (desc == "") return;

    let post = async () => {
      await supabase
        .from("Ticket_Notes")
        .insert({ ticket_id: ticketID, content: desc })
        .then((result) => {
          if (result.error != null) console.error(result.error);
          else {
            (
              document.getElementById("add-ticket-note") as HTMLTextAreaElement
            ).value = "";
          }
        });
    };

    post();
  }

  return (
    <>
      <div className="account-page" hidden={!pageVisible}>
        <div className="account-layout">
          <header style={{ display: "block", userSelect: "text" }}>
            <h1 style={{ margin: "0" }}>Ticket #{ticketID}</h1>
            <h3 style={{ marginTop: "10px", color: "rgb(197, 197, 197)" }}>
              UID: {creatorID}
            </h3>
            <h3 style={{ color: "rgb(197, 197, 197)" }}>Name: {fullName}</h3>
            <h3 style={{ color: "rgb(197, 197, 197)" }}>Email: {email}</h3>
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
              Status:
            </label>

            <select
              defaultValue={""}
              id="ticket-status"
              onChange={handleStatus}
            >
              <option value=""></option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Canceled">Canceled</option>
              <option value="Closed">Closed</option>
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
              onClick={UpdateTicket}
              style={{ width: "100px", alignSelf: "center" }}
            >
              Update
            </button>
          </main>

          <header>
            <h2>Notes</h2>
          </header>
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <CustomInputField
              inputType={"textarea"}
              placeholder={"Enter text..."}
              label={"Create New Note:"}
              inputID={"add-ticket-note"}
              setType={"none"}
              textAreaRows={5}
              textAreaCols={150}
            />
            <button
              onClick={PostNote}
              style={{
                width: "100px",
                alignSelf: "center",
                justifySelf: "center",
              }}
            >
              Post
            </button>
          </section>
          <section>
            {notes.map((item) => {
              return <Note data={item} />;
            })}
          </section>
        </div>
      </div>
    </>
  );
}
