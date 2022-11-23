import { Button, Drawer, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import MenuItem from "../Header/MenuItem";
import NemoIcon from "../NemoIcon";

const drawerWidth = 196;

export const useStyles = makeStyles((theme) => ({
	logoHolder: {
		padding: "24px 0 0 20px",
		marginBottom: "63px",
	},
	logo: {
		width: "109px",
		height: "auto",
	},
	drawerPaper: {
		position: "relative",
		zIndex: 9999,
		whiteSpace: "nowrap",
		width: drawerWidth,
		border: 0,
		background: "#FFFFFF",
		boxShadow: "0px 1px 8px rgba(61, 62, 100, 0.1)",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		paddingBottom: "60px",
	},
	drawerPaperClose: {
		overflowX: "hidden",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9),
		},
	},
}));

const open = true;
const Sidebar = () => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const toggleDrawer = (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setOpen((drawer) => !drawer);
	};

	return (
		<Drawer
			variant="permanent"
			classes={{
				paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
			}}
			open={open}
			onClose={toggleDrawer}
		>
			<div className="menu-holder" onClick={toggleDrawer}>
				<NemoIcon icon="arrow-left" />
			</div>
			<div className={classes.logoHolder}>
				<img
					src="/logo-new-plain.svg"
					alt="nemo logo"
					className={classes.logo}
				/>
			</div>
			<MenuItem />
		</Drawer>
	);
};

export default Sidebar;
