import { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { SetLoginStatus, isLoggedIn } from "./main";

function Authentication() {
  console.log("Authenticating...");

  //const [loggedIn, setStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    navigate(isLoggedIn ? "/app" : "/login");
  });

  //checkLoginStatus()

  return <div>Auth Provider</div>;
}

export default Authentication;
