import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from "@material-ui/core/Icon";
import Box from '@material-ui/core/Box';
import { useRouter } from 'next/router'
import { TextField } from '@material-ui/core';
import TableComponent from '@components/TableComponent';
import ConfirmDialog from '@components/ConfirmDialog';
import commons from "@constants/common";
import InputAdornment from '@material-ui/core/InputAdornment';

const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

/* redux part */

import {
    
    deleteClientAction,
    getPracticeAction,
    listAction,
    nemoClientModelState
} from "@slices/nemoClientSlice";

import { setTabStateAction } from '@slices/tabModelSlice';
import {
    saveUsedNemoFactorAction
} from "@slices/nemoFactorSlice";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
        marginRight: '20px',
        [theme.breakpoints.down('sm')]: {
            paddingBottom: '10px'
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        border: '1px solid #CED5EB',
        boxSizing: 'border-box',
        borderRadius: '6px'
    },
    inputInput: {
        height: '34px',
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '25ch',
            '&:focus': {
                width: '25ch',
            },
        },
        [theme.breakpoints.down('sm')]: {
            width: '16ch',
            '&:focus': {
                width: '16ch',
            },
        },
    },
   
    searchRow: {
        marginBottom: '15px'
    },
    newModelButton: {
        background: '#42DEB4',
        borderRadius: '100px',
        height: '47px',
        lineHeight: '1',
        color: '#ffffff',
        border: 'unset',
        '&:hover': {
            background: '#42DEB4',
            border: '1px solid ' + theme.palette.secondary.color
        },
        width: '80%',
        fontSize: '18px',

        "& .MuiButton-startIcon": {
            position: "absolute",
            left: 24
        },
        "& .MuiButton-startIcon span": {
            fontSize: '36px'
        },
        marginTop: '20px',
        position: 'fixed',
        bottom: '80px',
    },
   
}));

const addIcon = (
    <Icon>
        +
    </Icon>
  );
  

const columns = [
    { name: 'Practice', component: 'TextComponent', sourceKey: 'Practice', align: 'left' },
    { name: 'Location', component: 'TextComponent', sourceKey: 'location', align: 'left' },
    { name: 'EMR', component: 'TextComponent', sourceKey: 'emr', align: 'left' },
    { name: 'TIN', component: 'TextComponent', sourceKey: 'tin', align: 'left' },
    { name: 'Size', component: 'TextComponent', sourceKey: 'size', align: 'left' },

   { name: '', component: 'TextComponent', sourceKey: 'ACTION' } // for edit and results action
]

export default function ConfigureModel() {
    const classes = useStyles();
    const router = useRouter()
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    const [clientSelected, setClientSelected] = useState(null);

    // useEffect(() => {
        
    //     dispatch(getPracticeAction());
    // }, []);

    // const {practiceList, resStatus}=useSelector(nemoClientModelState);

    // 

    const practiceList =[
        {
            "id": "BETA_IPA",
            "location": "Waltham-Main St Clinic",
            "Practice": "Alpha Doctors Group",
            "emr": 'Elation',
            "tin": "111-222-333",
            "size": "3000",
        
          },
          {
            "id": "BETA_IPA",
            "location": "Waltham-Main St Clinic",
            "Practice": "Beta Doctors Group",
            "emr": 'Epic Cloud',
            "tin": "111-222-232",
            "size": "2000",
        
          },
          
          {
            "id": "BETA_IPA",
            "location": "Main Clinic",
            "Practice": "Alpha Doctors Group",
            "emr": 'Athena',
            "tin": "111-222-335",
            "size": "3429",
        
          },
    ]


    const handleDelete = (selectedClient) => {
        setOpenDialog(true);
        setClientSelected(selectedClient);
    }
    
    


    const handleDeleteAction = () => {
        
        dispatch(deleteClientAction(clientSelected.nemoClientId))
        setOpenDialog(false);
    }

    


    
    const actions = [
        { name: 'Configure', component: 'CallbackComponent' },
        { name: 'EMR', component:'CallbackComponent'},
        { name: 'Delete', icon: '/delete-icon.svg', component: 'CallbackComponent', attributes: { "callback": handleDelete } },
       ];
    
    const modelList = practiceList.map(model=>({...model}));

   
    return (
        <Box p={3}>
            {/* search header */}
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                className={classes.searchRow}
            >
                 <Grid container item xs={12} lg={12} direction="row">
                <TextField fullWidth variant="outlined" label="Search…" 
                InputProps={{
                  
                  startAdornment: (
                    <InputAdornment position="start">
                     <SearchIcon />
                    </InputAdornment>
                  ),
                }} margin="dense" style={{ height: 50 }}>
                </TextField>
              
              </Grid>
              

            </Grid>


            {/* table component */}
            {<TableComponent headers={columns} data={modelList} actions={actions} key={1} />}
            <Button
                variant="outlined"
                color="primary"
                className={classes.newModelButton}
                startIcon={addIcon}
                // onClick={(e) => handleNewClientModelClick(e)}
            >
                New Practice
            </Button>
            <ConfirmDialog  handleConfirm={handleDeleteAction} close={()=>setOpenDialog(false)} title='Delete Confirmation' subtitle='Do you want to delete this model?' open={openDialog} />
   
        </Box>
    )
}