import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const menuToggleSlice = createSlice({
  name: "menuToggle",
  initialState,
  reducers: {
    menuToggle: (state, action) => {
      state.open = action.payload;
    }
  },
});

export const { menuToggle } = menuToggleSlice.actions;
export const menuSelector = createSelector(state => state.menu, menu => menu);

export default menuToggleSlice.reducer;
