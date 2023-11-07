import { useEffect } from "react";
import supabase from "./config/supabaseClient";
import { isLoggedIn } from "./main";
import { useNavigate } from "react-router-dom";


function Signup()
{    
    const navigate = useNavigate();

    useEffect(() =>
    {
        if (isLoggedIn)
        {
            navigate("/home")
        }
    });

    const register = async () => {
        var first_name = document.getElementById("fn") as HTMLInputElement;
        var fn_text = first_name?.value;
    
        var last_name = document.getElementById("ln") as HTMLInputElement;
        var ln_text = last_name?.value;
    
        var username = document.getElementById("username") as HTMLInputElement;
        var username_text = username    ?.value;
    
        var pw_element = document.getElementById("password") as HTMLInputElement;
        var pw_text = pw_element?.value;
    
        var email_element = document.getElementById("email") as HTMLInputElement;
        var email_text = email_element?.value;
    
        var pw_element = document.getElementById("password") as HTMLInputElement;
        var pw_text = pw_element?.value;

        console.log("email: " +  email_text + "\n password: " + pw_text)

        let {error} = await supabase.auth.signUp({
            email: email_text,
            password: pw_text
        });

        if (error)
            return;

        await supabase.from('Users').insert({
            email: email_text,
            first_name: fn_text,
            last_name: ln_text,
            username: username_text
        });


        console.log(await supabase.auth.getUser());

        window.location.reload();

    } 
    return (
        <>
            <label>First Name: <input id = "fn"></input></label>
            <label>Last Name: <input id = "ln"></input></label>
            <label>Username: <input id = "username"></input></label>
            <label>Email: <input id = "email"></input></label>
            <label>Password: <input id = "password"></input></label>


            <button onClick={register}>Signup</button>
        </>
    );
        
    //return await supabase?.auth.signUp({email: email_text, password: pw_text})
}

export default Signup;