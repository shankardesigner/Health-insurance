/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    // Action,
    createSlice,
    createAction,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import apiHandler from "@utils/apiHandler";

import rootConstants from "@constants/index";
const clientBaseUrl = rootConstants.CLIENT_API;

import commons from "@constants/common";
const {
	REQUEST,
	SUCCESS,
	PENDING,
	FAILURE
} = commons;

const initialData = [[
    {
        key: 'Impatient Facility',
        actual_1: 0,
        proj_1: 0,
        savings_1: 0,
    },
    {
        key: 'Outpatient Facility',
        actual_1: 0,
        proj_1: 0,
        savings_1: 0,
    },
    {
        key: 'Professional',
        actual_1: 0,
        proj_1: 0,
        savings_1: 0,
    },
    {
        key: 'Professional',
        actual_1: 0,
        proj_1: 0,
        savings_1: 0,
    },
    {
        key: 'Professional',
        actual_1: 0,
        proj_1: 0,
        savings_1: 0,
    },
]];

const generateMockResponse = () => {

    return [
       {
           key: 'Impatient Facility',
           actual_1: Math.floor(Math.random() * 1000),
           proj_1: Math.floor(Math.random() * 1000),
           savings_1: Math.floor(Math.random() * 1000),
       },
       {
           key: 'Outpatient Facility',
           actual_1: Math.floor(Math.random() * 1000),
           proj_1: Math.floor(Math.random() * 1000),
           savings_1: Math.floor(Math.random() * 1000),
       },
       {
           key: 'Professional',
           actual_1: Math.floor(Math.random() * 1000),
           proj_1: Math.floor(Math.random() * 1000),
           savings_1: Math.floor(Math.random() * 1000),
       },
       {
           key: 'Professional',
           actual_1: Math.floor(Math.random() * 1000),
           proj_1: Math.floor(Math.random() * 1000),
           savings_1: Math.floor(Math.random() * 1000),
       },
       {
           key: 'Professional',
           actual_1: Math.floor(Math.random() * 1000),
           proj_1: Math.floor(Math.random() * 1000),
           savings_1: Math.floor(Math.random() * 1000),
       },
   ];
}

const sliceName = "compareImpactModel";
const actionLabel = "compareImpactModel";

const mockSubCategories = {
    'Payer': ['Payer1', 'Payer2', 'Payer3'],
    'Practice': ['Practice 1', 'Practice 2', 'Practice 3'],
    'PCP': ['PCP 1', 'PCP 2', 'PCP 3'],
    'Speciality': ['Speciality1', 'Speciality2', 'Speciality3'],
};
const mockCategories = [
    {
        name: 'Payer',
        id: 'Payer'
    },
    {
        name: 'Practice',
        id: 'Practice'
    },
    {
        name: 'PCP',
        id: 'PCP'
    },
    {
        name: 'Speciality',
        id: 'Speciality'
    },
];

const initialState = {
    compareImpactList: initialData,
    resStatus: PENDING,
    selectCategories: [],
    selectSubCategories: {'Payer': [], 'Practice': [], 'PCP': [], 'Speciality': []},
};

const setCompareImpactListSuccess = createAction(`${sliceName}/setCompareImpactListSuccess`, 
    function prepare(payload){
        return {
            payload
        }
    }
);

const setSelectListSuccess = createAction(`${sliceName}/setSelectListSuccess`, 
    function prepare(payload){
        return {
            payload
        }
    }
);

const setPayerListSuccess = createAction(`${sliceName}/setPayerListSuccess`, 
    function prepare(payload){
        return {
            payload
        }
    }
);

// clientId: "ALPHA_IPA"
// loa1Id: "CIGNA"
// planTypeId: "COMM"

export const setCompareImpactListAction = createAsyncThunk(
    `${sliceName}/setCompareImpactList${actionLabel}`,
    async (payload, thunkAPI) => {
        
        thunkAPI.dispatch(setCompareImpactListSuccess({data: generateMockResponse(), index: payload.index}));
        return true;
    }
);

export const setSelectListAction = createAsyncThunk(
    `${sliceName}/setSelectList${actionLabel}`,
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(setSelectListSuccess(mockCategories));
        return true;
    }
);

export const setPayerListAction = createAsyncThunk(
    `${sliceName}/getPayerList${actionLabel}`,
    async (payload, thunkAPI) => {
        try {
            const apiUrl = clientBaseUrl + "/loa1";
            const response = await apiHandler.post(apiUrl, {clientId: "ALPHA_IPA"});
            thunkAPI.dispatch(setPayerListSuccess({data: response.data, listName: 'Payer'}));
            // reply to thunk state
            return true;
        } catch (error) {
            
        }
    }
);

export const setPracticeListAction = createAsyncThunk(
    `${sliceName}/setPracticeListAction${actionLabel}`,
    async (payload, thunkAPI) => {
        try {
            const apiUrl = clientBaseUrl + "/loa2";
            const response = await apiHandler.post(apiUrl, {clientId: "ALPHA_IPA", loa1Id: 'CIGNA', planTypeId: 'COMM'});
            thunkAPI.dispatch(setPayerListSuccess({data: response.data, listName: 'Practice'}));
            // reply to thunk state
            return true;
        } catch (error) {
            
        }
    }
);

export const setPCPListAction = createAsyncThunk(
    `${sliceName}/setPCPListAction${actionLabel}`,
    async (payload, thunkAPI) => {
        try {
            const apiUrl = clientBaseUrl + "/loa4";
            const response = await apiHandler.post(apiUrl, {clientId: "ALPHA_IPA", loa1Id: 'CIGNA', loa2Id: 'PRC1', loa3Id: 'LOC1', planTypeId: 'COMM'});
            thunkAPI.dispatch(setPayerListSuccess({data: response.data, listName: 'PCP'}));
            // reply to thunk state
            return true;
        } catch (error) {
            
        }
    }
);

const mainSlice = createSlice({
    name: sliceName,
    initialState: initialState,
    reducers: {
        setCompareImpactListSuccess: (state, action) => {
            state.compareImpactList[action.payload.index] = action.payload.data
            state.resStatus = SUCCESS
        },
        setSelectListSuccess: (state, action) => {
            state.selectCategories = action.payload
        },
        addNewList: (state, action) => {
            state.compareImpactList = [...state.compareImpactList, ...initialData]
        },
        resetToInitial: (state, action) => {
            state.compareImpactList = initialData;
            state.selectCategories = []
        },
        setPayerListSuccess: (state, { payload }) => {
            const keys = Object.keys(payload.data);
            const data = keys.map(key=>({id: key, name: payload.data[key].name}));
            state.selectCategories = mockCategories
            state.selectSubCategories = {
                ...state.selectSubCategories,
                [payload.listName]: data
            }   
        }
    },
})

const mainReducer = mainSlice.reducer;
export const { addNewList, resetToInitial } = mainSlice.actions;
export default mainReducer;

export const compareImpactModelState = (state) => state[sliceName];