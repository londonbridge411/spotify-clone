import { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SetLoginStatus, goHomePage, isLoggedIn } from "./main";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/app");
  });
  //console.log("Logged In: " + isLoggedIn);

  return (
    <>
      <label>
        Enter Email: <input id="email"></input>
      </label>
      <label>
        Enter Password: <input id="password"></input>
      </label>

      <button onClick={() => LoginUser(navigate)}>Login</button>
      <button onClick={() => RegisterUser(navigate)}>SignUp</button>
    </>
  );
}

// Logs in the user and takes them to the home page.
function LoginUser(navigate: NavigateFunction) {
  var email_element = document.getElementById("email") as HTMLInputElement;
  var email_text = email_element?.value;

  var pw_element = document.getElementById("password") as HTMLInputElement;
  var pw_text = pw_element?.value;

  const login = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email_text,
      password: pw_text,
    });

    // If there is no error run
    if (error == null) {
      SetLoginStatus(true); //This is technically done automatically, but this is a safeguard to make sure it works
      await goHomePage();
      navigate("/app");
    }
  };
  login();
}

function RegisterUser(navigate: NavigateFunction) {
  navigate("/signup");
}

export default Login;
