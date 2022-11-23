/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // Action,
  createSlice,
  createAction,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
//   import { stringify } from "querystring";

// import { ThunkAction } from 'redux-thunk';
import rootConstants from "@constants/index";
import { displayError, displaySuccess } from "./alertSlice";
import apiHandler from "@utils/apiHandler";
import { HYDRATE } from "next-redux-wrapper";

import { setDataForDebugAction } from "./sqlDebuggerSlice";
import commons from "@constants/common";
const { REQUEST, SUCCESS, PENDING, FAILURE } = commons;

const baseURL = rootConstants.CLIENT_API;
const sliceName = "clientModel";
const actionLabel = "clientModel";
const singular = "clientModel";
const pular = "clientModels";
export const initialState = {
  clientModelList: [],
  clientModel: {},
  populationSummary: {},
  loaList: {
    loa1List: {},
    loa2List: { ALL: { name: "ALL" } },
    loa3List: { ALL: { name: "ALL" } },
    loa4List: { ALL: { name: "ALL" } },
    loa5List: { ALL: { name: "ALL" } },
    loa6List: { ALL: { name: "ALL" } },
  },
  loaLabel: {
    loa1Id: "",
    loa2Id: "",
    loa3Id: "",
    loa4Id: "",
    loa5Id: "",
    loa6Id: "",
  },
  planTypeList: {},
  modelInfo: {
    modelName: "",
    clientId: "",
    noOfPcp: "",
    planType: "",
    loa1Id: "",
    loa2Id: "ALL",
    loa3Id: "ALL",
    loa4Id: "ALL",
    loa5Id: "ALL",
    loa6Id: "ALL",
    modelId: ""
  },
  
  resStatus: PENDING,
  clientListResStatus: PENDING,
};

const listSuccess = createAction(
  `${sliceName}/listSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const listGetDetailsByIdSuccess = createAction(
  `${sliceName}/listGetDetailsByIdSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const getLoa1ByIdActionSuccess = createAction(
  `${sliceName}/getLoa1ByIdActionSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const getLoa2ByIdActionSuccess = createAction(
  `${sliceName}/getLoa2ByIdActionSuccess`,
  function prepare(payload) {
    const newPayload = { "ALL": { name: "ALL" }, ...payload };
    return {
      payload: newPayload,
    };
  }
);

const getLoa3ByIdActionSuccess = createAction(
  `${sliceName}/getLoa3ByIdActionSuccess`,
  function prepare(payload) {
    const newPayload = { "ALL": { name: "ALL" }, ...payload };
    return {
      payload: newPayload,
    };
  }
);

const savePlanTypeOthersActionSuccess = createAction(
    `${sliceName}/savePlanTypeOthersActionSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const getLoa4ByIdActionSuccess = createAction(
  `${sliceName}/getLoa4ByIdActionSuccess`,
  function prepare(payload) {
    const newPayload = { "ALL": { name: "ALL" }, ...payload };
    return {
      payload: newPayload,
    };
  }
);

const getPlansByIdActionSuccess = createAction(
  `${sliceName}/getPlansByIdActionSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const listGetPopulationSummarySuccess = createAction(
  `${sliceName}/listGetPopulationSummarySuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const saveModelInfoSuccess = createAction(
  `${sliceName}/saveModelInfoSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const saveClientListSuccess = createAction(
  `${sliceName}/saveClientListSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const updateLabelListSuccess = createAction(
  `${sliceName}/updateLabelListSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const resetClientModelSuccess = createAction(
  `${sliceName}/resetClientModelSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const listRequest = createAction(`${sliceName}/listRequest`);

export const listAction = createAsyncThunk(
  `${sliceName}/list${actionLabel}`,
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(listRequest());
    /* cannot use utils apiHandler, authHeader creates dep cycle */
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

export const getDetailsByIdAction = createAsyncThunk(
  `${sliceName}/getDetailsById${actionLabel}`,
  async (payload, thunkAPI) => {
    const apiUrl = baseURL + "/details/" + payload;
    const response = await apiHandler.get(apiUrl, false);
    //   const { code, status } = response;
    thunkAPI.dispatch(setDataForDebugAction(response));
    thunkAPI.dispatch(listGetDetailsByIdSuccess(response.data));
    // reply to thunk state
    return true;
  }
);

export const getLoa1ByIdAction = createAsyncThunk(
  `${sliceName}/getLoa1ByIdAction${actionLabel}`,
  async (payload, thunkAPI) => {
    const apiUrl = baseURL + "/loa1";
    const response = await apiHandler.post(apiUrl, payload);
    //   const { code, status } = response;
    thunkAPI.dispatch(setDataForDebugAction(response));
    thunkAPI.dispatch(getLoa1ByIdActionSuccess(response.data));
    // reply to thunk state
    return true;
  }
);

export const getLoa2ByIdAction = createAsyncThunk(
  `${sliceName}/getLoa2ByIdAction${actionLabel}`,
  async (payload, thunkAPI) => {
    const apiUrl = baseURL + "/loa2";
    const response = await apiHandler.post(apiUrl, payload);
    //   const { code, status } = response;
    thunkAPI.dispatch(setDataForDebugAction(response));
    thunkAPI.dispatch(getLoa2ByIdActionSuccess(response.data));
    // reply to thunk state
    return true;
  }
);

export const savePlanTypeOthers = createAsyncThunk(
    `${sliceName}/savePlanTypeOthersAction${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(savePlanTypeOthersActionSuccess(payload));
        // reply to thunk state
        return true;
    }
);

export const getLoa3ByIdAction = createAsyncThunk(
  `${sliceName}/getLoa3ByIdAction${actionLabel}`,
  async (payload, thunkAPI) => {
    const apiUrl = baseURL + "/loa3";
    const response = await apiHandler.post(apiUrl, payload);
    //   const { code, status } = response;
    thunkAPI.dispatch(setDataForDebugAction(response));
    thunkAPI.dispatch(getLoa3ByIdActionSuccess(response.data));
    // reply to thunk state
    return true;
  }
);

export const getLoa4ByIdAction = createAsyncThunk(
  `${sliceName}/getLoa4ByIdAction${actionLabel}`,
  async (payload, thunkAPI) => {
    const apiUrl = baseURL + "/loa4";
    const response = await apiHandler.post(apiUrl, payload);
    //   const { code, status } = response;
    thunkAPI.dispatch(setDataForDebugAction(response));
    thunkAPI.dispatch(getLoa4ByIdActionSuccess(response.data));
    // reply to thunk state
    return true;
  }
);

export const getPlansByIdAction = createAsyncThunk(
  `${sliceName}/getPlansByIdAction${actionLabel}`,
  async (payload, thunkAPI) => {
    const apiUrl = baseURL + "/plans";
    const response = await apiHandler.post(apiUrl, payload);
    //   const { code, status } = response;
    thunkAPI.dispatch(setDataForDebugAction(response));
    thunkAPI.dispatch(getPlansByIdActionSuccess(response.data));
    // reply to thunk state
    return true;
  }
);

export const getPopulationSummaryAction = createAsyncThunk(
  `${sliceName}/getPopulationSummary${actionLabel}`,
  async (payload, thunkAPI) => {
    const apiUrl = baseURL + "/population-summary";
    const response = await apiHandler.post(apiUrl, payload);
    //   const { code, status } = response;
    thunkAPI.dispatch(setDataForDebugAction(response));
    thunkAPI.dispatch(listGetPopulationSummarySuccess(response.data));
    // reply to thunk state
    return true;
  }
);

export const saveModelInfoAction = createAsyncThunk(
  `${sliceName}/saveModelInfo${actionLabel}`,
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(saveModelInfoSuccess(payload));
    return true;
  }
);

export const updateLabelListAction = createAsyncThunk(
  `${sliceName}/updateLabelList${actionLabel}`,
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(updateLabelListSuccess(payload));
    return true;
  }
);

export const saveClientListAction = createAsyncThunk(
  `${sliceName}/saveClientList${actionLabel}`,
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(saveClientListSuccess(payload));
    return true;
  }
);

export const resetClientModelAction = createAsyncThunk(
  `${sliceName}/resetClientModel${actionLabel}`,
  async (payload, thunkAPI) => {
    thunkAPI.dispatch(resetClientModelSuccess(payload));
    return true;
  }
);

const mainSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    listRequest: (state, action) => {
      state.clientListResStatus = REQUEST;
    },
    listSuccess: (state, action) => {
      state.clientModelList = action.payload;
      state.resStatus = SUCCESS;
      state.clientListResStatus = SUCCESS;
    },
    listGetDetailsByIdSuccess: (state, action) => {
      state.clientModel = action.payload;
      state.resStatus = SUCCESS;
    },
    getLoa1ByIdActionSuccess: (state, action) => {
      state.loaList.loa1List = action.payload;
      state.resStatus = SUCCESS;
    },
    getLoa2ByIdActionSuccess: (state, action) => {
      state.loaList.loa2List = action.payload;
      state.resStatus = SUCCESS;
    },
    getLoa3ByIdActionSuccess: (state, action) => {
      state.loaList.loa3List = action.payload;
      state.resStatus = SUCCESS;
    },
      savePlanTypeOthersActionSuccess: (state, action) => {
          state.modelInfo.planType = action.payload.planType
          state.modelInfo.modelId = action.payload.id
          state.modelInfo.clientId = action.payload.clientId
          state.modelInfo.loa1Id = action.payload.loa1
          state.modelInfo.ipaAlloc = action.payload.ipaAllocation
          state.modelInfo.ipaAdmin = action.payload.ipaAdmin
          state.modelInfo.modelName = action.payload.name
          state.modelInfo.name = action.payload.name
          state.modelInfo.noOfPcp = action.payload.numberOfPcp
      },
    getLoa4ByIdActionSuccess: (state, action) => {
      state.loaList.loa4List = action.payload;
      state.resStatus = SUCCESS;
    },
    getPlansByIdActionSuccess: (state, action) => {
      state.planTypeList = action.payload;
      state.resStatus = SUCCESS;
    },
    listGetPopulationSummarySuccess: (state, action) => {
      state.populationSummary = action.payload;
      state.resStatus = SUCCESS;
    },
    saveModelInfoSuccess: (state, action) => {
      state.modelInfo = action.payload;
      /* update label upon client change */
      const filteredClient = state.clientModelList.filter((client, index) => {
        return client.id === state.modelInfo.clientId;
      });
      if (filteredClient[0]) {
        const {
          loa1Label,
          loa2Label,
          loa3Label,
          loa4Label,
          loa5Label,
          loa6Label,
        } = filteredClient[0];
        state.loaLabel = {
          loa1Id: loa1Label,
          loa2Id: loa2Label,
          loa3Id: loa3Label,
          loa4Id: loa4Label,
          loa5Id: loa5Label,
          loa6Id: loa6Label,
        };
      } else {
        state.loaLabel = initialState.loaLabel;
      }
      state.resStatus = SUCCESS;
    },
    updateLabelListSuccess: (state, action) => {
      const clientId = action.payload;
      /* update label upon client change */
      const filteredClient = state.clientModelList.filter((client, index) => {
        return client.id === clientId;
      });
      if (filteredClient[0]) {
        const {
          loa1Label,
          loa2Label,
          loa3Label,
          loa4Label,
          loa5Label,
          loa6Label,
        } = filteredClient[0];
        state.loaLabel = {
          loa1Id: loa1Label,
          loa2Id: loa2Label,
          loa3Id: loa3Label,
          loa4Id: loa4Label,
          loa5Id: loa5Label,
          loa6Id: loa6Label,
        };
      } else {
        state.loaLabel = initialState.loaLabel;
      }
      state.resStatus = SUCCESS;
    },
    saveClientListSuccess: (state, action) => {
      state.clientModelList = action.payload;
    },
    resetClientModelSuccess: () => initialState,
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
        clientListResStatus: PENDING,
      };
    });
    builder.addCase(listAction.rejected, (state) => {
      state.resStatus = FAILURE;
      state.clientListResStatus = FAILURE;
    });
    // getPopulationSummaryAction
    builder.addCase(getDetailsByIdAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
    builder.addCase(getDetailsByIdAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // getPopulationSummaryAction
    builder.addCase(
      getPopulationSummaryAction.pending,
      (state /* , action */) => {
        return { ...initialState, ...state, resStatus: PENDING };
      }
    );
    builder.addCase(getPopulationSummaryAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // saveModelInfoAction
    builder.addCase(saveModelInfoAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
    builder.addCase(saveModelInfoAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // getLoa1ByIdAction
    builder.addCase(getLoa1ByIdAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
    builder.addCase(getLoa1ByIdAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // getLoa2ByIdAction
    builder.addCase(getLoa2ByIdAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
    builder.addCase(getLoa2ByIdAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // getLoa3ByIdAction
    builder.addCase(getLoa3ByIdAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
    builder.addCase(getLoa3ByIdAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // getLoa4ByIdAction
    builder.addCase(getLoa4ByIdAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
    builder.addCase(getLoa4ByIdAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
    // getPlansByIdAction
    builder.addCase(getPlansByIdAction.pending, (state /* , action */) => {
      return { ...initialState, ...state, resStatus: PENDING };
    });
    builder.addCase(getPlansByIdAction.rejected, (state) => {
      state.resStatus = FAILURE;
    });
  },
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const clientModelState = (state) => state[sliceName];
export const selectModelInfo = createSelector(clientModelState, (state) => state?.modelInfo?.modelName || '');
export const selectClientModel = createSelector(clientModelState, (state) => state?.modelInfo);
export const clientModelSlice = {
  listAction,
  getDetailsByIdAction,
  getPopulationSummaryAction,
};
