import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import styles from './searchbox.module.css';

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

        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
    },
    inputRoot: {
        border: '1px solid #CED5EB',
        boxSizing: 'border-box',
        borderRadius: '6px',
        width: '100%',
    },
    inputInput: {
        height: '34px',
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
        paddingLeft: '5px',
        transition: theme.transitions.create('width'),
        width: '100%',
    }
}));

export default function SearchBox(props) {
    const { helperText } = props;
    const classes = useStyles();
    return (
        <FormControl>
            <InputBase
                placeholder="Search…"
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                endAdornment={
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                }
                inputProps={{ 'aria-label': 'search' }}
            />

            {helperText && <FormHelperText id="my-helper-text">{helperText}</FormHelperText>}
        </FormControl>
    )
}