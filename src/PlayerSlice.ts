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
  queueDisplacement: number; // This is a way for me to queue up FIFO, instead of FILO. It is used to displace the position of a queued song.
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
  queueDisplacement: 0,
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

    addToEndOfQueue(state, action: PayloadAction<string>) {
      state.queue.push(action.payload);
    },

    enqueue(state, action: PayloadAction<string>) {
      if (
        state.queue.length == 0 ||
        state.queue.length + 1 == state.listPosition
      ) {
        // We push because if we insert at the index 1, it should throw an out of bounds error.
        state.queue.push(action.payload);
      } else {
        // Queues song at the next spot
        state.queueDisplacement++;
        state.queue.splice(
          state.listPosition + state.queueDisplacement,
          0,
          action.payload
        );
      }

      //state.queue.unshift(action.payload);
    },

    shufflePlay(state) {
      if (queueMicrotask.length == 0) return;
      state.isShuffled = true;
      state.queue.sort(() => Math.random() - 0.5);

      state.song_id = state.queue[0];
      state.listPosition = 0;
    },

    prevSong(state) {
      // Guard Statements
      if (state.queue.length == 0) return;
      if (state.queue.length == 1) state.song_id = state.queue[0];
      if (state.listPosition - 1 < 0) return;

      state.song_id =
        state.queue[state.holdPrev ? state.listPosition : --state.listPosition];
      state.holdPrev = false;
      if (state.queueDisplacement > 0) state.queueDisplacement++; //Insures that if we go backwards before hitting queued song, we adjust the displacement;
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
        if (state.queueDisplacement > 0) state.queueDisplacement--; //Doesn't lower it if it is already at 0
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
  addToEndOfQueue,
  enqueue,
  LoadPlayer,
  ClearPlayer,
  prevSong,
  nextSong,
  shufflePlay,
} = playerSlice.actions;
export default playerSlice.reducer;
