import { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MuiIcon from "@material-ui/core/Icon";
import Button from '@material-ui/core/Button';
import { CurrencyComponent } from '@components/FormatNumber';
import NemoSkeleton from '@components/NemoSkeleton';
import EditNemoFactor from '../EditNemoFactor';
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import styles from './nemofactortable.module.css';

/* redux part */
import {
    storeNemoFactorListAction,
    saveUsedNemoFactorAction,
    nemoFactorModelState,
} from "@slices/nemoFactorSlice";

import {
    riskModelerState,
} from "@slices/riskModelerSlice";

import { useSelector, useDispatch } from "react-redux";

const TableCellWithoutBorder = withStyles({
    root: {
        borderBottom: "none",
        fontWeight: "bold",
        fontSize: '14px',
        lineHeight: '17px',
        color: "#3D3E64",
        paddingTop: '10px',
        paddingBottom: '0px'
    }
})(MuiTableCell);

const TableCell = withStyles({
    root: {
        fontWeight: "bold",
        fontSize: '14px',
        lineHeight: '17px',
        color: "#3D3E64",
        paddingTop: '10px',
        paddingBottom: '10px',
    }
})(MuiTableCell);

const Icon = withStyles({
    root: {
        height: 'unset'
    }
})(MuiIcon);

const CustomCheckBoxIcon = () => (
    <Icon>
        <img alt="checkbox icon" src="/check-box-icon.svg" />
    </Icon>
);

const CustomCheckBoxOutlineBlankIcon = () => (
    <Icon>
        <img alt="checkbox marked icon" src="/check-box-icon-checked.svg" />
    </Icon>
);

const CustomCheckBoxIntermediateIcon = () => (
    <Icon>
        <img alt="checkbox marked icon" src="/check-box-icon-intermediate.svg" />
    </Icon>
);

const useStyles = makeStyles({
    headerTitle: {
        fontSize: '14px',
        lineHeight: '17px',
        color: '#3D3E64',
        fontWeight: 600
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
    actionButton: {
        marginRight: '5px',
        borderRadius: '20px',
        border: '1px solid #000000',
        minWidth: '70px !important'
    },
});

export default function NemoFactorTable(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const { data, nemoFactorPreset, factorData, setFactorData, resStatus } = props;
    const [checkboxState, setCheckboxState] = useState({});
    const [parentCheckboxState, setParentCheckboxState] = useState({
        isChecked: false,
        isIndeterminate: false
    });
    
    const [openEditModal, setEditModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState({});

    const { storeNemoFactorListResStatus, usedNemoFactor } = useSelector(nemoFactorModelState);
    const { savedModel } = useSelector(riskModelerState);

    useEffect(() => {
        /* initialize dynamic fields: delta pmpm and %change */
        let initialFactorData = {};
        if (data && data.length !== 0) {
            data.map((nemofactor, index) => {
                const { id, nemoFactorName, value } = nemofactor;
                let rowData = {
                    id: id,
                    nemoFactorName: nemoFactorName,
                    deltaPmpm: -2.3,
                    percentageChange: '',
                    isChecked: usedNemoFactor.includes(id),
                    value
                }
                initialFactorData[id] = rowData;
            });
            
            setFactorData(initialFactorData);
        }
    }, [data, usedNemoFactor])

    const toggleRootCheckbox = (e) => {
        const isRootChecked = e.target.checked;
        setParentCheckboxState({ ...parentCheckboxState, isChecked: isRootChecked });
        const checkedFactorState = {};
        Object.keys(factorData).map((uniqueKey, index) => {
            checkedFactorState[uniqueKey] = { ...factorData[uniqueKey], isChecked: isRootChecked };
        });
        setFactorData(checkedFactorState);
    }

    const toggleChildCheckbox = (e) => {
        const uniqueKey = e.target.name;
        const intensity = nemoFactorPreset[0].toUpperCase() + nemoFactorPreset.slice(1)
        /* store changes into db */
        const { modelId } = savedModel;
        if(modelId){
            const payload = {
                modelId,
                nemoFactorId: uniqueKey,
                intensity,
                isSelected: !factorData[uniqueKey].isChecked == true?1:0
            }
            dispatch(storeNemoFactorListAction(payload));
        }

        const newFactorData = { ...factorData, [uniqueKey]: { ...factorData[uniqueKey], isChecked: !factorData[uniqueKey].isChecked } };
        setFactorData(newFactorData);

        const checkedFactors = Object.keys(newFactorData).filter((uniqueKey, index) => {
            return newFactorData[uniqueKey].isChecked === true
        });
        dispatch(saveUsedNemoFactorAction(checkedFactors));
    }

    const checkForIndeterminateState = () => {
        let isIndeterminate = false;
        let isChecked = false;
        const checkedFactors = Object.keys(factorData).filter((uniqueKey, index) => {
            return factorData[uniqueKey].isChecked === true
        });
        if (checkedFactors.length !== 0 && (checkedFactors.length != Object.keys(factorData).length)) {
            isIndeterminate = true;
        }
        if (checkedFactors.length !== 0 && (checkedFactors.length == Object.keys(factorData).length)) {
            isChecked = true;
        }
        setParentCheckboxState({ isIndeterminate: isIndeterminate, isChecked });
    }

    useEffect(() => {
        checkForIndeterminateState();
        /* GET ALL CHECKED FACTORS */
        // const checkedFactors = Object.fromEntries(Object.entries(factorData).filter(([key, value])=>value.isChecked === true));
        
        // 
    }, [factorData]);

    const handleEditClick = (uniqueKey) => {
        /* set selected row data */
        setSelectedRowData(factorData[uniqueKey]);
        setEditModalOpen(true);
    }

    return (
        <>
            <TableContainer className={styles.tableContainer}>
                <Table aria-label="simple table" className={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCellWithoutBorder></TableCellWithoutBorder>
                            {/* <TableCellWithoutBorder align="left" colSpan={2} classes={{ root: clsx(classes.lightGreenBackground, classes.topBorderRadius) }} className={styles.tableHeaderTitle}>
                                NEMO Program Impact
                            </TableCellWithoutBorder> */}
                            <TableCellWithoutBorder></TableCellWithoutBorder>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">
                                {/* <FormControlLabel
                                    control={<Checkbox
                                        indeterminate={parentCheckboxState.isIndeterminate}
                                        checked={parentCheckboxState.isChecked}
                                        icon={<CustomCheckBoxOutlineBlankIcon />}
                                        checkedIcon={<CustomCheckBoxIcon />}
                                        indeterminateIcon={<CustomCheckBoxIntermediateIcon />}
                                        name="parentCheckbox" onChange={(e) => toggleRootCheckbox(e)} />}
                                    label={<span className={classes.headerTitle}>NEMO Factors</span>}
                                /> */}
                                <span className={classes.headerTitle}>NEMO Factors</span>
                            </TableCell>

                            {/* <TableCell classes={{ root: classes.lightGreenBackground }} className={styles.tableHeaderSubTitle}> Delta PMPM (%)</TableCell>
                            <TableCell classes={{ root: classes.lightGreenBackground }} className={styles.tableHeaderSubTitle} align={'right'}> % Change</TableCell>
                             */}
                            <TableCell align="left"></TableCell>
                        </TableRow>

                    </TableHead>

                    {resStatus === REQUEST &&
                        <TableBody>
                            <TableRow>
                                <TableCell align="left" colSpan={2}>
                                    <NemoSkeleton count={1} height={30} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left" colSpan={2}>
                                    <NemoSkeleton count={1} height={30} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left" colSpan={2}>
                                    <NemoSkeleton count={1} height={30} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left" colSpan={2}>
                                    <NemoSkeleton count={1} height={30} />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    }

                    {resStatus === SUCCESS && Object.keys(factorData).length !== 0 && Object.keys(factorData).map((uniqueKey, index) => {
                        if (factorData[uniqueKey]) {
                            const { isChecked, nemoFactorName, deltaPmpm, percentageChange, value } = factorData[uniqueKey];
                            return (
                                <TableRow key={uniqueKey}>
                                    <TableCell align="left">
                                        <FormControlLabel
                                            control={<Checkbox icon={<CustomCheckBoxOutlineBlankIcon />} checkedIcon={<CustomCheckBoxIcon />}
                                                name={uniqueKey} onChange={(e) => toggleChildCheckbox(e)} checked={isChecked} />}
                                            label={<span className={styles.tableHeaderSubTitle}>{nemoFactorName}</span>}
                                        />
                                    </TableCell>
                                    {/* <TableCell classes={{ root: classes.lightGreenBackground }} className={styles.tableHeaderSubTitle}>
                                            <CurrencyComponent adaptiveColor={true}>{value}</CurrencyComponent>
                                        </TableCell>
                                        <TableCell classes={{ root: classes.lightGreenBackground }} className={styles.tableHeaderSubTitle} align={'right'}>
                                            {percentageChange}
                                        </TableCell> */}
                                    <TableCell component='td' scope="row" key={'action'} align={'right'} >
                                        <Button variant="outlined" className={clsx(classes.actionButton)}
                                            onClick={() => handleEditClick(uniqueKey)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    })

                    }

                </Table>
            </TableContainer>
            {openEditModal && <EditNemoFactor openModal={openEditModal} setModalOpen={setEditModalOpen} data={selectedRowData} setSelectedRowData={setSelectedRowData} nemoFactorPreset={nemoFactorPreset}/>}
        </>
    );
}