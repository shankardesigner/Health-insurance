import { Grid, Tabs, Tab, Table, makeStyles } from "@material-ui/core";
import {
	selectModalId,
	selectStopLossPremium,
} from "@slices/stopLoss/selectors";
import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputTextElement from "../InputElement";
import StopLossPanel from "../stopLossPanel";
import TabPanel from "../TabUtils";
import { a11yProps } from "../TabUtils/tabProps";
import _debounce from "lodash/debounce";
import { savePremium } from "@slices/stopLoss/";
import styles from "../TabUtils/tabs.module.scss";
import { extractValue, handleStopLossTabInputChange } from "../utils";
import { updateTabEdited } from "@slices/tabModelSlice";

const useStyles = makeStyles((theme) => ({
	tabStyle: {
		margin: "8px 20px",
		padding: "15px",
	},
}));

const StopLossPremium = ({ tabIndex }) => {
	const modelId = useSelector(selectModalId);
	const classes = useStyles();
	const selectPremium = useSelector(selectStopLossPremium);
	const dispatch = useDispatch();
	const [tabValue, setTabValue] = useState(0);
	const [categoryType, setCategoryType] = useState("all");

	const [timeSpend, setTimeSpend] = useState({
		categoryType: "all",
		pmpm: "",
		modelId: 0,
		totalPremium: "",
		netExpense: "",
		serviceCategory: "all",
	});

	const dispatchPremium = (payload) => {
		dispatch(savePremium(Array.isArray(payload) ? payload : [payload]));
	};

	const debounceFn = useCallback(
		_debounce((payload) => dispatchPremium(payload), 500),
		[]
	);

	const handleTimeSpendChange = (event) => {
		dispatch(updateTabEdited(tabIndex));

		const target = event.target;
		let pattern = /^\d+\.?\d*$/;
		if (isNaN(Number(target.value))) return;
		if (!pattern.test(Number(target.value))) return;

		setTimeSpend({
			...timeSpend,
			modelId,
			[target.name]: target.value,
		});

		debounceFn({
			...timeSpend,
			[target.name]: target.value,
		});
	};

	const [allPremium, setAllPremium] = useState([]);
	const handleServiceCategoryChange = (event) => {
		handleStopLossTabInputChange(
			event,
			allPremium,
			setAllPremium,
			debounceFn,
			categoryType,
			modelId
		);
		dispatch(updateTabEdited(tabIndex));
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleCategoryChange = (category) => {
		setCategoryType(category);
	};

	useEffect(() => {
		if (selectPremium) {
			const newPremium = [...selectPremium].filter(
				(item) => item.categoryType === "service"
			);
			setAllPremium(newPremium);
			setTimeSpend(
				[...selectPremium].filter((item) => item.categoryType === "all")[0] ||
					{}
			);
		}
	}, [selectPremium]);

	return (
		<StopLossPanel title="Stop Loss Premium">
			<Tabs
				onChange={handleTabChange}
				value={tabValue}
				aria-label="stop-loss-tab"
				classes={{
					indicator: styles.indicator,
					root: styles.root,
					flexContainer: styles.customFlexContainer,
					scrollButtons: styles.scrollButtons,
				}}
			>
				<Tab
					label="Time Spend"
					value={0}
					{...a11yProps(0)}
					onClick={() => handleCategoryChange("all")}
					classes={{
						root: styles.tabRoot,
						selected: styles.selected,
					}}
				/>
				<Tab
					label="Service Category"
					value={1}
					{...a11yProps(1)}
					onClick={() => handleCategoryChange("service")}
					classes={{
						root: styles.tabRoot,
						selected: styles.selected,
					}}
				/>
			</Tabs>
			<TabPanel index={0} value={tabValue}>
				<Grid container item direction="row" spacing={3} xs={10}>
					<Grid item xs={4}>
						<InputTextElement
							title="PMPM"
							value={timeSpend.pmpm}
							onChange={handleTimeSpendChange}
							name="pmpm"
						/>
					</Grid>
					<Grid item xs={4}>
						<InputTextElement
							title="Total Premium"
							value={timeSpend.totalPremium}
							onChange={handleTimeSpendChange}
							name="totalPremium"
						/>
					</Grid>
					<Grid item xs={4}>
						<InputTextElement
							title="Net Expense"
							value={timeSpend.netExpense}
							onChange={handleTimeSpendChange}
							name="netExpense"
						/>
					</Grid>
				</Grid>
			</TabPanel>
			<TabPanel index={1} value={tabValue}>
				<Grid container item direction="row" spacing={3} xs={10}>
					<Table className={classes.tabStyle}>
						<thead>
							<tr>
								<th></th>
								<td>PMPM</td>
								<td>Total Premium</td>
								<td>Net Expenses</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>IP Only</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOnly", "pmpm", allPremium)}
										onChange={handleServiceCategoryChange}
										name="ipOnly_pmpm"
										placeholder="PMPM"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOnly", "totalPremium", allPremium)}
										onChange={handleServiceCategoryChange}
										name="ipOnly_totalPremium"
										placeholder="Total Premium"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOnly", "netExpense", allPremium)}
										onChange={handleServiceCategoryChange}
										name="ipOnly_netExpense"
										placeholder="Net Expense"
									/>
								</td>
							</tr>
							<tr>
								<td>IP + OP</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOp", "pmpm", allPremium)}
										onChange={handleServiceCategoryChange}
										name="ipOp_pmpm"
										placeholder="PMPM"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOp", "totalPremium", allPremium)}
										onChange={handleServiceCategoryChange}
										name="ipOp_totalPremium"
										placeholder="Total Premium"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOp", "netExpense", allPremium)}
										onChange={handleServiceCategoryChange}
										name="ipOp_netExpense"
										placeholder="Net Expense"
									/>
								</td>
							</tr>
							<tr>
								<td>Professional</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("professional", "pmpm", allPremium)}
										onChange={handleServiceCategoryChange}
										name="professional_pmpm"
										placeholder="PMPM"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue(
											"professional",
											"totalPremium",
											allPremium
										)}
										onChange={handleServiceCategoryChange}
										name="professional_totalPremium"
										placeholder="Total Premium"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue(
											"professional",
											"netExpense",
											allPremium
										)}
										onChange={handleServiceCategoryChange}
										name="professional_netExpense"
										placeholder="Net Expense"
									/>
								</td>
							</tr>
						</tbody>
					</Table>
				</Grid>
			</TabPanel>
		</StopLossPanel>
	);
};

export default StopLossPremium;
