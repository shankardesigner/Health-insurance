import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useRouter } from 'next/router'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Box from '@material-ui/core/Box';
import ModelResultBox from '../../ModelResultBox';
import BoxWithToggle from '@components/BoxWithToggle';
import TableComponentNemoFactor from '@components/TableComponentNemoFactor';
import NemoFactorTable from './NemoFactorTableOld';
import NemoSkeleton from '@components/NemoSkeleton';
import { makeid } from '@utils/common';
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import { useState } from 'react';

import styles from './nemofactors.module.css';

/* redux part */
import {
    listAction,
    storeNemoFactorAction,
    saveUsedNemoFactorAction,
    nemoFactorModelState,
} from "@slices/nemoFactorSlice";

import {
    riskModelerState,
    recalculateSavingsAction,
} from "@slices/riskModelerSlice";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    search: {
        [theme.breakpoints.down('sm')]: {
            paddingBottom: '10px'
        },
    },
    linearProgress: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function NemoFactors() {
    const classes = useStyles();
    const router = useRouter()

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listAction());
    }, []);

    const { nemoFactorModelList, nemoFactorModelListResStatus, resStatus } = useSelector(nemoFactorModelState);
    const { savedModel } = useSelector(riskModelerState);

    const [nemoFactorPreset, setNemoFactorPreset] = useState('aggressive');
    const [columnsData, setColumnsData] = useState([]);
    const [factorData, setFactorData] = useState({});

    const handleChange = (event) => {
        setClient(event.target.value);
    };

    const handleNemoFactorPresetChange = (event) => {
        setNemoFactorPreset(event.target.value);
    };

    useEffect(() => {
        setColumnsData(nemoFactorModelList[nemoFactorPreset]);
    }, [nemoFactorPreset, nemoFactorModelList]);

    // useEffect(()=>{
    //     /* save used nemo factors */
    //     dispatch(recalculateSavingsAction());
    // }, [factorData])

    const columns = [
        { name: 'NEMO Factors', component: 'TextComponent', sourceKey: 'nemoFactor' },
        { name: 'Baseline', component: 'TextComponent', sourceKey: 'value' }
    ]

    const actions = [
        { name: 'Edit' }
    ]

    return (
        <Box p={3}>
            <BoxWithToggle title="NEMO Factor Intensity" hideToggle={true}>
                {nemoFactorModelListResStatus === SUCCESS &&
                    <RadioGroup aria-label="quiz" name="quiz" value={nemoFactorPreset} onChange={handleNemoFactorPresetChange} className={styles.directionRow}>
                        <FormControlLabel value="aggressive" control={<Radio />} label="Aggressive" />
                        <FormControlLabel value="moderate" control={<Radio />} label="Moderate" />
                        <FormControlLabel value="conservative" control={<Radio />} label="Conservative" />
                    </RadioGroup>
                }
                {nemoFactorModelListResStatus === REQUEST && <NemoSkeleton count={1} height={50} />}
            </BoxWithToggle>

            {/* table component */}
            {/* {<TableComponentNemoFactor headers={columns} actions={actions} data={columnsData} options={{ displayPagination: false }} callback={setUsedNemoFactor} initialState={usedNemoFactor} />} */}
            <NemoFactorTable data={columnsData} resStatus={nemoFactorModelListResStatus} 
                nemoFactorPreset={nemoFactorPreset} factorData={factorData} setFactorData={setFactorData}/>

            <ModelResultBox next='nemo-tab-4' />
        </Box>
    )
}