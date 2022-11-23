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
const {
  REQUEST,
	SUCCESS,
	PENDING,
	FAILURE,
	ACTION_SUCCESS,
	ACTION_FAILURE,
} = commons;
import { displayError, displaySuccess } from "./alertSlice";
import apiHandler from "@utils/apiHandler";
import { HYDRATE } from 'next-redux-wrapper';

import { setDataForDebugAction } from './sqlDebuggerSlice';
import { toast } from "react-toastify";


const baseURL = rootConstants.REPORTING_MODEL_API;
const riskModelerBaseURL = rootConstants.RISKMODELER_API;
const sliceName = "reportingModel";
const actionLabel = "ReportingModel";
const singular = "ReportingModel";
const pular = "ReportingModels";
const initialState = {
  reportingModelList: [],
  reportingModel: null,
  resStatus: PENDING,
  favouriteModels: []
};

const listSuccess = createAction(
  `${sliceName}/listSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);
const listFailure = createAction(`${sliceName}/listFailure`);

const getSuccess = createAction(
  `${sliceName}/getSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);
const getFailure = createAction(`${sliceName}/getFailure`);

const actionSuccess = createAction(
  `${sliceName}/actionSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const deleteModelSuccess = createAction(
  `${sliceName}/deleteModelSuccess`,
  function prepare(payload) {
      return {
          payload,
      };
  }
);

const favouriteModelSuccess = createAction(
  `${sliceName}/favouriteModelSuccess`,
  function prepare(payload) {
      return {
          payload,
      };
  }
);

const actionFailure = createAction(`${sliceName}/actionFailure`);
const fetchDataRequest = createAction(`${sliceName}/fetchDataRequest`);

export const listAction = createAsyncThunk(
  `${sliceName}/list${actionLabel}`,
  async (payload, thunkAPI) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    const hasData = payload ? Object.keys(payload).length : null;
    const load = !!hasData && JSON.stringify(payload);
    const apiUrl = hasData ? `${baseURL}?userName=${payload.userName}` : `${baseURL}`;

    const response = await apiHandler.get(apiUrl, false);
    const { code, status } = response;

    thunkAPI.dispatch(fetchDataRequest());
    thunkAPI.dispatch(setDataForDebugAction(response));

    if (status === 200) {
      thunkAPI.dispatch(listSuccess(response.data));
    }else{
      thunkAPI.dispatch(getFailure());
    }
    
    return true;
  }
);

export const getAction = createAsyncThunk(
  `${sliceName}/get${actionLabel}`,
  async (
    payload,
    thunkAPI
  ) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    const apiUrl = `${baseURL}/${payload.id}`;
    const response = await apiHandler.get(apiUrl, false);
    const { code, status } = response;

    thunkAPI.dispatch(setDataForDebugAction(response));

    if (status === 200 && code === "SUCCESS") {
      if (!payload.noAlert)
        thunkAPI.dispatch(
          displaySuccess({ message: `${singular} fetched successfully.` })
        );
      thunkAPI.dispatch(getSuccess(response.data));
    } else {
      if (!payload.noAlert)
        thunkAPI.dispatch(
          displayError({
            message: `Couldn't fetch the ${singular.toLowerCase()}.`,
          })
        );
      thunkAPI.dispatch(getFailure());
    }
    // reply to thunk state
    return true;
  }
);

export const addAction = createAsyncThunk(
  `${sliceName}/add${actionLabel}`,
  async (payload, thunkAPI) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    const response = await apiHandler.post(baseURL, payload);
    const { code, status } = response;

    thunkAPI.dispatch(setDataForDebugAction(response));

    if (status === 200 && code === "SUCCESS") {
      thunkAPI.dispatch(
        displaySuccess({ message: `${singular} added successfully.` })
      );
      thunkAPI.dispatch(actionSuccess(response.data));
    } else {
      thunkAPI.dispatch(
        displayError({ message: `Failed. Couldn't add ${singular}!` })
      );
      thunkAPI.dispatch(actionFailure());
    }
    // reply to thunk state
    return true;
  }
);

export const editAction = createAsyncThunk(
  `${sliceName}/edit${actionLabel}`,
  async (payload, thunkAPI) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    const response = await apiHandler.put(`${baseURL}/${payload.id}`, payload);
    const { code, status } = response;

    thunkAPI.dispatch(setDataForDebugAction(response));

    if (status === 200 && code === "SUCCESS") {
      thunkAPI.dispatch(
        displaySuccess({ message: `${singular} updated successfully.` })
      );
      thunkAPI.dispatch(actionSuccess(response.data));
    } else if (status === 200 && code === "NOTHING_TO_UPDATE") {
      thunkAPI.dispatch(
        displaySuccess({ message: `${singular} updated successfully.` })
      );
      thunkAPI.dispatch(actionSuccess(response.data));
    } else {
      thunkAPI.dispatch(
        displayError({
          message: `Failed. Couldn't update${singular.toLowerCase()} !`,
        })
      );
      thunkAPI.dispatch(actionFailure());
    }
    // reply to thunk state
    return true;
  }
);

export const deleteAction = createAsyncThunk(
  `${sliceName}/delete${actionLabel}`,
  async (assumptionId, thunkAPI) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    const response = await apiHandler.deleteRequest(
      `${baseURL}/${assumptionId}`
    );
    const { code, status } = response;

    thunkAPI.dispatch(setDataForDebugAction(response));

    if (status === 200 && code === "SUCCESS") {
      thunkAPI.dispatch(
        displaySuccess({ message: `${singular} deleted successfully.` })
      );
      thunkAPI.dispatch(actionSuccess(response.data));
      thunkAPI.dispatch(listAction({}));
    } else {
      thunkAPI.dispatch(
        displayError({
          message: `Failed. Couldn't delete ${singular.toLowerCase}!`,
        })
      );
      thunkAPI.dispatch(actionFailure());
    }
    // reply to thunk state
    return true;
  }
);


export const deleteModelAction = createAsyncThunk(
  `${sliceName}/deleteModel${actionLabel}`,
  async (payload, thunkAPI) => {
      /* cannot use utils apiHandler, authHeader creates dep cycle */
      const response = await apiHandler.deleteRequest(`${riskModelerBaseURL}/${payload}`);
      const { code, status } = response;

      thunkAPI.dispatch(setDataForDebugAction(response));

      if (status === 204) {
          thunkAPI.dispatch(deleteModelSuccess(payload));
          toast.success('Model deleted successfully.');
      }
      return true;
  }
);

export const favouriteModelAction = createAsyncThunk(
  `${sliceName}/favouriteModelAction${actionLabel}`,
  async (payload, thunkAPI) => {
      /* cannot use utils apiHandler, authHeader creates dep cycle */
      const response = await apiHandler.post(`${riskModelerBaseURL}/model/favourite`, {isFavourite: payload.isFavourite, modelId: payload.modelId});
      // const { code, status } = response;

      // thunkAPI.dispatch(setDataForDebugAction(response));
      thunkAPI.dispatch(favouriteModelSuccess(payload));
      // toast.success(`${payload.modelId} favourited successfully.`);
      // if (status === 204) {
      //     thunkAPI.dispatch(deleteModelSuccess(payload));
      //     toast.success('Model deleted successfully.');
      // }
      return true;
  }
);

const mainSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    listSuccess: (state, action) => {
      state.reportingModelList = [];
      state.reportingModelList = action.payload;
      state.favouriteModels = action.payload.filter(mod=>mod.isFavourite)
      state.resStatus = SUCCESS;
    },
    listFailure: () => initialState,
    getSuccess: (state, action) => {
      state.reportingModel = action.payload;
      state.resStatus = SUCCESS;
    },
    getFailure: (state) => {
      state.resStatus = FAILURE;
    },
    actionSuccess: (state, action) => {
      state.reportingModel = action.payload;
      state.resStatus = ACTION_SUCCESS;
    },
    actionFailure: (state) => {
      state.resStatus = ACTION_FAILURE;
    },
    fetchDataRequest: (state) => {
      state.resStatus = REQUEST;
    },
    deleteModelSuccess: (state, action) => {
      state.reportingModelList = state.reportingModelList.filter(model => model.modelId !== action.payload)
    },
    favouriteModelSuccess: (state, action) => {
      if(action.payload.isFavourite){
        state.favouriteModels = [...state.favouriteModels, action.payload]
      }else {
        state.favouriteModels = state.favouriteModels.filter(mod=>mod.modelId !== action.payload.modelId);
      }
      state.reportingModelList = state.reportingModelList.map(model=>{
        if(model.modelId === action.payload.modelId){
          model.isFavourite = action.payload.isFavourite
          return model;
        }else{
          return model;
        }
      })
    },
  },
  extraReducers: (builder) => {
    // hydrate 
    // builder.addCase(HYDRATE, (state, action ) => {
    //   return {...action.payload[sliceName]}
    // });
    // listAction
    builder.addCase(listAction.pending, (state /* , action */) => {
      return { ...initialState, resStatus: PENDING };
    });
    builder.addCase(listAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // getAction
    builder.addCase(getAction.pending, (state /* , action */) => {
      state.resStatus = PENDING;
    });
    builder.addCase(getAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // addAction
    builder.addCase(addAction.pending, (state /* , action */) => {
      state.resStatus = PENDING;
    });
    builder.addCase(addAction.fulfilled, (state /* , action */) => {
      state.resStatus = ACTION_SUCCESS;
    });
    builder.addCase(addAction.rejected, (state) => {
      state.resStatus = ACTION_FAILURE;
    });

    // editAction
    builder.addCase(editAction.pending, (state /* , action */) => {
      state.resStatus = PENDING;
    });
    builder.addCase(editAction.rejected, (state) => {
      state.resStatus = ACTION_FAILURE;
    });

    // deleteAction
    builder.addCase(deleteAction.pending, (state /* , action */) => {
      state.resStatus = PENDING;
    });
    builder.addCase(deleteAction.rejected, (state) => {
      state.resStatus = ACTION_FAILURE;
    });
  },
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const reportingModelState = (state) => state[sliceName];
export const reportingModelSlice = {
  listAction,
  getAction,
  addAction,
  deleteAction,
  editAction,
};
