import {
	Divider,
	Grid,
	makeStyles,
	Tab,
	Table,
	Tabs,
	withStyles,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputTextElement from "../InputElement";
import StopLossPanel from "../stopLossPanel";
import TabPanel from "../TabUtils";
import { a11yProps } from "../TabUtils/tabProps";
import styles from "../TabUtils/tabs.module.scss";
import { extractValue, handleStopLossTabInputChange } from "../utils";
import _debounce from "lodash/debounce";
import {
	selectModalId,
	selectStopLossSpecific,
} from "@slices/stopLoss/selectors";
import { saveSpecific } from "@slices/stopLoss";
import { updateTabEdited } from "@slices/tabModelSlice";

const useStyles = makeStyles((theme) => ({
	dividerStyle: {
		marginTop: "20px",
		marginBottom: "20px",
	},
	tableStyle: {
		margin: "8px 20px",
	},
}));

const Specific = ({ tabIndex }) => {
	const modelId = useSelector(selectModalId);
	const classes = useStyles();
	const dispatch = useDispatch();

	const [tabValue, setTabValue] = useState(0);
	const [categoryType, setCategoryType] = useState("all");
	const selectSpecific = useSelector(selectStopLossSpecific);
	const [premiumVal, setPremiumVal] = useState();
	const [ipPremiumVal, setIpPremiumVal] = useState();
	const [ipOpPremiumVal, setIpOpPremiumVal] = useState();

	const [professionalPremiumVal, setProfessionalPremiumVal] = useState();

	const [allExpenses, setAllExpenses] = useState({
		categoryType: "all",
		deductible: "",
		modelId: "",
		coinsurance: "",
		serviceCategory: "all",
	});

	const [allSpecific, setAllSpecific] = useState([]);

	const dispatchSpecific = (payload) => {
		dispatch(saveSpecific(Array.isArray(payload) ? payload : [payload]));
	};

	const debounceFn = useCallback(
		_debounce((payload) => dispatchSpecific(payload), 500),
		[]
	);

	const handleAllSpecificChange = (event) => {
		dispatch(updateTabEdited(tabIndex));

		const target = event.target;
		if (!RegExp("^[0-9]*$").test(target.value)) return;

		setAllExpenses({
			...allExpenses,
			modelId,
			[target.name]: target.value,
		});

		debounceFn({
			...allExpenses,
			[target.name]: target.value,
		});
	};

	const handleServiceCategoryChange = (event) => {
		handleStopLossTabInputChange(
			event,
			allSpecific,
			setAllSpecific,
			debounceFn,
			categoryType,
			modelId
		);
		dispatch(updateTabEdited(tabIndex));
	};

	const handlePremiumChange = (event) => {
		const target = event.target;

		let pattern = /^\d+\.?\d*$/;

		if (isNaN(Number(target.value))) return;
		if (!pattern.test(Number(target.value))) return;

		if (event.target.name == "premium") {
			setPremiumVal(event.target.value);
		}
		if (event.target.name == "ip_Premium") {
			setIpPremiumVal(event.target.value);
		}
		if (event.target.name == "ip_op_premium") {
			setIpOpPremiumVal(event.target.value);
		}
		if (event.target.name == "pro_premium") {
			setProfessionalPremiumVal(event.target.value);
		}
	};

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleCategoryChange = (category) => {
		setCategoryType(category);
	};

	useEffect(() => {
		if (selectSpecific) {
			const newSpecific = [...selectSpecific].filter(
				(item) => item.categoryType === "service"
			);
			setAllSpecific(newSpecific);
			setAllExpenses(
				[...selectSpecific].filter((item) => item.categoryType === "all")[0] ||
					{}
			);
		}
	}, [selectSpecific]);

	return (
		<StopLossPanel title="Specific">
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
					label="Item One"
					label="All Expenses"
					value={0}
					{...a11yProps(0)}
					classes={{
						root: styles.tabRoot,
						selected: styles.selected,
					}}
					onClick={() => handleCategoryChange("all")}
				/>
				<Tab
					label="Item Two"
					label="Service Category"
					value={1}
					{...a11yProps(1)}
					classes={{
						root: styles.tabRoot,
						selected: styles.selected,
					}}
					onClick={() => handleCategoryChange("service")}
				/>
			</Tabs>
			<TabPanel index={0} value={tabValue}>
				<Grid container item direction="row" spacing={3} xs={10}>
					<Grid item xs={4}>
						<InputTextElement
							title="Deductible"
							value={allExpenses.deductible || ""}
							name="deductible"
							onChange={handleAllSpecificChange}
							fullWidth={true}
						/>
					</Grid>
					<Grid item xs={4}>
						<InputTextElement
							title="Coinsurance %"
							value={allExpenses.coinsurance || ""}
							name="coinsurance"
							onChange={handleAllSpecificChange}
							fullWidth={true}
						/>
					</Grid>
					<Grid item xs={4}>
						<InputTextElement
							number
							title="Premium "
							value={premiumVal}
							name="premium"
							onChange={handlePremiumChange}
							fullWidth={true}
						/>
					</Grid>
				</Grid>
				<Divider className={classes.dividerStyle} />
			</TabPanel>
			<TabPanel index={1} value={tabValue}>
				<Grid container item direction="row" spacing={3} xs={10}>
					<Table className={classes.tableStyle}>
						<thead>
							<tr>
								<th></th>
								<td>Deductible</td>
								<td>Coinsurance %</td>
								<td>Premium</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>IP Only</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOnly", "deductible", allSpecific)}
										onChange={handleServiceCategoryChange}
										name="ipOnly_deductible"
										placeholder="Deductible"
									/>
								</td>

								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOnly", "coinsurance", allSpecific)}
										onChange={handleServiceCategoryChange}
										name="ipOnly_coinsurance"
										placeholder="Coinsurance"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={ipPremiumVal}
										onChange={handlePremiumChange}
										name="ip_Premium"
										placeholder="Premium"
									/>
								</td>
							</tr>
							<tr>
								<td>IP + OP</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOp", "deductible", allSpecific)}
										onChange={handleServiceCategoryChange}
										name="ipOp_deductible"
										placeholder="Deductible"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue("ipOp", "coinsurance", allSpecific)}
										onChange={handleServiceCategoryChange}
										name="ipOp_coinsurance"
										placeholder="Coinsurance"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={ipOpPremiumVal}
										onChange={handlePremiumChange}
										name="ip_op_premium"
										placeholder="Premium"
									/>
								</td>
							</tr>
							<tr>
								<td>Professional</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue(
											"professional",
											"deductible",
											allSpecific
										)}
										onChange={handleServiceCategoryChange}
										name="professional_deductible"
										placeholder="Deductible"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={extractValue(
											"professional",
											"coinsurance",
											allSpecific
										)}
										onChange={handleServiceCategoryChange}
										name="professional_coinsurance"
										placeholder="Coinsurance"
									/>
								</td>
								<td>
									<InputTextElement
										title=""
										value={professionalPremiumVal}
										onChange={handlePremiumChange}
										name="pro_premium"
										placeholder="Premium"
									/>
								</td>
							</tr>
						</tbody>
					</Table>
				</Grid>
				<Divider className={classes.dividerStyle}></Divider>
			</TabPanel>
		</StopLossPanel>
	);
};

export default Specific;
