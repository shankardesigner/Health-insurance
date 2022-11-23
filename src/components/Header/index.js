import { signIn, signOut, useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Drawer from '@material-ui/core/Drawer';
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
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import styles from './header.module.css';
import constants from '@constants/index'
import { useUser, withPageAuthRequired} from '@auth0/nextjs-auth0';

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
        [theme.breakpoints.down('sm')]: {
            fontSize: '14px !important',
            flexGrow: 1,
            color: '#3D3E64'
        },
        [theme.breakpoints.up('sm')]: {
            color: '#3D3E64'
        },
    },
}));

function Header(props) {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [userTypeText, setUserTypeText] = useState('admin');
    const [userType, setUserType] = useState(null);

    useEffect(() => {
       
       user && setUserType(user.nickname)
        
    }, [user])

    useEffect(() => {
        if (userType === 'admin') {
            setUserTypeText('Admin');
        } else if (userType === 'careteam') {
            setUserTypeText('Care Team');
        } else if (userType === 'doctor') {
            setUserTypeText('Doctor')
        } else if (userType === 'patient') {
            setUserTypeText('Patient');
        }
    }, [userType])

    const classes = useStyles();

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
                <ListItem button key={'Logout'}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <Link href='/api/auth/logout'>Logout</Link>                    
                </ListItem>
            </List>
        </div>
    );

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpenDrawer(open);
    };

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

                <Grid
                    container
                    direction="row"
                    justify={(props.width === 'sm' || props.width === 'xs') ? 'flex-start' : 'center'}
                    alignItems="center"
                >
                    <img
                        src="/logo-plain.svg"
                        alt="nemo logo"
                        className={`${styles.logoPlain} ${classes.logoPlain}`}
                    />
                    <img
                        src="/vertical-line.svg"
                        alt="divider"
                        className={styles.divider}
                    />
                    <Typography variant="h6" className={classes.title}>
                        {userTypeText}
                    </Typography>
                </Grid>
                {/* <Button color="inherit">Login</Button> */}
            </Toolbar>
            <Drawer anchor={'left'} open={openDrawer} onClose={toggleDrawer('left', false)}>
                {list('left')}
            </Drawer>
        </AppBar>
    )
}

export default withWidth()(withPageAuthRequired(Header));