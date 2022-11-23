import { createSelector } from "@reduxjs/toolkit";

export const getUserState = (rootState) => rootState["profile"];

export const selectUserProfile = createSelector(
  getUserState,
  (state) => state.user
);
