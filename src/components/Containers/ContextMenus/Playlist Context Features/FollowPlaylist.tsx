import { CloseSongContextMenu } from "../SongContextMenu";
import { SwitchToPopup } from "../../../../PopupControl";
import { useEffect, useState } from "react";
import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { ClosePlaylistContextMenu } from "../PlaylistContextMenu";

export default function ContextOption_FollowPlaylist(props: any) {
  function FollowPlaylist() {
    let run = async () => {
      await supabase
        .from("Users")
        .select("subscribed_playlists")
        .eq("id", authUserID)
        .then(async (result) => {
          let list: string[] = result.data?.at(0)?.subscribed_playlists;

          list.push(props.target as string);

          await supabase
            .from("Users")
            .update({ subscribed_playlists: list })
            .eq("id", authUserID);

          //setprops.isFollowing(!props.isFollowing);
        });
    };

    run();
  }

  function UnfollowPlaylist() {
    if (props.isFollowing == true && props.isOwner == false) {
      // Remove user as a sub
      supabase
        .from("Users")
        .select("subscribed_playlists")
        .eq("id", authUserID)
        .then(async (result) => {
          let list: string[] = result.data?.at(0)?.subscribed_playlists;

          list.splice(list.indexOf(props.target as string), 1);

          await supabase
            .from("Users")
            .update({ subscribed_playlists: list })
            .eq("id", authUserID);
        });

      // .isFollowing(false);
    }
  }

  return (
    <>
      <div className="contextButton" hidden={props.isOwner}>
        <div
          onClick={() => {
            //props.onClick();
            ClosePlaylistContextMenu();

            props.isFollowing ? UnfollowPlaylist() : FollowPlaylist();
          }}
        >
          {props.isFollowing ? "Unfollow Playlist" : "Follow Playlist"}
        </div>
      </div>
    </>
  );
}
