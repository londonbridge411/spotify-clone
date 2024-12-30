import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Store
interface PlayerState {
  song_id: string; //The song that is currently playing
  volume: string;
  isPlaying: boolean;
  isShuffled: boolean;
  hasLoaded: boolean;
  isLooping: boolean;
  inQueue: boolean;
  nextQueue: string[]; // This is what we want to play next on command.
  properQueue: string[]; // This is the songs that are meant to play after the nextQueue is over.
  //fullQueue: string[]; // This includes ALL songs. [Playing + queue + Songs]. Gets updated often
  //queueDisplacement: number; // This is a way for me to queue up FIFO, instead of FILO. It is used to displace the position of a queued song.

  //playlistSongs: string[];
  listPosition: number;
}

const initialState: PlayerState = {
  song_id: "",
  volume: "50",
  isPlaying: false,
  isShuffled: false,
  hasLoaded: false,
  isLooping: false,
  nextQueue: [],
  properQueue: [],
  //fullQueue: [],
  //queueDisplacement: 0,
  inQueue: false,
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

      if (state.properQueue.length > 0) {
        state.listPosition = state.properQueue.indexOf(state.song_id);
      }
    },

    setLooping(state, action: PayloadAction<boolean>) {
      state.isLooping = action.payload;
      document.cookie = "loop=" + action.payload;

      if (action.payload) {
        document.getElementById("loop-button")!.style.filter =
          "sepia(79%) saturate(1000%) hue-rotate(86deg)";
      } else {
        document.getElementById("loop-button")!.style.filter = "";
      }
    },

    setVolume(state, action: PayloadAction<string>) {
      state.volume = action.payload;
      document.cookie = "volume=" + action.payload; // If this ever gives issues, CLEAR COOKIES
    },

    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },

    setProperQueue(state, action: PayloadAction<string[]>) {
      state.properQueue = action.payload;
      console.log("AAA" + state.song_id);
      state.listPosition = state.properQueue.indexOf(state.song_id);
    },

    setNextQueue(state, action: PayloadAction<string[]>) {
      state.nextQueue = action.payload;
      state.listPosition = state.nextQueue.indexOf(state.song_id);
    },

    clearFullQueue(state) {
      state.nextQueue = [];
      state.properQueue = [];
    },

    enqueue(state, action: PayloadAction<string>) {
      if (state.nextQueue.includes(action.payload)) return;

      state.nextQueue.push(action.payload);
    },

    shufflePlay(state) {
      if (queueMicrotask.length == 0) return;
      state.isShuffled = true;
      state.properQueue.sort(() => Math.random() - 0.5);

      state.song_id = state.properQueue[0];
      state.listPosition = 0;
    },

    prevSong(state) {
      // Guard Statements
      if (state.properQueue.length == 0) return;
      if (state.properQueue.length == 1) state.song_id = state.properQueue[0];
      if (state.listPosition - 1 < 0) return;

      //if (properQ[state.listPosition - 1])
      //state.song_id = state.properQueue[--state.listPosition];
      if (state.inQueue) {
        state.song_id = state.properQueue[state.listPosition]; // We want this sometimes... we also want to keep the position. We need to check if current song is in queue. Which it won't because we pop it...
      } else if (state.nextQueue.length > 0) {
        state.song_id = state.properQueue[--state.listPosition]; // We want this sometimes... we also want to keep the position. We need to check if current song is in queue. Which it won't because we pop it...
        //state.queueDisplacement++; //Insures that if we go backwards before hitting queued song, we adjust the displacement;
      } else {
        state.song_id = state.properQueue[--state.listPosition];
      }
    },

    nextSong(state) {
      // Guard Statements
      if (state.properQueue.length == 0) return;

      // Check if we are at the last song of the proper queue
      if (
        state.listPosition == state.properQueue.length - 1 &&
        state.nextQueue.length == 0
      ) {
        //console.log("End of the road");
        if (state.isLooping) {
          state.listPosition = 0;
          state.song_id = state.properQueue[0];
        }
        return;
      }

      // If Song In Queue
      if (state.nextQueue.length > 0) {
        // pop next queue
        state.song_id = state.nextQueue.shift()!;
        state.inQueue = true;
        //state.queueDisplacement = 0; //???????????????????????????????????????????
        return;
      } else {
        state.inQueue = false;
      }

      if (state.listPosition + 1 == state.properQueue.length) return; // Will cause issues UPDTE: Maybe not?

      if (state.properQueue.length > 0) {
        //state.inQueue = false;
        state.song_id = state.properQueue[++state.listPosition] as string;
      }
    },

    LoadPlayer(state) {
      state.hasLoaded = true;
    },

    ClearPlayer(state) {
      const a = document.getElementById("audioControl") as HTMLAudioElement;
      a.pause();
      a.currentTime = 0;
      a.src = "";
      state.song_id = "";
      state.isPlaying = false;
      state.isShuffled = false;
      state.nextQueue = [];
      state.properQueue = [];
      //state.fullQueue = [];
      state.listPosition = -1;
      state.hasLoaded = false;
    },
  },
});

export const {
  setProperQueue,
  setNextQueue,
  setSongID,
  setVolume,
  setIsPlaying,
  setLooping,
  clearFullQueue,
  enqueue,
  LoadPlayer,
  ClearPlayer,
  prevSong,
  nextSong,
  shufflePlay,
} = playerSlice.actions;
export default playerSlice.reducer;
