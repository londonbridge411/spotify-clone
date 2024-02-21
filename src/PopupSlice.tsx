import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Store
interface PopupState{
  currentPopup: string; //The song that is currently playing
  active: boolean;
}

const initialState: PopupState = {
  currentPopup: "",
  active: false,
};

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    setPopup(state, action: PayloadAction<any>) {
      state.currentPopup = action.payload;
    }
  },
});

export const {
  setPopup
} = popupSlice.actions;
export default popupSlice.reducer;
