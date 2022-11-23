/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // Action,
  createSlice,
  createAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
//   import { stringify } from "querystring";

import { setDataForDebugAction } from './sqlDebuggerSlice';

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

const baseURL = rootConstants.PAYER_API;
const sliceName = "payor";
const actionLabel = "Payor";
const singular = "Payor";
const pular = "Payors";
const initialState = {
  payorsList: [],
  payor: null,
  resStatus: PENDING,
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
const actionFailure = createAction(`${sliceName}/actionFailure`);

export const listAction = createAsyncThunk(
  `${sliceName}/list${actionLabel}`,
  async (payload, thunkAPI) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    const hasData = payload ? Object.keys(payload).length : null;
    const load = !!hasData && JSON.stringify(payload);
    const apiUrl = hasData ? `${baseURL}?${load}` : `${baseURL}`;
    const response = await apiHandler.get(apiUrl, false);

    thunkAPI.dispatch(setDataForDebugAction(response));
    //   const { code, status } = response;
    // 

    /* generate id */
    const payorList = [];

    response.forEach((v, i) => {
      v.id = i;
      payorList.push(v);
    })

    thunkAPI.dispatch(listSuccess(payorList));

    //   if (status === 200 && code === "SUCCESS") {
    //     if (!payload.noAlert)
    //       thunkAPI.dispatch(
    //         displaySuccess({ message: `${pular} list fetched successfully.` })
    //       );
    //     thunkAPI.dispatch(listSuccess(response));
    //   } else {
    //     if (!payload.noAlert)
    //       thunkAPI.dispatch(
    //         displayError({
    //           message: `Couldn't fetch ${pular.toLowerCase()} list`,
    //         })
    //       );
    //     thunkAPI.dispatch(listFailure());
    //   }
    // reply to thunk state
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

const mainSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    listSuccess: (state, action) => {
      state.payorsList = action.payload;
      state.resStatus = SUCCESS;
    },
    listFailure: () => initialState,
    getSuccess: (state, action) => {
      state.payor = action.payload;
      state.resStatus = SUCCESS;
    },
    getFailure: (state) => {
      state.resStatus = FAILURE;
    },
    actionSuccess: (state, action) => {
      state.payor = action.payload;
      state.resStatus = ACTION_SUCCESS;
    },
    actionFailure: (state) => {
      state.resStatus = ACTION_FAILURE;
    },
  },
  extraReducers: (builder) => {
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

export const payorState = (state) => state[sliceName];
export const payorSlice = {
  listAction,
  getAction,
  addAction,
  deleteAction,
  editAction,
};
