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
	SUCCESS,
    PENDING,
    FAILURE,
    REQUEST
} = commons;
import { displayError, displaySuccess } from "./alertSlice";
import apiHandler from "@utils/apiHandler";
import { HYDRATE } from 'next-redux-wrapper';
import { toast } from "react-toastify";


import { setDataForDebugAction } from './sqlDebuggerSlice';

const baseURL = rootConstants.WHAT_IF_API;
const sliceName = "whatIfModel";
const actionLabel = "whatIfModel";
const singular = "whatIfModel";
const pular = "whatIfModels";
const initialState = {
    highCostEventsFetch: false,
    highCostEvents: [],
    highCostEventsSearchData: [],
    storeHighCostEventsResStatus: PENDING, 

    claimsCategoryFetch: false,
    claimsCategory: [],
    claimsCategorySearchData: [],

    diagnosisPrevalenceList: [],
    diagnosisPrevalenceSearchData: [],
    diagnosisPrevalenceFetch: false, 
    storeDiagnosisResStatus: PENDING, 

    resStatus: PENDING,
};

const getHighCostEventsSuccess = createAction(
    `${sliceName}/getHighCostEventsSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const getClaimCategorySuccess = createAction(
    `${sliceName}/getClaimCategorySuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const findHighCostEventsByNameSuccess = createAction(
    `${sliceName}/findHighCostEventsByNameSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const findClaimCategoryByNameSuccess = createAction(
    `${sliceName}/findClaimCategoryByNameSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const addNewHighCostEventsSuccess = createAction(
    `${sliceName}/addNewHighCostEventsSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const addNewClaimCategoriesSuccess = createAction(
    `${sliceName}/addNewClaimCategoriesSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const addNewDiagnosisSuccess = createAction(
    `${sliceName}/addNewDiagnosisSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const deleteDiagnosisSuccess = createAction(
    `${sliceName}/deleteDiagnosisSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const deleteClaimCategorySuccess = createAction(
    `${sliceName}/deleteClaimCategorySuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const deleteHighCostEventsSuccess = createAction(
    `${sliceName}/deleteHighCostEventsSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const getDiagnosisPrevalenceSuccess = createAction(
    `${sliceName}/getDiagnosisPrevalenceSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const findDiagnosisByNameSuccess = createAction(
    `${sliceName}/findDiagnosisByNameSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const fetchDataRequest = createAction(`${sliceName}/fetchDataRequest`);
const getHighCostEventsFailure = createAction(`${sliceName}/getHighCostEventsFailure`);
const resetWhatIfFetchSuccess = createAction(`${sliceName}/resetWhatIfFetchSuccess`);
const storeHighCostEventsRequest = createAction(`${sliceName}/storeHighCostEventsRequest`);
const storeHighCostEventsSuccess = createAction(`${sliceName}/storeHighCostEventsSuccess`);
const storeDiagnosisRequest = createAction(`${sliceName}/storeDiagnosisRequest`);
const storeDiagnosisSuccess = createAction(`${sliceName}/storeDiagnosisSuccess`);

export const resetWhatIfFetchAction = createAsyncThunk(
    `${sliceName}/resetFetch${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(resetWhatIfFetchSuccess(payload));
        // reply to thunk state
        return true;
    }
);

export const getHighCostEventsAction = createAsyncThunk(
    `${sliceName}/getHighCostEvents${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/highcost', payload);
        const { code, status } = response;

        thunkAPI.dispatch(fetchDataRequest());
        thunkAPI.dispatch(setDataForDebugAction(response));
        if (status === 200) {
            if(response.data){
                thunkAPI.dispatch(getHighCostEventsSuccess(response.data));
            }else{
                thunkAPI.dispatch(getHighCostEventsFailure());
            }
        } else {
            thunkAPI.dispatch(getHighCostEventsFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const storeHighCostEventsAction = createAsyncThunk(
    `${sliceName}/storeHighCostEvents${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/highcost/save', payload);
        const { code, status } = response;

        thunkAPI.dispatch(storeHighCostEventsRequest());
        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(storeHighCostEventsSuccess());
        } else {
            thunkAPI.dispatch(resetStoreAction());
        }
        // reply to thunk state
        return true;
    }
);

export const addNewHighCostEventsAction = createAsyncThunk(
    `${sliceName}/addNewHighCostEvents${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(addNewHighCostEventsSuccess(payload));
        // reply to thunk state
        return true;
    }
);

export const addNewClaimCategoriesAction = createAsyncThunk(
    `${sliceName}/addNewClaimCategories${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(addNewClaimCategoriesSuccess(payload));
        // reply to thunk state
        return true;
    }
);

export const deleteClaimCategoryAction = createAsyncThunk(
    `${sliceName}/deleteClaimCategory${actionLabel}`,
    async (payload, thunkAPI) => {
        try {
            const response = await apiHandler.post(baseURL + '/claims-category/delete', payload);
            if(response.status === 204){
                thunkAPI.dispatch(deleteClaimCategorySuccess(payload.serviceCategoryId));
                toast.success('Deleted successfully.')
            }else{
                toast.error('Failed to delete.')
            }
            // reply to thunk state
        } catch (error) {
            toast.error('Failed to delete.')
        }
        return true;
    }
);

export const deleteHighCostEventsAction = createAsyncThunk(
    `${sliceName}/deleteHighCostEvents${actionLabel}`,
    async (payload, thunkAPI) => {
        try {
            const response = await apiHandler.post(baseURL + '/highcost/delete', payload);
            if(response.status === 204){
                thunkAPI.dispatch(deleteHighCostEventsSuccess(payload.episodesId));
                toast.success('Deleted successfully.')
            }else{
                toast.error('Failed to delete.')

            }
            // reply to thunk state
        } catch (error) {
            toast.error('Failed to delete.')

        }
        return true;
    }
);

export const findHighCostEventsByNameAction = createAsyncThunk(
    `${sliceName}/findHighCostEventsByName${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/highcost/search', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            if(response.data){
                thunkAPI.dispatch(findHighCostEventsByNameSuccess(response.data));
            }else{
                thunkAPI.dispatch(findHighCostEventsByNameFailure());
            }
        } else {
            thunkAPI.dispatch(findHighCostEventsByNameFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const storeDiagnosisAction = createAsyncThunk(
    `${sliceName}/storeDiagnosis${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/diagnosis-prevalence/save', payload);
        const { code, status } = response;

        thunkAPI.dispatch(storeDiagnosisRequest());
        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(storeDiagnosisSuccess());
        } else {
            thunkAPI.dispatch(resetStoreAction());
        }
        // reply to thunk state
        return true;
    }
);

const getClaimCategoryFailure = createAction(`${sliceName}/getClaimCategoryFailure`);

export const getClaimCategoryAction = createAsyncThunk(
    `${sliceName}/getClaimCategory${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/claims-category', payload);
        const { code, status } = response;

        thunkAPI.dispatch(fetchDataRequest());
        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            if(response.data){
                thunkAPI.dispatch(getClaimCategorySuccess(response.data));
            }else{
                thunkAPI.dispatch(getClaimCategoryFailure());
            }
        } else {
            thunkAPI.dispatch(getClaimCategoryFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const findClaimCategoryByNameAction = createAsyncThunk(
    `${sliceName}/findClaimCategoryByName${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/claims-category/search', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));
        if (status === 200) {
            if(response.data){
                thunkAPI.dispatch(findClaimCategoryByNameSuccess(response.data));
            }else{
                thunkAPI.dispatch(getClaimCategoryFailure());
            }
        } else {
            thunkAPI.dispatch(getClaimCategoryFailure());
        }
        // reply to thunk state
        return true;
    }
);

const getDiagnosisPrevalenceFailure = createAction(`${sliceName}/getDiagnosisPrevalenceFailure`);

export const getDiagnosisPrevalenceAction = createAsyncThunk(
    `${sliceName}/getDiagnosisPrevalence${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/diagnosis-prevalence', payload);
        const { code, status } = response;

        thunkAPI.dispatch(fetchDataRequest());
        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            if(response.data){
                thunkAPI.dispatch(getDiagnosisPrevalenceSuccess(response.data));
            }else{
                thunkAPI.dispatch(getDiagnosisPrevalenceFailure());
            }
        } else {
            thunkAPI.dispatch(getDiagnosisPrevalenceFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const findDiagnosisByNameAction = createAsyncThunk(
    `${sliceName}/findClaimCategoryByName${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/diagnosis-prevalence/search', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));
        if (status === 200) {
            if(response.data){
                thunkAPI.dispatch(findDiagnosisByNameSuccess(response.data));
            }else{
                thunkAPI.dispatch(getDiagnosisPrevalenceFailure());
            }
        } else {
            thunkAPI.dispatch(getDiagnosisPrevalenceFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const resetStoreAction = createAsyncThunk(
    `${sliceName}/resetStore${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(resetStoreSuccess());
        // reply to thunk state
        return true;
    }
);

export const addNewDiagnosisAction = createAsyncThunk(
    `${sliceName}/addNewDiagnosis${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(addNewDiagnosisSuccess(payload));
        // reply to thunk state
        return true;
    }
);

export const deleteDiagnosisAction = createAsyncThunk(
    `${sliceName}/deleteDiagnosis${actionLabel}`,
    async (payload, thunkAPI) => {
        try {
            const response = await apiHandler.post(baseURL + '/diagnosis-prevalence/delete', payload);
            if(response.status === 204){
                thunkAPI.dispatch(deleteDiagnosisSuccess(payload.diagId));
                toast.success('Deleted successfully.')

            }else {
                toast.error('Failed to delete.')
            }
        } catch (error) {
            toast.error('Failed to delete.')
        }
        // reply to thunk state
        return true;
    }
);

const mainSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        fetchDataRequest: (state, action) => {
            state.resStatus = REQUEST;
        },
        getHighCostEventsSuccess: (state, action) => {
            state.highCostEvents = null;
            state.highCostEvents = action.payload;
            state.resStatus = SUCCESS;
            state.highCostEventsFetch = true;
        },
        getHighCostEventsFailure: (state, action) => {
            state.resStatus = PENDING;
        },
        storeHighCostEventsRequest: (state, action) => {
            state.storeHighCostEventsResStatus = REQUEST;
        },
        storeHighCostEventsSuccess: (state, action) => {
            state.storeHighCostEventsResStatus = SUCCESS;
        },
        resetStoreSuccess: (state, action) => {
            state.storeHighCostEventsResStatus = PENDING;
        },
        findHighCostEventsByNameSuccess: (state, action) => {
            state.highCostEventsSearchData = action.payload;
            state.resStatus = SUCCESS;
        },
        findHighCostEventsByNameFailure: (state, action) => {
            state.resStatus = PENDING;
        },
        addNewHighCostEventsSuccess: (state, action) => {
            state.highCostEvents = [...state.highCostEvents, ...action.payload];
        },
        getClaimCategorySuccess: (state, action) => {
            state.claimsCategory = null;
            state.claimsCategory = action.payload;
            state.resStatus = SUCCESS;
            state.claimsCategoryFetch = true;
        },
        findClaimCategoryByNameSuccess: (state, action) => {
            state.claimsCategorySearchData = action.payload;
            state.resStatus = SUCCESS;
        },
        getClaimCategoryFailure: (state, action) => {
            state.resStatus = PENDING;
        },
        addNewClaimCategoriesSuccess: (state, action) => {
            const newClaimsCategory= [...state.claimsCategory, ...action.payload];
            state.claimsCategory = newClaimsCategory;
        },
        deleteClaimCategorySuccess: (state, action) => {
            const serviceCategory2Id = action.payload;
            state.claimsCategory = state.claimsCategory.filter((claims, index)=>{
                return claims.serviceCategory2Id !==serviceCategory2Id
            })
        },
        deleteHighCostEventsSuccess: (state, action) => {
            const episodeId = action.payload;
            state.highCostEvents = state.highCostEvents.filter((highCost, index)=>{
                return highCost.episodeId !==episodeId
            })
        },
        getDiagnosisPrevalenceSuccess: (state, action) => {
            state.diagnosisPrevalenceList = action.payload;
            state.resStatus = SUCCESS;
            state.diagnosisPrevalenceFetch = true;
        },
        getDiagnosisPrevalenceFailure: (state, action) => {
            state.resStatus = PENDING;
        },
        findDiagnosisByNameSuccess: (state, action) => {
            state.diagnosisPrevalenceSearchData = action.payload;
            state.resStatus = SUCCESS;
        },
        addNewDiagnosisSuccess: (state, action) => {
            const newDiagnosisArray= [...state.diagnosisPrevalenceList, ...action.payload];
            state.diagnosisPrevalenceList = newDiagnosisArray;
        },
        deleteDiagnosisSuccess: (state, action) => {
            const diagId = action.payload;
            state.diagnosisPrevalenceList = state.diagnosisPrevalenceList.filter((prev, index)=>{
                return prev.diagId != diagId
            })
        },
        storeDiagnosisRequest: (state, action) => {
            state.storeDiagnosisResStatus = REQUEST;
        },
        storeDiagnosisSuccess: (state, action) => {
            state.storeDiagnosisResStatus = SUCCESS;
        },
        resetWhatIfFetchSuccess: (state, action) => {
            state.highCostEventsFetch = false;
            state.claimsCategoryFetch = false;
            state.diagnosisPrevalenceFetch = false;
        },
        listFailure: () => initialState,
    },
    extraReducers: (builder) => {
        // hydrate 
        builder.addCase(HYDRATE, (state, action) => {
            return { ...action.payload[sliceName] }
        });
        // getHighCostEventsAction
        builder.addCase(getHighCostEventsAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(getHighCostEventsAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });
        // findHighCostEventsByNameAction
        builder.addCase(findHighCostEventsByNameAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(findHighCostEventsByNameAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });
        // getClaimCategoryAction
        builder.addCase(getClaimCategoryAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(getClaimCategoryAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });
        // findClaimCategoryByNameAction
        builder.addCase(findClaimCategoryByNameAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(findClaimCategoryByNameAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });
        // getDiagnosisPrevalenceAction
        builder.addCase(getDiagnosisPrevalenceAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(getDiagnosisPrevalenceAction.rejected, (state) => {
            state.resStatus = FAILURE;
        });
    },
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const whatIfModelState = (state) => state[sliceName];
