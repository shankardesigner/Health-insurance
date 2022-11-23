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
import Skeleton from "react-loading-skeleton";
import { debounce } from "lodash";

import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
import SearchBoxAuto from "@components/SearchBoxAuto";
import NumberInputField from "@components/NemoInputField";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import styles from "./whatif.module.scss";

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

import {
	riskModelerState,
	recalculateSavingsAction,
	calculateSavingsAction,
} from "@slices/riskModelerSlice";

import { useDispatch, useSelector } from "react-redux";
import ConfirmDialog from "@components/ConfirmDialog";
import { TableCell, TableFooter, Typography } from "@material-ui/core";
import NemoNumberField from "src/shared/NemoNumberField";
import NemoTable from "src/shared/NemoTable";
import { updateTabEdited } from "@slices/tabModelSlice";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
	tabStyle: {
		fontSize: "16px",
	},
	secondTableStyle: {
		fontSize: "16px",
		lineHeight: "1",
	},
}));

export default function HighCostEvents({ tabIndex }) {
	const dispatch = useDispatch();
	const classes = useStyles();
	const {
		highCostEvents,
		highCostEventsSearchData,
		highCostEventsFetch,
		resStatus,
		storeHighCostEventsResStatus,
	} = useSelector(whatIfModelState);
	const { modelInfo } = useSelector(clientModelState);
	const { savedModel, isNext } = useSelector(riskModelerState);
	const [modelingEventCount, setModelingEventCount] = useState({});
	const [newEpisodes, setNewEpisodes] = useState([]);
	const [autocompleteInput, setAutocompleteInput] = useState();
	const [showAddBtn, setShowAddBtn] = useState(false);
	const [tableKey, setTableKey] = useState(0);
	const [searchKey, setSearchKey] = useState(0);
	const router = useRouter();

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedData, setSelectedData] = useState(null);
	const [i, setI] = useState(0);
	//const [boldTotal, setBoldTotal] = useState(true);

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

		if (router.query.modelid && isNext === false) {
			dispatch(getHighCostEventsAction(payload));
		}
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

			// dispatch(findHighCostEventsByNameAction(payload));
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
				const { episodeId, eventCount } = highCostEvent;
				initialModelingCount[episodeId] = {
					episodeId: episodeId,
					value: eventCount,
					impactValue: calculateImpactValue(episodeId, eventCount),
				};
			});
			setModelingEventCount(initialModelingCount);
			// setTableKey(new Date().getTime());
		}
	}, [highCostEvents]);

	const calculateImpactValue = (episodeId, modelingEventCount = 0) => {
		const filteredHightCost = highCostEvents.filter((highCostEvent, index) => {
			return highCostEvent.episodeId === episodeId;
		});
		if (filteredHightCost[0]) {
			const { paidAmountByUnitCost, unitCountBenchmark } = filteredHightCost[0];
			// rounding up to heighest as prabash requested...
			const impactValue =
				paidAmountByUnitCost * (unitCountBenchmark - modelingEventCount);
			return impactValue;
		}
		return "";
	};

	const handleModelingCountChange = (value, episodeId) => {
		/* update modelingEventCount */
		/* calculate impact value */
		const impactValue = calculateImpactValue(episodeId, value);
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
				dispatch(updateTabEdited(tabIndex));
			}
			return acc;
		}, []);

		debounceStoreHighCost.current(dataToUpload);
		setModelingEventCount(data);
		dispatch(updateTabEdited(tabIndex));
	};

	// No effect in calculate saving action.. from this component..

	// useEffect(() => {
	// 	if (storeHighCostEventsResStatus == SUCCESS) {
	// 		dispatch(recalculateSavingsAction());
	// 	}
	// }, [storeHighCostEventsResStatus]);

	// const addNewEpisodes = () => {
	// 	let newModelingCount = {};
	// 	newEpisodes.map((episode, index) => {
	// 		const uniqueId = episode.episodeId;
	// 		newModelingCount[uniqueId] = {
	// 			episodeId: uniqueId,
	// 			value: 0,
	// 			impactValue: 0,
	// 		};
	// 	});
	// 	setModelingEventCount({ ...modelingEventCount, ...newModelingCount });
	// 	dispatch(addNewHighCostEventsAction(newEpisodes));
	// 	setAutocompleteInput();
	// 	setNewEpisodes([]);
	// 	setSearchKey(new Date().getTime());
	// 	dispatch(updateTabEdited(tabIndex));
	// };

	const handleDelete = (data) => {
		setOpenDialog(true);
		setSelectedData({ ...data, modelId: savedModel.modelId });
		dispatch(updateTabEdited(tabIndex));
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
				// if(res) {
				// 	await dispatch(calculateSavingsAction({modelId: router.query.modelid}))
				// }
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
			results.perCostTotal += data.paidAmountByUnitCost;
			results.impactTotal += generateImpactNumber(
				modelingEventCount[data?.episodeId]?.impactValue
			);
		});

		return results;
	};

	const totals = getTotalResults(highCostEvents);

	if (resStatus == REQUEST || Object.keys(modelingEventCount).length === 0) {
		// return <LinearProgressBar />
		return <Skeleton count={5} height={30} />;
	} else {
		return (
			<React.Fragment>
				<NemoTable>
					<React.Fragment>
						<TableHead>
							<TableRow>
								<TableCell colSpan={1}>&nbsp;</TableCell>
								<TableCell
									align="center"
									className={classes.tabStyle}
									colSpan={2}
								>
									Benchmark
								</TableCell>
								<TableCell colSpan={2} align="center">
									Actual
								</TableCell>
								{/* <TableCell align="right">&nbsp;</TableCell> */}

								{/* <TableCell>&nbsp;</TableCell> */}
								<TableCell
									colSpan={2}
									align="center"
									className={classes.tabStyle}
								>
									Modeling Event Count
								</TableCell>
								<TableCell align="right" className={classes.tabStyle}>
									Cost Per Case
								</TableCell>
								<TableCell align="right" className={classes.tabStyle}>
									$ Impact
								</TableCell>
								<TableCell>&nbsp;</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell colSpan={1}>&nbsp;</TableCell>
								<TableCell align="right" className={classes.secondTableStyle}>
									Units Per 1000
								</TableCell>
								<TableCell align="right" className={classes.secondTableStyle}>
									Count
								</TableCell>
								<TableCell align="right" className={classes.secondTableStyle}>
									Units Per 1000
								</TableCell>
								<TableCell align="right" className={classes.secondTableStyle}>
									Count
								</TableCell>
								<TableCell colSpan={5}>&nbsp;</TableCell>
							</TableRow>
							{highCostEvents &&
								Object.keys(modelingEventCount).length !== 0 &&
								[...highCostEvents]
									.sort((a, b) => {
										if (a.episodeName < b.episodeName) return -1;
										if (a.episodeName > b.episodeName) return 1;
										return 0;
									})
									.map((highCostEvent, index) => {
										const {
											episodeId,
											episodeName,
											unitPerKBenchmark,
											unitCountBenchmark,
											unitsPerK,
											unitCost,
											eventCount,
											paidAmountByUnitCost,
											showAsDefault,
										} = highCostEvent;
										//
										return (
											<TableRow key={index}>
												<TableCell colSpan={1}>
													<span>{episodeName}</span>
												</TableCell>

												{/* Benchmark */}
												<TableCell align="right" colSpan={1}>
													<NumberComponent>{unitPerKBenchmark}</NumberComponent>
												</TableCell>
												<TableCell align="right" colSpan={1}>
													<NumberComponent decimal={false}>
														{unitCountBenchmark}
													</NumberComponent>
												</TableCell>

												{/* Actual */}
												<TableCell align="right" colSpan={1}>
													<NumberComponent>{unitsPerK}</NumberComponent>
												</TableCell>
												<TableCell align="right" colSpan={1}>
													<NumberComponent decimal={false}>
														{unitCountBenchmark}
													</NumberComponent>
												</TableCell>

												{/* Modeling Event Count */}
												<TableCell align="center" colSpan={2}>
													{/* <NumberInputField
                          key={index}
                          value={modelingEventCount[episodeId].value}
                          id={episodeId}
                          callback={handleModelingCountChange}
                          start={Math.ceil(unitCountBenchmark)}
                        /> */}
													<NemoNumberField
														key={index}
														value={eventCount}
														id={episodeId}
														callback={handleModelingCountChange}
														start={unitCountBenchmark}
														type="decimal"
														factor={1}
													/>
												</TableCell>

												{/* Cost Per Case */}
												<TableCell align="right" colSpan={1}>
													<CurrencyComponent decimalCount={0}>
														{paidAmountByUnitCost}
													</CurrencyComponent>
												</TableCell>

												{/* $ Impact */}
												<TableCell align="right">
													<CurrencyComponent decimalCount={0}>
														{modelingEventCount[episodeId].impactValue}
													</CurrencyComponent>
												</TableCell>

												{/* Delete Action */}
												<TableCell>
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
												</TableCell>
											</TableRow>
										);
									})}
							<TableRow>
								<TableCell align="left">Total</TableCell>
								<TableCell align="right">-</TableCell>
								<TableCell align="right">-</TableCell>
								<TableCell align="right">-</TableCell>
								<TableCell align="right">-</TableCell>
								<TableCell align="center" colSpan={2}>
									-
								</TableCell>
								<TableCell align="right">
									{/* <CurrencyComponent decimalCount={0} boldTotal={true}>
										{totals.perCostTotal}
									</CurrencyComponent> */}
								</TableCell>
								<TableCell align="right">
									<CurrencyComponent decimalCount={0} boldTotal={true}>
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
										// className={classes.newModelButton}
										onClick={addNewEpisodes}
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
