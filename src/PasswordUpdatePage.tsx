import { useNavigate } from "react-router";
import supabase from "./config/supabaseClient";
import CustomInputField from "./components/CustomInputField";

export default function PasswordUpdatePage() {
  const navigate = useNavigate();

  supabase.auth.getUser().then((result) => {
    if (result.data.user == null) {
      navigate("/login");
    }
  });

  function updatePassword() {
    const a = async () => {
      const pw_element = document.getElementById("password") as HTMLInputElement;
      const pw_text = pw_element?.value;

      const verifypw_element = document.getElementById(
        "verify-password"
      ) as HTMLInputElement;
      const verifypw_text = verifypw_element?.value;

      if (pw_text == verifypw_text) {
        await supabase.auth
          .updateUser({ password: pw_text })
          .then(() => navigate("../app/home"));
      } else {
        verifypw_element.value = "";
      }
    };

    a();
  }
  return (
    <>
      <CustomInputField
        inputType={"password"}
        placeholder={"Some name"}
        label={"New Password:"}
        inputID={"password"}
        setType={"none"}
      />

      <CustomInputField
        inputType={"password"}
        placeholder={"Some name"}
        label={"Verify New Password:"}
        inputID={"verify-password"}
        setType={"none"}
      />

      <button onClick={updatePassword}>Update</button>
    </>
  );
}
