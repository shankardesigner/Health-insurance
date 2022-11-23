import React from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { makeStyles } from "@material-ui/core";
import Search from "./Search";

const drawerWidth = 196;

export const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    boxShadow: 'none',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: "20px",
    lineHeight: "23px",
    color: "#06406D",
  },
  toolbar: {
    background: "#FFFFFF",
    boxShadow: "0px 1px 8px rgba(61, 62, 100, 0.1)",
  },
}));

const Header = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  return (
    <AppBar
      position="absolute"
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        {/* <IconButton
      edge="start"
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
    >
      <MenuIcon />
    </IconButton> */}
        <Typography
          component="h1"
          variant="h2"
          color="inherit"
          noWrap
          className={classes.title}
        >
          Admin
        </Typography>
        {/* <NemoIcon icon="home" /> */}
        <Search />
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
