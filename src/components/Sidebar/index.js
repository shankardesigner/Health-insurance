/* eslint-disable react/prop-types */
import styles from "./sidebar.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SidebarMenuItem from "@components/SidebarMenuItem";
import { useEffect, useState } from "react";
import { Box, Drawer, IconButton } from "@material-ui/core";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector, useDispatch } from "react-redux";
import { menuSelector, menuToggle } from "@slices/menuToggleSlice";

const drawerWidth = 196;

const useStyles = makeStyles((theme) => ({
  logoContainer: {
    height: "70px",
    marginBottom: "25px",
    position: "relative",
    marginLeft: "10px",
  },
  logo: {
    width: "109px",
    height: "20.24px",
    transition: 'padding-left 0.3s ease-in-out',
    paddingLeft: 0,
  },
  dashboardMenuIcon: {
    width: "25px",
    height: "25px",
  },

  menuText: {
    fontSize: 18,
  },
  menuButton: {
    marginRight: 36,
    position: "absolute",
    left: "15px",
    top: "12px",
    zIndex: 10,
    color: "#939698",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    width: 196,
    zIndex: 5,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
  },
  menuCollapsed: {
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  paper: {
    borderRight: 0,
    boxShadow: `0px 1px 8px rgba(61, 62, 100, 0.1)`
  },
  logoDrawerOpen : {
    paddingLeft: theme.spacing(1) + 2,
  }
}));

export default function Sidebar({ menuItems, logo, customStyle }) {
  const classes = useStyles();
  const { open } = useSelector(menuSelector);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch(menuToggle(!open));
  };

  useEffect(() => {
    dispatch(menuToggle(false));
  },[])

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx(classes.paper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <Grid className={styles.cardContainer}>
        <Box display="flex">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton>
          <Grid
            item
            xs={12}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className={classes.logoContainer}
          >
            <img src={logo} alt="nemo logo" className={` ${classes.logo} ${!open ? classes.logoDrawerOpen: ''}`} />
          </Grid>
        </Box>
        <Grid item xs={12} container direction="column" alignItems="flex-start" className={`${!open ? classes.menuCollapsed : ''}`}>
            {menuItems.map((menuItem, index) => (
              <SidebarMenuItem menuItem={menuItem} key={index} />
            ))}
        </Grid>
      </Grid>
    </Drawer>
  );
}
