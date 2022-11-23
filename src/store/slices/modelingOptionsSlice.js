/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // Action,
  createSlice,
  createAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
//   import { stringify } from "querystring";

import { setDataForDebugAction } from "./sqlDebuggerSlice";

// import { ThunkAction } from 'redux-thunk';
import rootConstants from "@constants/index";
import commons from "@constants/common";
import constants from "@constants/index";

const { REQUEST, SUCCESS, PENDING, FAILURE, ACTION_SUCCESS, ACTION_FAILURE } =
  commons;
import { displayError, displaySuccess } from "./alertSlice";
import apiHandler from "@utils/apiHandler";

const baseURL = rootConstants.MODELOPTION_API;
const sliceName = "modelOptions";
const actionLabel = "modelOptions";
const singular = "modeloption";
const pular = "modeloptions";
const { ModelOptionsMap } = constants;

const initialState = {
  modelOption: [],
  modelingOptionsInfo: {
	ibnr: "",
	mcr: "",
	pci: "",
	pr: "",
  },
  modelingResStatus: PENDING,
  resStatus: PENDING,
  savedModelingOptions: []
};

const listAction = createAction(
  `${sliceName}/listAction`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);
const listFailure = createAction(`${sliceName}/listFailure`);
const saveModelingOptionsRequest = createAction(`${sliceName}/saveModelingOptions`);
const getModelingOptionsRequest = createAction(`${sliceName}/getModelingOptions`);

const saveModelingOptionsInfoSuccess = createAction(
  `${sliceName}/saveModelingOptionsInfoSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const getModelingOptionsInfoSuccess = createAction(
  `${sliceName}/getModelingOptionsInfoSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const saveModelingOptionsSuccess = createAction(
    `${sliceName}/saveModelingOptionsSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

export const addAction = createAsyncThunk(
  `${sliceName}/add${actionLabel}`,
  async (payload, thunkAPI) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    // const response = await apiHandler.post(baseURL, payload);
    // 
    // const { code, status } = response;

    thunkAPI.dispatch(listAction({}));

    //   if (status === 200 || code === "SUCCESS") {
    //     thunkAPI.dispatch(
    //       displaySuccess({ message: `${singular} added successfully.` })
    //     );
    //     thunkAPI.dispatch(actionSuccess(response.data));
    //     thunkAPI.dispatch(listAction({}));
    //   } else {
    //     thunkAPI.dispatch(
    //       displayError({ message: `Failed. Couldn't add ${singular}!` })
    //     );
    //     thunkAPI.dispatch(actionFailure());
    //   }
    // reply to thunk state
    return true;
  }
);

export const saveModelingOptionsInfoAction = createAsyncThunk(
  `${sliceName}/modelingOptionsInfo${actionLabel}`,
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(saveModelingOptionsInfoSuccess(payload));
    return true;
  }
);


export const getModelingOptionsInfoAction = createAsyncThunk(
  `${sliceName}/getModelingOptionsInfo${actionLabel}`,
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(getModelingOptionsInfoSuccess(payload));
    return true;
  }
);





export const saveModelingOptionsAction = createAsyncThunk(
    `${sliceName}/saveModelingOptions${actionLabel}`,
    async (payload, thunkAPI) => {
		
        
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL, payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));
        thunkAPI.dispatch(saveModelingOptionsRequest());

        if (status === 200) {
            thunkAPI.dispatch(saveModelingOptionsSuccess(response.data));
			
            return response.data;
            // thunkAPI.dispatch(calculateSavingsAction({
            //     modelId: response.data.modelId,
            // }));
        } else {
            thunkAPI.dispatch(actionFailure());
        }
        // reply to thunk state
        return true;
    }
);
export const getModelingOptionsAction = createAsyncThunk(
    `${sliceName}/saveModelingOptions${actionLabel}`,
    async (payload, thunkAPI) => {
		
        
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.get(baseURL + "/"+ payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));
        thunkAPI.dispatch(getModelingOptionsRequest());

        if (status === 200) {
            thunkAPI.dispatch(getModelingOptionsInfoSuccess(response.data));
            return response.data;
            // thunkAPI.dispatch(calculateSavingsAction({
            //     modelId: response.data.modelId,
            // }));
        } else {
            thunkAPI.dispatch(actionFailure());
        }
        // reply to thunk state
        return true;
    }
);

const mainSlice = createSlice({
  name: sliceName,
  initialState,saveModelingOptionsRequest,
  reducers: {
	saveModelingOptionsRequest: (state, action) => {
		state.resStatus = REQUEST;
	},
	saveModelingOptionsSuccess: (state, action) => {
		state.resStatus = SUCCESS;
		state.savedModelingOptions = action.payload;
	},
    listAction: (state, action) => {
      state.modelOption = [...initialState.modelOption, ...action.payload];
      state.modelingResStatus = SUCCESS;
    },
    listFailure: () => initialState,
    saveModelingOptionsInfoSuccess: (state, action) => {
      state.modelingOptionsInfo[action.payload.name] = action.payload.value
      state.modelingResStatus = SUCCESS;
    },
	getModelingOptionsInfoSuccess: (state, action) => {
		// debugger
		state.modelingOptionsInfo =  action.payload.options.reduce((prev,next) => ({...prev,[ModelOptionsMap[next["modelingOptionsFieldId"]]]:next.value}),{})
		state.resStatus = SUCCESS;
	  },
  },
  extraReducers: (builder) => {
    // listAction
    builder.addCase(addAction.pending, (state /* , action */) => {
      return { ...initialState, modelingResStatus: PENDING };
    });
    builder.addCase(addAction.rejected, (state) => {
      state.modelingResStatus = FAILURE;
    });
    // saveModelInfoAction
    builder.addCase(saveModelingOptionsInfoAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
	builder.addCase(saveModelingOptionsInfoAction.rejected, (state,action) => {
		state.resStatus = FAILURE;
	  });
    // getModelingOptionsInfoAction
    builder.addCase(getModelingOptionsInfoAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
	builder.addCase(getModelingOptionsInfoAction.rejected, (state,action) => {
		state.resStatus = FAILURE;
	  });
  },
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const modelOptionState = (state) => 
	state[sliceName]
export const modelOptionSlice = {
  listAction,
};


