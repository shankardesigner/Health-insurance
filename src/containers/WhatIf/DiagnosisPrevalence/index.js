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

import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
import ModelResultBox from "../../ModelResultBox";
import SearchBoxAuto from "@components/SearchBoxAuto";
import NumberInputField from "@components/NemoInputField";
import LinearProgressBar from "@components/LinearProgressBar";
import Skeleton from "react-loading-skeleton";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import styles from "./diagnosisprevalence.module.css";

/* redux part */
import {
	getDiagnosisPrevalenceAction,
	findDiagnosisByNameAction,
	addNewDiagnosisAction,
	deleteDiagnosisAction,
	storeDiagnosisAction,
	whatIfModelState,
} from "@slices/whatIfSlice";

import { clientModelState } from "@slices/clientModelSlice";

import { riskModelerState } from "@slices/riskModelerSlice";

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
		// [theme.breakpoints.down('md')]: {
		//     width: '500px'
		// },
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

const TableCell = withStyles({
	root: {
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
	},
})(MuiTableCell);

const TableCellInput = withStyles({
	root: {
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
		width: "100px",
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

export default function DiagnosisPrevalence() {
	const classes = useStyles();
	const router = useRouter();

	const dispatch = useDispatch();

	const {
		diagnosisPrevalenceList,
		diagnosisPrevalenceSearchData,
		diagnosisPrevalenceFetch,
		resStatus,
	} = useSelector(whatIfModelState);
	const { modelInfo } = useSelector(clientModelState);
	const { savedModel } = useSelector(riskModelerState);

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
			modelId: savedModel.modelId,
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

			dispatch(findDiagnosisByNameAction(payload));
		}
	}, [autocompleteInput]);

	useEffect(() => {
		if (newDiagnosis.length) {
			setShowAddBtn(true);
		} else {
			setShowAddBtn(false);
		}
	}, [newDiagnosis]);

	useEffect(() => {
		let initialPrevalenceData = {};
		if (diagnosisPrevalenceList) {
			/* initialModelingEventcount */
			diagnosisPrevalenceList.map((diagnosisData, index) => {
				const {
					diagId: uniqueId,
					paidAmount,
					costPerMember,
					memberPerK,
					memberPerKSaved,
				} = diagnosisData;
				initialPrevalenceData[uniqueId] = {
					...diagnosisData,
					prevalenceInputValue: memberPerKSaved || "",
					impactValue: memberPerKSaved
						? calculateImpactValue(uniqueId, Number(memberPerKSaved).toFixed(2))
						: "",
				};
			});
			setPrevalenceData(initialPrevalenceData);
			setTableKey(new Date().getTime());
		}
	}, [diagnosisPrevalenceList]);

	const calculateImpactValue = (diagId, newMemberPerK) => {
		const filteredDiagnosisData = diagnosisPrevalenceList.filter(
			(rowData, index) => {
				return rowData.diagId === diagId;
			}
		);
		if (filteredDiagnosisData[0]) {
			const { paidAmount, costPerMember, memberPerK } =
				filteredDiagnosisData[0];
			const impactValue = (newMemberPerK - memberPerK) * costPerMember * 1000;
			return impactValue;
		}
		return "";
	};

	const handlePrevalenceInputChange = (value, diagId) => {
		/* calculate impact value */
		const impactValue = value !== "" ? calculateImpactValue(diagId, value) : "";
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
			}
			return acc;
		}, []);
		debounceStoreDiagnosis.current(dataToUpload);
	};

	const debounceStoreDiagnosis = useRef(
		debounce((dataToUpload) => {
			/* prepare payload data */
			if (dataToUpload.length) {
				dispatch(storeDiagnosisAction(dataToUpload));
			}
		}, 1000)
	);

	const addNewDiagnosis = () => {
		dispatch(addNewDiagnosisAction(newDiagnosis));
		setAutocompleteInput();
		setNewDiagnosis([]);
		setSearchKey(new Date().getTime());
	};

	const handleDelete = (data) => {
		/* remove from store as well */
		setOpenDialog(true);
		setSelectedData({ ...data, modelId: savedModel.modelId });
	};

	const handleDeleteAction = () => {
		dispatch(deleteDiagnosisAction(selectedData));
		setOpenDialog(false);
	};

	const getTotalResults = (prevelenceObject = {}) => {
		const results = {
			impactTotal: 0,
			unitCostTotal: 0,
		};
		Object.keys(prevelenceObject).forEach((key, index) => {
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
									colSpan={1}
									classes={{
										root: clsx(classes.darkBackground, classes.topBorderRadius),
									}}
									className={styles.tableHeaderTitle}
								>
									Benchmark
								</TableCell>
								<TableCell
									align="left"
									colSpan={2}
									className={styles.tableHeaderTitle}
								>
									Actual
								</TableCell>
								<TableCell
									align="left"
									rowSpan={2}
									classes={{
										root: clsx(
											classes.lightGreenBackground,
											classes.topBorderRadius
										),
									}}
									className={styles.tableHeaderTitle}
								>
									Prevalence Per K
								</TableCell>
								<TableCell
									align="left"
									rowSpan={2}
									className={styles.tableHeaderTitle}
								>
									Cost Per Case
								</TableCell>
								<TableCell
									align="left"
									rowSpan={2}
									className={styles.tableHeaderTitle}
								>
									$ Impact
								</TableCell>

								{/* Delete Action */}
								<TableCell></TableCell>
							</TableRow>
							<TableRow>
								<TableCell className={styles.tableHeaderSubTitle}></TableCell>

								{/* Benchmark */}
								<TableCell
									classes={{ root: classes.darkBackground }}
									className={styles.tableHeaderSubTitle}
								>
									Prevalence Per K
								</TableCell>
								{/* <TableCell align="left" classes={{ root: classes.darkBackground }} className={styles.tableHeaderSubTitle}>Patient Count</TableCell> */}

								{/* Actual */}
								<TableCell className={styles.tableHeaderSubTitle}>
									Prevalence Per K
								</TableCell>
								<TableCell align="left" className={styles.tableHeaderSubTitle}>
									Patient Count
								</TableCell>

								{/* Delete Action */}
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
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
											<TableCell className={styles.tableHeaderSubTitle}>
												<span className={styles.rowHeaderTitle}>
													{diagName}
												</span>
											</TableCell>

											{/* Benchmark */}
											<TableCell classes={{ root: classes.darkBackground }}>
												<NumberComponent>{memberPerKBenchmark}</NumberComponent>
											</TableCell>

											{/* Actual */}
											<TableCell>
												<NumberComponent>{memberPerK}</NumberComponent>
											</TableCell>
											<TableCell>
												<NumberComponent>{memberCount}</NumberComponent>
											</TableCell>

											{/* Prevalence Input */}
											<TableCellInput
											//classes={{ root: classes.lightGreenBackground }}
											>
												<NumberInputField
													key={`${index}${prevalenceInputValue}`}
													value={prevalenceInputValue}
													id={diagId}
													start={memberPerK}
													callback={handlePrevalenceInputChange}
													type="decimal"
													factor={0.1}
												/>
											</TableCellInput>

											{/* Cost per Case */}
											<TableCell>
												<CurrencyComponent>{costPerMember}</CurrencyComponent>
											</TableCell>

											{/* Impact in 1000 */}
											<TableCell>
												<CurrencyComponent
													adaptiveColor={true}
													reverseColor={true}
												>
													{impactValue}
												</CurrencyComponent>
											</TableCell>

											{/* Delete Action */}
											<TableCellAction>
												{!showAsDefault && (
													<IconButton
														color="primary"
														aria-label="upload picture"
														component="span"
														onClick={(e) => handleDelete({ index, diagId })}
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
								})}
							<TableRow>
								<TableCell colSpan={5} align="left">
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
									<CurrencyComponent>{totals.unitCostTotal}</CurrencyComponent>
								</TableCell>
								<TableCell
									classes={{
										root: clsx(
											classes.lightGreenBackground,
											classes.bottomBorderRadius
										),
									}}
								>
									<CurrencyComponent>{totals.impactTotal}</CurrencyComponent>
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
										className={classes.newModelButton}
										onClick={addNewDiagnosis}
									>
										Add
									</Button>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				{/* <ModelResultBox next='nemo-tab-1' isDone={true}/> */}
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
