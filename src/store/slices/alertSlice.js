import { createSlice } from "@reduxjs/toolkit";
// import { Notification } from "@components/Notification";

const initialState = {};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    displaySuccess: (state, action) => {
      const { message, description } = action.payload;
      // Notification.success(message, description);
      
    },
    displayError: (state, action) => {
      const { message, description } = action.payload;
      // Notification.error(message, description);
      console.error('FETCH FAILED: ', message);
    },
  },
});

export const { displaySuccess, displayError } = alertSlice.actions;

export default alertSlice.reducer;
