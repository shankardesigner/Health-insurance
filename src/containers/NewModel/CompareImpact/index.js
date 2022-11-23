import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';

import TableComponent from '@components/TableComponent';

import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addNewList, compareImpactModelState, resetToInitial, setCompareImpactListAction, setSelectListAction, setPayerListAction, setPracticeListAction, setPCPListAction } from '@slices/compareImpactSlice';
import { useSelector } from 'react-redux';
import { resultsClaimsModelState } from '@slices/resultsClaimsSlice';

const useStyles = makeStyles((theme) => ({
    search: {
        [theme.breakpoints.down('sm')]: {
            paddingBottom: '10px'
        },
    },
    actionButton: {
        marginRight: '5px',
        borderRadius: '20px',
        border: '1px solid #000000'
    },
    inputStyle: {
        background: '#EFEFF0',
        borderRadius: '7px !important',
        paddingLeft: '10px',
        marginBottom: '10px',
        width: '80%'
    },
    selectStyle: {
        root: {
            height: '18px',
            borderRadius: '7px',
            minHeight: 'unset !important',
            '&.MuiFilledInput-input': {
                color: 'grey',
            }
        }
    },
    compareImpactContainer: {
        display: 'flex',
        overflowX: 'scroll'
    }
}));

export default function CompareImpact() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { compareImpactList, selectCategories, selectSubCategories } = useSelector(compareImpactModelState);

    const [selectedValue, setSelectedValue] = useState({});

    const [total, setTotal] = useState({});
    const { resultsClaimsModelList } = useSelector(resultsClaimsModelState);
    useEffect(() => {
        dispatch(resetToInitial());
        dispatch(setSelectListAction());
        dispatch(setPayerListAction());
        dispatch(setPracticeListAction());
        dispatch(setPCPListAction());
    }, []);

    const columns = [
        { name: '', component: 'TextComponent', sourceKey: 'serviceCategoryName' },
        { name: 'Budget', component: 'CurrencyComponent', sourceKey: 'pmPm' },
        { name: 'Actual', component: 'CurrencyComponent', sourceKey: 'pmPmBenchMark' },
        { name: 'Proj.', component: 'CurrencyComponent', sourceKey: 'pmPmProjected' },
        { name: 'Savings', component: 'CurrencyComponent', sourceKey: 'pmPmSavings' },
    ]

    const comparedColumns = [
        { name: 'Actual', component: 'CurrencyComponent', sourceKey: 'actual_1' },
        { name: 'Proj.', component: 'CurrencyComponent', sourceKey: 'proj_1' },
        { name: 'Savings', component: 'CurrencyComponent', sourceKey: 'savings_1' },
    ]


    const onSelectValueChange = (event, index) => {
        const updatedState = {
            ...selectedValue,
            [index]: {
                ...selectedValue[index],
                [event.target.name]: event.target.value
            }
        }
        setSelectedValue(updatedState);
        if(event.target.name === 'subcategory'){
            dispatch(setCompareImpactListAction({...updatedState[index], index}));
        }
    }

    const ref = useRef(null);

    const scroll = () => {
        ref.current.scrollLeft += 300;
    };

    const handleAddNewImpactClick = () => {
        dispatch(addNewList());
        setTimeout(()=>{
            scroll();
        }, 500)
    }

    const getComparedTable = (impacts, index, compareImpactList) => {
        const isLast = index === compareImpactList.length -1
        return <div style={{minWidth: 300}}>
            <div style={{display: 'flex', alignItems:'center'}}>
                <div style={{flex: 2}}>
                    <FormControl fullWidth classes={{ root: classes.inputStyle }}>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            key={index}
                            name="category"
                            displayEmpty
                            disableUnderline
                            value={selectedValue[index] && selectedValue[index].category || ''}
                            classes={{ root: classes.selectStyle }}
                            onChange = {(e) => onSelectValueChange(e, index)}
              
                        >
                            {
                                selectCategories && selectCategories.map(client=>{
                                    return <MenuItem value={client.id} key={`${client.id}${index}`}>{client.name}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth classes={{ root: classes.inputStyle }}>
                        <Select
                            labelId="demo-simple-select-filled-label"
                            name="subcategory"
                            displayEmpty
                            disableUnderline
                            disabled = {!selectedValue[index] || !selectedValue[index].category}
                            value={selectedValue[index] && selectedValue[index].subcategory || ''}
                            classes={{ root: classes.selectStyle }}
                            onChange = {(e) => onSelectValueChange(e, index)}
                        >
                            {
                                selectSubCategories && selectedValue[index] && selectedValue[index].category && selectSubCategories[selectedValue[index].category].map(sub=>{
                                    return <MenuItem value={sub.id} key={`${index}${sub.id}`}>{sub.name}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
                {isLast && <button onClick={handleAddNewImpactClick}>ADD</button>}
            </div>
            <TableComponent 
                headers={comparedColumns}
                data={impacts} 
                options={{ 
                    displayPagination: false, 
                    total: {
                        // display: true,
                        columns: ['actual_1', 'proj_1', 'savings_1']
                    }
                }}
                getCalculatedTotal={setTotal}
            />
        </div>
    }

    return (
        <Box p={3}>
            <div className={classes.compareImpactContainer} ref={ref}>
                <div style={{minWidth: '899px'}}>
                    <div style={{height: 84}}></div>
                    <TableComponent 
                        headers={columns}
                        data={resultsClaimsModelList} 
                        key={12}
                        options={{ 
                            displayPagination: false, 
                            total: {
                                display: true,
                                columns: ['pmPm', 'pmPmBenchMark', 'pmPmProjected', 'pmPmSavings']
                            }
                        }}
                        getCalculatedTotal={setTotal}
                    />
                </div>
                {compareImpactList.map((impacts, index)=>{
                    return getComparedTable(impacts, index, compareImpactList)
                })}
            </div>
        </Box>
    )
}