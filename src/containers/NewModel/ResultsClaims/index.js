import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useRouter } from "next/router";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Skeleton from "react-loading-skeleton";

import ModelResultBox from "../../ModelResultBox";
import BoxWithToggle from "@components/BoxWithToggle";
import TableComponent from "@components/TableComponent";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import { useState } from "react";

import styles from "./resultsclaims.module.scss";
import "react-circular-progressbar/dist/styles.css";

/* redux part */
import {
	listAction,
	resultsClaimsModelState,
	resetStoreFactorAction,
} from "@slices/resultsClaimsSlice";

import { resetWhatIfFetchAction } from "@slices/whatIfSlice";

import { riskModelerState } from "@slices/riskModelerSlice";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import NemoTable from "src/shared/NemoTable";
import { clientModelState } from "@slices/clientModelSlice";

const useStyles = makeStyles((theme) => ({
	search: {
		[theme.breakpoints.down("sm")]: {
			paddingBottom: "10px",
		},
	},
	actionButton: {
		marginRight: "5px",
		borderRadius: "20px",
		border: "1px solid #000000",
	},
	compareButton: {
		marginTop: "20px",
		borderRadius: "20px",
		border: "1px solid #000000",
		padding: "5px 60px",
	},
}));

export default function ResultsClaims() {
	const classes = useStyles();
	const router = useRouter();

	const dispatch = useDispatch();

	const { savedModel, savings, calculateSavingResStatus } =
		useSelector(riskModelerState);
	const [isDataAvailable, setIsDataAvailable] = useState(false);
	const [displayGraph, setDisplayGraph] = useState(false);
	const [total, setTotal] = useState({});
	const [percentageSaving, setPercentageSavings] = useState();
	const [pieChartData, setPieChartData] = useState();
	const [tableKey, setTableKey] = useState(1);

	useEffect(() => {
		// reset data that was fetched for waht if section (need to be changed the placement of it if it gets moved into tab)
		// dispatch(resetWhatIfFetchAction());
		dispatch(resetStoreFactorAction());
	}, []);

	const { resultsClaimsModelList, resultsClaimsModelListReqStatus, resStatus } =
		useSelector(resultsClaimsModelState);

	useEffect(() => {
		if (
			(resultsClaimsModelListReqStatus === SUCCESS ||
				resultsClaimsModelListReqStatus === PENDING) &&
			calculateSavingResStatus === SUCCESS
		) {
			//
			if (savedModel.modelId) {
				let payload = {
					modelId: savedModel.modelId,
					clientId: savedModel.clientId,
					loa1Id: savedModel.loa1Id,
				};
				dispatch(listAction(payload));
			}
		}
	}, [resultsClaimsModelListReqStatus, calculateSavingResStatus]);
	// }, [resultsClaimsModelListReqStatus, calculateSavingResStatus])

	useEffect(() => {
		if (resultsClaimsModelList) {
			setIsDataAvailable(true);
			setTableKey(new Date().getTime());
		} else {
			setIsDataAvailable(false);
			setTableKey(new Date().getTime());
		}
	}, [resultsClaimsModelList]);

	const handleChange = (event) => {
		setClient(event.target.value);
	};

	const handleNemoFactorPresetChange = (event) => {
		setNemoFactorPreset(event.target.value);
	};

	const columns = [
		{ name: "", component: "TextComponent", sourceKey: "serviceCategoryName" },
		{
			name: "Budget",
			component: "CurrencyComponent",
			sourceKey: "pmPm",
			attributes: { decimalCount: 2 },
		},
		{
			name: "Actual",
			component: "CurrencyComponent",
			sourceKey: "pmPmBenchMark",
			attributes: { decimalCount: 2 },
		},
		{
			name: "Proj.",
			component: "CurrencyComponent",
			sourceKey: "pmPmProjected",
			attributes: { decimalCount: 2 },
		},
		{
			name: "Savings",
			component: "CurrencyComponent",
			sourceKey: "pmPmSavings",
			attributes: { decimalCount: 2 },
		},
		{ name: "", component: "TextComponent", sourceKey: "ACTION" }, // for edit and results action
	];

	const actions = [
		{
			name: "Edit",
			icon: "/edit-icon.svg",
			component: "RouteComponent",
			data: {
				href: "/reporting/resultsclaims",
				params: [
					"clientId",
					"loa1Id",
					"loa2Id",
					"loa3Id",
					"loa4Id",
					"loa5Id",
					"loa6Id",
					"serviceCategoryId",
					"serviceCategoryName",
					"modelId",
				],
			},
		},
	];

	const handleWhatIfClick = () => {
		router.push("/reporting/whatif");
	};

	const handleCompareImpactClick = () => {
		router.push("/reporting/compareimpact");
	};

	useEffect(() => {
		if (savedModel) {
			setPieChartData(savedModel?.ipaAlloc * savedModel?.premium);
		}
	}, [savedModel]);

	useEffect(() => {
		if (Object.keys(total).length > 0) {
			// const total = total['pmPmBenchMark'];
			/* get pmpmTotalSavings */
			const netSavingsData = savings.filter((saving, index) => {
				return saving.amountTypeId === "TOTAL_SAVINGS";
			});
			const pmPm = netSavingsData[0].pmPm;
			const pmPmBenchmark = total["pmPmBenchMark"];
			if (pmPmBenchmark > pmPm) {
				const calculatedPercentageSavings = Number(
					(pmPm / total["pmPmBenchMark"]) * 100
				).toFixed(0);
				setPercentageSavings(calculatedPercentageSavings);
				setDisplayGraph(true);
			}
		}
	}, [total]);

	return (
		<Box p={3}>
			<Grid container spacing={3}>
				<Grid item xs={9}>
					{/* table component */}
					{calculateSavingResStatus === REQUEST && (
						<Skeleton count={4} height={50} />
					)}
					{!isDataAvailable && resStatus !== PENDING && "Data not available"}
					{calculateSavingResStatus === SUCCESS && isDataAvailable && (
						<TableComponent
							headers={columns}
							heightFix
							data={resultsClaimsModelList}
							actions={actions}
							sticky
							sideColumned
							key={tableKey}
							options={{
								displayPagination: false,
								total: {
									display: true,
									columns: [
										"pmPm",
										"pmPmBenchMark",
										"pmPmProjected",
										"pmPmSavings",
									],
								},
							}}
							getCalculatedTotal={setTotal}
						/>
					)}
				</Grid>
				<Grid item xs={3}>
					{displayGraph && percentageSaving > 0 && (
						<>
							{/* circle */}
							{calculateSavingResStatus === SUCCESS ? (
								<div className={styles.pieChartHolder}>
									<CircularProgressbar
										value={percentageSaving}
										strokeWidth={15}
										text={`$${Number(pieChartData).toFixed(0)}`}
										styles={buildStyles({
											pathColor: `rgba(90, 44, 109, 1)`,
											trailColor: `rgba(220, 220, 220, 1)`,
											textColor: `#333`,
											textSize: 14,
										})}
									/>
									<span className={styles.percentage}>
										<span className={styles.percentageText}>
											{percentageSaving}%{" "}
										</span>
										Savings{" "}
									</span>
								</div>
							) : (
								<div className={styles.pieChartHolder}>
									<div
										style={{
											borderRadius: `100%`,
											overflow: `hidden`,
										}}
									>
										<Skeleton count={1} height={130} />
									</div>
								</div>
							)}
						</>
					)}
				</Grid>
			</Grid>
			<ModelResultBox next="nemo-tab-6" displayButton={false} />
		</Box>
	);
}
