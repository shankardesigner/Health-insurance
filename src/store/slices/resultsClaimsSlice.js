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

const baseURL = rootConstants.RESULTS_CLAIMS_API;
const sliceName = "resultsClaimsModel";
const actionLabel = "resultsClaimsModel";
const singular = "resultsClaimsModel";
const pular = "resultsClaimsModels";
const maxRetryCount = 1;
const initialState = {
    resultsClaimsModelList: [],
    resultsClaimsModelListReqStatus: PENDING,
    retryResultsClaimsModelListFetchCount: 0, 

    resultsClaimsModel: null,
    resStatus: PENDING,

    serviceCategoryData: [],
    serviceCategoryDataResStatus: PENDING,

    specialityData: [],
    specialityDataResStatus: PENDING, 

    calculatedResults: [],
    storeServiceCategoryFactorStatus: PENDING
};

const listSuccess = createAction(
    `${sliceName}/listSuccess`,
    function prepare(payload, requestPayload) {
        let preparedData = [];
        payload.map((data, index)=>{
            const rowData = {
                ...data, 
                ...requestPayload
            }
            preparedData.push(rowData);
        });
        return {
            payload: preparedData,
        };
    }
);

const getServiceCategorySuccess = createAction(
    `${sliceName}/getServiceCategorySuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const getSpecialitySuccess = createAction(
    `${sliceName}/getSpecialitySuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const getCalculatedResultsSuccess = createAction(
    `${sliceName}/getCalculatedResultsSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const storeServiceCategoryFactorSuccess = createAction(
    `${sliceName}/storeServiceCategoryFactorSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const listRequest = createAction(`${sliceName}/listRequest`,);
const storeServiceCategoryFactorRequest = createAction(`${sliceName}/storeServiceCategoryFactorRequest`);
const resetStoreFactorSuccess = createAction(`${sliceName}/resetStoreFactorSuccess`);
const resetResultClaimsDataFetchSuccess = createAction(`${sliceName}/resetResultClaimsDataFetchSuccess`);
const retryListAction = createAction(`${sliceName}/retryListAction`);
const getServiceCategoryRequest = createAction(`${sliceName}/getServiceCategoryRequest`);
const getSpecialityRequest = createAction(`${sliceName}/getSpecialityRequest`);

export const listAction = createAsyncThunk(
    `${sliceName}/list${actionLabel}`,
    async (payload, thunkAPI) => {
        listRequest();
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL, payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            if(response.data.length !== 0){
                /* retry listAction */
                thunkAPI.dispatch(listSuccess(response.data, payload));
            }else{
                thunkAPI.dispatch(retryListAction());
            }
        } else {
            thunkAPI.dispatch(actionFailure());
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
        const response = await apiHandler.post(baseURL + '/service-category', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(getServiceCategorySuccess(response.data));
        } else {
            thunkAPI.dispatch(actionFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const getSpecialityAction = createAsyncThunk(
    `${sliceName}/getSpeciality${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(getSpecialityRequest());
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/speciality', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(getSpecialitySuccess(response.data));
        } else {
            thunkAPI.dispatch(actionFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const storeServiceCategoryFactorAction = createAsyncThunk(
    `${sliceName}/storeServiceCategoryFactor${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/service-category/factor', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));
        
        storeServiceCategoryFactorRequest();

        if (status === 200) {
            thunkAPI.dispatch(storeServiceCategoryFactorSuccess(response.data));
        } else {
            thunkAPI.dispatch(actionFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const getCalculatedResultsAction = createAsyncThunk(
    `${sliceName}/getCalculatedResults${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/service-category/results', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(getCalculatedResultsSuccess(response.data));
        } else {
            thunkAPI.dispatch(actionFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const resetStoreFactorAction = createAsyncThunk(
    `${sliceName}/resetStoreFactor${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(resetStoreFactorSuccess(payload));
        return true;
    }
);

export const resetResultClaimsDataFetchAction = createAsyncThunk(
    `${sliceName}/resetResultClaimsDataFetch${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(resetResultClaimsDataFetchSuccess(payload));
        return true;
    }
);


const mainSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        listRequest: (state, action) => {
            state.resultsClaimsModelListReqStatus = REQUEST;
        },
        listSuccess: (state, action) => {
            state.resultsClaimsModelList = action.payload;
            state.resultsClaimsModelListReqStatus = SUCCESS;
        },
        retryListAction: (state, action) => {
            const currentRetryCount = state.retryResultsClaimsModelListFetchCount;
            if(currentRetryCount <= maxRetryCount){
                state.retryResultsClaimsModelListFetchCount = currentRetryCount + 1;
                state.resultsClaimsModelListReqStatus = PENDING;
            }
        },
        resetResultClaimsDataFetchSuccess: (state, action) => {
            state.resultsClaimsModelListReqStatus = PENDING;
        },
        getServiceCategoryRequest: (state, action) => {
            state.serviceCategoryData = initialState.serviceCategoryData;
            state.serviceCategoryDataResStatus = REQUEST;
        },
        getServiceCategorySuccess: (state, action) => {
            state.serviceCategoryData = action.payload;
            state.serviceCategoryDataResStatus = SUCCESS;
            state.resStatus = SUCCESS;
        },
        getSpecialityRequest: (state, action) => {
            state.specialityData = initialState.specialityData;
            state.specialityDataResStatus = REQUEST;
        },
        getSpecialitySuccess: (state, action) => {
            state.specialityData = action.payload;
            state.specialityDataResStatus = SUCCESS;
            state.resStatus = SUCCESS;
        },
        getCalculatedResultsSuccess: (state, action) => {
            state.calculatedResults = action.payload;
            state.resStatus = SUCCESS;
        },
        storeServiceCategoryFactorRequest: (state, action) => {
            state.storeServiceCategoryFactorStatus = REQUEST;
        },
        storeServiceCategoryFactorSuccess: (state, action) => {
            state.storeServiceCategoryFactorStatus = SUCCESS;
        },
        resetStoreFactorSuccess: (state, action) => {
            state.serviceCategoryData = initialState.serviceCategoryData;
            state.storeServiceCategoryFactorStatus = PENDING;
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
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(listAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });

        // getServiceCategoryAction
        builder.addCase(getServiceCategoryAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(getServiceCategoryAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });

        // getSpecialityAction
        builder.addCase(getSpecialityAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(getSpecialityAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });

        // getCalculatedResultsAction
        builder.addCase(getCalculatedResultsAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(getCalculatedResultsAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });

        // storeServiceCategoryFactorAction
        builder.addCase(storeServiceCategoryFactorAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(storeServiceCategoryFactorAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });
    },
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const resultsClaimsModelState = (state) => state[sliceName];
export const resultsClaimsModelSlice = {
    listAction,
};
