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
  //playlistSongs: string[];
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
  //playlistSongs: [],
  listPosition: -1,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setSongID(state, action: PayloadAction<string>) {
      state.song_id = action.payload;

      state.isShuffled = false;

      if (state.queue.length > 0) {
        state.listPosition = state.queue.findIndex((x) => x == state.song_id);
      }
    },

    setVolume(state, action: PayloadAction<string>) {
      state.volume = action.payload;
      document.cookie = "volume=" + state.volume;
    },

    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },

    /*setPlaylistSongs(state, action: PayloadAction<string[]>) {
      state.playlistSongs = action.payload;
    },*/

    clearQueue(state) {
      state.queue = [];
    },

    addToQueue(state, action: PayloadAction<string>) {
      state.queue.push(action.payload);
    },

    shufflePlay(state) {
      if (queueMicrotask.length == 0) return;
      state.isShuffled = true;
      state.queue.sort(() => Math.random() - 0.5);

      state.song_id = state.queue[0];
      state.listPosition = 0;
      /*if (state.playlistSongs.length == 0) return;
      state.isShuffled = true;
      state.playlistSongs.sort(() => Math.random() - 0.5);

      state.song_id = state.playlistSongs[0];
      state.listPosition = 0;*/
    },

    prevSong(state) {
      // Guard Statements
      if (state.queue.length == 0) return;
      if (state.queue.length == 1) state.song_id = state.queue[0];
      if (state.listPosition - 1 < 0) return;

      state.song_id =
        state.queue[state.holdPrev ? state.listPosition : --state.listPosition];
      state.holdPrev = false;
    },

    nextSong(state) {
      // Guard Statements
      console.log(state.queue.length);
      if (state.queue.length == 0) return;
      if (state.listPosition + 1 == state.queue.length) return; // Will cause issues UPDTE: Maybe not?
      //state.song_id = state.playlistSongs[++state.listPosition];

      if (state.queue.length > 0) {
        state.song_id = state.queue[++state.listPosition] as string; //[++state.listPosition];
        state.holdPrev = true;
        //++state.listPosition;
      } else {
        if (state.listPosition + 1 == state.queue.length) return;
        state.song_id = state.queue[++state.listPosition];
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
      state.queue = [];
      state.listPosition = -1;
      state.hasLoaded = false;
    },
  },
});

export const {
  setSongID,
  setVolume,
  setIsPlaying,
  clearQueue,
  addToQueue,
  LoadPlayer,
  ClearPlayer,
  prevSong,
  nextSong,
  shufflePlay,
} = playerSlice.actions;
export default playerSlice.reducer;
