import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Icon from "@material-ui/core/Icon";
import Box from '@material-ui/core/Box';
import { useRouter } from 'next/router'
import { TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import TableComponent from '@components/TableComponent';
import ConfirmDialog from '@components/ConfirmDialog';
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

/* redux part */

import {
    
    deleteClientAction,
    listAction,
    nemoClientModelState,
    searchAction
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
        marginBottom: '22px'
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
    { name: 'Client', component: 'TextComponent', sourceKey: 'name', align: 'left' },
    { name: 'LOB', component: 'TextComponent', sourceKey: 'type', align: 'left' },
    { name: 'Members', component: 'TextComponent', sourceKey: 'members', align: 'left' },
    { name: 'Payer', component: 'TextComponent', sourceKey: 'payer' , align: 'left'},
   { name: '', component: 'TextComponent', sourceKey: 'ACTION' } // for edit and results action
]

export default function NemoClientModel() {
    const classes = useStyles();
    const router = useRouter()
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    const [clientSelected, setClientSelected] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        
        dispatch(listAction());
    }, []);

    const {nemoClientModelList, resStatus}=useSelector(nemoClientModelState);

    

    const handleNewClientModelClick = (e) => {
       
        router.push('/clientManagement/newClient');
    }

    const handleDelete = (selectedClient) => {
        setOpenDialog(true);
        setClientSelected(selectedClient);
    }
     
    const handleEditAction =()=>{
        // if(configure){
        //     const payload = {
        //         key: 'newModelTabs',
        //         data: {
        //             lastactive: 6
        //         }
        //     }
        //     dispatch(setTabStateAction(payload));
        // }
        router.push('/clientManagement/configure');
    }


    const handleDeleteAction = () => {
        
        dispatch(deleteClientAction(clientSelected.id))
        setOpenDialog(false);
    }

    const handleKeyPress = (event) => {
        if (event.keyCode == 13) {
            const payload={
                searchParam :searchTerm
            }
            dispatch(searchAction(payload))
        }
      };

    // useEffect(() => {
    //     const payload={
    //         searchParam :searchTerm
    //     }
    //     dispatch(SearchAction(payload));
    // }, [searchTerm]);

    


    
    const actions = [
        { name: 'Configure', component: 'CallbackComponent', attributes: { "callback": handleEditAction}   },
        { name: 'Export', icon: '/export-icon.svg', component:'CallbackComponent'},
        { name: 'Edit', icon: '/edit-icon.svg', component: 'CallbackComponent' },
        { name: 'Delete', icon: '/delete-icon.svg', component: 'CallbackComponent', attributes: { "callback": handleDelete } },
       ];
    
    const modelList = nemoClientModelList.map(model=>({...model}));

   
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
                }} margin="dense" style={{ height: 50 }} onKeyDown={(event) => handleKeyPress(event)}  
                onChange={(event)=>setSearchTerm(event.target.value)}>
                </TextField>
              
              </Grid>
                {/* search bar */}
                {/* <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                       
                    </div>
                    <InputBase
                        placeholder="Search…"
                      
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={(event)=>setSearchTerm(event.target.value)}
                    />
                    <Button onClick={()=> handleSearch()}></Button>
                </div> */}

            </Grid>


            {/* table component */}
            {<TableComponent headers={columns} data={modelList} actions={actions} key={1} />}
              {/* new model button */}
              {resStatus !== 'PENDING' && <Button
                variant="outlined"
                color="primary"
                className={classes.newModelButton}
                startIcon={addIcon}    
                onClick={(e) => handleNewClientModelClick(e)}
                style={{
                    bottom: '80px',
                    width: '82%',
                }}
            >
                New Client
            </Button>}
            <ConfirmDialog  handleConfirm={handleDeleteAction} close={()=>setOpenDialog(false)} title='Delete Confirmation' subtitle='Do you want to delete this model?' open={openDialog} />
   
        </Box>
    )
}