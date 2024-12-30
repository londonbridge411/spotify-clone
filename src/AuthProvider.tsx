import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "./main";

function Authentication() {
  console.log("Authenticating...");

  //const [loggedIn, setStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    navigate(isLoggedIn ? "/app/home" : "/login");
  });

  //checkLoginStatus()

  return <div>Auth Provider</div>;
}

export default Authentication;
