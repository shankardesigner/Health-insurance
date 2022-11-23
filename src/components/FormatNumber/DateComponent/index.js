import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import moment from "moment";

const useStyles = makeStyles({
	textComponent: {
		fontSize: "14px !important",
		lineHeight: "16px",
		fontWeight: 400,
	},
	defaultColor: {
		color: "#3D3E64",
	},
	positiveColor: {
		color: "#42DEB4",
	},
	negativeColor: {
		color: "#FF0000",
	},
});

const DateComponent = function DateComponent(props) {
	const { children, classProp } = props;
	const classes = useStyles();
	const date = children;

	const formatDateWithTime = (date) => {
		let dateObj = new Date(date);
		let newDate = moment(dateObj).utc().format("MM/DD/YYYY h:mma"); // June 1, 2019

		// let day = ("0" + dateObj.getDate()).slice(-2);
		// let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
		// let year = dateObj.getFullYear();
		// let time = dateObj.toLocaleTimeString([], { timeStyle: "short" });
		// let newDate = month + "/" + day + "/" + year + " " + time;
		return newDate;
	};

	return (
		<span className={clsx(classes.textComponent, classProp)}>
			{formatDateWithTime(date)}
		</span>
	);
};

export default DateComponent;