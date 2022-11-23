/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stopLossInitialState } from "./utils";
import apiHandler from "@utils/apiHandler";
import rootConstants from "@constants/index";

const baseURL = rootConstants.STOPLOSS_API;

export const getStopLoss = createAsyncThunk(
	"stoploss/getDetails",
	async (payload, { dispatch, getState, rejectWithValue }) => {
		try {
			const state = getState();

			const modelId = payload || state.riskModeler.savedModel.modelId;

			dispatch(updateModalId(modelId));
			const apiUrl = `${baseURL}?modelId=${modelId}`;
			const { data, error } = await apiHandler.get(apiUrl);
			const {
				stopLossAggregate,
				stopLossPremiums,
				stopLossPopulationCredibility,
				stopLossSpecifics,
			} = data;

			return {
				stopLossAggregate,
				stopLossPopulationCredibility,
				stopLossPremiums,
				stopLossSpecifics,
			};
		} catch (error) {}
	}
);

export const saveAggregate = createAsyncThunk(
	"stoploss/saveAggregate",
	async (payload, { dispatch, rejectWithValue }) => {
		try {
			const apiUrl = `${baseURL}/aggregate`;
			const { data, error } = await apiHandler.post(apiUrl, payload);
			return data;
		} catch (error) {}
	}
);

export const savePopulationCredibility = createAsyncThunk(
	"stoploss/savePopulationCredibility",
	async (payload, { dispatch, rejectWithValue }) => {
		try {
			const apiUrl = `${baseURL}/population-credibility`;
			const { data, error } = await apiHandler.post(apiUrl, payload);
			return data;
		} catch (error) {}
	}
);

export const saveSpecific = createAsyncThunk(
	"stoploss/saveSpecific",
	async (payload, { dispatch, rejectWithValue }) => {
		try {
			const apiUrl = `${baseURL}/specific`;
			const { data, error } = await apiHandler.post(apiUrl, payload);
			return data;
		} catch (error) {}
	}
);

export const savePremium = createAsyncThunk(
	"stoploss/savePremium",
	async (payload, { dispatch, rejectWithValue }) => {
		try {
			const apiUrl = `${baseURL}/premium`;
			const { data, error } = await apiHandler.post(apiUrl, payload);
			return data;
		} catch (error) {}
	}
);

export const stopLossSlice = createSlice({
	name: "stopLoss",
	initialState: stopLossInitialState,
	reducers: {
		updateModalId: (state, action) => {
			const modalId = action.payload;
			state.stopLossModelId = modalId;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getStopLoss.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(getStopLoss.fulfilled, (state, { payload }) => {
			state.loading = false;
			state.error = "";
			(state.stopLossAggregate = payload?.stopLossAggregate),
				(state.stopLossPopulationCredibility =
					payload?.stopLossPopulationCredibility),
				(state.stopLossPremiums = payload?.stopLossPremiums),
				(state.stopLossSpecifics = payload?.stopLossSpecifics);
		});
		builder.addCase(getStopLoss.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		});
		builder.addCase(saveAggregate.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(saveAggregate.fulfilled, (state, action) => {
			state.loading = false;
			state.stopLossAggregate = action.payload;
		});
		builder.addCase(saveAggregate.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		});
		builder.addCase(savePopulationCredibility.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(savePopulationCredibility.fulfilled, (state, action) => {
			state.loading = false;
			state.stopLossPopulationCredibility = action.payload;
		});
		builder.addCase(savePopulationCredibility.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		});
		builder.addCase(savePremium.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(savePremium.fulfilled, (state, action) => {
			state.loading = false;
			state.stopLossPremiums = action.payload;
		});
		builder.addCase(savePremium.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		});
		builder.addCase(saveSpecific.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(saveSpecific.fulfilled, (state, action) => {
			state.loading = false;
			state.stopLossSpecifics = action.payload;
		});
		builder.addCase(saveSpecific.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload;
		});
	},
});

export const { updateModalId } = stopLossSlice.actions;

export default stopLossSlice.reducer;
