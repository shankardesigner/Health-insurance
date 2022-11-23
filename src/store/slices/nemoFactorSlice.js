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
} = commons;
import { displayError, displaySuccess } from "./alertSlice";
import apiHandler from "@utils/apiHandler";
import { HYDRATE } from 'next-redux-wrapper';

import { setDataForDebugAction } from './sqlDebuggerSlice';

const baseURL = rootConstants.NEMO_FACTOR_API;
const sliceName = "nemoFactorModel";
const actionLabel = "nemoFactorModel";
const singular = "nemoFactorModel";
const pular = "nemoFactorModels";
const initialState = {
    nemoFactorModelList: [],
    nemoFactorModelListResStatus: PENDING,
    nemoFactorModel: null,
    serviceCategories: {},
    serviceCategoriesResStatus: PENDING,
    storeNemoFactorResStatus: PENDING,
    storeNemoFactorListResStatus: PENDING,
    usedNemoFactor: [],
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

const saveUsedNemoFactorSuccess = createAction(
    `${sliceName}/saveUsedNemoFactorSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const listRequest = createAction(`${sliceName}/listRequest`);
const getServiceCategoryRequest = createAction(`${sliceName}/getServiceCategoryRequest`);

const getServiceCategorySuccess = createAction(
    `${sliceName}/getServiceCategorySuccess`,
    function prepare(payload, requestBody) {
        // 
        let serviceCategory = {
            [requestBody.nemoFactorId]: {
                [requestBody.intensity]: payload
            }
        }
        return { payload: { nemoFactorId: requestBody.nemoFactorId, data: serviceCategory } }
    }
);

const storeNemoFactorListSuccess = createAction(
    `${sliceName}/storeNemoFactorListSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);
const getNemoFactorsByModelIdSuccess = createAction(
    `${sliceName}/getNemoFactorsByModelIdSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const storeNemoFactorRequest = createAction(`${sliceName}/storeNemoFactorRequest`);
const storeNemoFactorListRequest = createAction(`${sliceName}/storeNemoFactorListRequest`);
const resetStoreNemoFactorStatusSuccess = createAction(`${sliceName}/resetStoreNemoFactorStatusSuccess`);

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

// store into remote db: from popup modal
export const storeNemoFactorAction = createAsyncThunk(
    `${sliceName}/storeNemoFactor${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(storeNemoFactorRequest());
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL, payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(storeNemoFactorSuccess(response.data));
        } else {
            thunkAPI.dispatch(listFailure());
        }
        // reply to thunk state
        return true;
    }
);

// store into remote db: from parent table
export const storeNemoFactorListAction = createAsyncThunk(
    `${sliceName}/storeNemoFactorList${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(storeNemoFactorListRequest());
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        thunkAPI.dispatch(storeNemoFactorPending(REQUEST));
        const response = await apiHandler.post(baseURL+"/save", payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(storeNemoFactorSuccess(SUCCESS));
            thunkAPI.dispatch(storeNemoFactorListSuccess(response.data));
        } else {
            thunkAPI.dispatch(listFailure());
        }
        // reply to thunk state
        return true;
    }
);


export const getServiceCategoryAction = createAsyncThunk(
    `${sliceName}/getServiceCategory${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(getServiceCategoryRequest());
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/service-categories', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(getServiceCategorySuccess(response.data, payload));
        } else {
            thunkAPI.dispatch(actionFailure());
        }
        // reply to thunk state
        return true;
    }
);

//save locally
export const saveUsedNemoFactorAction = createAsyncThunk(
    `${sliceName}/saveUsedNemoFactor${actionLabel}`,
    async (payload, thunkAPI) => {
       thunkAPI.dispatch(saveUsedNemoFactorSuccess(payload));
        return true;
    }
);

// reset nemo factor saving status
export const resetStoreNemoFactorStatusAction = createAsyncThunk(
    `${sliceName}/resetStoreNemoFactorStatus${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(resetStoreNemoFactorStatusSuccess(payload));
        return true;
    }
);

// Handle nemo factor edit

export const getNemoFactorsByModelIdAction = createAsyncThunk(
    `${sliceName}/getNemoFactorById${actionLabel}`,
    async (payload, thunkAPI) => {
        // thunkAPI.dispatch(getServiceCategoryRequest());
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/saved-factors', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));
        // 
        if (status === 200) {
            thunkAPI.dispatch(getNemoFactorsByModelIdSuccess(response.data));
        } else {
            thunkAPI.dispatch(actionFailure());
        }
        // reply to thunk state
        return true;
    }
)


const mainSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        listRequest: (state, action) => {
            state.nemoFactorModelListResStatus = REQUEST;
        },
        listSuccess: (state, action) => {
            state.nemoFactorModelList = action.payload;
            state.nemoFactorModelListResStatus = SUCCESS;
            state.resStatus = SUCCESS;
        },
        getServiceCategoryRequest: (state, action) => {
            state.serviceCategoriesResStatus = REQUEST;
        },
        getServiceCategorySuccess: (state, action) => {
            const { nemoFactorId, data } = action.payload;
            state.serviceCategories = {
                ...state.serviceCategories,
                [nemoFactorId]: {
                    ...state.serviceCategories[nemoFactorId],
                    ...data[nemoFactorId]
                }
            };
            state.serviceCategoriesResStatus = SUCCESS;
            state.resStatus = SUCCESS;
        },
        saveUsedNemoFactorSuccess: (state, action) => {
            state.usedNemoFactor = action.payload;
            state.resStatus = SUCCESS;
        },
        storeNemoFactorRequest: (state, action) => {
            state.storeNemoFactorResStatus = REQUEST;
        },
        storeNemoFactorListRequest: (state, action) => {
            state.storeNemoFactorListResStatus = REQUEST;
        },
        storeNemoFactorPending: (state, action) => {
            state.storeNemoFactorResStatus = REQUEST;
        },
        storeNemoFactorSuccess: (state, action) => {
            state.storeNemoFactorResStatus = SUCCESS;
        },
        storeNemoFactorListSuccess: (state, action) => {
            state.storeNemoFactorListResStatus = SUCCESS;
        },
        resetStoreNemoFactorStatusSuccess: (state, action) => {
            state.storeNemoFactorResStatus = PENDING;
        },
        getNemoFactorsByModelIdSuccess: (state, action) => {
            let nemoFactors = {};
            action.payload.forEach(data=>{
                nemoFactors = {
                    ...nemoFactors,
                    [data.nemoFactorId]: {
                        id: data.nemoFactorId,
                        intensity: data.isCustom ? 'Custom' : data.intensity,
                        isSelected: true,
                    }
                }
            })
            state.usedNemoFactor = nemoFactors;
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
            return { ...initialState, ...state, resStatus: PENDING, nemoFactorModelListResStatus: PENDING };
        });
        builder.addCase(listAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE, nemoFactorModelListResStatus: FAILURE };
        });
        // saveUsedNemoFactorAction
        builder.addCase(saveUsedNemoFactorAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(saveUsedNemoFactorAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE };
        });
        // getServiceCategoryAction
        builder.addCase(getServiceCategoryAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING, serviceCategoriesResStatus: PENDING };
        });
        builder.addCase(getServiceCategoryAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE, serviceCategoriesResStatus: FAILURE };
        });
        // storeNemoFactorListAction
        builder.addCase(storeNemoFactorAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING, storeNemoFactorResStatus: PENDING };
        });
        builder.addCase(storeNemoFactorAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE, storeNemoFactorResStatus: FAILURE };
        });
        // storeNemoFactorListAction
        builder.addCase(storeNemoFactorListAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING, storeNemoFactorListResStatus: PENDING };
        });
        builder.addCase(storeNemoFactorListAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE, storeNemoFactorListResStatus: FAILURE };
        });
        // resetStoreNemoFactorStatusAction
        builder.addCase(resetStoreNemoFactorStatusAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING, storeNemoFactorResStatus: PENDING };
        });
        builder.addCase(resetStoreNemoFactorStatusAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE, storeNemoFactorResStatus: PENDING };
        });
    },
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const nemoFactorModelState = (state) => state[sliceName];
export const nemoFactorModelSlice = {
    listAction
};

export const { storeNemoFactorPending, storeNemoFactorSuccess } =
  mainSlice.actions;
