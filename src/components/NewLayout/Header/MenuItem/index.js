// import NemoIcon from "@components/NewLayout/NemoIcon";
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
} from "@material-ui/core";
import React from "react";

const menuItems = [
	{
		text: "Dashboard",
		icon: "home",
		path: "/",
		subMenu: [],
	},
	{
		text: "Signal",
		icon: "chart",
	},
	{
		text: "Reporting",
		icon: "list",
		active: true,
	},
	{
		text: "Compensation",
		icon: "wallet",
	},
	{
		text: "Active",
		icon: "star",
	},
	{
		text: "Claims",
		icon: "discount",
	},
	{
		text: "Quality",
		icon: "ticket",
	},
	{
		text: "Client Management",
		icon: "setting",
	},
];

const useStyles = makeStyles((theme) => ({
	root: {
		fontSize: 14,
		lineHeight: "16px",
	},
	item: {
		padding: "12px 18px",
		borderRadius: "10px 0px 0px 10px",
		color: "#6F7376",
		letterSpacing: "-1px",

		"&:hover": {
			background: "rgba(194, 228, 255, .4)",
			color: "#06406D",
			fontWeight: 500,

			"& path": {
				fill: "#06406D !important",
			},
		},

		"&.active": {
			background: "rgba(194, 228, 255, .4)",
			color: "#06406D",
			fontWeight: 500,

			"& path": {
				fill: "#06406D !important",
			},
		},
	},
	icon: {
		marginRight: theme.spacing(1),
		minWidth: "24px",
	},
	text: {
		"& span": {
			fontSize: 14,
			lineHeight: "16px",
		},
	},
}));

const MenuItem = () => {
	const classes = useStyles();

	return (
		<List className={classes.root}>
			{menuItems.map((item) => (
				<ListItem
					button
					key={item.text}
					className={`${classes.item} ${item.active ? "active" : ""}`}
				>
					{/* <ListItemIcon className={classes.icon}>
						<NemoIcon icon={item.icon} />
					</ListItemIcon> */}
					<ListItemText primary={item.text} className={classes.text} />
					{item.subMenu?.length > 0 &&
						item.subMenu.map((subItem) => (
							<ListItem button key={subItem.text}>
								<ListItemText primary={subItem.text} />
							</ListItem>
						))}
				</ListItem>
			))}
		</List>
	);
};

export default MenuItem;
