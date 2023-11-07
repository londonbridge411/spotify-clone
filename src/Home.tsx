import { Link, useNavigate } from "react-router-dom";
import supabase from "./config/supabaseClient";
import { useEffect } from "react";
import { SetLoginStatus, isLoggedIn } from "./main";
import Sidebar from "./components/Left/Sidebar";
import Album from "./components/Middle/Album";
import Comments from "./components/Right/Comments";
import MusicControl from "./components/Music Control";

function Home()
{
    const navigate = useNavigate();

    useEffect(() =>
    {
        if (isLoggedIn == false)
        {
            navigate("/login")
        }
    });


    function Logout()
    {
       supabase.auth.signOut();
       SetLoginStatus(false);
       navigate('/');
       /*const logout = async () =>
       {
          let {error} = await supabase.auth.signOut();
          
          /*console.log(error);
          if (error == null)
          {

          }
       };*/



   }

    return (
    <div>
        <button onClick={Logout}>Logout</button>
        <Sidebar />
        <Album />
        <Comments />
        <MusicControl />
    </div>
    );
}

export default Home