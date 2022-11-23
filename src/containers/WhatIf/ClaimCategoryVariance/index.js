import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

/* table */
import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { debounce } from "lodash";

import ModelResultBox from "../../ModelResultBox";
import SearchBoxAuto from "@components/SearchBoxAuto";
import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
import NumberInputField from "@components/NemoInputField";
import LinearProgressBar from "@components/LinearProgressBar";
import Skeleton from "react-loading-skeleton";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import styles from "./claimcategoryvariance.module.css";

/* redux part */
import {
	getClaimCategoryAction,
	findClaimCategoryByNameAction,
	addNewClaimCategoriesAction,
	deleteClaimCategoryAction,
	whatIfModelState,
} from "@slices/whatIfSlice";

import { clientModelState } from "@slices/clientModelSlice";

import { riskModelerState } from "@slices/riskModelerSlice";

import { storeServiceCategoryFactorAction } from "@slices/resultsClaimsSlice";

import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "@components/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
	table: {
		minWidth: 650,
	},
	darkBackground: {
		background: "rgba(239, 239, 240, 0.5)",
	},
	topBorderRadius: {
		borderTopLeftRadius: "10px",
		borderTopRightRadius: "10px",
	},
	bottomBorderRadius: {
		borderBottomLeftRadius: "10px",
		borderBottomRightRadius: "10px",
	},
	lightGreenBackground: {
		background: "rgba(236, 252, 247, 0.5)",
	},
	inputStyle: {
		background: "#EFEFF0",
		borderRadius: "7px",
		paddingLeft: "10px",
		width: "100px",
	},
	icon: {
		color: "#fff",
	},
	inputWrapper: {
		paddingTop: "5px",
	},
	inputTableCell: {
		width: "230px",
	},
	newModelButton: {
		background: "#42DEB4",
		borderRadius: "100px",
		height: "47px",
		lineHeight: "1",
		color: "#ffffff",
		border: "unset",
		"&:hover": {
			background: "#42DEB4",
			border: "1px solid " + theme.palette.secondary.color,
		},
		width: "100%",
		fontSize: "18px",
		position: "relative",
	},
}));

const TableCell = withStyles((theme) => ({
	root: {
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
		[theme.breakpoints.up("md")]: {
			maxWidth: "30px",
		},
		[theme.breakpoints.down("md")]: {
			maxWidth: "150px",
		},
	},
}))(MuiTableCell);

const TableCellInput = withStyles({
	root: {
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
		width: "200px",
	},
})(MuiTableCell);

const TableCellAction = withStyles({
	root: {
		minWidth: "65px",
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "14px",
		color: "#3D3E64",
		padding: "0 !important",
		lineHeight: "unset",
	},
})(MuiTableCell);

export default function ClaimCategoryVariance() {
	const classes = useStyles();
	const router = useRouter();

	const dispatch = useDispatch();

	const {
		claimsCategory,
		claimsCategorySearchData,
		claimsCategoryFetch,
		resStatus,
	} = useSelector(whatIfModelState);
	const { modelInfo } = useSelector(clientModelState);
	const { savedModel } = useSelector(riskModelerState);

	const [initialClaimsData, setInitialClaimsData] = useState();
	const [newClaimCategories, setNewClaimCategories] = useState([]);
	const [autocompleteInput, setAutocompleteInput] = useState();
	const [showAddBtn, setShowAddBtn] = useState(false);
	const [tableKey, setTableKey] = useState(0);
	const [searchKey, setSearchKey] = useState(0);

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedData, setSelectedData] = useState(null);

	useEffect(() => {
		const { clientId, loa1Id, loa2Id, loa3Id, loa4Id, loa5Id, loa6Id } =
			modelInfo;

		let payload = {
			clientId: clientId,
			loa1Id: loa1Id,
			modelId: savedModel.modelId,
		};

		if (loa2Id && loa2Id != "ALL") {
			payload.loa2Id = loa2Id;
		}
		if (loa3Id && loa3Id != "ALL") {
			payload.loa3Id = loa3Id;
		}
		if (loa4Id && loa4Id != "ALL") {
			payload.loa4Id = loa4Id;
		}
		if (loa5Id && loa5Id != "ALL") {
			payload.loa5Id = loa5Id;
		}
		if (loa6Id && loa6Id != "ALL") {
			payload.loa6Id = loa6Id;
		}

		dispatch(getClaimCategoryAction(payload));
	}, []);

	useEffect(() => {
		if (autocompleteInput) {
			const { clientId, loa1Id, loa2Id, loa3Id, loa4Id, loa5Id, loa6Id } =
				modelInfo;

			let payload = {
				clientId: clientId,
				loa1Id: loa1Id,
				name: autocompleteInput,
				modelId: savedModel.modelId,
			};

			if (loa2Id && loa2Id != "ALL") {
				payload.loa2Id = loa2Id;
			}
			if (loa3Id && loa3Id != "ALL") {
				payload.loa3Id = loa3Id;
			}
			if (loa4Id && loa4Id != "ALL") {
				payload.loa4Id = loa4Id;
			}
			if (loa5Id && loa5Id != "ALL") {
				payload.loa5Id = loa5Id;
			}
			if (loa6Id && loa6Id != "ALL") {
				payload.loa6Id = loa6Id;
			}

			dispatch(findClaimCategoryByNameAction(payload));
		}
	}, [autocompleteInput]);

	useEffect(() => {
		if (newClaimCategories.length) {
			setShowAddBtn(true);
		} else {
			setShowAddBtn(false);
		}
	}, [newClaimCategories]);

	const getResults = (data) => {
		const { pmpm, unitsPerK, cost, util } = data;
		const percentagePmpmChange = (pmpm * cost) / 100;
		let resultPmpm = 0;
		if (cost < 0) {
			resultPmpm = pmpm - percentagePmpmChange;
		} else {
			resultPmpm = pmpm + percentagePmpmChange;
		}

		/* calculate resultTotal */
		const percentageUtilchange = (unitsPerK * util) / 100;
		let resultUnitsPerK = 0;
		if (util < 0) {
			resultUnitsPerK = unitsPerK - percentageUtilchange;
		} else {
			resultUnitsPerK = unitsPerK + percentageUtilchange;
		}
		const resultTotal = (resultPmpm * resultUnitsPerK) / 12000;
		return { resultPmpm, resultTotal };
	};

	useEffect(() => {
		if (claimsCategory) {
			/* initialize data for table */
			let initialData = {};
			claimsCategory.map((claimdata, index) => {
				const uniqueId =
					claimdata.serviceCategory1Id + "~" + claimdata.serviceCategory2Id;
				/* calculate resultPmpm */
				const cost = claimdata.pmpmFactor || "";
				const util = claimdata.unitsPerKFactor || "";

				const { resultPmpm, resultTotal } = getResults({
					...claimdata,
					cost,
					util,
				});

				const rowData = {
					...claimdata,
					cost,
					util,
					resultPmpm,
					resultTotal,
				};
				initialData[uniqueId] = rowData;
			});
			setInitialClaimsData(initialData);
			setTableKey(new Date().getTime());
		}
	}, [claimsCategory]);

	const handleCostChange = (value, uniqueKey) => {
		const { resultPmpm, resultTotal } = getResults({
			...initialClaimsData[uniqueKey],
			cost: value,
		});
		const updatedRow = {
			...initialClaimsData[uniqueKey],
			cost: value,
			resultPmpm,
			resultTotal,
		};
		setInitialClaimsData({ ...initialClaimsData, [uniqueKey]: updatedRow });
	};

	const handleUtilChange = (value, uniqueKey) => {
		const { resultPmpm, resultTotal } = getResults({
			...initialClaimsData[uniqueKey],
			util: value,
		});
		const updatedRow = {
			...initialClaimsData[uniqueKey],
			util: value,
			resultPmpm,
			resultTotal,
		};
		setInitialClaimsData({ ...initialClaimsData, [uniqueKey]: updatedRow });
	};

	const debounceStoreClaimCategoryVariance = useRef(
		debounce((dataToUpload) => {
			/* prepare payload data */
			if (dataToUpload.length) {
				dispatch(storeServiceCategoryFactorAction(dataToUpload));
			}
		}, 1000)
	);

	useEffect(() => {
		if (savedModel.modelId && initialClaimsData) {
			let dataToUpload = Object.values(initialClaimsData).reduce((acc, val) => {
				const { serviceCategory2Id, cost, util } = val;
				if (cost !== "" || util !== "") {
					let payload = {
						modelId: savedModel.modelId,
						serviceCategoryId: serviceCategory2Id,
					};

					if (cost) {
						payload.pmPm = cost;
					}
					if (util) {
						payload.unitsPerK = util;
					}

					acc.push(payload);
				}
				return acc;
			}, []);
			debounceStoreClaimCategoryVariance.current(dataToUpload);
		}
	}, [initialClaimsData]);

	const addNewClaimCategories = () => {
		dispatch(addNewClaimCategoriesAction(newClaimCategories));
		setAutocompleteInput();
		setNewClaimCategories([]);
		setSearchKey(new Date().getTime());
	};

	const handleDelete = (data) => {
		setOpenDialog(true);
		setSelectedData({ ...data, modelId: savedModel.modelId });
	};

	const handleDeleteAction = () => {
		dispatch(deleteClaimCategoryAction(selectedData));
		setOpenDialog(false);
	};

	const getTotalResults = (claimsObject = {}) => {
		const results = {
			pmPmTotal: 0,
			resultTotal: 0,
		};
		Object.keys(claimsObject).forEach((key, index) => {
			const data = claimsObject[key];
			results.pmPmTotal = results.pmPmTotal + data.resultPmpm;
			results.resultTotal = results.resultTotal + data.resultTotal;
		});
		return results;
	};

	const totals = getTotalResults(initialClaimsData);

	if (
		resStatus == REQUEST ||
		!initialClaimsData ||
		Object.keys(initialClaimsData).length === 0
	) {
		// return <LinearProgressBar />
		return <Skeleton count={5} height={30} />;
	} else {
		return (
			<Box p={3}>
				<TableContainer className={styles.tableContainer}>
					<Table
						className={classes.table}
						aria-label="simple table"
						className={styles.table}
						key={tableKey}
					>
						<TableHead>
							<TableRow>
								<TableCell align="left"></TableCell>
								<TableCell
									align="left"
									classes={{
										root: clsx(
											classes.lightGreenBackground,
											classes.topBorderRadius
										),
									}}
									className={styles.tableHeaderTitle}
								>
									Cost(%)
								</TableCell>
								<TableCell
									align="left"
									classes={{
										root: clsx(classes.darkBackground, classes.topBorderRadius),
									}}
									className={styles.tableHeaderTitle}
								>
									Util(%)
								</TableCell>
								<TableCell
									align="left"
									classes={{
										root: clsx(
											classes.lightGreenBackground,
											classes.topBorderRadius
										),
									}}
									className={styles.tableHeaderTitle}
								>
									{" "}
									Result PMPM
								</TableCell>
								<TableCell align="left" className={styles.tableHeaderTitle}>
									Result Total
								</TableCell>
								<TableCell
									align="left"
									className={styles.tableHeaderTitle}
								></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{initialClaimsData &&
								Object.keys(initialClaimsData).length !== 0 &&
								Object.keys(initialClaimsData).map((uniqueKey, index) => {
									if (initialClaimsData[uniqueKey]) {
										const {
											cost,
											util,
											resultPmpm,
											resultTotal,
											serviceCategory1Name,
											serviceCategory2Name,
											showAsDefault,
											serviceCategory2Id,
										} = initialClaimsData[uniqueKey];

										return (
											<TableRow key={index}>
												<TableCell align="left">
													<Grid
														container
														direction="column"
														justifyContent="flex-start"
														alignItems="flex-start"
													>
														<Grid item>
															<span className={styles.rowHeaderSubTitle}>
																{serviceCategory1Name}
															</span>
														</Grid>
														<Grid item>
															<span className={styles.rowHeaderTitle}>
																{serviceCategory2Name}
															</span>
														</Grid>
													</Grid>
												</TableCell>
												<TableCellInput
													classes={{
														root: clsx(
															classes.lightGreenBackground,
															classes.bottomBorderRadius
														),
													}}
												>
													<NumberInputField
														value={cost}
														id={uniqueKey}
														callback={handleCostChange}
														type="decimal"
														start={0.1}
														factor={0.1}
													/>
												</TableCellInput>
												<TableCellInput
													classes={{
														root: clsx(
															classes.darkBackground,
															classes.bottomBorderRadius
														),
													}}
												>
													<NumberInputField
														value={util}
														id={uniqueKey}
														callback={handleUtilChange}
														type="decimal"
														start={0.1}
														factor={0.1}
													/>
												</TableCellInput>
												<TableCell
													classes={{
														root: clsx(
															classes.lightGreenBackground,
															classes.bottomBorderRadius
														),
													}}
												>
													<CurrencyComponent>{resultPmpm}</CurrencyComponent>
												</TableCell>
												<TableCell>
													<CurrencyComponent adaptiveColor={true}>
														{resultTotal}
													</CurrencyComponent>
												</TableCell>
												<TableCellAction>
													{!showAsDefault && (
														<IconButton
															color="primary"
															aria-label="upload picture"
															component="span"
															onClick={(e) =>
																handleDelete({
																	index,
																	serviceCategoryId: serviceCategory2Id,
																})
															}
														>
															<Icon>
																<img
																	src="/cross-icon-red.svg"
																	alt="delete icon"
																/>
															</Icon>
														</IconButton>
													)}
												</TableCellAction>
											</TableRow>
										);
									}
								})}
							<TableRow>
								<TableCell colSpan={3} align="left">
									<Grid
										container
										direction="column"
										justifyContent="flex-start"
										alignItems="flex-start"
									>
										<Grid item>
											<span className={styles.rowHeaderSubTitle2}>Total</span>
										</Grid>
									</Grid>
								</TableCell>
								<TableCell
									classes={{
										root: clsx(
											classes.lightGreenBackground,
											classes.bottomBorderRadius
										),
									}}
								>
									<CurrencyComponent>{totals.pmPmTotal}</CurrencyComponent>
								</TableCell>
								<TableCell
									classes={{
										root: clsx(
											classes.lightGreenBackground,
											classes.bottomBorderRadius
										),
									}}
								>
									<CurrencyComponent>{totals.resultTotal}</CurrencyComponent>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
				<Grid
					container
					direction="row"
					justifyContent="flex-start"
					alignItems="flex-start"
				>
					<Grid item key={searchKey}>
						<SearchBoxAuto
							helperText="Search for NEMO service category and select cost or utilization for WHAT-IF modeling"
							data={claimsCategorySearchData}
							defaultKey="serviceCategory2Name"
							setAutoCompleteInput={setAutocompleteInput}
							setSelected={setNewClaimCategories}
							sort={true}
						/>
					</Grid>
					<Grid item>
						{showAddBtn && (
							<Button
								variant="outlined"
								color="primary"
								// className={classes.newModelButton}
								onClick={addNewClaimCategories}
							>
								Add
							</Button>
						)}
					</Grid>
				</Grid>

				{/* <ModelResultBox next="nemo-tab-1" isDone={true} /> */}
				<ConfirmDialog
					handleConfirm={handleDeleteAction}
					close={() => setOpenDialog(false)}
					title="Delete Confirmation"
					subtitle="Do you want to delete?"
					open={openDialog}
				/>
			</Box>
		);
	}
}
