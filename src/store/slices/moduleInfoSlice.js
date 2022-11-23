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
const { REQUEST, SUCCESS, PENDING, FAILURE } = commons;
import { HYDRATE } from "next-redux-wrapper";

const sliceName = "moduleInfoModel";
const actionLabel = "moduleInfoModel";
const initialState = {
	moduleInfo: {},
	autoModelName: false,
	resStatus: PENDING,
	allData: {},
};

const setModuleInfoSuccess = createAction(
	`${sliceName}/setModuleInfoSuccess`,
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
export const setAutoGenerateModelName = createAction(
	`${sliceName}/setAutoGenerateModelName`,
	function prepare(payload) {
		return {
			payload,
		};
	}
);

export const setModuleInfoAction = createAsyncThunk(
	`${sliceName}/setTabStsetModuleInfo${actionLabel}`,
	async (payload, thunkAPI) => {
		thunkAPI.dispatch(setModuleInfoSuccess(payload));
		return true;
	}
);

// export const getAllData = createAsyncThunk(
// 	`${sliceName}/get${actionLabel}`,
// 	async (payload, thunkAPI) => {
// 		const data = {};
// 		/* cannot use utils apiHandler, authHeader creates dep cycle */
// 		const apiUrl = "https://api.docnemo.com/model/readId/" + 6454;

// 		const response = await apiHandler.get(apiUrl, false);

// 		const { code, status } = response;

// 		thunkAPI.dispatch(getSuccess(response.data));

// 		// reply to thunk state
// 		return true;
// 	}
// );

const mainSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		setModuleInfoSuccess: (state, action) => {
			state.moduleInfo = action.payload;
			state.resStatus = SUCCESS;
		},
		setAutoGenerateModelName: (state, action) => {
			state.autoModelName = action.payload;
		},
		listFailure: () => initialState,
		getSuccess: (state, action) => {
			state.allData = { ...action.payload };
			state.resStatus = SUCCESS;
		},
	},
	extraReducers: (builder) => {
		// hydrate
		builder.addCase(HYDRATE, (state, action) => {
			return { ...action.payload[sliceName] };
		});
		// setModuleInfoAction
		builder.addCase(setModuleInfoAction.pending, (state /* , action */) => {
			return { ...initialState, ...state, resStatus: PENDING };
		});
		builder.addCase(setModuleInfoAction.rejected, (state) => {
			state.resStatus = FAILURE;
		});
	},
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const moduleInfoState = (state) => state[sliceName];
