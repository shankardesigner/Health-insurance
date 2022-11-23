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

import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
import SearchBoxAuto from "@components/SearchBoxAuto";
import Skeleton from "react-loading-skeleton";
import commons from "@constants/common";
const { REQUEST, SUCCESS } = commons;

import styles from "./whatif.module.scss";

/* redux part */
import {
	getDiagnosisPrevalenceAction,
	findDiagnosisByNameAction,
	deleteDiagnosisAction,
	storeDiagnosisAction,
	whatIfModelState,
	addNewDiagnosisAction,
} from "@slices/whatIfSlice";

import { clientModelState } from "@slices/clientModelSlice";

import {
	riskModelerState,
	recalculateSavingsAction,
	calculateSavingsAction,
} from "@slices/riskModelerSlice";

import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "@components/ConfirmDialog";
import { TableCell, TableFooter } from "@material-ui/core";
import NemoNumberField from "src/shared/NemoNumberField";
import NemoTable from "src/shared/NemoTable";
import { updateTabEdited } from "@slices/tabModelSlice";
import { useRouter } from "next/router";
const useStyles = makeStyles((theme) => ({
	tabStyle: {
		fontSize: "16px",
		color: "#632200",
	},
	fontTabStyle: {
		fontSize: "16px",
	},
}));

export default function DiagnosisPrevalence({ tabIndex }) {
	const dispatch = useDispatch();
	const classes = useStyles();
	const {
		diagnosisPrevalenceList,
		diagnosisPrevalenceSearchData,
		diagnosisPrevalenceFetch,
		storeDiagnosisResStatus,
		resStatus,
	} = useSelector(whatIfModelState);

	const { modelInfo } = useSelector(clientModelState);
	const { savedModel, isNext } = useSelector(riskModelerState);
	const router = useRouter();

	const [newDiagnosis, setNewDiagnosis] = useState([]);
	const [autocompleteInput, setAutocompleteInput] = useState();
	const [showAddBtn, setShowAddBtn] = useState(false);
	const [prevalenceData, setPrevalenceData] = useState({});
	const [tableKey, setTableKey] = useState(0);
	const [searchKey, setSearchKey] = useState(0);

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedData, setSelectedData] = useState(null);

	useEffect(() => {
		const { clientId, loa1Id, loa2Id, loa3Id, loa4Id, loa5Id, loa6Id } =
			modelInfo;

		let payload = {
			modelId: router.query.modelid,
			clientId: clientId,
			loa1Id: loa1Id,
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

		dispatch(getDiagnosisPrevalenceAction(payload));
	}, []);

	useEffect(() => {
		if (String(autocompleteInput).length > 1) {
			const { clientId, loa1Id, loa2Id, loa3Id, loa4Id, loa5Id, loa6Id } =
				modelInfo;

			let payload = {
				modelId: savedModel.modelId,
				clientId: clientId,
				loa1Id: loa1Id,
				name: autocompleteInput,
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

			// dispatch(findDiagnosisByNameAction(payload));
		}
	}, [autocompleteInput]);

	useEffect(() => {
		if (newDiagnosis.length) {
			setShowAddBtn(true);
		} else {
			setShowAddBtn(false);
		}
	}, [newDiagnosis]);

	const calculateImpactValue = (diagId, newMemberPerK) => {
		const filteredDiagnosisData = diagnosisPrevalenceList.filter((rowData) => {
			return rowData.diagId === diagId;
		});
		if (filteredDiagnosisData[0]) {
			const { costPerMember, memberPerK } = filteredDiagnosisData[0];
			const impactValue = (newMemberPerK - memberPerK) * costPerMember * 1000;
			return impactValue;
		}
	};

	useEffect(() => {
		let initialPrevalenceData = {};
		if (diagnosisPrevalenceList) {
			/* initialModelingEventcount */
			diagnosisPrevalenceList.forEach((diagnosisData) => {
				const { diagId: uniqueId, memberPerKSaved } = diagnosisData;
				initialPrevalenceData[uniqueId] = {
					...diagnosisData,
					prevalenceInputValue: memberPerKSaved || 0,
					impactValue: calculateImpactValue(
						uniqueId,
						Number(memberPerKSaved).toFixed(2)
					),
				};
			});
			setPrevalenceData(initialPrevalenceData);
			setTableKey(new Date().getTime());
		}
	}, [diagnosisPrevalenceList]);

	const handlePrevalenceInputChange = (value, diagId) => {
		/* calculate impact value */
		const impactValue = calculateImpactValue(diagId, value);
		const data = {
			...prevalenceData,
			[diagId]: {
				...prevalenceData[diagId],
				prevalenceInputValue: value,
				impactValue: impactValue,
			},
		};
		setPrevalenceData(data);
		let dataToUpload = Object.values(data).reduce((acc, val) => {
			if (val.prevalenceInputValue !== "") {
				const payload = {
					modelId: savedModel.modelId,
					diagId: val.diagId,
					memberPerK: val.prevalenceInputValue,
				};
				acc.push(payload);
				dispatch(updateTabEdited(tabIndex));
			}
			return acc;
		}, []);
		setTableKey(new Date().getTime());
		debounceStoreDiagnosis.current(dataToUpload);
	};

	// No effect in calculate saving action.. from this component..
	// useEffect(() => {
	// 	if (storeDiagnosisResStatus == SUCCESS) {
	// 		dispatch(recalculateSavingsAction());
	// 	}
	// }, [storeDiagnosisResStatus]);

	const debounceStoreDiagnosis = useRef(
		debounce((dataToUpload) => {
			/* prepare payload data */
			if (dataToUpload.length) {
				dispatch(storeDiagnosisAction(dataToUpload));

				// if(res) {
				// 	await dispatch(calculateSavingsAction({modelId: router.query.modelid}))
				// }
			}
		}, 1000)
	);

	const handleDelete = (data) => {
		/* remove from store as well */
		setOpenDialog(true);
		setSelectedData({ ...data, modelId: savedModel.modelId });
		dispatch(updateTabEdited(tabIndex));
	};

	const handleDeleteAction = () => {
		dispatch(deleteDiagnosisAction(selectedData));
		setOpenDialog(false);
	};
	const addNewDiagnosis = () => {
		dispatch(addNewDiagnosisAction(newDiagnosis));
		dispatch(updateTabEdited(tabIndex));
	};

	const getTotalResults = (prevelenceObject = {}) => {
		const results = {
			impactTotal: 0,
			unitCostTotal: 0,
		};
		Object.keys(prevelenceObject).forEach((key) => {
			const data = prevelenceObject[key];
			results.impactTotal = results.impactTotal + Number(data.impactValue) || 0;
			results.unitCostTotal = results.unitCostTotal + data.costPerMember;
		});
		return results;
	};

	const totals = getTotalResults(prevalenceData);

	if (resStatus == REQUEST || Object.keys(prevalenceData).length === 0) {
		// return <LinearProgressBar />
		return <Skeleton count={5} height={30} />;
	} else {
		return (
			<React.Fragment>
				<NemoTable>
					<React.Fragment>
						<TableHead className={styles.tableHeading}>
							<TableRow>
								<TableCell colSpan={1}>&nbsp;</TableCell>
								<TableCell colSpan={2} align="right">
									Benchmark
								</TableCell>
								<TableCell align="center" colSpan={3}>
									Actual
								</TableCell>
								<TableCell colSpan={1} align="center">
									Prevalence per K
								</TableCell>
								<TableCell colSpan={1} align="right">
									Cost Per Case
								</TableCell>
								<TableCell colSpan={1} align="right">
									$ Impact
								</TableCell>
								<TableCell>&nbsp;</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell colSpan={1}>&nbsp;</TableCell>
								<TableCell
									colSpan={2}
									align="right"
									className={classes.tabStyle}
								>
									Prevalence per K
								</TableCell>
								<TableCell
									colSpan={2}
									align="right"
									className={classes.fontTabStyle}
								>
									Prevalence per K
								</TableCell>
								<TableCell
									colSpan={1}
									align="right"
									className={classes.fontTabStyle}
								>
									Patient Count
								</TableCell>

								<TableCell>&nbsp;</TableCell>
								<TableCell>&nbsp;</TableCell>
								<TableCell>&nbsp;</TableCell>
								<TableCell>&nbsp;</TableCell>
							</TableRow>
							{prevalenceData &&
								Object.keys(prevalenceData).length !== 0 &&
								Object.keys(prevalenceData).map((diagId, index) => {
									const {
										memberPerKBenchmark,
										memberPerK,
										diagName,
										costPerMember,
										memberCount,
										impactValue,
										prevalenceInputValue,
										showAsDefault,
									} = prevalenceData[diagId];
									return (
										<TableRow key={index}>
											<TableCell colSpan={1} align="left">
												{diagName}
											</TableCell>

											{/* Benchmark */}
											<TableCell align="right" colSpan={2}>
												<NumberComponent>{memberPerKBenchmark}</NumberComponent>
											</TableCell>

											{/* Actual */}
											<TableCell align="right" colSpan={2}>
												<NumberComponent>{memberPerK}</NumberComponent>
											</TableCell>
											<TableCell align="right" colSpan={1}>
												<NumberComponent>{memberCount}</NumberComponent>
											</TableCell>

											{/* Prevalence Input */}
											<TableCell>
												{/* <NumberInputField
                          key={`${index}${prevalenceInputValue}`}
                          value={prevalenceInputValue}
                          id={diagId}
                          start={memberPerK}
                          callback={handlePrevalenceInputChange}
                          type="decimal"
                          factor={0.1}
                        /> */}
												<NemoNumberField
													key={`${index}${prevalenceInputValue}`}
													value={prevalenceInputValue}
													id={diagId}
													start={memberPerK}
													callback={handlePrevalenceInputChange}
													type="decimal"
													factor={0.1}
												/>
											</TableCell>

											{/* Cost per Case */}
											<TableCell align="right">
												<CurrencyComponent decimalCount={0}>
													{costPerMember}
												</CurrencyComponent>
											</TableCell>

											{/* Impact in 1000 */}
											<TableCell align="right">
												<CurrencyComponent
													decimalCount={0}
													adaptiveColor={true}
													reverseColor={true}
												>
													{impactValue}
												</CurrencyComponent>
											</TableCell>

											{/* Delete Action */}
											<TableCell>
												{!showAsDefault && (
													<IconButton
														color="primary"
														aria-label="upload picture"
														component="span"
														onClick={() => handleDelete({ index, diagId })}
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
								})}

							<TableRow>
								<TableCell align="left">Total</TableCell>
								<TableCell align="right" colspan={2}>
									-
								</TableCell>
								<TableCell align="right">-</TableCell>
								<TableCell align="right" colspan={2}>
									-
								</TableCell>
								<TableCell align="center" colspan={1}>
									-
								</TableCell>

								<TableCell align="right">
									{/* <CurrencyComponent boldTotal={true}>
										{totals.unitCostTotal}
									</CurrencyComponent> */}
								</TableCell>
								<TableCell align="right">
									<CurrencyComponent boldTotal={true} decimalCount={0}>
										{totals.impactTotal}
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
					alignItems="flex-start"
				>
					<Grid item md={12}>
						<Grid
							container
							justifyContent="flex-start"
							alignItems="center"
							direction="row"
							spacing={1}
						>
							<Grid item>
								<SearchBoxAuto
									helperText="Search by Diagnosis group"
									data={diagnosisPrevalenceSearchData}
									defaultKey="diagName"
									setAutoCompleteInput={setAutocompleteInput}
									setSelected={setNewDiagnosis}
									sort={true}
								/>
							</Grid>
							<Grid item>
								{showAddBtn && (
									<Button
										variant="outlined"
										color="primary"
										// className={classes.newModelButton}
										onClick={addNewDiagnosis}
									>
										Add
									</Button>
								)}
							</Grid>
						</Grid>
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
