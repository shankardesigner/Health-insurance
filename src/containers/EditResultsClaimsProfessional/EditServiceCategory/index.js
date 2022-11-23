import { useEffect, useState } from "react";
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
import Button from "@material-ui/core/Button";
import Router, { useRouter } from "next/router";
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
	getCalculatedResultsAction,
	resultsClaimsModelState,
	resetResultClaimsDataFetchAction,
} from "@slices/resultsClaimsSlice";

import {
	calculateSavingsAction,
	riskModelerState,
} from "@slices/riskModelerSlice";

import { useSelector, useDispatch } from "react-redux";
import NemoTable from "src/shared/NemoTable";
import NemoNumberField from "src/shared/NemoNumberField";
import { toast } from "react-toastify";

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
		minWidth: "100px",
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "14px",
		color: "#3D3E64",
		padding: "15px !important",
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
		"&:hover": {
			background: "#42DEB4",
			border: "1px solid " + theme.palette.secondary.color,
		},
		width: "82%",
		fontSize: "18px",

		"& .MuiButton-startIcon": {
			position: "absolute",
			left: 24,
		},
		"& .MuiButton-startIcon span": {
			fontSize: "36px",
		},
		marginTop: "20px",
		position: "fixed",
		bottom: "80px",
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
	const defaultValue = defValue ? defValue : "";
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
			onChange={(e) => callback(e)}
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

function EditServiceCategory(props) {
	const classes = useStyles();
	const router = useRouter();
	const { width, data } = props;
	const [isPotrait, setIsPotrait] = useState(true);
	const [isValidParams, setisValidParams] = useState(false);
	const [nemoFactors, setNemoFactors] = useState({});
	const [results, setResults] = useState({});
	const [renderNemoFactor, setRenderNemoFactor] = useState(false);

	const dispatch = useDispatch();

	const {
		serviceCategoryData,
		calculatedResults,
		resStatus,
		storeServiceCategoryFactorStatus,
	} = useSelector(resultsClaimsModelState);
	const { savedModel } = useSelector(riskModelerState);

	useEffect(() => {
		const isPotrait = window.innerHeight > window.innerWidth;
		setIsPotrait(isPotrait);
	}, [width]);

	useEffect(() => {
		if (data.clientId && data.loa1Id) {
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
				modelId: savedModel.modelId,
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
			console.log(
				".....default value check passed in service category page........"
			);
			return (
				<>
					<TableCell align="left">
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
					<TableCell align="left">
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
		}
	}, [serviceCategoryData]);

	useEffect(() => {
		if (Object.keys(nemoFactors).length) {
			// initialize results
			const initializeResults = {};
			Object.keys(nemoFactors).forEach((serviceCategoryId, index) => {
				const claimCategoryRow = serviceCategoryData.filter(
					(result, index) => result.serviceCategoryId === serviceCategoryId
				);
				if (claimCategoryRow[0]) {
					const {
						capPmpm = 0,
						paidPerService = 0,
						unitsPerK = 0,
					} = nemoFactors[serviceCategoryId] || {};
					const { unitsPerKBenchmark, pmPmBenchMark, paidPerServiceBenchmark } =
						claimCategoryRow[0];

					initializeResults[serviceCategoryId] = {
						unitsPerK: { value: unitsPerKBenchmark },
						paidPerService: { value: paidPerServiceBenchmark },
						pmPm: { value: pmPmBenchMark },
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
					console.log("No row found");
				}
			});

			setResults(initializeResults);
			setRenderNemoFactor(true);
		}
	}, [nemoFactors]);

	const handleNemoFactorInputChange = (inputValue, id) => {
		// if (Math.abs(inputValue) > 30) {
		//     toast.info("Factors cannot be over +/- 30.");
		//   }
		const splitArr = id.split("---");
		const nemoFactorKey = splitArr[0];
		const uniqueId = splitArr[1];

		const previousValue = nemoFactors[uniqueId][nemoFactorKey];
		let updatedNemoFactorValue = {
			[uniqueId]: {
				...nemoFactors[uniqueId],
				[nemoFactorKey]: { ...previousValue, value: inputValue },
			},
		};
		// if user enters on cap pmpm disable paidPerService and unitsPerK
		if (nemoFactorKey === "capPmpm" && inputValue) {
			(updatedNemoFactorValue[uniqueId].paidPerService = {
				id: "paidPerService---" + uniqueId,
				value: "",
				disabled: true,
			}),
				(updatedNemoFactorValue[uniqueId].unitsPerK = {
					id: "unitsPerK---" + uniqueId,
					value: "",
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
		return data?.reduce((ac, v) => {
			ac += Number(v[key]);
			return ac;
		}, 0);
	};

	const calculateResultsTotal = (data, key) => {
		if (data) {
			let resultTotal = 0;
			// debugger;
			Object.keys(data)?.forEach((uniqueId, index) => {
				resultTotal += Number(data[uniqueId][key]?.value);
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
		const modelId = savedModel.modelId;
		if (modelId && storeServiceCategoryFactorStatus !== REQUEST) {
			Object.keys(nemoFactors).forEach((serviceCategoryId, index) => {
				const { capPmpm, paidPerService, unitsPerK } =
					nemoFactors[serviceCategoryId];
				/* store only those field which has values */
				/* Updated : Removed the check to ensure value gets saved when user clear the field and saves it*/
				// if (capPmpm.value || paidPerService.value || unitsPerK.value) {
				const data = {
					modelId,
					serviceCategoryId,
					capitation: capPmpm.value,
					pmPm:
						paidPerService?.value || paidPerService?.value === 0
							? paidPerService.value
							: 1,
					unitsPerK:
						unitsPerK?.value || unitsPerK?.value === 0 ? unitsPerK.value : 1,
				};
				payload.push(data);
				// }
			});
			dispatch(storeServiceCategoryFactorAction(payload));
			dispatch(resetResultClaimsDataFetchAction());
		}
	};

	useEffect(() => {
		if (storeServiceCategoryFactorStatus === SUCCESS) {
			/* back to previous page on saving success */
			//   router.push("/reporting/newmodel");
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
							<TableCell align="left"></TableCell>
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
								colSpan={2}
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
							<TableCell className={styles.tableHeaderSubTitle}>
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
							<TableCellInput
								align="center"
								className={styles.tableHeaderSubTitle}
							>
								{" "}
								Units Per 1000
							</TableCellInput>
							<TableCellInput
								align="center"
								className={styles.tableHeaderSubTitle}
							>
								Paid Per Service
							</TableCellInput>

							{/* Results */}
							<TableCell className={styles.tableHeaderSubTitle}>
								Units Per 1000
							</TableCell>
							<TableCell align="left" className={styles.tableHeaderSubTitle}>
								Paid Per Service
							</TableCell>
							<TableCell align="left" className={styles.tableHeaderSubTitle}>
								PMPM
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
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
									pmpmFactor,
									unitsPerKFactor,
								} = categoryData;

								if (nemoFactors[serviceCategoryId]) {
									const {
										paidPerService: nemoPaidPerService = "",
										unitsPerK: nemoUnitsPerK = "",
									} = nemoFactors[serviceCategoryId];

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

											<TableCellInput align="left">
												{/* <RenderInputField
                          state={nemoUnitsPerK}
                          callback={handleNemoFactorInputChange}
                        /> */}
												<NemoNumberField
													value={
														unitsPerKFactor === null
															? 1
															: nemoUnitsPerK?.value === ""
															? 0
															: nemoPaidPerService.value || 1
													}
													id={nemoUnitsPerK?.id}
													callback={handleNemoFactorInputChange}
													type="decimal"
													defaultValue={1}
													factor={0.1}
													start={0.1}
													max={1.3}
													min={0.7}
												/>
											</TableCellInput>

											{/* nemo factor */}
											<TableCellInput align="left">
												{/* <RenderInputField
                          state={nemoPaidPerService}
                          callback={handleNemoFactorInputChange}
                        /> */}
												<NemoNumberField
													value={
														pmpmFactor === null
															? 1
															: nemoPaidPerService.value === ""
															? 0
															: nemoPaidPerService.value
													}
													id={nemoPaidPerService?.id}
													callback={handleNemoFactorInputChange}
													type="decimal"
													defaultValue={1}
													factor={0.1}
													start={0.1}
													max={1.3}
													min={0.7}
												/>
											</TableCellInput>

											{getResults(serviceCategoryId)}
										</TableRow>
									);
								}
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

							<TableCell component="th"></TableCell>
							<TableCell align="left"></TableCell>
							<TableCell align="center">
								<CurrencyComponent decimalCount={2}>
									{calculateTotal(serviceCategoryData, "pmPmBenchMark")}
								</CurrencyComponent>
							</TableCell>

							<TableCell align="left"></TableCell>
							<TableCell align="left"></TableCell>

							<TableCell></TableCell>
							<TableCell align="left"></TableCell>
							<TableCell align="left">
								<CurrencyComponent decimalCount={2}>
									{calculateResultsTotal(results, "pmPm")}
								</CurrencyComponent>
							</TableCell>
						</TableRow>
					</TableBody>
				</NemoTable>
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
                    </Grid> */}
				{/* {isPotrait &&
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

export default withWidth()(EditServiceCategory);
