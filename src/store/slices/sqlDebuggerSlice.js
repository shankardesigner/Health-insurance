import {
  // Action,
  createSlice,
  createAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const sliceName = "sqlDebugger";
const actionLabel = "sqlDebugger";

const initialState = {
  data: []
};

const setDataForDebugSuccess = createAction(
  `${sliceName}/setDataForDebugSuccess`,
  function prepare(payload) {
    return {
      payload,
    };
  }
);

export const setDataForDebugAction = createAsyncThunk(
  `${sliceName}/setDataForDebug${actionLabel}`,
  async (payload, thunkAPI) => {
    // TODO: disabling sql debugger now
    // thunkAPI.dispatch(setDataForDebugSuccess(payload));
    return true;
  }
);

const sqlDebuggerSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setDataForDebugSuccess: (state, action) => {
      let tempState = state.data;
      //
      const { data, requestOptions, meta, execTime, status } = action.payload;
      const metadata = meta ? meta : {};
      const payload = {
        url: requestOptions.url,
        method: requestOptions.method,
        data,
        execTime,
        query: metadata.query ? meta.query : "N/A",
        status,
        requestBody: requestOptions.body ? JSON.parse(requestOptions.body) : {}
      }
      tempState.unshift(payload);
      state.data = tempState;
    }
  },
  extraReducers: (builder) => {
    // setDataForDebugAction
    builder.addCase(setDataForDebugAction.pending, (state /* , action */) => {
      return { ...initialState, ...state };
    });
    builder.addCase(setDataForDebugAction.rejected, (state) => {
      return { ...initialState };
    });
  }
});

export const { displaySuccess, displayError } = sqlDebuggerSlice.actions;
export const sqlDebuggerState = (state) => state[sliceName];

export default sqlDebuggerSlice.reducer;
