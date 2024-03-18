import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Store
interface PlayerState {
  song_id: string; //The song that is currently playing
  volume: string;
  isPlaying: boolean;
  isShuffled: boolean;
  hasLoaded: boolean;
  songList: string[];
  listPosition: number;
}

const initialState: PlayerState = {
  song_id: "",
  volume: "50",
  isPlaying: false,
  isShuffled: false,
  hasLoaded: false,
  songList: [],
  listPosition: -1,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setSongID(state, action: PayloadAction<string>) {
      state.song_id = action.payload;

      state.isShuffled = false;

      if (state.songList.length > 0) {
        state.listPosition = state.songList.findIndex(
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

    setSongList(state, action: PayloadAction<string[]>) {
      state.songList = action.payload;
    },

    shufflePlay(state) {
      if (state.songList.length == 0) return;
      state.isShuffled = true;
      state.songList.sort(() => Math.random() - 0.5);

      state.song_id = state.songList[0];
      state.listPosition = 0;
    },

    prevSong(state) {
      // Guard Statements
      if (state.songList.length == 0) return;
      if (state.songList.length == 1) state.song_id = state.songList[0];
      if (state.listPosition - 1 < 0) return;

      state.song_id = state.songList[--state.listPosition];
    },

    nextSong(state) {
      // Guard Statements
      if (state.songList.length == 0) return;
      if (state.listPosition + 1 == state.songList.length) return;

      state.song_id = state.songList[++state.listPosition];
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
      state.songList = [];
      state.listPosition = -1;
      state.hasLoaded = false;
    },
  },
});

export const {
  setSongID,
  setVolume,
  setIsPlaying,
  setSongList,
  LoadPlayer,
  ClearPlayer,
  prevSong,
  nextSong,
  shufflePlay,
} = playerSlice.actions;
export default playerSlice.reducer;
