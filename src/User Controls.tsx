import { Component } from "react";
import supabase from "./config/supabaseClient";

export function GetFollowerCount(email: string) {
  var v;
  const fetchFollowers = async () => {
    let { data, error } = await supabase
      .from("Users")
      .select("followers")
      .eq("email", email);

    v = data?.at(0)?.followers;
  };

  fetchFollowers();

  return v;
}
/*
  const a = supabase
    .from("Users")
    .select("followers")
    .eq("email", email)
    .then((val) => val.data?.at(0)?.followers as Number);
*/
//const b = a.then((result) => result);
