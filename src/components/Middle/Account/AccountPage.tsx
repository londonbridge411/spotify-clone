import { useEffect, useState } from "react";
import { GetFollowerCount } from "../../../User Controls";
import { email, username } from "../../../main";
import "./AccountPage.css";

/*
Want to display icon, username, bio, followers, isVerified, upload song.
*/

export default function AccountPage() {
  const [getFollowers, setFollowers] = useState(0);

  useEffect(() => {
    GetFollowerCount("londonbridge411@gmail.com").then((result) =>
      setFollowers(result as number)
    );
  }, []);

  return (
    <>
      <div className="account-layout">
        <header>
          <h1>Account</h1>
        </header>
        <main>
          <h2> Username: {username}</h2>
          <p> Followers: {getFollowers}</p>
          <div> Email: {email}</div>
        </main>
      </div>
    </>
  );
}
