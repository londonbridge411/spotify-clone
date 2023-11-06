import { useEffect, useState } from "react";
import supabase from "./config/supabaseClient";
import { useNavigate } from "react-router-dom";
 
function Authentication(props:any)
{
    console.log("Authenticating...");
    const [loggedIn, setStatus] = useState(false);
    
    function checkLoginStatus()
    {

        supabase.auth.getSession().then((res) =>
        {
            setStatus(res.data.session != null);
        });


        const navigate = useNavigate();
        navigate('/home');
        return loggedIn;
    }

    if (checkLoginStatus())
    {
        console.log("Login Status: " + loggedIn);
        //router.push('/login')
        //route to home
    }

    return(
        <>
        Auth Provider
        </>
    );
}

export default Authentication;