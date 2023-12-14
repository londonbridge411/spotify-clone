import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Store
interface PlayerState {
  song_id: string;
  volume: string;
  isPlaying: boolean;
  hasLoaded: boolean;
}

const initialState: PlayerState = { song_id: "", volume: "50", isPlaying: false, hasLoaded: false};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setSongID(state, action: PayloadAction<string>) {
      state.song_id = action.payload;
    },

    setVolume(state, action: PayloadAction<string>) {
      state.volume = action.payload;
    },

    setIsPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },

    LoadPlayer(state) {
      state.hasLoaded = true;
    },
  },
});

export const { setSongID, setVolume, setIsPlaying, LoadPlayer } = playerSlice.actions;
export default playerSlice.reducer;
