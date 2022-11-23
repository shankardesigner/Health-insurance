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
import commons from "@constants/common";
const {
    REQUEST,
	SUCCESS,
	PENDING,
	FAILURE,
	ACTION_SUCCESS,
	ACTION_FAILURE,
} = commons;
import { HYDRATE } from 'next-redux-wrapper';

const sliceName = "tabModel";
const actionLabel = "tabModel";
const initialState = {
    tabState: {
        lastactive: 0,
    },
    resStatus: PENDING,
};

//TODO: No need to use async thunk just to update the internal redux states...
export const setTabStateAction = createAsyncThunk(
    `${sliceName}/setTabState${actionLabel}`,
    async (payload, thunkAPI) => {
        // thunkAPI.dispatch(setTabStateSuccess(payload));
        // return true;
    }
);


const mainSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        updateTabEdited: (state, action) => {
            const currentIndex  = action.payload;
            state.resStatus = FAILURE;
            const newPayload = {
                ...state.tabState,
                [currentIndex]: "*",
                lastActive: currentIndex
            };
            state.tabState = newPayload;
            state.resStatus = SUCCESS;
        },
        updateLastActiveTab : (state, action) => {
            const prevIndex = action.payload;
            state.tabState = {
                ...initialState.tabState,
                lastactive: prevIndex
            };
        },
        updateHandleChange : (state,action) => {
            const prevIndex = action.payload;
            state.tabState.lastactive = prevIndex;
        },

        editTabRest: (state) => initialState,
    },
    extraReducers: (builder) => {},
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const tabModelState = createSelector(state => state.tabModel, tabModel => tabModel);
export const tabModelSlice = {
    setTabStateAction,
};

export const { updateTabEdited, updateLastActiveTab, editTabRest, updateHandleChange } = mainSlice.actions