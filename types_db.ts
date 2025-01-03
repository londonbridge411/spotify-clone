export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      Liked_Songs: {
        Row: {
          liked_at: string;
          song_id: string;
          user_id: string;
        };
        Insert: {
          liked_at?: string;
          song_id?: string;
          user_id?: string;
        };
        Update: {
          liked_at?: string;
          song_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Liked_Songs_song_id_fkey";
            columns: ["song_id"];
            isOneToOne: false;
            referencedRelation: "Songs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Liked_Songs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      Playlist_Comments: {
        Row: {
          content: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          parent_id: string | null;
          playlist_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          parent_id?: string | null;
          playlist_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          parent_id?: string | null;
          playlist_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Playlist_Comments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Playlist_Comments_playlist_id_fkey";
            columns: ["playlist_id"];
            isOneToOne: false;
            referencedRelation: "Playlists";
            referencedColumns: ["id"];
          }
        ];
      };
      Playlists: {
        Row: {
          bg_url: string | null;
          cover_url: string | null;
          created_at: string;
          enable_comments: boolean;
          id: string;
          name: string | null;
          owner_id: string | null;
          privacy_setting: Database["public"]["Enums"]["privacy_setting"];
          type: Database["public"]["Enums"]["playlist_type"] | null;
        };
        Insert: {
          bg_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          enable_comments?: boolean;
          id?: string;
          name?: string | null;
          owner_id?: string | null;
          privacy_setting?: Database["public"]["Enums"]["privacy_setting"];
          type?: Database["public"]["Enums"]["playlist_type"] | null;
        };
        Update: {
          bg_url?: string | null;
          cover_url?: string | null;
          created_at?: string;
          enable_comments?: boolean;
          id?: string;
          name?: string | null;
          owner_id?: string | null;
          privacy_setting?: Database["public"]["Enums"]["privacy_setting"];
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
      Songs_Artists: {
        Row: {
          song_id: string;
          user_id: string;
        };
        Insert: {
          song_id: string;
          user_id: string;
        };
        Update: {
          song_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Songs_Artists_song_id_fkey";
            columns: ["song_id"];
            isOneToOne: false;
            referencedRelation: "Songs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Songs_Artists_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      Songs_Playlists: {
        Row: {
          order: number | null;
          playlist_id: string;
          song_id: string;
        };
        Insert: {
          order?: number | null;
          playlist_id?: string;
          song_id: string;
        };
        Update: {
          order?: number | null;
          playlist_id?: string;
          song_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Songs_Playlists_playlist_id_fkey";
            columns: ["playlist_id"];
            isOneToOne: false;
            referencedRelation: "Playlists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Songs_Playlists_song_id_fkey";
            columns: ["song_id"];
            isOneToOne: false;
            referencedRelation: "Songs";
            referencedColumns: ["id"];
          }
        ];
      };
      Subscribed_Artists: {
        Row: {
          subscribed_to: string;
          subscriber: string;
        };
        Insert: {
          subscribed_to: string;
          subscriber: string;
        };
        Update: {
          subscribed_to?: string;
          subscriber?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Subscribed_Artists_subscribed_to_fkey";
            columns: ["subscribed_to"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Subscribed_Artists_subscriber_fkey";
            columns: ["subscriber"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      Subscribed_Playlists: {
        Row: {
          playlist_id: string;
          subscriber: string;
        };
        Insert: {
          playlist_id: string;
          subscriber: string;
        };
        Update: {
          playlist_id?: string;
          subscriber?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Subscribed_Playlists_playlist_id_fkey";
            columns: ["playlist_id"];
            isOneToOne: false;
            referencedRelation: "Playlists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Subscribed_Playlists_subscriber_fkey";
            columns: ["subscriber"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          }
        ];
      };
      Ticket_Notes: {
        Row: {
          content: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          parent_id: string | null;
          ticket_id: number;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          parent_id?: string | null;
          ticket_id: number;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          parent_id?: string | null;
          ticket_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "Ticket_Notes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "Users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Ticket_Notes_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "Tickets";
            referencedColumns: ["id"];
          }
        ];
      };
      Tickets: {
        Row: {
          category: Database["public"]["Enums"]["\tticket_category"];
          closing_notes: string | null;
          created_at: string;
          created_by: string | null;
          description: string;
          id: number;
          status: Database["public"]["Enums"]["ticket_status"];
          subcategory: Database["public"]["Enums"]["ticket_subcategory"];
          subject: string;
        };
        Insert: {
          category?: Database["public"]["Enums"]["\tticket_category"];
          closing_notes?: string | null;
          created_at?: string;
          created_by?: string | null;
          description: string;
          id?: number;
          status?: Database["public"]["Enums"]["ticket_status"];
          subcategory?: Database["public"]["Enums"]["ticket_subcategory"];
          subject: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["\tticket_category"];
          closing_notes?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          id?: number;
          status?: Database["public"]["Enums"]["ticket_status"];
          subcategory?: Database["public"]["Enums"]["ticket_subcategory"];
          subject?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Tickets_created_by_fkey";
            columns: ["created_by"];
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
          is_admin: boolean;
          is_verified: boolean | null;
          last_name: string | null;
          pfp_url: string | null;
          username: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string;
          first_name?: string | null;
          id?: string;
          is_admin?: boolean;
          is_verified?: boolean | null;
          last_name?: string | null;
          pfp_url?: string | null;
          username?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          first_name?: string | null;
          id?: string;
          is_admin?: boolean;
          is_verified?: boolean | null;
          last_name?: string | null;
          pfp_url?: string | null;
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
          playlistid: string;
        };
        Returns: {
          ord: number;
          song_id: string;
          title: string;
        }[];
      };
      getlikedsongs: {
        Args: {
          user_id: string;
        };
        Returns: {
          songid: string;
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
      getqueueinfo: {
        Args: {
          queue: string[];
        };
        Returns: {
          song_id: string;
          title: string;
          album_name: string;
          cover_url: string;
        }[];
      };
      getsongbyid: {
        Args: {
          songid: string;
        };
        Returns: {
          id: string;
          title: string;
          album_id: string;
          owner_id: string;
          view_count: number;
          contributors: string[];
        }[];
      };
      getsongs:
        | {
            Args: {
              playlistid: string;
            };
            Returns: {
              ord: number;
              song_id: string;
              title: string;
              created_at: string;
              owner_id: string;
              contributors: string[];
              views: number;
              duration: string;
              album_id: string;
              album_title: string;
              cover_url: string;
              bg_url: string;
            }[];
          }
        | {
            Args: {
              song_ids: string[];
            };
            Returns: {
              song_id: string;
              title: string;
              created_at: string;
              owner_id: string;
              contributors: string[];
              album_id: string;
              views: number;
              duration: string;
              album_title: string;
              cover_url: string;
              bg_url: string;
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
      selecttop10artists: {
        Args: Record<PropertyKey, never>;
        Returns: {
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
      "\tticket_category": "Other" | "Account" | "Report" | "Question";
      playlist_type: "Playlist" | "Album" | "Single" | "EP";
      privacy_setting: "Public" | "Private" | "Unlisted";
      ticket_status: "Open" | "In Progress" | "On Hold" | "Canceled" | "Closed";
      ticket_subcategory:
        | "General"
        | "Other"
        | "Account Locked"
        | "Account Compromised"
        | "Account Verification"
        | "Password Reset"
        | "Copyright"
        | "Bug/Issue"
        | "Inappropriate Behavior/Content";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
