import { createSelector } from "@reduxjs/toolkit";

export const getStopLossState = (rootState) => rootState["stopLoss"];

export const selectStopLoss = createSelector(
  getStopLossState,
  (state) => state
);

export const selectModalId = createSelector(
  getStopLossState,
  (state) => state.stopLossModelId
);

export const selectStopLossLoading = createSelector(
  getStopLossState,
  (state) => state.loading
);

export const selectStopLossError = createSelector(
  getStopLossState,
  (state) => state.error
);

export const selectStopLossAggregate = createSelector(
  getStopLossState,
  (state) => state.stopLossAggregate
);

export const selectStopLossSpecific = createSelector(
  getStopLossState,
  (state) => state.stopLossSpecifics
);

export const selectStopLossPremium = createSelector(
  getStopLossState,
  (state) => state.stopLossPremiums
);

export const selectStopLossPopulationCredibility = createSelector(
  getStopLossState,
  (state) => state.stopLossPopulationCredibility
);
