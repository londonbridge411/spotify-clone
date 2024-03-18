import { useEffect } from "react";
import supabase from "./config/supabaseClient";
import { isLoggedIn } from "./main";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import CustomInputField from "./components/CustomInputField";

function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/app");
    }
  });

  const register = async () => {
    var first_name = document.getElementById("fn") as HTMLInputElement;
    var fn_text = first_name?.value;

    var last_name = document.getElementById("ln") as HTMLInputElement;
    var ln_text = last_name?.value;

    var username = document.getElementById("username") as HTMLInputElement;
    var username_text = username?.value;

    var pw_element = document.getElementById("password") as HTMLInputElement;
    var pw_text = pw_element?.value;

    var pw_element = document.getElementById(
      "verify-password"
    ) as HTMLInputElement;
    var pw_text = pw_element?.value;

    var email_element = document.getElementById("email") as HTMLInputElement;
    var email_text = email_element?.value;

    var verifypw_element = document.getElementById(
      "password"
    ) as HTMLInputElement;
    var verifypw_text = verifypw_element?.value;

    console.log("email: " + email_text + "\n password: " + pw_text);

    if (pw_text != verifypw_text) {
      console.log("Passwords do not match.");
      return;
    }
    let { error } = await supabase.auth.signUp({
      email: email_text,
      password: pw_text,
    });

    if (error) return;

    await supabase.from("Users").insert({
      id: (await supabase.auth.getUser()).data.user?.id,
      email: email_text,
      first_name: fn_text,
      last_name: ln_text,
      username: username_text,
      pfp_url: null,
    });

    console.log(await supabase.auth.getUser());

    window.location.reload();
  };
  return (
    <>
      <CustomInputField
        inputType={"url"}
        placeholder={"Some name"}
        label={"First Name:"}
        inputID={"fn"}
        setType={"none"}
      />

      <CustomInputField
        inputType={"url"}
        placeholder={"Some name"}
        label={"Last Name:"}
        inputID={"ln"}
        setType={"none"}
      />

      <CustomInputField
        inputType={"url"}
        placeholder={"Some name"}
        label={"Username:"}
        inputID={"username"}
        setType={"none"}
      />

      <CustomInputField
        inputType={"url"}
        placeholder={"Some name"}
        label={"Email:"}
        inputID={"email"}
        setType={"none"}
      />

      <CustomInputField
        inputType={"password"}
        placeholder={"Some name"}
        label={"Password:"}
        inputID={"password"}
        setType={"none"}
      />

      <CustomInputField
        inputType={"password"}
        placeholder={"Some name"}
        label={"Verify Password:"}
        inputID={"verify-password"}
        setType={"none"}
      />

      <button onClick={register}>Signup</button>
      <button onClick={() => navigate("/Login")}>Cancel</button>
    </>
  );

  //return await supabase?.auth.signUp({email: email_text, password: pw_text})
}

export default Signup;
