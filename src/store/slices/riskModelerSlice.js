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
import { displayError, displaySuccess } from "./alertSlice";
import apiHandler from "@utils/apiHandler";
import { HYDRATE } from 'next-redux-wrapper';

import { setDataForDebugAction } from './sqlDebuggerSlice';
import generatePDF from "@utils/generatePdf";
import { toast } from "react-toastify";


const baseURL = rootConstants.RISKMODELER_API;
const sliceName = "riskModeler";
const actionLabel = "riskModeler";
const initialState = {
    resStatus: PENDING,
    newModelActivationStatus: PENDING,
    savings: [],
    calculateSavingResStatus: PENDING,
    recalculateSavings: false, 
    results: [],
    resultsResStatus: PENDING,
    savedModel: {},
    generatePdfStatus: PENDING,
    isNext: false,
};

const saveNewModelSuccess = createAction(
    `${sliceName}/saveNewModelSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const resetResStatusSuccess = createAction(
    `${sliceName}/resetResStatusSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const restRiskModelerSuccess = createAction(
    `${sliceName}/restRiskModelerSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const activateNewModelSuccess = createAction(
    `${sliceName}/activateNewModelSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const calculateSavingsSuccess = createAction(
    `${sliceName}/calculateSavingsSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const loadIntialModelDataSuccess = createAction(
    `${sliceName}/loadIntialModelDataSuccess`,
    function prepare(payload) {
        return {
            payload,
        };
    }
);

const getResultsSuccess = createAction(
    `${sliceName}/getResultsSuccess`,
    function prepare(payload) {
        let newPayload = [];
        if (payload) {
            payload.forEach((data, index) => {
                const newData = { ...data, totalAmount: parseFloat(Number(data.totalAmount).toFixed(0)) }
                newPayload.push(newData);
            })
        }
        return {
            payload: newPayload,
        };
    }
);

const saveNewModelRequest = createAction(`${sliceName}/saveNewModelRequest`);
const activateNewModelRequest = createAction(`${sliceName}/activateNewModelRequest`);
const activateNewModelFailure = createAction(`${sliceName}/activateNewModelFailure`);
const calculateSavingsRequest = createAction(`${sliceName}/calculateSavingsRequest`);
const calculateSavingsFailure = createAction(`${sliceName}/calculateSavingsFailure`);
const getResultsRequest = createAction(`${sliceName}/getResultsRequest`);
const getCheckIfModelExist = createAction(`${sliceName}/getCheckIfModelExist`);
const getResultsFailure = createAction(`${sliceName}/getResultsFailure`);
const recalculateSavingsSuccess = createAction(`${sliceName}/recalculateSavingsSuccess`);
const handleOnNextSuccess = createAction(`${sliceName}/handleOnNextSuccess`);

const generatePdfRequest = createAction(`${sliceName}/generatePdfRequest`);
const generatePdfFailure = createAction(`${sliceName}/generatePdfFailure`);
const generatePdfSuccess = createAction(`${sliceName}/generatePdfSuccess`);

export const loadIntialModelDataAction = createAsyncThunk(
    `${sliceName}/loadIntialModelData${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(loadIntialModelDataSuccess(payload));
        // reply to thunk state
        return true;
    }
);

export const saveNewModelAction = createAsyncThunk(
    `${sliceName}/saveNewModel${actionLabel}`,
    async (payload, thunkAPI) => {
        
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/newmodel', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));
        thunkAPI.dispatch(saveNewModelRequest());

        if (status === 200) {
            thunkAPI.dispatch(saveNewModelSuccess(response.data));
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

export const activateNewModelAction = createAsyncThunk(
    `${sliceName}/activateNewModel${actionLabel}`,
    async (payload, thunkAPI) => {
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/newmodel/activate', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));
        thunkAPI.dispatch(activateNewModelRequest());

        if (status === 200) {
            if (response.data) {
                thunkAPI.dispatch(activateNewModelSuccess(response.data));
                toast.success('Model saved successfully.')
            } else {
                thunkAPI.dispatch(activateNewModelFailure());
                toast.error('Failed to save model.')
            }
        } else {
            thunkAPI.dispatch(activateNewModelFailure());
            toast.error('Failed to save model.')
        }
        // reply to thunk state
        return true;
    }
);

export const generatePdfAction = createAsyncThunk(
    `${sliceName}/generatePdfModel${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(generatePdfRequest());
        const toastId = toast.info("Generating PDF...", { autoClose: false });
        const resultResponse = await apiHandler.post(baseURL + '/results', payload);
        const claimsResponse = await apiHandler.post(rootConstants.RESULTS_CLAIMS_API, payload);
        const totalResponse = await apiHandler.post(`${rootConstants.RISKMODELER_API}/calculate-savings`, {modelId: payload.modelId});
        thunkAPI.dispatch(setDataForDebugAction(resultResponse));
        thunkAPI.dispatch(setDataForDebugAction(claimsResponse));
        thunkAPI.dispatch(setDataForDebugAction(totalResponse));

        if(resultResponse.status === 200 && claimsResponse.status === 200 && totalResponse.status ===200){
            generatePDF(claimsResponse.data, resultResponse.data, totalResponse.data);
            thunkAPI.dispatch(generatePdfSuccess());
            toast.update(toastId, {
                render: `Downloading PDF Complete.`,
                autoClose: 1000,
              },);
        }else{
            thunkAPI.dispatch(generatePdfFailure());
            toast.update(toastId, {
                render: `Downloading PDF Failed.`,
                autoClose: 2000,
                type: 'error'
            },);
        }
        return true;
    }
);

export const calculateSavingsAction = createAsyncThunk(
    `${sliceName}/calculateSavings${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(calculateSavingsRequest());
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/calculate-savings', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(calculateSavingsSuccess(response.data));
        } else {
            thunkAPI.dispatch(calculateSavingsFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const recalculateSavingsAction = createAsyncThunk(
    `${sliceName}/recalculateSavings${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(recalculateSavingsSuccess(payload));
        return true;
    }
);

export const changeStatusOnNextTab = createAsyncThunk(
    `${sliceName}/handleOnNext${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(handleOnNextSuccess(payload));
        return true;
    }
);
export const getResultsAction = createAsyncThunk(
    `${sliceName}/getResults${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(getResultsRequest());
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/results', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(getResultsSuccess(response.data));
        } else {
            thunkAPI.dispatch(getResultsFailure());
        }
        // reply to thunk state
        return true;
    }
);

export const checkIfModelExists = createAsyncThunk(
    `${sliceName}/checkIfModelExists${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(getCheckIfModelExist());
        /* cannot use utils apiHandler, authHeader creates dep cycle */
        const response = await apiHandler.post(baseURL + '/model/exist', payload);
        const { code, status } = response;

        thunkAPI.dispatch(setDataForDebugAction(response));

        if (status === 200) {
            thunkAPI.dispatch(getCheckIfModelExist(response.data));
            return true;
        }
        else {
            thunkAPI.dispatch(getResultsFailure());
        }
        // reply to thunk state
        return false;
    }
);

export const resetResStatusAction = createAsyncThunk(
    `${sliceName}/resetResStatus${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(resetResStatusSuccess(payload));
        return true;
    }
);

export const restRiskModeler = createAsyncThunk(
    `${sliceName}/restRiskModeler${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(restRiskModelerSuccess(payload));
        return true;
    }
);


const mainSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
        saveNewModelRequest: (state, action) => {
            state.resStatus = REQUEST;
        },
        saveNewModelSuccess: (state, action) => {
            state.resStatus = SUCCESS;
            state.savedModel = action.payload;
        },
        loadIntialModelDataSuccess: (state, action) => {
            state.resStatus = SUCCESS;
            state.savedModel = action.payload;
        },
        activateNewModelRequest: (state, action) => {
            state.newModelActivationStatus = REQUEST;
        },
        activateNewModelSuccess: (state, action) => {
            state.newModelActivationStatus = SUCCESS;
        },
        activateNewModelFailure: (state, action) => {
            state.newModelActivationStatus = ACTION_FAILURE;
        },
        resetResStatusSuccess: (state, action) => {
            state.resStatus = PENDING;
            state.recalculateSavings = false;
        },
        calculateSavingsRequest: (state, action) => {
            state.calculateSavingResStatus = REQUEST;
            state.recalculateSavings = false;
        },
        calculateSavingsFailure: (state, action) => {
            state.calculateSavingResStatus = PENDING;
            state.recalculateSavings = false;
            state.savings = initialState.savings;
        },
        calculateSavingsSuccess: (state, action) => {
            state.savings = action.payload;
            state.calculateSavingResStatus = SUCCESS;
            state.recalculateSavings = false;
        },
        recalculateSavingsSuccess: (state, action) => {
            state.recalculateSavings = true;
        },
        handleOnNextSuccess: (state, action) => {
            state.isNext = action.payload.isNext;
        },
        getResultsSuccess: (state, action) => {
            state.results = action.payload;
            state.resultsResStatus = SUCCESS;
        },
        getResultsRequest: (state, action) => {
            state.resultsResStatus = REQUEST;
        },
        getResultsFailure: (state, action) => {
            state.resultsResStatus = PENDING;
            state.results = initialState.results;
        },
        generatePdfRequest: (state, action) => {
            state.generatePdfStatus = REQUEST;
        },
        generatePdfSuccess: (state, action) => {
            state.generatePdfStatus = SUCCESS;
        },
        generatePdfFailure: (state, action) => {
            state.generatePdfStatus = FAILURE;
        },
        actionFailure: () => initialState,
        restRiskModelerSuccess: () => initialState,
        listFailure: () => initialState,
    },
    extraReducers: (builder) => {
        // hydrate 
        builder.addCase(HYDRATE, (state, action) => {
            return { ...action.payload[sliceName] }
        });
        // saveNewModelAction
        builder.addCase(saveNewModelAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(saveNewModelAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE };
        });

        //activateNewModelAction
        builder.addCase(activateNewModelAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(activateNewModelAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE };
        });

        //calculateSavingsAction
        builder.addCase(calculateSavingsAction.pending, (state /* , action */) => {
            return { ...initialState, ...state, resStatus: PENDING };
        });
        builder.addCase(calculateSavingsAction.rejected, (state) => {
            return { ...initialState, ...state, resStatus: FAILURE };
        });
    },
});

const mainReducer = mainSlice.reducer;
export default mainReducer;

export const riskModelerState = (state) => state[sliceName];
export const selectCurrentModalId = createSelector(riskModelerState, (state) => state.savedModel.modelId);