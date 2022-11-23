import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import styles from "./stoploss.module.scss";

const useStyles = makeStyles((theme) => ({
	stopLossInfoContainer: {
		margin: "0 0 22px",
	},
	title: {
		font: "500 16px/20px Roboto, Arial, Helvetica, sans-serif",
		color: "#5A2C6D",
		margin: "0 0 30px",
		textDecoration: "underline",
	},
	extraHeading: {
		font: "600 18px/23px Roboto, Arial, Helvetica, sans-serif",
		color: "#06406d",
		margin: "0 0 10px",
		textDecoration: "none",
	},
	extraDecor: {
		borderBottom: "2px solid #DCDCDC",
		margin: "0 0 15px",
		padding: "0 0 15px",
	},
}));

const StopLossPanel = ({ title, children, extraStyle = false }) => {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Typography
				variant="h6"
				className={`${classes.title} ${extraStyle ? classes.extraHeading : ""}`}
			>
				{title}
			</Typography>
			<div
				className={`${styles.stopLossInfoContainer} ${
					extraStyle ? classes.extraDecor : ""
				}`}
			>
				{children}
			</div>
		</React.Fragment>
	);
};

export default StopLossPanel;
