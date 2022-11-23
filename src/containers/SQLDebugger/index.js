import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import CodeIcon from '@material-ui/icons/Code';
import Zoom from '@material-ui/core/Zoom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TableComponent from '@components/TableComponent';
import styles from './sqldebugger.module.css';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
/* redux part */
import {
    sqlDebuggerState
} from "@slices/sqlDebuggerSlice";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
    },
    fab: {
        position: 'fixed',
        // bottom: theme.spacing(2),
        // right: theme.spacing(2),
        // right: '168px',
        left: '0px',
        bottom: '0px',
        borderRadius: '8px !important',
        borderBottomLeftRadius: '0px !important',
        borderBottomRightRadius: '0px !important',
        height: '37px !important'
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function SQLDebugger() {
    const classes = useStyles();
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [open, setOpen] = React.useState(false);

    const { data } = useSelector(sqlDebuggerState);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        { name: 'Req. URL', component: 'TextComponent', sourceKey: 'url' },
        { name: 'Req. Method', component: 'TagComponent', sourceKey: 'method' },
        { name: 'Status', component: 'TagComponent', sourceKey: 'status' },
        { name: 'Query.', component: 'DefaultComponent', sourceKey: 'query', align: 'left' },
        { name: 'Exec. Time (ms)', component: 'TextComponent', sourceKey: 'execTime' },
        { name: 'Payload', component: 'JsonComponent', sourceKey: 'requestBody', align: 'left' },
        { name: 'Resp.', component: 'JsonComponent', sourceKey: 'data', align: 'left' },
    ]

    const actions = [
        // { name: 'Edit' }
    ]

    return (
        <>
            <Zoom
                key="primary"
                in={true}
                timeout={transitionDuration}
                style={{
                    transitionDelay: `${true ? transitionDuration.exit : 0}ms`,
                }}
                unmountOnExit
            >
                <Fab size="small" aria-label={"Add"} className={classes.fab} color="secondary" onClick={handleClickOpen} >
                    <CodeIcon/>
                </Fab>
            </Zoom>

            {/* dialog */}
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar position="fixed" color={'inherit'} elevation={0} className={styles.appbar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close" >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            SQL Debugger
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className={styles.tableWrapper}>
                    {data.length > 0 && <TableComponent headers={columns} data={data} actions={actions} key={1} options={{ displayPagination: false }} />}
                    {data.length == 0 && <span style={{ marginLeft: '30px' }}>Data not available.</span>}
                </div>
            </Dialog>
        </>
    )
}