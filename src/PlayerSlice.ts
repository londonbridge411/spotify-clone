import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Store
interface PlayerState {
  song_id: string; //The song that is currently playing
  volume: string;
  isPlaying: boolean;
  isShuffled: boolean;
  hasLoaded: boolean;
  holdPrev: boolean;
  queue: string[];
  playlistSongs: string[];
  listPosition: number;
}

const initialState: PlayerState = {
  song_id: "",
  volume: "50",
  isPlaying: false,
  isShuffled: false,
  hasLoaded: false,
  holdPrev: false,
  queue: [],
  playlistSongs: [],
  listPosition: -1,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setSongID(state, action: PayloadAction<string>) {
      state.song_id = action.payload;

      state.isShuffled = false;

      if (state.playlistSongs.length > 0) {
        state.listPosition = state.playlistSongs.findIndex(
          (x) => x == state.song_id
        );
      }
    },

    setVolume(state, action: PayloadAction<string>) {
      state.volume = action.payload;
      document.cookie = "volume=" + state.volume;
    },

    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },

    setPlaylistSongs(state, action: PayloadAction<string[]>) {
      state.playlistSongs = action.payload;
    },

    addToQueue(state, action: PayloadAction<string>) {
      state.queue.push(action.payload);
    },

    shufflePlay(state) {
      if (state.playlistSongs.length == 0) return;
      state.isShuffled = true;
      state.playlistSongs.sort(() => Math.random() - 0.5);

      state.song_id = state.playlistSongs[0];
      state.listPosition = 0;
    },

    prevSong(state) {
      // Guard Statements
      if (state.playlistSongs.length == 0) return;
      if (state.playlistSongs.length == 1)
        state.song_id = state.playlistSongs[0];
      if (state.listPosition - 1 < 0) return;

      state.song_id =
        state.playlistSongs[
          state.holdPrev ? state.listPosition : --state.listPosition
        ];
      state.holdPrev = false;
    },

    nextSong(state) {
      // Guard Statements
      if (state.queue.length == 0 && state.playlistSongs.length == 0) return;
      //if (state.listPosition + 1 == state.playlistSongs.length) return; // Will cause issues
      //state.song_id = state.playlistSongs[++state.listPosition];

      if (state.queue.length > 0) {
        state.song_id = state.queue.pop() as string; //[++state.listPosition];
        state.holdPrev = true;
        //++state.listPosition;
      } else {
        if (state.listPosition + 1 == state.playlistSongs.length) return;
        state.song_id = state.playlistSongs[++state.listPosition];
      }
    },

    LoadPlayer(state) {
      state.hasLoaded = true;
    },

    ClearPlayer(state) {
      let a = document.getElementById("audioControl") as HTMLAudioElement;
      a.pause();
      a.currentTime = 0;
      a.src = "";
      state.song_id = "";
      state.isPlaying = false;
      state.isShuffled = false;
      state.queue = [];
      state.playlistSongs = [];
      state.listPosition = -1;
      state.hasLoaded = false;
    },
  },
});

export const {
  setSongID,
  setVolume,
  setIsPlaying,
  addToQueue,
  setPlaylistSongs,
  LoadPlayer,
  ClearPlayer,
  prevSong,
  nextSong,
  shufflePlay,
} = playerSlice.actions;
export default playerSlice.reducer;
