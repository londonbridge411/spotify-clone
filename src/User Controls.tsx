import { Component } from "react";
import supabase from "./config/supabaseClient";

// Uses useEffect in accountPage
export async function User_GetFollowerCount(email: string): Promise<number> {
  return (await (
    await supabase.from("Users").select("followers").eq("email", email)
  ).data?.at(0)?.followers) as number;
}

export async function User_IsVerified(email: string): Promise<boolean> {
  return (await (
    await supabase.from("Users").select("is_verified").eq("email", email)
  ).data?.at(0)?.is_verified) as boolean;
}

export async function User_GetMyAlbums(email: string): Promise<any> {
  return;
}
