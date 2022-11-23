import { Grid, makeStyles } from "@material-ui/core";
import { savePopulationCredibility } from "@slices/stopLoss";
import {
	selectModalId,
	selectStopLossPopulationCredibility,
} from "@slices/stopLoss/selectors";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputTextElement from "../InputElement";
import StopLossPanel from "../stopLossPanel";
import _debounce from "lodash/debounce";
import { updateTabEdited } from "@slices/tabModelSlice";

const useStyles = makeStyles((theme) => ({
	marginStyle: {
		marginBottom: "8px",
	},
}));

const PopulationCredibility = ({ tabIndex }) => {
	const classes = useStyles();
	const [populationCredibility, setPopulationCredibility] = useState("");
	const dispatch = useDispatch();
	const modelId = useSelector(selectModalId);
	const populationCredibilityValue = useSelector(
		selectStopLossPopulationCredibility
	);

	const dispatchPC = (payload) => {
		dispatch(savePopulationCredibility(payload));
	};

	const debounceFn = useCallback(
		_debounce((payload) => dispatchPC(payload), 500),
		[]
	);

	const handleChange = (event) => {
		dispatch(updateTabEdited(tabIndex));

		if (!RegExp("^[0-9]*$").test(event.target.value)) return;
		debounceFn({
			modelId,
			populationCredibility: event.target.value,
		});
		setPopulationCredibility(event.target.value);
	};

	useEffect(() => {
		if (populationCredibilityValue) {
			setPopulationCredibility(
				populationCredibilityValue.populationCredibility
			);
		}
	}, [populationCredibilityValue]);

	return (
		<StopLossPanel title="Population Credibility" extraStyle={false}>
			<Grid
				container
				item
				direction="row"
				spacing={3}
				xs={8}
				className={classes.marginStyle}
			>
				<Grid item xs={5}>
					<InputTextElement
						title=""
						value={populationCredibility}
						name="populationCredibility"
						onChange={handleChange}
						fullWidth={true}
						placeholder="15%"
					/>
				</Grid>
			</Grid>
		</StopLossPanel>
	);
};

export default PopulationCredibility;
