import { Component } from "react";
import supabase from "./config/supabaseClient";

// Uses useEffect in accountPage
export async function GetFollowerCount(email: string) {
  return await (
    await supabase.from("Users").select("followers").eq("email", email)
  ).data?.at(0)?.followers;
}
