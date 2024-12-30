import supabase from "../../../../config/supabaseClient";
import { authUserID } from "../../../../main";
import { ClosePlaylistContextMenu } from "../PlaylistContextMenu";

export default function ContextOption_FollowPlaylist(props: any) {
  function FollowPlaylist() {
    const run = async () => {
      await supabase
        .from("Subscribed_Playlists")
        .insert({ subscriber: authUserID, playlist_id: props.target });

      // await supabase
      //   .from("Users")
      //   .select("subscribed_playlists")
      //   .eq("id", authUserID)
      //   .then(async (result) => {
      //     let list: string[] = result.data?.at(0)?.subscribed_playlists;

      //     list.push(props.target as string);

      //     await supabase
      //       .from("Users")
      //       .update({ subscribed_playlists: list })
      //       .eq("id", authUserID);

      //     //setprops.isFollowing(!props.isFollowing);
      //   });
    };

    run();
  }

  function UnfollowPlaylist() {
    if (props.isFollowing == true && props.isOwner == false) {
      const del = async () => {
        await supabase
          .from("Subscribed_Playlists")
          .delete()
          .eq("subscriber", authUserID)
          .eq("playlist_id", props.target);
      };

      del();
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
