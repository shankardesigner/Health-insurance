import { Grid, makeStyles } from "@material-ui/core";
import {
	selectModalId,
	selectStopLossAggregate,
} from "@slices/stopLoss/selectors";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputTextElement from "../InputElement";
import StopLossPanel from "../stopLossPanel";
import { resetStopLoss, saveAggregate } from "@slices/stopLoss";
import { getStopLoss } from "@slices/stopLoss";

import _debounce from "lodash/debounce";
import { updateTabEdited } from "@slices/tabModelSlice";

const useStyles = makeStyles({
	note: {
		font: "normal 12px/16px Roboto, sans-serif",
		color: "#C4C4C4",
		display: "block",
		marginBottom: "21px",
	},
});

const Aggregate = ({ tabIndex }) => {
	const classes = useStyles();

	const [aggregate, setAggregate] = useState({
		deductible: "",
		coinsurance: "",
	});

	const aggregateValue = useSelector(selectStopLossAggregate);

	console.log("aggregateValue", aggregateValue);

	const [premiumVal, setPremiumVal] = useState();
	const modelId = useSelector(selectModalId);
	const dispatch = useDispatch();

	function handleDebounceFn(payload) {
		dispatch(saveAggregate(payload));
	}

	const debounceFn = useCallback(
		_debounce((payload) => handleDebounceFn(payload), 500),
		[]
	);

	const handleChange = (event) => {
		dispatch(updateTabEdited(tabIndex));

		const target = event.target;
		let name = target.name.split("_")[1];
		if (!RegExp("^[0-9]*$").test(target.value)) return;

		debounceFn({
			...aggregate,
			modelId,
			[name]: target.value,
		});

		setAggregate({
			...aggregate,
			[name]: target.value,
		});
	};

	const handlePremiumChange = (event) => {
		const target = event.target;
		let pattern = /^\d+\.?\d*$/;
		if (isNaN(Number(target.value))) return;
		if (!pattern.test(Number(target.value))) return;

		setPremiumVal(event.target.value);
	};

	useEffect(() => {
		if (aggregateValue) {
			setAggregate({
				deductible: aggregateValue.deductible,
				coinsurance: aggregateValue.coinsurance,
			});
		} else if (!aggregateValue) {
			setAggregate({
				deductible: "",
				coinsurance: "",
			});
		}
	}, [aggregateValue]);

	useEffect(() => {
		if (aggregateValue) {
			setAggregate({
				...aggregate,
				coinsurance: aggregateValue.coinsurance,
				deductible: aggregateValue.deductible,
			});
		} else if (!aggregateValue) {
			setAggregate({
				deductible: "",
				coinsurance: "",
			});
		}
	}, [aggregateValue]);

	return (
		<StopLossPanel title="Aggregate">
			<Grid container item direction="row" spacing={3} xs={10}>
				<Grid item xs={4}>
					<InputTextElement
						title="Deductible"
						value={aggregate.deductible}
						name="aggregate_deductible"
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={4}>
					<InputTextElement
						title="Coinsurance %"
						value={aggregate.coinsurance}
						onChange={handleChange}
						name="aggregate_coinsurance"
					/>
				</Grid>
				<Grid item xs={4}>
					<InputTextElement
						title="Premium "
						value={premiumVal}
						onChange={handlePremiumChange}
						name="aggregate_premium"
					/>
				</Grid>
			</Grid>
			<em className={classes.note}>
				Annual expenses per member in contract year
			</em>
		</StopLossPanel>
	);
};

export default Aggregate;
