import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles({
	textComponent: {
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
		fontWeight: 500,
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

const NumberComponent = function NumberComponent(props) {
	const classes = useStyles();
	const {
		children,
		adaptiveColor = false,
		withComma = false,
		decimal = true,
	} = props;
	let decimalCount = 0;
	if (decimal) {
		decimalCount = 2;
	}
	let number = children ? Number(children).toFixed(decimalCount) : "-";

	if (withComma && number !== "-") {
		number = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	let adaptiveClass = "defaultColor";
	if (adaptiveColor == true) {
		if (number >= 0) {
			adaptiveClass = "positiveColor";
		} else {
			adaptiveClass = "negativeColor";
		}
	}
	return (
		<span className={clsx(classes.textComponent, classes[adaptiveClass])}>
			{number}
		</span>
	);
};

export default NumberComponent;
