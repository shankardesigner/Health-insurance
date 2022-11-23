import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { useTheme, makeStyles, withStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
import styles from "./editdetails.module.scss";

const TableCell = withStyles({
	root: {
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
	},
})(MuiTableCell);

const ModalTableHeaderCell = withStyles({
	root: {
		borderBottom: "none",
		fontWeight: "bold",
		fontSize: "17px",
		lineHeight: "21px",
		color: "#3D3E64",
	},
})(MuiTableCell);

const ModalTableRowTitleCell = withStyles({
	root: {
		borderBottom: "none",
		fontWeight: "normal",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
		width: "10px",
	},
})(MuiTableCell);

const ModalTableCell = withStyles({
	root: {
		border: 0,
		fontWeight: "bold",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
	},
})(MuiTableCell);

const PrettoSlider = withStyles((theme) => ({
	root: {
		color: "#42DEB4",
		height: 8,
		marginLeft: "10px",
	},
	thumb: {
		height: 21,
		width: 21,
		backgroundColor: "#42DEB4",
		border: "2px solid #fff",
		marginTop: -7,
		marginLeft: -10,
		boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
		"&:focus, &:hover, &$active": {
			boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
		},
	},
	active: {},
	valueLabel: {
		left: "unset",
	},
	markLabel: {
		fontWeight: 500,
		fontSize: "12px",
		lineHeight: "15px",
		color: "rgba(61, 62, 100, 0.5)",
		[theme.breakpoints.down("md")]: {
			top: "36px",
		},
		[theme.breakpoints.up("md")]: {
			top: "32px",
		},
	},
	track: {
		height: 8,
		borderRadius: 4,
	},
	rail: {
		height: 8,
		borderRadius: 4,
	},
	mark: {
		opacity: 0,
	},
	markActive: {
		opacity: 0,
	},
}))(Slider);

const useStyles = makeStyles({
	modal: {
		backgroundColor: "lightgreen",
	},
	dialogActions: {
		justifyContent: "space-between !important",
	},
	clearTableBorder: { border: 0 },
	tableRightBorder: {
		borderRightWidth: 1,
		borderColor: "#E3E9FF",
		borderStyle: "solid",
	},
	tableBottomBorder: {
		borderBottomWidth: 1,
		borderColor: "#E3E9FF",
		borderStyle: "solid",
	},
	sliderRoot: {
		width: 120,
	},
	inputStyle: {
		background: "#EFEFF0",
		borderRadius: "7px",
	},
	inputPadding: {
		paddingLeft: "10px",
		fontSize: "12px",
	},
	inputAdornment: {
		fontSize: 13,
		paddingLeft: "0",
		height: "unset",
	},
	toggleBtn: {
		marginRight: "5px",
		borderRadius: "20px",
		border: "1px solid #000000",
		minWidth: "145px !important",
		maxHeight: "24px",
	},
	sliderInputRoot: {
		height: "55px",
	},
	inputWrapper: {
		paddingTop: "10px",
	},
});

function EditDetails({
	openModal,
	setModalOpen,
	rowData,
	nemoFactors,
	setNemoFactors,
}) {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const displaySliderDefault = false;

	const marks = [
		{
			value: 0.75,
			label: "0.75",
		},
		{
			value: 1.0,
			label: "1.0",
		},
		{
			value: 1.25,
			label: "1.25",
		},
	];

	// initialize default value
	const nemoFactor = nemoFactors[rowData.serviceCategoryId];
	const [modalState, setModalState] = useState({
		nemoPaidPerService: {
			value: nemoFactor.paidPerService.value
				? nemoFactor.paidPerService.value
				: "",
			disabled: nemoFactor.paidPerService.disabled
				? nemoFactor.paidPerService.disabled
				: false,
			slider: displaySliderDefault,
		},
		nemoUnitsPerK: {
			value: nemoFactor.unitsPerK.value ? nemoFactor.unitsPerK.value : "",
			disabled: nemoFactor.unitsPerK.disabled
				? nemoFactor.unitsPerK.disabled
				: false,
			slider: displaySliderDefault,
		},
		nemoCapPmpm: {
			value: nemoFactor.capPmpm.value ? nemoFactor.capPmpm.value : "",
			disabled: nemoFactor.capPmpm.disabled
				? nemoFactor.capPmpm.disabled
				: false,
			slider: displaySliderDefault,
		},
	});

	/* default slider value */
	const nemoPaidPerServiceSlider = nemoFactor.paidPerService.value
		? nemoFactor.paidPerService.value !== ""
			? nemoFactor.paidPerService.value
			: marks[0].value
		: marks[0].value;
	const nemoUnitsPerKSlider = nemoFactor.unitsPerK.value
		? nemoFactor.unitsPerK.value !== ""
			? nemoFactor.unitsPerK.value
			: marks[0].value
		: marks[0].value;

	const [sliderState, setSliderState] = useState({
		nemoPaidPerService: {
			value: nemoPaidPerServiceSlider,
			disabled: nemoFactor.paidPerService.disabled
				? nemoFactor.paidPerService.disabled
				: false,
			slider: displaySliderDefault,
		},
		nemoUnitsPerK: {
			value: nemoUnitsPerKSlider,
			disabled: nemoFactor.unitsPerK.disabled
				? nemoFactor.unitsPerK.disabled
				: false,
			slider: displaySliderDefault,
		},
	});

	const toggleBtnText = ["Custom Value", "Switch to Slider"];
	const toggleSliderAndCustomInput = (key) => {
		setSliderState({
			...sliderState,
			[key]: {
				...sliderState[key],
				slider: !sliderState[key].slider,
			},
		});
	};

	const [results, setResults] = useState({
		unitsPerK: { value: "" },
		paidPerService: { value: "" },
		pmPm: { value: "" },
	});

	const handleModalClose = () => {
		setModalOpen(false);
	};

	/* slider */
	const handleSliderChange = (event, value, name) => {
		setModalState({
			...modalState,
			[name]: { ...sliderState[name], value: value },
		});
	};

	useEffect(() => {
		setSliderState({ ...sliderState, ...modalState });
	}, [modalState]);

	useEffect(() => {
		/* initialize results */
		const {
			nemoCapPmpm: capPmpm,
			nemoPaidPerService: paidPerService,
			nemoUnitsPerK: unitsPerK,
		} = modalState;
		const { unitsPerKBenchmark, pmPmBenchMark, paidPerServiceBenchmark } =
			rowData;

		let initializeResults = {
			unitsPerK: { value: unitsPerKBenchmark },
			paidPerService: { value: paidPerServiceBenchmark },
			pmPm: { value: pmPmBenchMark },
		};

		if (paidPerService.value) {
			initializeResults.paidPerService = {
				value: Number(paidPerService.value * paidPerServiceBenchmark),
			};
		}

		if (unitsPerK.value) {
			initializeResults.unitsPerK = {
				value: Number(unitsPerK.value * unitsPerKBenchmark),
			};
		}

		if (paidPerService.value && unitsPerK.value) {
			const Ra = Number(paidPerService.value * paidPerServiceBenchmark);
			const Rb = Number(unitsPerK.value * unitsPerKBenchmark);
			const pmpmvalue = (Ra * Rb) / 12000;
			initializeResults.pmPm = { value: pmpmvalue };
		}

		if (capPmpm.value) {
			initializeResults = {
				unitsPerK: { value: "" },
				paidPerService: { value: "" },
				pmPm: { value: capPmpm.value },
			};
		}
		setResults(initializeResults);
	}, [modalState]);

	const handleSliderInputChange = (event) => {
		if (event.target.name === "nemoCapPmpm" && event.target.value) {
			/* disable NEMO factors */
			setModalState({
				...modalState,
				nemoPaidPerService: {
					...sliderState["nemoPaidPerService"],
					value: "",
					disabled: true,
				},
				nemoUnitsPerK: {
					...sliderState["nemoUnitsPerK"],
					value: "",
					disabled: true,
				},
				[event.target.name]: {
					value: event.target.value,
					disabled: false,
				},
			});
			setSliderState({
				...sliderState,
				nemoPaidPerService: {
					...sliderState["nemoPaidPerService"],
					value: "",
					disabled: true,
				},
				nemoUnitsPerK: {
					...sliderState["nemoUnitsPerK"],
					value: "",
					disabled: true,
				},
			});
		}
		if (event.target.name === "nemoCapPmpm" && event.target.value == "") {
			/* enable NEMO factors */
			setModalState({
				...modalState,
				nemoPaidPerService: {
					...sliderState["nemoPaidPerService"],
					value: "",
					disabled: false,
				},
				nemoUnitsPerK: {
					...sliderState["nemoUnitsPerK"],
					value: "",
					disabled: false,
				},
				[event.target.name]: {
					value: event.target.value,
					disabled: false,
				},
			});
			setSliderState({
				...sliderState,
				nemoPaidPerService: {
					...sliderState["nemoPaidPerService"],
					value: "",
					disabled: false,
				},
				nemoUnitsPerK: {
					...sliderState["nemoUnitsPerK"],
					value: "",
					disabled: false,
				},
			});
		}
		if (event.target.name !== "nemoCapPmpm") {
			setModalState({
				...modalState,
				[event.target.name]: {
					...modalState[event.target.name],
					...sliderState[event.target.name],
					value: event.target.value,
				},
			});
		}
	};

	const handleModalApply = () => {
		/* save modal state to global nemo factor state */
		const uniqueId = rowData.serviceCategoryId;
		const updatedObject = {
			paidPerService: {
				id: "paidPerService---" + uniqueId,
				value: modalState.nemoPaidPerService.value,
				disabled: modalState.nemoPaidPerService.disabled,
			},
			unitsPerK: {
				id: "unitsPerK---" + uniqueId,
				value: modalState.nemoUnitsPerK.value,
				disabled: modalState.nemoUnitsPerK.disabled,
			},
			capPmpm: {
				id: "capPmpm---" + uniqueId,
				value: modalState.nemoCapPmpm.value,
				disabled: modalState.nemoCapPmpm.disabled,
			},
		};
		setNemoFactors({
			...nemoFactors,
			[uniqueId]: {
				...updatedObject,
			},
		});
		setModalOpen(false);
	};

	function valuetext(value) {
		return `${value}`;
	}

	const { nemoPaidPerService, nemoUnitsPerK, nemoCapPmpm } = modalState;

	const modalClasses = useStyles();
	if (Object.keys(rowData).length) {
		const {
			unitsPerK,
			paidPerService,
			pmPm,
			unitsPerKBenchmark,
			paidPerServiceBenchmark,
			pmPmBenchMark,
			serviceCategoryId,
			serviceCategoryName,
		} = rowData;
		return (
			<Dialog
				fullScreen={fullScreen}
				maxWidth={"md"}
				open={openModal}
				onClose={handleModalClose}
				aria-labelledby="responsive-dialog-title"
				BackdropProps={{ style: { backgroundColor: "rgba(62, 63, 100, 0.9)" } }}
				PaperProps={{ style: { paddingLeft: "20px", paddingRight: "20px" } }}
				classes={{ paper: styles.dialogPaper }}
			>
				<DialogTitle
					className={styles.modalHeader}
					component="div"
					disableTypography={true}
				>
					{serviceCategoryName}
				</DialogTitle>
				<DialogContent>
					<TableContainer component={Paper} elevation={0}>
						<Table className={classes.table} aria-label="simple table">
							<TableHead>
								<TableRow>
									<ModalTableHeaderCell align={"left"}></ModalTableHeaderCell>
									<ModalTableHeaderCell align={"left"}>
										Paid Per Service
									</ModalTableHeaderCell>
									<ModalTableHeaderCell align={"left"}>
										Units Per 1000
									</ModalTableHeaderCell>
									<ModalTableHeaderCell align={"left"}>
										PMPM
									</ModalTableHeaderCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{/* Budget */}
								<TableRow>
									<ModalTableRowTitleCell align={"left"}>
										Budget
									</ModalTableRowTitleCell>
									<ModalTableCell
										align={"left"}
										className={modalClasses.tableRightBorder}
									>
										<CurrencyComponent decimalCount={2}>
											{paidPerService}
										</CurrencyComponent>
									</ModalTableCell>
									<ModalTableCell
										align={"left"}
										className={modalClasses.tableRightBorder}
									>
										<NumberComponent>{unitsPerK}</NumberComponent>
									</ModalTableCell>
									<ModalTableCell align={"left"}>
										<CurrencyComponent decimalCount={2}>
											{pmPm}
										</CurrencyComponent>
									</ModalTableCell>
								</TableRow>

								{/* Actual */}
								<TableRow>
									<ModalTableRowTitleCell align={"left"}>
										Actual
									</ModalTableRowTitleCell>
									<ModalTableCell
										align={"left"}
										className={modalClasses.tableRightBorder}
									>
										<CurrencyComponent decimalCount={2}>
											{paidPerServiceBenchmark}
										</CurrencyComponent>
									</ModalTableCell>
									<ModalTableCell
										align={"left"}
										className={modalClasses.tableRightBorder}
									>
										<NumberComponent>{unitsPerKBenchmark}</NumberComponent>
									</ModalTableCell>
									<ModalTableCell align={"left"}>
										<CurrencyComponent decimalCount={2}>
											{pmPmBenchMark}
										</CurrencyComponent>
									</ModalTableCell>
								</TableRow>

								{/* Modeling */}
								<TableRow style={{ minHeight: 100 }}>
									<ModalTableRowTitleCell align={"left"}>
										Modeling
									</ModalTableRowTitleCell>

									<ModalTableCell
										align={"left"}
										className={modalClasses.tableRightBorder}
									>
										{/* Slider */}
										<Grid
											container
											direction="column"
											justifyContent="flex-start"
											alignItems="flex-start"
										>
											<Grid item xs={12}>
												<Grid
													container
													direction="row"
													justifyContent="flex-start"
													alignItems="flex-start"
													spacing={1}
												>
													<Grid item>
														<img
															src="/nemo-small.svg"
															alt="nemo logo"
															height="16px"
														/>
													</Grid>
													<Grid item>
														<span className={styles.nemoFactor}>Factor</span>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={12}>
												<div className={modalClasses.sliderInputRoot}>
													{sliderState.nemoPaidPerService.slider && (
														<div className={modalClasses.sliderRoot}>
															<PrettoSlider
																onChange={(e, newValue) =>
																	handleSliderChange(
																		e,
																		newValue,
																		"nemoPaidPerService"
																	)
																}
																value={Number(
																	sliderState.nemoPaidPerService.value
																)}
																disabled={
																	sliderState.nemoPaidPerService.disabled
																}
																getAriaValueText={valuetext}
																aria-labelledby="discrete-slider-always"
																step={0.01}
																marks={marks}
																min={0.75}
																max={1.25}
																valueLabelDisplay="auto"
															/>
														</div>
													)}

													{!sliderState.nemoPaidPerService.slider && (
														<div className={modalClasses.inputWrapper}>
															<Input
																name="nemoPaidPerService"
																value={nemoPaidPerService.value}
																disabled={nemoPaidPerService.disabled}
																classes={{
																	root: clsx(
																		modalClasses.inputStyle,
																		modalClasses.inputPadding
																	),
																}}
																margin="dense"
																onChange={handleSliderInputChange}
																disableUnderline={true}
																inputProps={{
																	step: 0.01,
																	min: 0.75,
																	max: 1.25,
																	type: "number",
																	"aria-labelledby": "input-slider",
																}}
															/>
														</div>
													)}
												</div>
											</Grid>
											<Grid item xs={12}>
												<Button
													variant="outlined"
													className={clsx(classes.toggleBtn)}
													disabled={sliderState.nemoPaidPerService.disabled}
													onClick={() =>
														toggleSliderAndCustomInput("nemoPaidPerService")
													}
												>
													{sliderState.nemoPaidPerService.slider
														? toggleBtnText[0]
														: toggleBtnText[1]}
												</Button>
											</Grid>
										</Grid>
									</ModalTableCell>
									<ModalTableCell
										align={"left"}
										className={modalClasses.tableRightBorder}
									>
										{/* Slider */}
										<Grid
											container
											direction="column"
											justifyContent="flex-start"
											alignItems="flex-start"
										>
											<Grid item xs={12}>
												<Grid
													container
													direction="row"
													justifyContent="flex-start"
													alignItems="flex-start"
													spacing={1}
												>
													<Grid item>
														<img
															src="/nemo-small.svg"
															alt="nemo logo"
															height="16px"
														/>
													</Grid>
													<Grid item>
														<span className={styles.nemoFactor}>Factor</span>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={12}>
												<div className={modalClasses.sliderInputRoot}>
													{sliderState.nemoUnitsPerK.slider && (
														<div className={modalClasses.sliderRoot}>
															<PrettoSlider
																value={Number(sliderState.nemoUnitsPerK.value)}
																disabled={sliderState.nemoUnitsPerK.disabled}
																onChange={(e, newValue) =>
																	handleSliderChange(
																		e,
																		newValue,
																		"nemoUnitsPerK"
																	)
																}
																getAriaValueText={valuetext}
																aria-labelledby="discrete-slider-always"
																step={0.01}
																marks={marks}
																min={0.75}
																max={1.25}
																valueLabelDisplay="auto"
															/>
														</div>
													)}

													{!sliderState.nemoUnitsPerK.slider && (
														<div className={modalClasses.inputWrapper}>
															<Input
																name="nemoUnitsPerK"
																value={nemoUnitsPerK.value}
																disabled={nemoUnitsPerK.disabled}
																classes={{
																	root: clsx(
																		modalClasses.inputStyle,
																		modalClasses.inputPadding
																	),
																}}
																margin="dense"
																onChange={handleSliderInputChange}
																disableUnderline={true}
																inputProps={{
																	step: 0.01,
																	min: 0.75,
																	max: 1.25,
																	type: "number",
																	"aria-labelledby": "input-slider",
																}}
															/>
														</div>
													)}
												</div>
											</Grid>
											<Grid item xs={12}>
												<Button
													variant="outlined"
													className={clsx(classes.toggleBtn)}
													disabled={sliderState.nemoUnitsPerK.disabled}
													onClick={() =>
														toggleSliderAndCustomInput("nemoUnitsPerK")
													}
												>
													{sliderState.nemoUnitsPerK.slider
														? toggleBtnText[0]
														: toggleBtnText[1]}
												</Button>
											</Grid>
										</Grid>
									</ModalTableCell>
									<ModalTableCell
										align={"left"}
										style={{ verticalAlign: "top" }}
									>
										{/* <RenderInputField state={{ id: 'cappmpmslide', value: '80.53', disabled: false }}
                                                callback={() => { }}
                                                adornment={{ value: "$", showOnFocus: true }} /> */}

										<Grid
											container
											direction="column"
											justifyContent="flex-start"
											alignItems="flex-start"
										>
											<Grid item xs={12}>
												<Grid
													container
													direction="row"
													justifyContent="flex-start"
													alignItems="flex-start"
													spacing={1}
												>
													<Grid item>
														<span className={styles.nemoFactor}>
															Capitation PMPM
														</span>
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={12}>
												<div style={{ paddingTop: "12px" }}>
													<Input
														name="nemoCapPmpm"
														value={nemoCapPmpm.value}
														disabled={nemoCapPmpm.disabled}
														classes={{
															root: clsx(
																modalClasses.inputStyle,
																modalClasses.inputPadding
															),
														}}
														margin="dense"
														onChange={handleSliderInputChange}
														disableUnderline={true}
														startAdornment={
															<InputAdornment position="start">
																<Icon className={modalClasses.inputAdornment}>
																	$
																</Icon>
															</InputAdornment>
														}
														inputProps={{
															step: 0.01,
															min: 0.75,
															max: 1.25,
															type: "number",
															"aria-labelledby": "input-slider",
														}}
													/>
												</div>
											</Grid>
										</Grid>
									</ModalTableCell>
								</TableRow>

								{/* Result */}
								<TableRow>
									<ModalTableRowTitleCell
										align={"left"}
										className={clsx(
											modalClasses.clearTableBorder,
											modalClasses.tableBottomBorder
										)}
									>
										Result
									</ModalTableRowTitleCell>
									<ModalTableCell
										align={"left"}
										className={clsx(
											modalClasses.tableRightBorder,
											modalClasses.tableBottomBorder
										)}
									>
										<CurrencyComponent decimalCount={2}>
											{results.paidPerService.value}
										</CurrencyComponent>
									</ModalTableCell>
									<ModalTableCell
										align={"left"}
										className={clsx(
											modalClasses.tableRightBorder,
											modalClasses.tableBottomBorder
										)}
									>
										<NumberComponent>{results.unitsPerK.value}</NumberComponent>
									</ModalTableCell>
									<ModalTableCell
										align={"left"}
										className={modalClasses.tableBottomBorder}
									>
										<CurrencyComponent decimalCount={2}>
											{results.pmPm.value}
										</CurrencyComponent>
									</ModalTableCell>
								</TableRow>
							</TableBody>
							<TableFooter>
								<TableRow>
									<ModalTableHeaderCell
										align={"left"}
										style={{ verticalAlign: "top", paddingTop: "21px" }}
									>
										Projected Savings
									</ModalTableHeaderCell>
									<ModalTableCell
										align={"left"}
										style={{ verticalAlign: "top" }}
									>
										<span className={styles.bigGreenText}>$98k</span>
									</ModalTableCell>
									<ModalTableCell
										padding="none"
										align={"left"}
										colSpan={2}
										style={{ verticalAlign: "top", paddingTop: "10px" }}
									>
										<Table aria-label="simple table" padding="none">
											<TableBody>
												<TableRow>
													<TableCell>
														<span className={styles.savingsText}>
															Inpatient Acute Savings
														</span>
													</TableCell>
													<TableCell align="right">
														<span className={styles.savingsValue}>7.2%</span>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>
														<span className={styles.savingsText}>
															Inpatient Hospital Savings
														</span>
													</TableCell>
													<TableCell align="right">
														<span className={styles.savingsValue}>7.2%</span>
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell>
														<span className={styles.savingsText}>
															Total Medical Savings
														</span>
													</TableCell>
													<TableCell align="right">
														<span className={styles.savingsValue}>7.2%</span>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</ModalTableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</TableContainer>
				</DialogContent>
				<DialogActions classes={{ root: modalClasses.dialogActions }}>
					<Button
						onClick={handleModalClose}
						className={styles.greyButton}
						fullWidth={true}
					>
						Back
					</Button>
					<Button
						className={styles.greenButton}
						fullWidth={true}
						onClick={handleModalApply}
					>
						Apply
					</Button>
				</DialogActions>
			</Dialog>
		);
	} else {
		return <></>;
	}
}
export default EditDetails;
