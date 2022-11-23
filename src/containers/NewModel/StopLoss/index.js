import React, { useEffect } from "react";

import { Box, Button, Divider, Grid } from "@material-ui/core";
import styles from "./stoploss.module.scss";

import Aggregate from "./Aggregate";
import Specific from "./Specific";
import PopulationCredibility from "./PopulationCredibility";
import StopLossPremium from "./StopLossPremium";
import { useDispatch, useSelector } from "react-redux";

import { getStopLoss } from "@slices/stopLoss";
import SummaryTable from "./summaryTable";
import { setTabStateAction } from "@slices/tabModelSlice";
import ModelResultBox from "@containers/ModelResultBox";

const StopLoss = ({ onChange, index, tabIndex, ...props }) => {
	const dispatch = useDispatch();
	const selectTabState = useSelector((state) => state.tabModel.tabState);

	const handleButtonClick = (order = "next") => {
		if (order === "next") {
			const nextTab = document.getElementById(`nemo-tab-${index + 1}`);
			nextTab.click();
			// dispatch(setTabStateAction(index + 1));
			// onChange(index + 1);
			// return <ModelResultBox next='nemo-tab-3' />
		} else {
			const nextTab = document.getElementById(`nemo-tab-${index - 1}`);
			nextTab.click();
			// dispatch(setTabStateAction(index));
			// onChange(index - 1);
			// return <ModelResultBox next='nemo-tab-2' />
		}
	};

	useEffect(() => {
		dispatch(getStopLoss());
	}, []);

	return (
		<div className={styles.nemoStoplossContainer}>
			<Grid container spacing={4}>
				<Grid item xs={6} className={styles.inputHolder}>
					<h4 className={styles.heading}>Stop Loss Modeling Input</h4>
					<Aggregate tabIndex={tabIndex} />
					<Specific tabIndex={tabIndex} />
					<PopulationCredibility tabIndex={tabIndex} />
					<StopLossPremium tabIndex={tabIndex} />
				</Grid>
				<Grid item xs={6}>
					<div className={styles.resultsArea}>
						<h4 className={styles.heading}>Stop Loss Results Summary</h4>
						<SummaryTable />
					</div>
				</Grid>
			</Grid>
			<Box component="div" sx={{ visibility: "hidden" }}>
				<ModelResultBox next="nemo-tab-2" displayButton={false} />
			</Box>
		</div>
	);
};

export default StopLoss;
