import React from "react";

import { FormControl, makeStyles, OutlinedInput } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		font: "400 16px/21px Roboto, Arial, Helvetica, sans-serif",
		display: "block",
		margin: "0 0 10px",
	},
	label: {
		font: "400 14px/18px Roboto, Arial, Helvetica, sans-serif",
		marginBottom: "8px",
		color: "#4D5154",
		display: "block",
	},
	input: {
		font: "400 12px/16px Roboto, Arial, Helvetica, sans-serif",
		width: "100%",

		"& input": {
			padding: "10px",
		},
	},
}));

const InputTextElement = ({
	title,
	value,
	onChange,
	disabled = false,
	fullWidth = false,
	placeholder,
	...props
}) => {
	const classes = useStyles();
	const id =
		"nemo-input-" + title.replace(/ +/g, "").toLowerCase() || Math.random();
	const [inputError, setInputError] = React.useState(false);

	const onChangeGuard = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		if (
			(name.includes("coinsurance") ||
				name.includes("populationCredibility")) &&
			value > 100
		) {
			setInputError(true);
		} else {
			setInputError(false);
			onChange(event);
		}
	};

	return (
		<FormControl className={classes.root}>
			<label htmlFor={id} className={classes.label}>
				{title}
			</label>
			<OutlinedInput
				className={classes.input}
				type="text"
				id={id}
				value={value || ""}
				onChange={onChangeGuard}
				placeholder={placeholder || title}
				fullWidth={fullWidth}
				autoComplete="false"
				{...props}
				style={
					{
						// borderColor: inputError ? "red" : "black"
					}
				}
			/>
			{inputError && (
				<span style={{ color: "red", fontSize: "12px" }}>
					Please enter a value less than 100
				</span>
			)}
		</FormControl>
	);
};

export default InputTextElement;
