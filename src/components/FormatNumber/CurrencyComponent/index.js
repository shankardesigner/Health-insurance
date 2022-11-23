import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles({
	textComponent: {
		fontSize: "14px !important",
		lineHeight: "16px",
		fontWeight: 500,
	},
	boldComponent: {
		fontWeight: "bolder !important",
		fontSize: "15px !important",
		lineHeight: "16px",
	},
	defaultColor: {
		color: "#3D3E64",
	},
	positiveColor: {
		color: "black",
	},
	negativeColor: {
		color: "#FF0000",
	},
});

const CurrencyComponent = function CurrencyComponent(props) {
	const {
		children,
		adaptiveColor = false,
		classProp,
		decimalCount = 2,
		reverseColor = false,
		boldTotal,
	} = props;

	const classes = useStyles();
	const number = Number(children);

	let adaptiveClass = "defaultColor";

	const colorClass = ["positiveColor", "negativeColor"];
	// if (adaptiveColor == true) {
	// 	if (number >= 0) {
	// 		adaptiveClass = colorClass[0];
	// 	} else {
	// 		adaptiveClass = colorClass[1];
	// 	}
	// }

	let amount = number.toFixed(decimalCount);

	//regex for incase 0 is after decimal point
	// .replace(/\.0+$/, "")

	/* check for -0.00 case */
	if (amount * 1000 == 0) {
		amount = Number(Number(0.0).toFixed(decimalCount));
	}

	if (amount < 0) {
		adaptiveClass = colorClass[1];
	} else {
		adaptiveClass = colorClass[0];
	}

	if (reverseColor) {
		const currentIndex = colorClass.indexOf(adaptiveClass);
		const toggleIndex = currentIndex ? 0 : 1;
		adaptiveClass = colorClass[toggleIndex];
	}

	if (amount === 0) {
		adaptiveClass = colorClass[0];
	}

	const amountWithCommas = amount
		? amount < 0
			? "-$" +
			  Math.abs(amount)
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			: "$" + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		: "$0";

	return (
		<span
			className={
				boldTotal
					? clsx(classes.boldComponent)
					: clsx(classes.textComponent, classes[adaptiveClass], classProp)
			}
		>
			{amountWithCommas}
		</span>
	);
};

export default CurrencyComponent;
