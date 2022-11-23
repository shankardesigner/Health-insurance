import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import withWidth from "@material-ui/core/withWidth";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { toast } from "react-toastify";
import Button from "@material-ui/core/Button";
import { useRouter } from "next/router";
import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
//

import { makeStyles, withStyles } from "@material-ui/core/styles";
import styles from "./editresultsclaims.module.scss";
import LinearProgressBar from "@components/LinearProgressBar";
import EditDetails from "./EditDetails";
import commons from "@constants/common";
const { REQUEST, SUCCESS } = commons;

/* redux part */
import {
	storeServiceCategoryFactorAction,
	getServiceCategoryAction,
	resultsClaimsModelState,
	resetResultClaimsDataFetchAction,
} from "@slices/resultsClaimsSlice";
import {
	calculateSavingsAction,
	riskModelerState,
} from "@slices/riskModelerSlice";

import { useSelector, useDispatch } from "react-redux";
import Transition from "./Transition";
import NemoTable from "src/shared/NemoTable";
import NemoNumberField from "src/shared/NemoNumberField";
import { IconButton, TableCell } from "@material-ui/core";

const TableCellInput = withStyles({
	root: {
		minWidth: "100px",
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "14px",
		color: "#3D3E64",
		padding: "6px !important",
		lineHeight: "unset",
	},
})(MuiTableCell);

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
		position: "relative",
	},
	inputStyle: {
		background: "#EFEFF0",
		borderRadius: "7px",
	},
	inputPadding: {
		paddingLeft: "24px",
	},
	inputAdornment: {
		fontSize: 16,
		paddingLeft: "3px",
		height: "unset",
	},
	doneButton: {
		background: "#42DEB4",
		borderRadius: "100px",
		height: "47px",
		lineHeight: "1",
		color: "#ffffff",
		border: "unset",
		marginBottom: "20px",
		"&:hover": {
			background: "#42DEB4",
			border: "1px solid " + theme.palette.secondary.color,
		},
		width: "100%",
		fontSize: "18px",

		position: "relative",
		"& .MuiButton-startIcon": {
			position: "absolute",
			left: 24,
		},
		"& .MuiButton-startIcon span": {
			fontSize: "36px",
		},
		marginTop: "20px",
	},
	helperText: {
		position: "absolute",
		bottom: -8,
		right: 10,
		fontSize: 9,
	},
}));

const RenderInputField = ({
	state,
	callback,
	adornment,
	defValue,
	InputProps,
}) => {
	const classes = useStyles();
	const { id, value, disabled } = state;

	const inputProps = InputProps ? InputProps : {};
	const prefix = adornment && adornment.value ? adornment.value : null;

	const showAdornmentOnFocus =
		adornment && adornment.showOnFocus ? adornment.showOnFocus : false;

	const [showAdornment, setShowAdornment] = useState(false);

	let adornmentConfig = {};

	const defaultAdornmentConfig = {
		startAdornment: (
			<InputAdornment position="start">
				<Icon className={classes.inputAdornment}>{prefix}</Icon>
			</InputAdornment>
		),
	};

	if (prefix && value) {
		adornmentConfig = defaultAdornmentConfig;
	}

	const handleFocus = () => {
		setShowAdornment(showAdornmentOnFocus);
	};

	useEffect(() => {
		if (showAdornment) {
			adornmentConfig = defaultAdornmentConfig;
		} else {
			adornmentConfig = {};
		}
	}, [showAdornment]);

	return (
		<TextField
			id={id}
			value={value}
			disabled={disabled}
			name={id}
			type="number"
			onChange={(e) => {
				//not allowing $0
				if (e.target.value === "0") {
					e.target.value = "";
				}
				callback(Number(e.target.value), id);
			}}
			onFocus={(e) => handleFocus(e)}
			InputProps={{
				"aria-label": "description",
				disableUnderline: true,
				...inputProps,
				...adornmentConfig,
			}}
			classes={{
				root: clsx(
					classes.inputStyle,
					!showAdornment && !value && prefix ? classes.inputPadding : {}
				),
			}}
		/>
	);
};

function EditResultsClaims(props) {
	const classes = useStyles();
	const { width, data } = props;
	const [isPotrait, setIsPotrait] = useState(true);
	const [isValidParams, setisValidParams] = useState(false);
	const [nemoFactors, setNemoFactors] = useState({});
	const [results, setResults] = useState({});
	const [renderNemoFactor, setRenderNemoFactor] = useState(false);
	const router = useRouter();

	const dispatch = useDispatch();

	const { serviceCategoryData, resStatus, storeServiceCategoryFactorStatus } =
		useSelector(resultsClaimsModelState);
	const { savedModel } = useSelector(riskModelerState);

	useEffect(() => {
		const isPotrait = window.innerHeight > window.innerWidth;
		setIsPotrait(isPotrait);
	}, [width]);

	useEffect(() => {
		if (data.clientId && data.loa1Id) {
			// call api
			// dispatch(getCalculatedResultsAction(data));
			setisValidParams(true);
		} else {
			setisValidParams(false);
		}
	}, [data]);

	useEffect(() => {
		if (isValidParams) {
			const payload = {
				...data,
				modelId: router.query?.modelId,
			};
			dispatch(getServiceCategoryAction(payload));
		}
	}, [isValidParams]);

	const getRowHeader = (data) => {
		return (
			<TableCell component="th" className={styles.sidebarTableDefiniataion}>
				<div className={styles.sidebarTableDefiniataionWrapper}>
					<Button
						className={styles.editButton}
						onClick={() => handleClickEditDetailsModalOpen(data)}
					>
						<img src="/new/edit.svg" />
					</Button>
					<span className={styles.sidebarHeading}>
						{data.serviceCategoryName}
					</span>
				</div>
			</TableCell>
		);
	};

	const getResults = (serviceCategoryId) => {
		// const calculatedResultRow = calculatedResults.filter((result, index) => result.serviceCategoryId === serviceCategoryId);
		if (Object.keys(results).length) {
			const defaultValue = {
				value: 0,
			};
			const {
				unitsPerK = defaultValue,
				pmPm = defaultValue,
				paidPerService = defaultValue,
			} = results[serviceCategoryId] || {};

			// if above objects doesn't have value then it returns null to avoid page break;
			//   if (!unitsPerK?.value || !paidPerService?.value || !pmPm?.value)
			//     return null;
			//This check is commented to display cap pmpm

			return (
				<>
					<TableCell align="center" component="th">
						{unitsPerK?.value && (
							<NumberComponent>{unitsPerK?.value || ""}</NumberComponent>
						)}
					</TableCell>
					<TableCell align="right">
						{paidPerService?.value && (
							<CurrencyComponent decimalCount={2}>
								{paidPerService?.value || ""}
							</CurrencyComponent>
						)}
					</TableCell>
					<TableCell align="center">
						<CurrencyComponent decimalCount={2}>
							{pmPm?.value || ""}
						</CurrencyComponent>
					</TableCell>
				</>
			);
		} else {
			return (
				<>
					<TableCell component="th">TBC</TableCell>
					<TableCell align="left">TBC</TableCell>
					<TableCell align="left">TBC</TableCell>
				</>
			);
		}
	};

	useEffect(() => {
		let initialNemoFactors = {};

		if (serviceCategoryData) {
			const totalRows = serviceCategoryData.length;
			serviceCategoryData.map((serviceCategory, index) => {
				const uniqueId = serviceCategory.serviceCategoryId;
				const unitsPerKFactor = serviceCategory.unitsPerKFactor
					? serviceCategory.unitsPerKFactor
					: 1;
				const capitation = serviceCategory.capitation
					? serviceCategory.capitation
					: "";
				const pmpmFactor = serviceCategory.pmpmFactor
					? serviceCategory.pmpmFactor
					: 1;
				initialNemoFactors[uniqueId] = {
					paidPerService: {
						id: "paidPerService---" + uniqueId,
						value: pmpmFactor,
						disabled: false,
					},
					unitsPerK: {
						id: "unitsPerK---" + uniqueId,
						value: unitsPerKFactor,
						disabled: false,
					},
					capPmpm: {
						id: "capPmpm---" + uniqueId,
						value: capitation,
						disabled: false,
					},
				};

				if (index === totalRows - 1) {
					setNemoFactors(initialNemoFactors);
				}
			});

			//calculate dynamic height for table
		}
	}, [serviceCategoryData]);

	useEffect(() => {
		if (Object.keys(nemoFactors).length) {
			// initialize results
			const initializeResults = {};
			Object.keys(nemoFactors).forEach((serviceCategoryId) => {
				const claimCategoryRow = serviceCategoryData.filter(
					(result) => result.serviceCategoryId === serviceCategoryId
				);
				if (claimCategoryRow[0]) {
					const { capPmpm, paidPerService, unitsPerK } =
						nemoFactors[serviceCategoryId];
					const { unitsPerKBenchmark, pmPmBenchMark, paidPerServiceBenchmark } =
						claimCategoryRow[0];

					initializeResults[serviceCategoryId] = {
						unitsPerK: { value: unitsPerKBenchmark },
						paidPerService: { value: paidPerServiceBenchmark },
						pmPm: { value: 0 },
					};

					if (paidPerService.value || paidPerService.value == 0) {
						initializeResults[serviceCategoryId].paidPerService = {
							value: Number(paidPerService.value * paidPerServiceBenchmark),
						};
					}

					if (unitsPerK.value || unitsPerK.value == 0) {
						initializeResults[serviceCategoryId].unitsPerK = {
							value: Number(unitsPerK.value * unitsPerKBenchmark),
						};
					}

					const paidPerServiceInput = paidPerService.value
						? paidPerService.value
						: 1;
					const unitsPerKInput = unitsPerK.value ? unitsPerK.value : 1;

					const Ra = Number(paidPerServiceInput * paidPerServiceBenchmark);
					const Rb = Number(unitsPerKInput * unitsPerKBenchmark);
					const pmpmvalue = (Ra * Rb) / 12000;
					initializeResults[serviceCategoryId].pmPm = { value: pmpmvalue };

					if (capPmpm.value) {
						initializeResults[serviceCategoryId] = {
							unitsPerK: { value: "" },
							paidPerService: { value: "" },
							pmPm: { value: capPmpm.value },
						};
					}
				} else {
				}
			});

			setResults(initializeResults);
			setRenderNemoFactor(true);
		}
	}, [nemoFactors]);

	// useEffect(() => {
	//     if (results) {
	//
	//     }
	// }, [results])

	const handleNemoFactorInputChange = (inputValue, id) => {
		if (!id) {
			return;
		}
		// if (Math.abs(inputValue) > 3) {
		//   toast.info("Factors cannot be over +/- 3.");
		//   return;
		// }
		const splitArr = id.split("---");
		const nemoFactorKey = splitArr[0];
		const uniqueId = splitArr[1];

		const previousValue = nemoFactors[uniqueId][nemoFactorKey];

		let updatedNemoFactorValue = {
			[uniqueId]: {
				...nemoFactors[uniqueId],
				[nemoFactorKey]: { ...previousValue, value: inputValue || "" },
			},
		};

		// if user enters on cap pmpm disable paidPerService and unitsPerK
		if (nemoFactorKey === "capPmpm" && inputValue) {
			(updatedNemoFactorValue[uniqueId].paidPerService = {
				id: "paidPerService---" + uniqueId,
				value: 1,
				disabled: true,
			}),
				(updatedNemoFactorValue[uniqueId].unitsPerK = {
					id: "unitsPerK---" + uniqueId,
					value: 1,
					disabled: true,
				});
		} else {
			(updatedNemoFactorValue[uniqueId].paidPerService = {
				...updatedNemoFactorValue[uniqueId].paidPerService,
				disabled: false,
			}),
				(updatedNemoFactorValue[uniqueId].unitsPerK = {
					...updatedNemoFactorValue[uniqueId].unitsPerK,
					disabled: false,
				});
		}
		setNemoFactors({ ...nemoFactors, ...updatedNemoFactorValue });
	};

	const calculateTotal = (data, key) => {
		return data.reduce((ac, v) => {
			ac += Number(v[key]);
			return ac;
		}, 0);
	};

	const calculateResultsTotal = (data, key) => {
		if (data) {
			let resultTotal = 0;
			Object.keys(data).forEach((uniqueId) => {
				resultTotal += Number(data[uniqueId][key].value);
			});
			return resultTotal;
		}
		return "";
	};

	// modal
	const [openEditDetailsModal, setEditDetailsModalOpen] = useState(false);
	const [claimsCategoryRowData, setClaimsCategoryRowData] = useState({});

	const handleClickEditDetailsModalOpen = (data) => {
		setClaimsCategoryRowData(data);
		setEditDetailsModalOpen(true);
	};

	const handleDoneClick = () => {
		/* store the service category factor into database */
		/* prepare data */
		let payload = [];
		const modelId = router.query?.modelId;
		if (modelId && storeServiceCategoryFactorStatus !== REQUEST) {
			Object.keys(nemoFactors).forEach((serviceCategoryId) => {
				const { capPmpm, paidPerService, unitsPerK } =
					nemoFactors[serviceCategoryId];
				/* store only those field which has values */
				if (capPmpm.value || paidPerService.value || unitsPerK.value) {
					const data = {
						modelId,
						serviceCategoryId,
						capitation: capPmpm.value,
						pmPm: paidPerService.value ? paidPerService.value : 1,
						unitsPerK: unitsPerK.value ? unitsPerK.value : 1,
					};
					// const data = {
					// 	modelId,
					// 	serviceCategoryId,
					// 	capitation: capPmpm.value,
					// 	pmPm: paidPerService.value,
					// 	unitsPerK: unitsPerK.value,
					// };
					payload.push(data);
				}
			});
			dispatch(storeServiceCategoryFactorAction(payload));
			dispatch(resetResultClaimsDataFetchAction());
		}
	};

	useEffect(() => {
		if (storeServiceCategoryFactorStatus === SUCCESS) {
			/* back to previous page on saving success */
			dispatch(calculateSavingsAction({ modelId: router.query?.modelId }));
			router.push("/reporting/editmodel/" + router.query?.modelId);
		}
	}, [storeServiceCategoryFactorStatus]);

	if (resStatus === "PENDING" || !renderNemoFactor) {
		return <LinearProgressBar />;
	} else if (isValidParams) {
		return (
			<div className={styles.editRMDetails}>
				<NemoTable maxHeight={`80%`}>
					<TableHead>
						<TableRow>
							<TableCell>&nbsp;</TableCell>
							<TableCell
								align="center"
								colSpan={3}
								className={styles.tableHeaderTitle}
							>
								Budget
							</TableCell>
							<TableCell
								align="center"
								colSpan={3}
								className={styles.tableHeaderTitle}
							>
								Actual
							</TableCell>
							<TableCell
								align="center"
								colSpan={3}
								className={styles.tableHeaderTitle}
							>
								Program Impacts
							</TableCell>
							<TableCell
								align="center"
								colSpan={3}
								className={styles.tableHeaderTitle}
							>
								Results
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell
								className={`${styles.tableHeaderSubTitle} ${styles.sideTitle}`}
							>
								Claims Category
							</TableCell>

							{/* Budget */}
							<TableCell className={styles.tableHeaderSubTitle}>
								Units Per 1000
							</TableCell>
							<TableCell align="left" className={styles.tableHeaderSubTitle}>
								Paid Per Service
							</TableCell>
							<TableCell align="center" className={styles.tableHeaderSubTitle}>
								PMPM
							</TableCell>

							{/* Actual */}
							<TableCell className={styles.tableHeaderSubTitle}>
								Units Per 1000
							</TableCell>
							<TableCell align="left" className={styles.tableHeaderSubTitle}>
								Paid Per Service
							</TableCell>
							<TableCell align="center" className={styles.tableHeaderSubTitle}>
								PMPM
							</TableCell>

							{/* Nemo Factor */}
							<TableCell align="center" className={styles.tableHeaderSubTitle}>
								Units Per 1000
							</TableCell>
							<TableCell align="center" className={styles.tableHeaderSubTitle}>
								Paid Per Service
							</TableCell>
							<TableCell align="center" className={styles.tableHeaderSubTitle}>
								Cap. PMPM
							</TableCell>

							{/* Results */}
							<TableCell align="center" className={styles.tableHeaderSubTitle}>
								Units Per 1000
							</TableCell>
							<TableCell align="center" className={styles.tableHeaderSubTitle}>
								Paid Per Service
							</TableCell>
							<TableCell align="center" className={styles.tableHeaderSubTitle}>
								PMPM
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody className={styles.tableBodyRelative}>
						{serviceCategoryData &&
							Object.keys(nemoFactors).length !== 0 &&
							serviceCategoryData.map((categoryData, index) => {
								const {
									unitsPerK,
									paidPerService,
									pmPm,
									unitsPerKBenchmark,
									paidPerServiceBenchmark,
									pmPmBenchMark,
									serviceCategoryId,
								} = categoryData;
								// const { paidPerService: nemoPaidPerService = 0, unitsPerK: nemoUnitsPerK = 0, capPmpm: nemoCapPmpm = 0 } = nemoFactors[serviceCategoryId];
								// if (nemoPaidPerService || nemoUnitsPerK || nemoCapPmpm) doesn't have value from it;s nemoFactors[serviceCategoryId] then assign default to zero to avoid the page break
								const nemoPaidPerService =
									nemoFactors[serviceCategoryId]?.paidPerService || 0;
								const nemoUnitsPerK =
									nemoFactors[serviceCategoryId]?.unitsPerK || 0;

								const nemoCapPmpm =
									nemoFactors[serviceCategoryId]?.capPmpm || 0;

								return (
									<TableRow key={index}>
										{getRowHeader(categoryData)}
										<TableCell align="center">
											<NumberComponent>{unitsPerK}</NumberComponent>
										</TableCell>
										<TableCell align="right">
											<CurrencyComponent decimalCount={2}>
												{paidPerService}
											</CurrencyComponent>
										</TableCell>
										<TableCell align="center">
											<CurrencyComponent decimalCount={2}>
												{pmPm}
											</CurrencyComponent>
										</TableCell>

										<TableCell align="center" component="th">
											<NumberComponent>{unitsPerKBenchmark}</NumberComponent>
										</TableCell>
										<TableCell align="right">
											<CurrencyComponent decimalCount={2}>
												{paidPerServiceBenchmark}
											</CurrencyComponent>
										</TableCell>
										<TableCell align="center">
											<CurrencyComponent decimalCount={2}>
												{pmPmBenchMark}
											</CurrencyComponent>
										</TableCell>

										{/* nemo factor and corrected */}
										<TableCell align="left">
											<NemoNumberField
												value={nemoUnitsPerK?.value || 1}
												id={nemoUnitsPerK.id}
												callback={handleNemoFactorInputChange}
												type="decimal"
												factor={0.1}
												defaultValue={1}
												allowNegative
												max={1.3}
												min={0.7}
												disabled={nemoUnitsPerK?.disabled ||  nemoCapPmpm?.value !== ''  || false}
											/>
											{!nemoUnitsPerK?.disabled && (
												<Transition
													value={nemoUnitsPerK.value}
													factor={unitsPerKBenchmark}
												/>
											)}
										</TableCell>
										<TableCell align="left">
											<NemoNumberField
												value={nemoPaidPerService?.value || 1}
												id={nemoPaidPerService.id}
												callback={handleNemoFactorInputChange}
												type="decimal"
												factor={0.1}
												defaultValue={1}
												allowNegative
												max={1.3}
												min={0.7}
												disabled={nemoPaidPerService?.disabled || nemoCapPmpm?.value !== '' || false}
											/>
											{!nemoPaidPerService?.disabled && (
												<Transition
													value={nemoPaidPerService.value}
													factor={paidPerServiceBenchmark}
												/>
											)}
										</TableCell>
										<TableCell
											align="center"
											style={{
												paddingLeft: 0,
												paddingRight: 15,
												paddingTop: 20,
											}}
										>
											<TableCellInput>
												<RenderInputField
													state={nemoCapPmpm}
													callback={handleNemoFactorInputChange}
													InputProps={{ inputProps: { min: 0 } }}
													adornment={{ value: "$", showOnFocus: true }}
												/>
											</TableCellInput>
										</TableCell>

										{/* <TableCell align="left">
											<NemoNumberField
												value={nemoCapPmpm.value || 0}
												id={nemoCapPmpm.id}
												callback={handleNemoFactorInputChange}
												type="decimal"
												factor={1}
												start={1}
												min={0}
											/>
										</TableCell> */}

										{getResults(serviceCategoryId)}
									</TableRow>
								);
							})}

						{/* total */}
						<TableRow className={styles.lastRow}>
							<TableCell component="th">Total</TableCell>
							<TableCell align="left"></TableCell>
							<TableCell align="left"></TableCell>
							<TableCell align="center">
								<CurrencyComponent decimalCount={2}>
									{calculateTotal(serviceCategoryData, "pmPm")}
								</CurrencyComponent>
							</TableCell>

							<TableCell></TableCell>
							<TableCell align="left"></TableCell>
							<TableCell align="center">
								<CurrencyComponent decimalCount={2}>
									{calculateTotal(serviceCategoryData, "pmPmBenchMark")}
								</CurrencyComponent>
							</TableCell>

							<TableCell align="left"></TableCell>
							<TableCell align="left"></TableCell>
							<TableCell align="left"></TableCell>

							<TableCell></TableCell>
							<TableCell align="left"></TableCell>
							<TableCell align="center">
								<CurrencyComponent decimalCount={2}>
									{calculateResultsTotal(results, "pmPm")}
								</CurrencyComponent>
							</TableCell>
						</TableRow>
					</TableBody>
				</NemoTable>
				{/* <Grid item className={styles.fullWidth}>
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.doneButton}
                            onClick={(e) => { handleDoneClick(e) }}
                        >
                            {storeServiceCategoryFactorStatus !== REQUEST && "Done"}
                            {storeServiceCategoryFactorStatus === REQUEST && "Saving your changes. Please wait!"}
                        </Button>
                    </Grid>
                    {isPotrait &&
                        <Grid item className={styles.fullWidth} >
                            <Grid
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item>
                                    <img
                                        src="/rotate-icon.svg"
                                        alt="rotate icon"
                                        width={222}
                                        height={244}
                                    />
                                </Grid>
                                <Grid item>
                                    <span className={styles.tableHeaderTitle}>Rotate your screen to view more easily.</span>
                                </Grid>
                            </Grid>
                        </Grid>
                    } */}
				<div className={styles.editFooter}>
					<Grid container spacing={6} justifyContent="flex-end">
						<Grid
							item
							xs={6}
							lg={4}
							style={{
								textAlign: "right",
								borderLeft: `1px solid #DCDCDC`,
							}}
						>
							<Button
								variant="outlined"
								className={styles.prevBtn}
								onClick={() => {
									router.back();
								}}
							>
								Back
							</Button>

							<Button
								variant="contained"
								className={styles.nextBtn}
								onClick={(e) => {
									handleDoneClick(e);
								}}
							>
								{storeServiceCategoryFactorStatus !== REQUEST && "Save"}
								{storeServiceCategoryFactorStatus === REQUEST && "Saving..."}
							</Button>
						</Grid>
					</Grid>
				</div>
				{claimsCategoryRowData && openEditDetailsModal && (
					<EditDetails
						setModalOpen={setEditDetailsModalOpen}
						openModal={openEditDetailsModal}
						rowData={claimsCategoryRowData}
						nemoFactors={nemoFactors}
						setNemoFactors={setNemoFactors}
					/>
				)}
			</div>
		);
	} else {
		return <span>Parameters are invalid.</span>;
	}
}

export default withWidth()(EditResultsClaims);
