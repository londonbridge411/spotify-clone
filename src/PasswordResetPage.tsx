import CustomInputField from "./components/CustomInputField";
import supabase from "./config/supabaseClient";

export default function PasswordResetPage() {
  function sendResetLink() {
    const sendLink = async () => {
      const email_element = document.getElementById("email") as HTMLInputElement;
      const email_text = email_element?.value;

      await supabase.auth.resetPasswordForEmail(email_text, {
        redirectTo: "/update-password",
      });
    };

    sendLink();
  }

  return (
    <>
      <CustomInputField
        inputType={"url"}
        placeholder={""}
        label={"Email:"}
        inputID={"email"}
        setType={"none"}
      />
      <button onClick={sendResetLink}>Send Link</button>
    </>
  );
}
