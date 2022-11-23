import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { VariableSizeList } from 'react-window';
import { Typography } from '@material-ui/core';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Chip from '@material-ui/core/Chip';

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + LISTBOX_PADDING,
        },
    });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});


function random(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}


const useStyles = makeStyles((theme) => ({
    listbox: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    }
}));


const renderGroup = (params) => [
    <ListSubheader key={params.key} component="div">
        {params.group}
    </ListSubheader>,
    params.children,
];

export default function SearchBoxAuto(props) {
    const { data, helperText, defaultKey, setSelected, setAutoCompleteInput, sort = false } = props;
    const classes = useStyles();

    let searchdata = JSON.parse(JSON.stringify(data));
    if (sort && data) {
        searchdata = searchdata.sort((a, b) => a[defaultKey].toUpperCase().localeCompare(b[defaultKey].toUpperCase()));
    }

    const handleAutoCompleteValueChange = (e, value) => {
        setSelected(value);
    }

    const handleAutoComplateInputChange = (e) => {
        setAutoCompleteInput(e.target.value);
    }

    return (
        <FormControl>
            <Autocomplete
                multiple
                id="virtualize-demo"
                style={{ width: 500 }}
                disableListWrap
                disableClearable
                classes={{ listbox: classes.listbox }}
                ListboxComponent={ListboxComponent}
                renderGroup={renderGroup}
                getOptionLabel={(option) => option[defaultKey]}
                options={searchdata}
                groupBy={(option) => option[defaultKey][0].toUpperCase()}
                onChange={handleAutoCompleteValueChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search input"
                        margin="normal"
                        variant="outlined"
                        multiline
                        onChange={handleAutoComplateInputChange}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ), type: 'search'
                        }}
                    />
                )}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip variant="outlined" label={option[defaultKey]} {...getTagProps({ index })} />
                    ))
                }
                renderOption={(option) => <Typography noWrap>{option[defaultKey]}</Typography>}
            />
            {helperText && <FormHelperText id="my-helper-text">{helperText}</FormHelperText>}
        </FormControl>
    );
}