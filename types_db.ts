export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Playlists: {
        Row: {
          bg_url: string | null;
          cover_url: string | null;
          created_at: string;
          id: string;
          name: string | null;
          owner_id: string | null;
          privacy_setting: Database["public"]["Enums"]["privacy_setting"];
          song_ids: string[];
          type: Database["public"]["Enums"]["playlist_type"] | null;
        };
        Insert: {
          bg_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          owner_id?: string | null;
          privacy_setting?: Database["public"]["Enums"]["privacy_setting"];
          song_ids: string[];
          type?: Database["public"]["Enums"]["playlist_type"] | null;
        };
        Update: {
          bg_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
          owner_id?: string | null;
          privacy_setting?: Database["public"]["Enums"]["privacy_setting"];
          song_ids?: string[];
          type?: Database["public"]["Enums"]["playlist_type"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "Playlists_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      Songs: {
        Row: {
          album_id: string | null;
          artist_data: Json | null;
          created_at: string;
          duration: string | null;
          id: string;
          like_count: number;
          owner_id: string | null;
          title: string | null;
          view_count: number;
        };
        Insert: {
          album_id?: string | null;
          artist_data?: Json | null;
          created_at: string;
          duration?: string | null;
          id?: string;
          like_count?: number;
          owner_id?: string | null;
          title?: string | null;
          view_count?: number;
        };
        Update: {
          album_id?: string | null;
          artist_data?: Json | null;
          created_at?: string;
          duration?: string | null;
          id?: string;
          like_count?: number;
          owner_id?: string | null;
          title?: string | null;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "Songs_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "Playlists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Songs_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      Users: {
        Row: {
          created_at: string;
          email: string;
          first_name: string | null;
          id: string;
          is_verified: boolean | null;
          last_name: string | null;
          liked_songs: string[];
          pfp_url: string | null;
          subscribed_artists: string[] | null;
          subscribed_playlists: string[] | null;
          subscribers: string[] | null;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string;
          first_name?: string | null;
          id?: string;
          is_verified?: boolean | null;
          last_name?: string | null;
          liked_songs?: string[];
          pfp_url?: string | null;
          subscribed_artists?: string[] | null;
          subscribed_playlists?: string[] | null;
          subscribers?: string[] | null;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          first_name?: string | null;
          id?: string;
          is_verified?: boolean | null;
          last_name?: string | null;
          liked_songs?: string[];
          pfp_url?: string | null;
          subscribed_artists?: string[] | null;
          subscribed_playlists?: string[] | null;
          subscribers?: string[] | null;
          username?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      checkfollowingownership: {
        Args: {
          userid: string;
          playlistid: string;
        };
        Returns: {
          isfollowing: boolean;
          isowner: boolean;
        }[];
      };
      get_playlist_songs_edit: {
        Args: {
          uid: string;
        };
        Returns: {
          id: string;
          title: string;
        }[];
      };
      getplaylistsongs: {
        Args: {
          playlist_id: string;
          user_id: string;
        };
        Returns: {
          id: string;
          title: string;
          album_id: string;
          privacy_setting: string;
          owner_id: string;
          artist_data: Json;
        }[];
      };
      getsubsnewestalbums: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
        }[];
      };
      searchalbums: {
        Args: {
          input: string;
          threshhold: number;
        };
        Returns: {
          id: string;
        }[];
      };
      searchplaylists: {
        Args: {
          input: string;
          threshhold: number;
        };
        Returns: {
          id: string;
        }[];
      };
      searchsongs: {
        Args: {
          input: string;
          threshhold: number;
        };
        Returns: {
          id: string;
          privacy_setting: string;
        }[];
      };
      searchusers: {
        Args: {
          input: string;
          threshhold: number;
        };
        Returns: {
          id: string;
          username: string;
          is_verified: boolean;
          pfp_url: string;
          namematch: number;
          idmatch: number;
        }[];
      };
      selectplaylistsongs: {
        Args: {
          uid: string;
        };
        Returns: {
          song_ids: string[];
          title: string;
          id: string;
        }[];
      };
      selecttop5songs:
        | {
            Args: Record<PropertyKey, never>;
            Returns: {
              title: string;
              view_count: number;
              owner_id: string;
              privacy_setting: string;
            }[];
          }
        | {
            Args: {
              uid: string;
            };
            Returns: {
              songid: string;
            }[];
          };
    };
    Enums: {
      playlist_type: "Playlist" | "Album" | "Single" | "EP";
      privacy_setting: "Public" | "Private" | "Unlisted";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
