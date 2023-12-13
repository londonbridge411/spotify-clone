import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Store
interface PlayerState {
  song_id: string;
}

const initialState: PlayerState = { song_id: "" };

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setSongID(state, action: PayloadAction<string>) {
      state.song_id = action.payload;
    },
  },
});

export const { setSongID } = playerSlice.actions;
export default playerSlice.reducer;
