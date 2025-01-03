import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Store
interface SongContextState {
  currentSongID: string; //The song that is currently playing
  active: boolean;
}

const initialState: SongContextState = {
  currentSongID: "",
  active: false,
};

const songContextSlice = createSlice({
  name: "song_context",
  initialState,
  reducers: {
    OpenSongContextMenu(state, action: PayloadAction<string>) {
      //console.log("Payload: " + action.payload);
      state.currentSongID = action.payload;
      state.active = action.payload != "";
    },
  },
});

export const { OpenSongContextMenu } = songContextSlice.actions;
export default songContextSlice.reducer;
