import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Grid from "@material-ui/core/Grid";
import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { NumberComponent } from "../FormatNumber";

const useStyles = makeStyles((theme) => ({
	inputStyle: {
		background: "#EFEFF0",
		borderRadius: "15px",
		width: "100%",
		"& .MuiInputBase-input": {
			textAlign: "center",
		},
	},
	icon: {
		color: "#fff",
	},
	inputWrapper: {
		paddingTop: "5px",
	},
	iconButton: {
		"&:hover, &.MuiButtonBase-root": {
			backgroundColor: "#42DEB4",
			width: "27px",
			height: "35px",
		},
	},
	iconButtonLeft: {
		"&:hover, &.MuiButtonBase-root": {
			backgroundColor: "#42DEB4",
			width: "27px",
			height: "35px",
			borderRadius: "unset",
			borderBottomRightRadius: "8px",
			borderTopRightRadius: "8px",
		},
	},
	iconButtonRight: {
		"&:hover, &.MuiButtonBase-root": {
			backgroundColor: "#42DEB4",
			width: "27px",
			height: "35px",
			borderRadius: "unset",
			borderBottomLeftRadius: "8px",
			borderTopLeftRadius: "8px",
		},
	},
	gridContainer: {
		width: "150px",
	},
}));

const isFloat = (n) => {
	return Number(n) === n && n % 1 !== 0;
};

const NumberInputField = ({
	value,
	id,
	callback,
	start,
	type = "integer",
	factor = 1,
}) => {
	const classes = useStyles();

	let startAt = start;
	if (!start) {
		startAt = 0;
	}
	/* convert into two decimal number if it is decimal */
	let twoDecimalValue = value;
	if (isFloat(Number(value)) && value !== "") {
		twoDecimalValue = parseFloat(Number(twoDecimalValue).toFixed(2));
	}
	const [inputValue, setInputValue] = useState(twoDecimalValue);

	const getTwoDecimal = (value) => {
		const decimalCount = type == "integer" ? 0 : 2;
		return parseFloat(Number(value).toFixed(decimalCount));
	};

	const handleClickIncrease = (e) => {
		let tempValue = inputValue;
		if (inputValue == "") {
			tempValue = startAt - factor;
		}
		tempValue = parseFloat(tempValue) + factor;
		tempValue = getTwoDecimal(tempValue);
		setInputValue(tempValue);
		callback(tempValue, id);
	};

	const handleClickDecrease = (e) => {
		let tempValue = inputValue;

		if (inputValue < 0 || inputValue == "") {
			tempValue = startAt + factor;
		}

		tempValue = Number(tempValue - factor);
		if (tempValue < 0) {
			tempValue = startAt;
		}
		tempValue = getTwoDecimal(tempValue);
		setInputValue(tempValue);
		callback(tempValue, id);
	};

	const handleInputChange = (e) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		callback(newValue, id);
	};

	// useEffect(() => {
	//     callback(inputValue, id);
	// }, [inputValue])

	return (
		<Grid
			container
			direction="column"
			justifyContent="space-between"
			alignItems="center"
			spacing={1}
			className={classes.gridContainer}
		>
			<Grid item xs={12}>
				<div className={classes.inputWrapper}>
					<TextField
						value={inputValue}
						name={"diagId" + id}
						type="number"
						onChange={(e) => handleInputChange(e)}
						InputProps={{
							"aria-label": "description",
							disableUnderline: true,
							endAdornment: (
								<IconButton
									className={classes.iconButtonLeft}
									size="small"
									color="secondary"
									aria-label="increase"
									onClick={(e) => handleClickIncrease(e)}
								>
									<AddIcon className={classes.icon} />
								</IconButton>
							),
							startAdornment: (
								<IconButton
									className={classes.iconButtonRight}
									size="small"
									color="primary"
									aria-label="decrease"
									onClick={(e) => handleClickDecrease(e)}
								>
									<RemoveIcon className={classes.icon} />
								</IconButton>
							),
						}}
						classes={{ root: clsx(classes.inputStyle) }}
					/>
				</div>
			</Grid>
		</Grid>
	);
};

export default NumberInputField;
