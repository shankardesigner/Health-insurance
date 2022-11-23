/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	// Action,
	createSlice,
	createAction,
	createAsyncThunk,
} from "@reduxjs/toolkit";
//   import { stringify } from "querystring";

// import { ThunkAction } from 'redux-thunk';
import rootConstants from "@constants/index";
import commons from "@constants/common";
const { REQUEST, SUCCESS, PENDING, FAILURE, ACTION_SUCCESS, ACTION_FAILURE } =
	commons;
import { displayError, displaySuccess } from "./alertSlice";
import apiHandler from "@utils/apiHandler";
import { HYDRATE } from "next-redux-wrapper";

import { setDataForDebugAction } from "./sqlDebuggerSlice";
import { calculateSavingsAction } from "./riskModelerSlice";

const baseURL = rootConstants.GLOBAL_ASSUMPTION_API;
const globalURL = rootConstants.REPORTING_MODEL_API;
const sliceName = "globalAssumptionModel";
const actionLabel = "globalAssumptionModel";
const initialState = {
	globalAssumptionModelList: [],
	globalAssumptionModel: null,
	globalAssumptionModelListResStatus: PENDING,
	usedAssumption: {},
	modelDetail: {},

	showAssumptionDetails: false,
	resStatus: PENDING,
	oneGlobalAssumption: {},
};

const listSuccess = createAction(
	`${sliceName}/listSuccess`,
	function prepare(payload) {
		return {
			payload,
		};
	}
);

const getSuccess = createAction(
	`${sliceName}/getSuccess`,
	function prepare(payload) {
		return {
			payload,
		};
	}
);

const saveUsedAssumptionSuccess = createAction(
	`${sliceName}/saveUsedAssumptionSuccess`,
	function prepare(payload) {
		return {
			payload,
		};
	}
);

const listRequest = createAction(`${sliceName}/listRequest`);
const resetUsedAssumptionSuccess = createAction(
	`${sliceName}/resetUsedAssumptionSuccess`
);
const setShowAssumptionDetailsSuccess = createAction(
	`${sliceName}/setShowAssumptionDetailsSuccess`
);

export const listAction = createAsyncThunk(
	`${sliceName}/list${actionLabel}`,
	async (payload, thunkAPI) => {
		/* cannot use utils apiHandler, authHeader creates dep cycle */
		thunkAPI.dispatch(listRequest());
		const hasData = payload ? Object.keys(payload).length : null;
		const load = !!hasData && JSON.stringify(payload);
		const apiUrl = hasData ? `${baseURL}?${load}` : `${baseURL}`;
		const response = await apiHandler.get(apiUrl, false);
		//   const { code, status } = response;
		thunkAPI.dispatch(setDataForDebugAction(response));
		thunkAPI.dispatch(listSuccess(response.data));
		// reply to thunk state
		return true;
	}
);

export const saveUsedAssumptionAction = createAsyncThunk(
	`${sliceName}/saveUsedAssumption${actionLabel}`,
	async (payload, thunkAPI) => {
		const { modelId, ...restPayload } = payload;
		thunkAPI.dispatch(saveUsedAssumptionSuccess(restPayload));
		// modelId && thunkAPI.dispatch(calculateSavingsAction({modelId}));
		return true;
	}
);

export const resetUsedAssumptionAction = createAsyncThunk(
	`${sliceName}/resetUsedAssumption${actionLabel}`,
	async (payload, thunkAPI) => {
		thunkAPI.dispatch(resetUsedAssumptionSuccess());
		return true;
	}
);

// export const getGlobalAssumption = createAsyncThunk(
// 	`${sliceName}/get${actionLabel}`,
// 	async (payload, thunkAPI) => {
// 		/* cannot use utils apiHandler, authHeader creates dep cycle */
// 		const response = await apiHandler.get(baseURL, payload);
//
// 		const { code, status } = response;

// 		thunkAPI.dispatch(getAction({}));

// 		return true;
// 	}
// );

export const getGlobalAssumption = createAsyncThunk(
	`${sliceName}/get${actionLabel}`,
	async (payload, thunkAPI) => {
		const data = {};
		/* cannot use utils apiHandler, authHeader creates dep cycle */

		const apiUrl = `${globalURL}/readId/` + payload;

		const response = await apiHandler.get(apiUrl, false);

		const { code, status } = response;

		thunkAPI.dispatch(getSuccess(response.data));

		// reply to thunk state
		return true;
	}
);

export const setShowAssumptionDetailsAction = createAsyncThunk(
	`${sliceName}/setShowAssumptionDetails${actionLabel}`,
	async (payload, thunkAPI) => {
		thunkAPI.dispatch(setShowAssumptionDetailsSuccess(payload));
		return true;
	}
);

const mainSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		listRequest: (state, action) => {
			state.globalAssumptionModelListResStatus = REQUEST;
		},
		listSuccess: (state, action) => {
			state.globalAssumptionModelList = action.payload;
			state.resStatus = SUCCESS;
			state.globalAssumptionModelListResStatus = SUCCESS;
			// state.usedAssumption
		},
		getSuccess: (state, action) => {
			if (action.payload) {
				// state.usedAssumption.ipaAllocationPercent =
				// 	action.payload.ipaAllocation * 100;
				state.modelDetail = action.payload;
				state.usedAssumption.ipaAllocationPercent =
					action.payload.ipaAllocation == 0
						? state?.globalAssumptionModelList?.[0]?.ipaAllocation * 100
						: action.payload.ipaAllocation * 100;
				//Removed the condition to set default ipaAdmin value when the value in payload is 0
				state.usedAssumption.ipaAdminPercent = action.payload.ipaAdmin * 100;
				// action.payload.ipaAdmin == 0
				//   ? state.globalAssumptionModelList?.[0]?.ipaAdmin * 100
				//   : action.payload.ipaAdmin * 100;
				state.usedAssumption.ipaAdmin = action.payload.ipaAdmin;
				//Removed the condition to set default ipaAdmin value when the value in payload is 0
				// action.payload.ipaAdmin == 0
				//   ? state?.globalAssumptionModelList?.[0]?.ipaAdmin
				//   : action.payload.ipaAdmin;
				state.usedAssumption.ipaAllocation =
					action.payload.ipaAllocation == 0
						? state?.globalAssumptionModelList?.[0]?.ipaAllocation
						: action.payload.ipaAllocation;
				state.usedAssumption.averagePremium = action.payload.premium;
				state.usedAssumption.pcpCount = action.payload.numberOfPcp;

				//state.allData = { ...initialState.allData, ...action.payload };
			}

			state.resStatus = SUCCESS;
		},
		saveUsedAssumptionSuccess: (state, action) => {
			// console.clear();
			//
			state.usedAssumption = action.payload;
			state.resStatus = SUCCESS;
		},
		resetUsedAssumptionSuccess: (state, action) => {
			state.usedAssumption = initialState.usedAssumption;
			state.resStatus = PENDING;
		},
		setShowAssumptionDetailsSuccess: (state, action) => {
			state.showAssumptionDetails = action.payload;
		},
		listFailure: () => initialState,
	},
	extraReducers: (builder) => {
		// hydrate
		builder.addCase(HYDRATE, (state, action) => {
			return { ...action.payload[sliceName] };
		});
		// listAction
		builder.addCase(listAction.pending, (state /* , action */) => {
			return {
				...initialState,
				...state,
				resStatus: PENDING,
				globalAssumptionModelListResStatus: PENDING,
			};
		});
		builder.addCase(listAction.rejected, (state) => {
			state.resStatus = FAILURE;
			state.globalAssumptionModelListResStatus = FAILURE;
		});
		// saveUsedAssumptionAction
		builder.addCase(
			saveUsedAssumptionAction.pending,
			(state /* , action */) => {
				return { ...initialState, ...state, resStatus: PENDING };
			}
		);
		builder.addCase(saveUsedAssumptionAction.rejected, (state) => {
			state.resStatus = FAILURE;
		});
		// resetUsedAssumptionAction
		builder.addCase(
			resetUsedAssumptionAction.pending,
			(state /* , action */) => {
				return { ...initialState, ...state, resStatus: PENDING };
			}
		);
		builder.addCase(resetUsedAssumptionAction.rejected, (state) => {
			state.resStatus = FAILURE;
		});
	},
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const globalAssumptionModelState = (state) => state[sliceName];
export const globalAssumptionModelSlice = {
	listAction,
	getGlobalAssumption,
};
