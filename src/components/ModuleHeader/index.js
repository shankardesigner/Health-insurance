import { signIn, signOut, useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';

import Drawer from '@material-ui/core/Drawer';
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { useUser, withPageAuthRequired} from '@auth0/nextjs-auth0';

import styles from './moduleheader.module.css';
import constants from '@constants/index'
import LoopIcon from '@material-ui/icons/Loop';
import CircularProgress from '@material-ui/core/CircularProgress';

const userType = 'admin';// set by session or jwt token

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    logoPlain: {
        [theme.breakpoints.down('sm')]: {
            width: '86px !important',
        },
    },
    title: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: '40px',
        lineHeight: '49px',
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px !important',
            flexGrow: 1,
            color: '#3D3E64'
        },
        [theme.breakpoints.up('sm')]: {
            color: '#3D3E64'
        },
    },
    drawerMenuIcon: {
        [theme.breakpoints.up('sm')]: {
            width: '32px',
            height: '32px',
        },
        [theme.breakpoints.down('sm')]: {
            width: '32px',
            height: '32px',
        },
    },
    forceReloadBtn: {
        "&.MuiButtonBase-root": {
            opacity: 0.3
        },
        "&:hover": {
            opacity: 1
        },
    }
}));

function ModuleHeader({ width, info }) {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [userTypeText, setUserTypeText] = useState('admin');

    const logout = () => {
        destroyCookie(null, 'next-auth.callback-url');
        destroyCookie(null, 'next-auth.csrf-token');
        destroyCookie(null, 'next-auth.session-token');
        localStorage.setItem('persist:nemo-admin', "{}");

        const NEXTAUTH_SIGNOUT_CALLBACK_URL = `${process.env.NEXTAUTH_SIGNOUT_CALLBACK_URL}`;
        signOut({ callbackUrl: NEXTAUTH_SIGNOUT_CALLBACK_URL });
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpenDrawer(open);
    };

  

    const classes = useStyles();

    const actionBack = () => {
        router.back();
    }

    const forceRecalculate = () => {
        const { actions } = info;
        const { forceRecalculate } = actions;
        forceRecalculate();
    }

    const navigateTo = (link) => {
        router.push(link);
    }

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem button key={'Logout'} onClick={() => { navigateTo('/dashboard') }}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary={"Dashboard"} />
                </ListItem>
            </List>
            <Divider />
            <List>
                {constants.drawerLinks.map((menuItem, index) => (
                    <ListItem button key={index} onClick={() => { navigateTo(menuItem.link) }}>
                        <ListItemIcon>
                            <img
                                src={menuItem.icon}
                                alt={menuItem.alt}
                                className={classes.drawerMenuIcon}
                            />
                        </ListItemIcon>
                        <ListItemText primary={menuItem.title} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button key={'Logout'} onClick={() => { logout() }}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary={"Logout"} />
                </ListItem>
            </List>
        </div>
    );

    return (
        <AppBar position="fixed" color={'inherit'} elevation={0} className={styles.appbar}>
            <Toolbar>

                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer('left', true)}>
                    <img
                        src="/hamburger-menu.svg"
                        alt="nemo logo"
                        className={styles.hamburgerMenuIcon}
                    />
                </IconButton>

                {info.header && info.header.displayBack &&
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => { actionBack() }}>
                        <img
                            src="/back-arrow.svg"
                            alt="back arrow"
                            className={styles.backButtonIcon}
                        />
                    </IconButton>
                }

                <Grid
                    container
                    direction="row"
                    justify={(width === 'sm' || width === 'xs') ? 'flex-start' : 'center'}
                    alignItems="center"
                >
                    {info.icon &&
                        <img
                            src={info.icon}
                            alt="module icon"
                            className={styles.moduleIcon}
                        />
                    }
                    <Typography variant="h6" className={classes.title}>
                        {info.name}
                    </Typography>
                </Grid>

                {info.header && info.header.forceReload &&
                    <IconButton edge="start" className={clsx(classes.menuButton, classes.forceReloadBtn)} color="inherit" aria-label="menu" onClick={() => { forceRecalculate() }}>
                        <LoopIcon alt="Force Reload" />
                    </IconButton>
                }
            </Toolbar>
            <Drawer anchor={'left'} open={openDrawer} onClose={toggleDrawer('left', false)}>
                {list('left')}
            </Drawer>
        </AppBar>
    )
}

export default withWidth()(withPageAuthRequired(ModuleHeader));