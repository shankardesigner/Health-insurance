import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useTheme, makeStyles, withStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';


import BoxWithToggle from '@components/BoxWithToggle';
import NumberInputField from '@components/NemoInputField';
import styles from './editnemofactor.module.css';
import NemoSkeleton from '@components/NemoSkeleton';
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

/* redux part */
import {
    nemoFactorModelState,
    getServiceCategoryAction,
    storeNemoFactorAction,
    resetStoreNemoFactorStatusAction,
    saveUsedNemoFactorAction
} from "@slices/nemoFactorSlice";
import {
    riskModelerState,
    recalculateSavingsAction,
} from "@slices/riskModelerSlice";
import { useSelector, useDispatch } from "react-redux";



const useStyles = makeStyles({
    modal: {
        backgroundColor: 'lightgreen'
    },
    dialogActions: {
        justifyContent: "space-between !important"
    },
    topBorderRadius: {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px'
    },
    bottomBorderRadius: {
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px'
    },
    lightGreenBackground: {
        background: 'rgba(236, 252, 247, 0.5)'
    },
    inputStyle: {
        background: '#EFEFF0',
        borderRadius: '7px',
        paddingLeft: '10px',
        width: '100%'
    },
    icon: {
        color: '#fff'
    },
    inputWrapper: {
        paddingTop: '5px'
    },
    inputTableCell: {
        width: '230px',
        // [theme.breakpoints.down('md')]: {
        //     width: '500px'
        // },
    },
});

const TableCell = withStyles({
    root: {
        fontWeight: "bold",
        fontSize: '14px',
        lineHeight: '17px',
        color: "#3D3E64"
    }
})(MuiTableCell);

const TableCellWithoutBorder = withStyles({
    root: {
        border: "none", 
        fontWeight: "bold",
        fontSize: '14px',
        lineHeight: '17px',
        color: "#3D3E64",
        paddingBottom: '0px'
    }
})(MuiTableCell);

const TableCellInput = withStyles({
    root: {
        fontWeight: "bold",
        fontSize: '14px',
        lineHeight: '17px',
        color: "#3D3E64",
        width: '200px',
    }
})(MuiTableCell);


export default function EditNemoFactor(props) {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { openModal, setModalOpen, data, setSelectedRowData, nemoFactorPreset } = props;
    const { nemoFactorName = "", id: nemoFactorId } = data;

    const { serviceCategories, serviceCategoriesResStatus, usedNemoFactor, storeNemoFactorResStatus } = useSelector(nemoFactorModelState);
    const { savedModel} = useSelector(riskModelerState);

    const defaultSelectedIntensity = nemoFactorPreset.charAt(0).toUpperCase() + nemoFactorPreset.slice(1);
    const [nemoFactorIntensity, setNemoFactorIntensity] = useState(defaultSelectedIntensity);
    const [serviceCategoryData, setServiceCategoryData] = useState([]);
    const [saveServiceCategoryData, setSaveServiceCategoryData] = useState([]);

    const handleModalClose = () => {
        dispatch(recalculateSavingsAction());
        dispatch(resetStoreNemoFactorStatusAction());
        setModalOpen(false);
    }

    const handleModalApply = () => {
        if(saveServiceCategoryData.length > 0){
            dispatch(storeNemoFactorAction(saveServiceCategoryData));
            /* check checkbox state */
            if(usedNemoFactor.indexOf(nemoFactorId) === -1){
                const newUsedNemoFactorState = [...usedNemoFactor, nemoFactorId];
                dispatch(saveUsedNemoFactorAction(newUsedNemoFactorState));
            }
        }
    }

    const handleNemoFactorIntensityChange = (event) => {
        setNemoFactorIntensity(event.target.value);
    }

    useEffect(() => {
        const payload = {
            nemoFactorId: nemoFactorId,
            serviceCategoryType: nemoFactorIntensity
        }
        setServiceCategoryData([]); // reset data;
        dispatch(getServiceCategoryAction(payload));
    }, [nemoFactorIntensity]);

    useEffect(() => {
        if (serviceCategories.hasOwnProperty(nemoFactorId)) {
            if (serviceCategories[nemoFactorId].hasOwnProperty(nemoFactorIntensity)) {
                const rawServiceCategoryData = serviceCategories[nemoFactorId][nemoFactorIntensity];
                const initialServiceCategoryData = []; // using array to preserve order
                /* prepare initial data for table */
                rawServiceCategoryData.map((rawServiceCategory, index) => {
                    const { serviceCategory2Name, serviceCategory2Id, factor } = rawServiceCategory;
                    const data = {
                        serviceCategory2Id,
                        serviceCategory2Name,
                        nemoFactor: factor
                    }
                    initialServiceCategoryData.push(data);
                });
                setServiceCategoryData(initialServiceCategoryData);
            }
        }
    }, [serviceCategories]);

    /* initialize updatedServiceCategoryData */
    useEffect(()=>{
        if(serviceCategoryData.length > 0){
            let allData = [];
            serviceCategoryData.map((category, index)=>{
                const usedData = {
                    modelId: savedModel.modelId,
                    nemoFactor: category.serviceCategory2Id,
                    value: parseFloat(Number(category.nemoFactor).toFixed(2))
                }
                allData.push(usedData);
            });
            setSaveServiceCategoryData(allData);
        }
    }, [serviceCategoryData])

    const handleNemoFactorChange = (inputValue, id) => {
        // 
        // /* search for existing data */
        const indexToUpdate = saveServiceCategoryData.findIndex((serviceCategory, index)=>{
            return serviceCategory.nemoFactor === id;
        });

        let temporaryData = JSON.parse(JSON.stringify(saveServiceCategoryData));
        if(indexToUpdate !== -1){
            const oldData = temporaryData[indexToUpdate];
            temporaryData[indexToUpdate] = {...oldData, value: inputValue}
        }

        setSaveServiceCategoryData(temporaryData);
    }

    useEffect(()=>{
        if(storeNemoFactorResStatus === SUCCESS){
           handleModalClose();
        }
    }, [storeNemoFactorResStatus])

    return (
        <Dialog
            fullScreen={fullScreen}
            maxWidth={"md"}
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="responsive-dialog-title"
            BackdropProps={{ style: { backgroundColor: 'rgba(62, 63, 100, 0.9)' } }}
            PaperProps={{ style: { paddingLeft: '20px', paddingRight: '20px' } }}
            classes={{ paper: styles.dialogPaper }}
        >
            <DialogTitle className={styles.modalHeader} component="div" disableTypography={true}>{nemoFactorName}</DialogTitle>
            <DialogContent>
                <BoxWithToggle title="NEMO Factor Intensity" hideToggle={true}>
                    <RadioGroup aria-label="quiz" name="quiz" value={nemoFactorIntensity} onChange={handleNemoFactorIntensityChange} className={styles.directionRow}>
                        <FormControlLabel value="Aggressive" control={<Radio />} label="Aggressive" />
                        <FormControlLabel value="Moderate" control={<Radio />} label="Moderate" />
                        <FormControlLabel value="Conservative" control={<Radio />} label="Conservative" />
                    </RadioGroup>
                </BoxWithToggle>
                <TableContainer className={styles.tableContainer}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCellWithoutBorder align="left"></TableCellWithoutBorder>
                                <TableCellWithoutBorder align="center" classes={{ root: clsx(classes.lightGreenBackground, classes.topBorderRadius) }} className={styles.tableHeaderTitle}>
                                    <img
                                        src="/nemo-factor.svg"
                                        alt="nemo logo"
                                        height="15px"
                                    />
                                </TableCellWithoutBorder>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Service Categories</TableCell>
                                <TableCell align="center" classes={{ root: clsx(classes.lightGreenBackground) }}>
                                    Utilization
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {serviceCategoriesResStatus === REQUEST &&
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <NemoSkeleton count={8} height={50} />
                                    </TableCell>
                                </TableRow>
                            }
                            {serviceCategoriesResStatus === SUCCESS && serviceCategoryData && serviceCategoryData.map((serviceCategory, index) => {
                                const { serviceCategory2Id, serviceCategory2Name, nemoFactor } = serviceCategory;
                                return (
                                    <TableRow key={index}>
                                        <TableCell align="left" className={styles.tableHeaderSubTitle}>{serviceCategory2Name}</TableCell>
                                        <TableCellInput align="left" classes={{ root: classes.lightGreenBackground }} className={clsx(styles.tableHeaderSubTitle, classes.inputTableCell)}>
                                            <NumberInputField start={nemoFactor} value={nemoFactor} id={serviceCategory2Id} callback={handleNemoFactorChange} type="decimal" factor={0.1}/>
                                        </TableCellInput>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions classes={{ root: classes.dialogActions }}>
                <Button onClick={handleModalClose}
                    className={styles.greyButton}
                    fullWidth={true}
                >
                    Back
                </Button>
                <Button
                    className={styles.greenButton}
                    fullWidth={true}
                    onClick={handleModalApply}
                >
                    {storeNemoFactorResStatus === REQUEST && "Applying..."}
                    {storeNemoFactorResStatus !== REQUEST && "Apply"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}