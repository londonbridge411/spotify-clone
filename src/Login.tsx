import { useState } from "react";
import supabase from "./config/supabaseClient";

function Login() {
    return (
        <div>
            <label>Enter Email: <input id = "email"></input></label>
            <label>Enter Password: <input id = "password"></input></label>


            <button onClick={LoginUser}>Login</button>
            <button onClick={RegisterUser}>SignUp</button>
            <button onClick={CheckCurrentUser}>Check</button>
            <button onClick={SendTestData}>Send Data</button>
            <button onClick={Logout}>Logout</button>
        </div>

    );
}


async function CheckCurrentUser()
{
    //const [data, error] = await supabase.auth.getSession();
    if ((await supabase.auth.getSession()).data.session != null)
        console.log("There is an active session.");
    else
        console.log("No session (null).");
    //await console.log(await supabase.auth.getUser());
}

async function Logout()
{
    await supabase.auth.signOut();
}

async function LoginUser()
{
    var email_element = document.getElementById("email") as HTMLInputElement;
    var email_text = email_element?.value;

    var pw_element = document.getElementById("password") as HTMLInputElement;
    var pw_text = pw_element?.value;

    /*return await supabase?.from('Users').insert({
        email: email_text,
        first_name: "Jim",
        last_name: "Pickens",
        username: "username" })

    */
    
    await supabase.auth.signInWithPassword({email: email_text, password: pw_text});

    //console.log(await supabase.auth.getUser());

    //return await supabase.auth.signInWithPassword({email: email_text, password: pw_text});
}

async function RegisterUser()
{
    var email_element = document.getElementById("email") as HTMLInputElement;
    var email_text = email_element?.value;

    var pw_element = document.getElementById("password") as HTMLInputElement;
    var pw_text = pw_element?.value;

    //const [data, error] = useState(null);

    /*return await supabase.from('Users').insert({
        email: "email_text",
        first_name: "Jim",
        last_name: "Pickens",
        username: "username" })
    */
        
    //return await supabase?.auth.signUp({email: email_text, password: pw_text})
}

async function SendTestData()
{
    return await supabase.from('aaa').insert({
        num: 4});
}

export default Login