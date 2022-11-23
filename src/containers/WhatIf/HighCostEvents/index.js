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
import Skeleton from "react-loading-skeleton";
import { debounce } from "lodash";

import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
import ModelResultBox from "../../ModelResultBox";
import SearchBoxAuto from "@components/SearchBoxAuto";
import NumberInputField from "@components/NemoInputField";
import LinearProgressBar from "@components/LinearProgressBar";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import styles from "./highcostevents.module.css";

/* redux part */
import {
	getHighCostEventsAction,
	findHighCostEventsByNameAction,
	addNewHighCostEventsAction,
	storeHighCostEventsAction,
	deleteHighCostEventsAction,
	whatIfModelState,
} from "@slices/whatIfSlice";

import { clientModelState } from "@slices/clientModelSlice";

import { riskModelerState } from "@slices/riskModelerSlice";

import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "@components/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
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
		width: "100%",
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
	iconButton: {
		"&.MuiFab-root": {
			minHeight: "unset !important",
		},
		"&:hover, &.MuiButtonBase-root": {
			backgroundColor: "#42DEB4",
			width: "30px",
			height: "30px",
		},
	},
	gridContainer: {
		width: "145px",
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

export default function HighCostEvents() {
	const classes = useStyles();
	const dispatch = useDispatch();

	const {
		highCostEvents,
		highCostEventsSearchData,
		highCostEventsFetch,
		resStatus,
	} = useSelector(whatIfModelState);
	const { modelInfo } = useSelector(clientModelState);
	const { savedModel } = useSelector(riskModelerState);
	const [modelingEventCount, setModelingEventCount] = useState({});
	const [newEpisodes, setNewEpisodes] = useState([]);
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

		dispatch(getHighCostEventsAction(payload));
		//
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

			dispatch(findHighCostEventsByNameAction(payload));
		}
	}, [autocompleteInput]);

	useEffect(() => {
		if (newEpisodes.length) {
			setShowAddBtn(true);
		} else {
			setShowAddBtn(false);
		}
	}, [newEpisodes]);

	useEffect(() => {
		let initialModelingCount = {};
		if (highCostEvents) {
			(highCostEvents || []).map((highCostEvent, index) => {
				const { episodeId, eventCount, unitCost } = highCostEvent;
				initialModelingCount[episodeId] = {
					episodeId: episodeId,
					value: eventCount || "",
					impactValue: eventCount
						? calculateImpactValue(episodeId, eventCount)
						: "",
				};
			});
			setModelingEventCount(initialModelingCount);
			setTableKey(new Date().getTime());
		}
	}, [highCostEvents]);

	const calculateImpactValue = (episodeId, modelingEventCount) => {
		const filteredHightCost = highCostEvents.filter((highCostEvent, index) => {
			return highCostEvent.episodeId === episodeId;
		});
		if (filteredHightCost[0]) {
			const { paidAmountByUnitCost, unitCountBenchmark } = filteredHightCost[0];
			const impactValue =
				paidAmountByUnitCost * ( unitCountBenchmark - modelingEventCount);
			return impactValue;
		}
		return "";
	};

	const handleModelingCountChange = (value, episodeId) => {
		/* update modelingEventCount */
		/* calculate impact value */
		const impactValue =
			value !== "" ? calculateImpactValue(episodeId, value) : "";
		const data = {
			...modelingEventCount,
			[episodeId]: {
				episodeId: episodeId,
				value: value,
				impactValue: impactValue,
			},
		};
		let dataToUpload = Object.values(data).reduce((acc, val) => {
			if (val.value !== "") {
				const payload = {
					modelId: savedModel.modelId,
					episodesId: val.episodeId,
					eventCount: val.value,
				};
				acc.push(payload);
			}
			return acc;
		}, []);
		debounceStoreHighCost.current(dataToUpload);
		setModelingEventCount(data);
	};

	const addNewEpisodes = () => {
		let newModelingCount = {};
		newEpisodes.map((episode, index) => {
			const uniqueId = episode.episodeId;
			newModelingCount[uniqueId] = {
				episodeId: uniqueId,
				value: 0,
				impactValue: 0,
			};
		});
		setModelingEventCount({ ...modelingEventCount, ...newModelingCount });
		dispatch(addNewHighCostEventsAction(newEpisodes));
		setAutocompleteInput();
		setNewEpisodes([]);
		setSearchKey(new Date().getTime());
	};

	const handleDelete = (data) => {
		setOpenDialog(true);
		setSelectedData({ ...data, modelId: savedModel.modelId });
	};

	const handleDeleteAction = () => {
		dispatch(deleteHighCostEventsAction(selectedData));
		setOpenDialog(false);
	};

	const debounceStoreHighCost = useRef(
		debounce((dataToUpload) => {
			/* prepare payload data */
			if (dataToUpload.length) {
				dispatch(storeHighCostEventsAction(dataToUpload));
			}
		}, 1000)
	);

	const generateImpactNumber = (impactValue = 0) => {
		return parseInt(impactValue).toFixed(2) !== "NaN" ? impactValue : 0;
	};

	const getTotalResults = (highCostEvents = []) => {
		
		const results = {
			perCostTotal: 0,
			impactTotal: 0,
		};
		highCostEvents.forEach((data, index) => {
			results.perCostTotal = results.perCostTotal + data.unitCost;
			results.impactTotal =
				results.impactTotal +
				generateImpactNumber(modelingEventCount[data?.episodeId]?.impactValue);
		});
		
		return results;
	};

	const totals = getTotalResults(highCostEvents);
	

	if (resStatus == REQUEST || Object.keys(modelingEventCount).length === 0) {
		// return <LinearProgressBar />
		return <Skeleton count={5} height={30} />;
	} else {
		return (
			<Box p={3}>
				<TableContainer className={styles.tableContainer}>
					<Table
						aria-label="simple table"
						className={styles.table}
						key={tableKey}
					>
						<TableHead>
							<TableRow>
								<TableCell align="left"></TableCell>
								<TableCell
									align="left"
									colSpan={2}
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
								<TableCellInput
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
									Modeling Event Count
								</TableCellInput>
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
									Units Per 1000
								</TableCell>
								<TableCell
									align="left"
									classes={{ root: classes.darkBackground }}
									className={styles.tableHeaderSubTitle}
								>
									Count
								</TableCell>

								{/* Actual */}
								<TableCell className={styles.tableHeaderSubTitle}>
									Units Per 1000
								</TableCell>
								<TableCell align="left" className={styles.tableHeaderSubTitle}>
									Count
								</TableCell>

								{/* Delete Action */}
								<TableCell></TableCell>
							</TableRow>

							{highCostEvents &&
								Object.keys(modelingEventCount).length !== 0 &&
								highCostEvents.map((highCostEvent, index) => {
									const {
										episodeId,
										episodeName,
										unitPerKBenchmark,
										unitCountBenchmark,
										unitsPerK,
										unitCost,
										paidAmountByUnitCost,
										showAsDefault,
									} = highCostEvent;
									
									
									return (
										<TableRow key={index}>
											<TableCell className={styles.tableHeaderSubTitle}>
												<span className={styles.rowHeaderTitle}>
													{episodeName}
												</span>
											</TableCell>

											{/* Benchmark */}
											<TableCell
												classes={{ root: classes.darkBackground }}
												className={styles.tableHeaderSubTitle}
											>
												<NumberComponent>{unitPerKBenchmark}</NumberComponent>
											</TableCell>
											<TableCell
												align="left"
												classes={{ root: classes.darkBackground }}
												className={styles.tableHeaderSubTitle}
											>
												<NumberComponent decimal={false}>
												{unitCountBenchmark}
												</NumberComponent>
											</TableCell>

											{/* Actual */}
											<TableCell className={styles.tableHeaderSubTitle}>
												<NumberComponent>{unitsPerK}</NumberComponent>
											</TableCell>
											<TableCell
												align="left"
												className={styles.tableHeaderSubTitle}
											>
												<NumberComponent decimal={false}>
													{unitCountBenchmark}
												</NumberComponent>
											</TableCell>

											{/* Modeling Event Count */}
											<TableCellInput
												align="left"
												classes={{ root: classes.lightGreenBackground }}
												className={clsx(
													styles.tableHeaderSubTitle,
													classes.inputTableCell
												)}
											>
												<NumberInputField
													key={index}
													value={modelingEventCount[episodeId].value}
													id={episodeId}
													callback={handleModelingCountChange}
													start={unitCountBenchmark}
												/>
											</TableCellInput>

											{/* Cost Per Case */}
											<TableCell className={styles.tableHeaderSubTitle}>
												<CurrencyComponent decimalCount={0}>
													{paidAmountByUnitCost}
												</CurrencyComponent>
											</TableCell>

											{/* $ Impact */}
											<TableCell className={styles.tableHeaderSubTitle}>
												<CurrencyComponent
													decimalCount={0}
													adaptiveColor={true}
													reverseColor={true}
												>
													{modelingEventCount[episodeId].impactValue}
												</CurrencyComponent>
											</TableCell>

											{/* Delete Action */}
											<TableCellAction>
												{!showAsDefault && (
													<IconButton
														color="primary"
														aria-label="upload picture"
														component="span"
														onClick={(e) =>
															handleDelete({ index, episodesId: episodeId })
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
								})}
							<TableRow>
								<TableCell colSpan={6} align="left">
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
									<CurrencyComponent decimalCount={0}>
										{totals.perCostTotal}
									</CurrencyComponent>
								</TableCell>
								<TableCell
									classes={{
										root: clsx(
											classes.lightGreenBackground,
											classes.bottomBorderRadius
										),
									}}
								>
									<CurrencyComponent decimalCount={0}>
										{totals.impactTotal}
									</CurrencyComponent>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody></TableBody>
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
									helperText="Search for NEMO service category for WHAT-IF modeling"
									data={highCostEventsSearchData}
									defaultKey="episodeName"
									setAutoCompleteInput={setAutocompleteInput}
									setSelected={setNewEpisodes}
									sort={true}
								/>
							</Grid>
							<Grid item>
								{showAddBtn && (
									<Button
										variant="outlined"
										color="primary"
										className={classes.newModelButton}
										onClick={addNewEpisodes}
									>
										Add
									</Button>
								)}
							</Grid>
						</Grid>
					</Grid>
				</Grid>

				{/* <ModelResultBox next='nemo-tab-1' isDone={true} /> */}
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
