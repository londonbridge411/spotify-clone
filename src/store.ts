import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./PlayerSlice";
import popupReducer from "./PopupSlice";
import playlistContextReducer from "./PlaylistContextSlice";
import songContextReducer from "./SongContextSlice";

export const store = configureStore({
  reducer: {
    player: playerReducer,
    popup: popupReducer,
    songContext: songContextReducer,
    playlistContext: playlistContextReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
