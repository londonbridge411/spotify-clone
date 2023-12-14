import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Store
interface PlayerState {
  song_id: string; //The song that is currently playing
  volume: string;
  isPlaying: boolean;
  hasLoaded: boolean;
  songList: string[];
  listPosition: number;
}

const initialState: PlayerState = {
  song_id: "",
  volume: "50",
  isPlaying: false,
  hasLoaded: false,
  songList: [],
  listPosition: 0,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setSongID(state, action: PayloadAction<string>) {
      state.song_id = action.payload;

      if (state.songList.length > 0) {
        state.listPosition = state.songList.findIndex(
          (x) => x == state.song_id
        );
      }

      console.log("Pos " + state.listPosition);
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

      console.log("List: " + state.songList);
    },

    prevSong(state) {
      // Guard Statements
      if (state.songList.length == 0) return;
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
  },
});

export const {
  setSongID,
  setVolume,
  setIsPlaying,
  setSongList,
  LoadPlayer,
  prevSong,
  nextSong,
} = playerSlice.actions;
export default playerSlice.reducer;
