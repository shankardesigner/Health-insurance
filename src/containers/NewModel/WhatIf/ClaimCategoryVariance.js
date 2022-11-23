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
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import { debounce } from "lodash";

import SearchBoxAuto from "@components/SearchBoxAuto";
import { CurrencyComponent } from "@components/FormatNumber";
import Skeleton from "react-loading-skeleton";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;
import { updateTabEdited } from "@slices/tabModelSlice";
import styles from "./whatif.module.scss";

/* redux part */
import {
	getClaimCategoryAction,
	findClaimCategoryByNameAction,
	addNewClaimCategoriesAction,
	deleteClaimCategoryAction,
	whatIfModelState,
} from "@slices/whatIfSlice";

import { clientModelState } from "@slices/clientModelSlice";

import {
	riskModelerState,
	recalculateSavingsAction,
	calculateSavingsAction,
} from "@slices/riskModelerSlice";

import {
	storeServiceCategoryFactorAction,
	resultsClaimsModelState,
} from "@slices/resultsClaimsSlice";

import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "@components/ConfirmDialog";
import NemoNumberField from "src/shared/NemoNumberField";
import NemoTable from "src/shared/NemoTable";
import TableCell from "@material-ui/core/TableCell";

export default function ClaimCategoryVariance({ tabIndex }) {
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
	const { storeServiceCategoryFactorStatus } = useSelector(
		resultsClaimsModelState
	);

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
			modelId: router.query.modelid,
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
				modelId: router.query.modelid,
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

			// dispatch(findClaimCategoryByNameAction(payload));
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
				const cost = claimdata.pmpmFactor || 0;
				const util = claimdata.unitsPerKFactor || 0;

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
		// setTableKey(new Date().getTime())
		if (value) {
			dispatch(updateTabEdited(tabIndex));
		}
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
		setTableKey(new Date().getTime());
		if (value) {
			dispatch(updateTabEdited(tabIndex));
		}
	};

	const debounceStoreClaimCategoryVariance = useRef(
		debounce(async (dataToUpload) => {
			/* prepare payload data */
			if (dataToUpload.length) {
				const res = await dispatch(
					storeServiceCategoryFactorAction(dataToUpload)
				);
				if (res) {
					await dispatch(
						calculateSavingsAction({ modelId: router.query.modelid })
					);
				}
			}
		}, 1000)
	);

	useEffect(() => {
		if (router.query.modelid && initialClaimsData) {
			let dataToUpload = Object.values(initialClaimsData).reduce((acc, val) => {
				const { serviceCategory2Id, cost, util } = val;
				if (cost !== "" || util !== "") {
					let payload = {
						modelId: router.query.modelid,
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

	// No effect in calculate saving action.. from this component..
	// useEffect(() => {
	// 	if (storeServiceCategoryFactorStatus == SUCCESS) {
	// 		dispatch(recalculateSavingsAction());
	// 	}
	// }, [storeServiceCategoryFactorStatus]);

	const addNewClaimCategories = () => {
		dispatch(addNewClaimCategoriesAction(newClaimCategories));
		setAutocompleteInput();
		setNewClaimCategories([]);
		setSearchKey(new Date().getTime());
		dispatch(updateTabEdited(tabIndex));
	};

	const handleDelete = (data) => {
		setOpenDialog(true);
		setSelectedData({ ...data, modelId: router.query.modelid });
		dispatch(updateTabEdited(tabIndex));
	};

	const handleDeleteAction = async () => {
		const res = await dispatch(deleteClaimCategoryAction(selectedData));
		if (res) {
			await dispatch(calculateSavingsAction({ modelId: router.query.modelid }));
		}
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
			<React.Fragment>
				<NemoTable stickyHeader={true}>
					<React.Fragment>
						<TableHead className={styles.tableHeading}>
							<TableRow>
								<TableCell align="right" colSpan={1}>
									&nbsp;
								</TableCell>
								<TableCell colSpan={1} align="left">
									Facility Type
								</TableCell>
								<TableCell colSpan={1} align="center">
									Cost(%)
								</TableCell>
								<TableCell colSpan={1} align="center">
									Util(%)
								</TableCell>
								<TableCell colSpan={1} align="right">
									Result PMPM
								</TableCell>

								<TableCell colSpan={1} align="right">
									Result Total
								</TableCell>
								<TableCell>&nbsp;</TableCell>
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
													{serviceCategory1Name}
												</TableCell>

												<TableCell align="left">
													{serviceCategory2Name}
												</TableCell>
												<TableCell>
													{/* <NumberInputField
                            value={cost}
                            id={uniqueKey}
                            callback={handleCostChange}
                            type="decimal"
                            start={0.1}
                            factor={0.1}
                          /> */}
													<NemoNumberField
														value={cost}
														id={uniqueKey}
														callback={handleCostChange}
														type="decimal"
														start={0.1}
														factor={0.1}
													/>
												</TableCell>
												<TableCell>
													{/* <NumberInputField
                            value={util}
                            id={uniqueKey}
                            callback={handleUtilChange}
                            type="decimal"
                            start={0.1}
                            factor={0.1}
                          /> */}
													<NemoNumberField
														value={util}
														id={uniqueKey}
														callback={handleUtilChange}
														type="decimal"
														start={0.1}
														factor={0.1}
													/>
												</TableCell>
												<TableCell colSpan={1} align="right">
													<CurrencyComponent decimalCount={2}>
														{resultPmpm}
													</CurrencyComponent>
												</TableCell>
												<TableCell colSpan={1} align="right">
													<CurrencyComponent
														decimalCount={2}
														adaptiveColor={true}
													>
														{resultTotal}
													</CurrencyComponent>
												</TableCell>
												<TableCell>
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
												</TableCell>
											</TableRow>
										);
									}
								})}
							<TableRow>
								<TableCell align="left">Total</TableCell>
								<TableCell align="right"></TableCell>
								<TableCell align="center">-</TableCell>

								<TableCell align="center">-</TableCell>

								<TableCell align="right">
									<CurrencyComponent decimalCount={2} boldTotal={true}>
										{totals.pmPmTotal}
									</CurrencyComponent>
								</TableCell>
								<TableCell align="right">
									<CurrencyComponent decimalCount={2} boldTotal={true}>
										{totals.resultTotal}
									</CurrencyComponent>
								</TableCell>
								<TableCell>&nbsp;</TableCell>
							</TableRow>
						</TableBody>
					</React.Fragment>
				</NemoTable>
				{/* <Grid
					container
					direction="row"
					justifyContent="flex-start"
					alignItems="center"
					spacing={1}
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
				</Grid> */}
				<ConfirmDialog
					handleConfirm={handleDeleteAction}
					close={() => setOpenDialog(false)}
					title="Delete Confirmation"
					subtitle="Do you want to delete?"
					open={openDialog}
				/>
			</React.Fragment>
		);
	}
}
