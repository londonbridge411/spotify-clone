import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Store
interface PlaylistContextState {
  currentPlaylistID: string; //The song that is currently playing
  active: boolean;
}

const initialState: PlaylistContextState = {
  currentPlaylistID: "",
  active: false,
};

const playlistContextSlice = createSlice({
  name: "playlist_context",
  initialState,
  reducers: {
    setPopup(state, action: PayloadAction<any>) {
      state.currentPlaylistID = action.payload;
    },
  },
});

export const { setPopup } = playlistContextSlice.actions;
export default playlistContextSlice.reducer;
