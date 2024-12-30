import { useEffect } from "react";
import supabase from "./config/supabaseClient";
import { NavLink, NavigateFunction, useNavigate } from "react-router-dom";
import { SetLoginStatus, getInfo, isLoggedIn } from "./main";
import CustomInputField from "./components/CustomInputField";
import "./LoginSignup.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/app");
  });
  //console.log("Logged In: " + isLoggedIn);

  onkeydown = (e) => {
    if (e.key == "Enter") {
      LoginUser(navigate);
    }
  };

  return (
    <>
      <div id="login-page">
        <main id="login-area">
          <CustomInputField
            inputType={"url"}
            placeholder={"Enter email"}
            label={"Email:"}
            inputID={"email"}
            setType={"none"}
          />

          <CustomInputField
            inputType={"password"}
            placeholder={"Enter password"}
            label={"Password:"}
            inputID={"password"}
            setType={"none"}
          />

          <NavLink to="../reset-password" className="customLink">
            Forgot Password
          </NavLink>
          <button onClick={() => LoginUser(navigate)}>Login</button>
          <button onClick={() => RegisterUser(navigate)}>Signup</button>
        </main>
      </div>
    </>
  );
}

// Logs in the user and takes them to the home page.
function LoginUser(navigate: NavigateFunction) {
  const email_element = document.getElementById("email") as HTMLInputElement;
  const email_text = email_element?.value;

  const pw_element = document.getElementById("password") as HTMLInputElement;
  const pw_text = pw_element?.value;

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email_text,
      password: pw_text,
    });

    // If there is no error run
    if (error == null) {
      SetLoginStatus(true); //This is technically done automatically, but this is a safeguard to make sure it works
      await getInfo();
      navigate("/app/home");
    }
  };
  login();
}

function RegisterUser(navigate: NavigateFunction) {
  navigate("/signup");
}

export default Login;
