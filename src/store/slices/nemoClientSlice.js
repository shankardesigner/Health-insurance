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
import apiHandler from "@utils/apiHandler";
import { HYDRATE } from 'next-redux-wrapper';
import { setDataForDebugAction } from './sqlDebuggerSlice';
import commons from "@constants/common";
const {
  REQUEST,
SUCCESS,
PENDING,
FAILURE
} = commons;

const baseURL = rootConstants.NEMO_CLIENTS_API;
const sliceName = "nemoClientModel";
const actionLabel = "nemoClientModel";
const singular = "nemoClientModel";
const pular = "nemoClientModels";
export const initialState = {
  nemoClientModelList: [],
  newClientsList:[],
  practiceList:[],
  nemoClientModel: null,
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
const getPracticeSuccess = createAction(
  `${sliceName}/getPracticeSuccess`,
  function prepare(payload) {
      return {
          payload,
      };
  }
);
const addSuccess = createAction(
  `${sliceName}/addSuccess`,
  function prepare(payload) {
      return {
          payload,
      };
  }
);

const searchSuccess = createAction(
  `${sliceName}/searchSuccess`,
  function prepare(payload) {
      return {
          payload,
      };
  }
);

const actionSuccess = createAction(
  `${sliceName}/actionSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

const actionFailure = createAction(`${sliceName}/actionFailure`);

const deleteClientSuccess = createAction(
  `${sliceName}/deleteClientSuccess`,
  function prepare(payload) {
      return {
          payload,
      };
  }
);

export const listAction = createAsyncThunk(
  `${sliceName}/list${actionLabel}`,
  async (payload, thunkAPI) => {
      
      const apiUrl = `${baseURL}`
      
      const response = await apiHandler.get(apiUrl, false);
      //const { code, status } = response;
      //thunkAPI.dispatch(setDataForDebugAction(response));

      thunkAPI.dispatch(listSuccess(response.data));
      // reply to thunk state
      return true;
  }
);

export const getPracticeAction = createAsyncThunk(
  `${sliceName}/list${actionLabel}`,
  async (payload, thunkAPI) => {
      
      const apiUrl = 'http://localhost:8080/nemo-practice'
      
      const response = await apiHandler.get(apiUrl, false);
      //const { code, status } = response;
      //thunkAPI.dispatch(setDataForDebugAction(response));
      thunkAPI.dispatch(getPracticeSuccess(response.data));
      // reply to thunk state
      return true;
  }
);

export const addAction = createAsyncThunk(
  `${sliceName}/list${actionLabel}`,
  async (payload, thunkAPI) => {
      
      const apiUrl = `${baseURL}`
      
      const response = await apiHandler.post(apiUrl, payload);
      //const { code, status } = response;
      //thunkAPI.dispatch(setDataForDebugAction(response));

      thunkAPI.dispatch(addSuccess(response));
      // reply to thunk state
      return true;
  }
);

export const searchAction = createAsyncThunk(
  `${sliceName}/list${actionLabel}`,
  async (payload, thunkAPI) => {
      
      const apiUrl = `${baseURL}?searchParam=${payload.searchParam}`
      
      const response = await apiHandler.get(apiUrl, payload);
      //const { code, status } = response;
      //thunkAPI.dispatch(setDataForDebugAction(response));

      thunkAPI.dispatch(searchSuccess(response.data));
      // reply to thunk state
      return true;
  }
);

export const deleteAction = createAsyncThunk(
  `${sliceName}/delete${actionLabel}`,
  async (nemoClientId, thunkAPI) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    const response = await apiHandler.deleteRequest(
      `${baseURL}/${nemoClientId}`
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

export const deleteClientAction = createAsyncThunk(
  `${sliceName}/delete${actionLabel}`,
  async (payload, thunkAPI) => {
    /* cannot use utils apiHandler, authHeader creates dep cycle */
    const response = await apiHandler.deleteRequest(
      `${baseURL}/${payload}`
    );
    const { code, status } = response;

    thunkAPI.dispatch(setDataForDebugAction(response));

    if (status === 200 && code === "SUCCESS") {
  
      thunkAPI.dispatch(deleteClientSuccess(payload));
      toast.success('Model deleted successfully.');
    } 
    return true;
  }
);


const mainSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    
      listSuccess: (state, action) => {
          state.nemoClientModelList = [...initialState.nemoClientModelList,...action.payload];
          state.resStatus = SUCCESS;
          
      },
      getPracticeSuccess: (state, action) => {
        state.practiceList = [...action.payload];
        state.resStatus = SUCCESS;
        
    },
      addSuccess:(state,action)=>{
          state.newClientsList =[...action.payload];
          state.resStatus =SUCCESS;
      },
      searchSuccess:(state,action)=>{
        state.nemoClientModelList =[...action.payload];
        state.resStatus =SUCCESS;
    },
      actionSuccess: (state, action) => {
        state.nemoClientModel = action.payload;
        state.resStatus = ACTION_SUCCESS;
      },
      actionFailure: (state) => {
        state.resStatus = ACTION_FAILURE;
      },
      deleteClientSuccess: (state, action) => {
        state.nemoClientModelList = state.nemoClientModelList.filter(model => model.modelId !== action.payload)
      },
    
      listFailure: () => initialState,
  },
  extraReducers: (builder) => {
      // hydrate 
      builder.addCase(HYDRATE, (state, action) => {
          return { ...action.payload[sliceName] }
      });
      // listAction
      builder.addCase(listAction.pending, (state /* , action */) => {
          return { ...initialState, ...state, resStatus: PENDING};
      });
      builder.addCase(listAction.rejected, (state) => {
          state.resStatus = FAILURE;
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

export const nemoClientModelState = (state) => state[sliceName];
export const nemoClientModelSlice = {
  listAction,
  deleteClientAction,
  addAction,
  searchAction,
  getPracticeAction
 
};
