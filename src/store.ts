import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "./PlayerSlice";
import popupReducer from "./PopupSlice";

export const store = configureStore({ reducer: { player: playerReducer, popup: popupReducer }, });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
