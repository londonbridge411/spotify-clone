import { GetFollowerCount } from "../../../User Controls";
import supabase from "../../../config/supabaseClient";
import { email, username } from "../../../main";
import "./AccountPage.css";

/*
Want to display icon, username, bio, followers, isVerified, upload song.

*/
/*
var followerCount: number = (
  await supabase.from("Users").select("followers").eq("email", email)
).data?.at(0)?.followers as number;
*/

export default function AccountPage() {
  console.log(GetFollowerCount("londonbridge411@gmail.com"));
  return (
    <>
      <div className="account-layout">
        <header>
          <h1>Account</h1>
        </header>
        <main>
          Username: {username}
          Followers: {}
          Email: {email}
        </main>
      </div>
    </>
  );
}
