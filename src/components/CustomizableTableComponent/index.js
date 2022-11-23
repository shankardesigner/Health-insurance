import { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Router, { useRouter } from "next/router";
import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import InfoIcon from "@material-ui/icons/Info";
import { IconButton } from "@material-ui/core";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import styles from "./customizabletablecomponent.module.css";
import LinearProgressBar from "@components/LinearProgressBar";
import commons from "@constants/common";
const { REQUEST, SUCCESS, PENDING, FAILURE, ACTION_SUCCESS, ACTION_FAILURE } =
	commons;

import { useSelector, useDispatch } from "react-redux";
import NemoIcon from "@components/NewLayout/NemoIcon";
import { indexes } from "d3-array";
import { forEach } from "lodash";

const TableCell = withStyles((theme) => ({
	root: {
		borderBottom: "none",
		fontWeight: "normal",
		fontSize: "16px",
		lineHeight: "37px",
		color: theme.palette.common.black,
		align: "center !important",
		// borderRight: "1px solid #EFEFF0",
		verticalAlign: "center",
	},
}))(MuiTableCell);

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
	root: {
		// border: "1px solid #EFEFF0",
		// borderRadius: 10,
	},
	table: {
		minWidth: 650,
		width: "100%",
	},
	darkBackground: {
		background: "#efeaf0",
	},
	tableHeaderTitle: {
		fontWeight: "bold !important",
		color: "#5A2C6D",
	},
	mutedBtn: {
		background: "#EFEFF0",
		color: "#5A2C6D",
		fontSize: 14,
		fontWeight: "bold",
		margin: 5,
	},
	fullWidth: {
		width: "100%",
	},
	dialogTitle: {
		color: "#3D3E64",
		fontWeight: "bold",
		borderBottom: "3px solid #5A2C6D",
		padding: 10,
		fontSize: 20,
		marginBottom: 10,
	},
	subHeaderFormControl: {
		justifySelf: "center",
		width: "100%",
	},
	saveBtn: {
		borderRadius: 20,
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 10,
		marginBottom: 10,
		"&:hover": {
			backgroundColor: theme.palette.secondary.main,
		},
	},
	tableRowBorder: {
		borderBottom: "1px solid #EFEFF0",
	},
	borderBottom: {
		borderBottom: "3px solid #5A2C6D",
	},
	stickyHeaderRight: {
		position: "sticky",
		right: 0,
		borderBottom: "3px solid white",
	},
	stickyHeaderLeft: {
		position: "sticky",
		left: 0,
		borderBottom: "3px solid white",
	},
	bgWhite: {
		backgroundColor: "white",
	},
	filterOutlineBtn: {
		background: "white",
		color: "#06406D",
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: "15px",
		border: "1px solid #06406D",
		borderRadius: 5,
		height: "40px",
	},
}));

export default function CustomizableTableComponent({
	allColumns,
	data,
	renderTableBody,
	customize,
}) {
	const classes = useStyles();
	const router = useRouter();
	const dispatch = useDispatch();
	const [selectedColumns, setSelectedColumns] = useState(
		allColumns.map((column, index) =>
			index < 4
				? {
						...column,
						visibility: true,
						subHeader: column.subHeader.map((subColumn, index) =>
							index >= 0 ? { ...subColumn, visibility: true } : { ...subColumn }
						),
				  }
				: {
						...column,
						visibility: false,
						subHeader: column.subHeader.map((subColumn, index) =>
							index >= 0 ? { ...subColumn, visibility: true } : { ...subColumn }
						),
				  }
		)
	);
	const [tempSelectedColumns, setTempSelectedColumns] =
		useState(selectedColumns);
	const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
	const [customizeHeaderCheckbox, setCustomizeHeaderCheckbox] = useState({});
	const [customizeSubHeaderCheckbox, setCustomizeSubHeaderCheckbox] = useState(
		{}
	);

	const handleCustomizeHeaderCheckbox = (event, columnHeader) => {
		setCustomizeHeaderCheckbox({
			...customizeHeaderCheckbox,
			[event.target.name]: event.target.checked,
		});
		if (event.target.checked) {
			setChildrenCheckboxTrue(columnHeader);
			setTempSelectedColumns(
				tempSelectedColumns.map((column) =>
					column.header === columnHeader.header
						? {
								...column,
								visibility: true,
								subHeader: column.subHeader.map((subColumn, index) =>
									index === 0
										? { ...subColumn, visibility: true }
										: { ...subColumn }
								),
						  }
						: { ...column }
				)
			);
		} else {
			setTempSelectedColumns(
				tempSelectedColumns.map((column) =>
					column.header === columnHeader.header
						? { ...column, visibility: false }
						: { ...column }
				)
			);
		}
	};

	const handleCustomizeSubHeaderCheckbox = (
		event,
		columnHeader,
		columnSubHeader
	) => {
		setCustomizeSubHeaderCheckbox({
			...customizeSubHeaderCheckbox,
			[event.target.name]: event.target.checked,
		});
		if (event.target.checked) {
			setTempSelectedColumns(
				tempSelectedColumns.map((column, index) =>
					index >= 0 && columnHeader === column.header
						? {
								...column,
								subHeader: column.subHeader.map((subColumn) =>
									subColumn.name === columnSubHeader
										? { ...subColumn, visibility: true }
										: { ...subColumn }
								),
						  }
						: {
								...column,
						  }
				)
			);
		} else {
			setTempSelectedColumns(
				tempSelectedColumns
					.map((column, index) =>
						index >= 0 && columnHeader === column.header
							? {
									...column,
									subHeader: column.subHeader.map((subColumn) =>
										subColumn.name === columnSubHeader
											? { ...subColumn, visibility: false }
											: { ...subColumn }
									),
							  }
							: {
									...column,
							  }
					)
					.map((column) =>
						column.subHeader.filter(
							(subColumn) => subColumn.visibility !== false
						).length === 0
							? setParentCheckboxFalse(column)
							: { ...column }
					),
				() => setSelectedColumns(tempSelectedColumns)
			);
		}
	};

	const setParentCheckboxFalse = (column) => {
		setCustomizeHeaderCheckbox({
			...customizeHeaderCheckbox,
			[column.header]: false,
		});

		return {
			...column,
			visibility: false,
		};
	};

	const setChildrenCheckboxTrue = (_column) => {
		if (_column.subHeader.length !== 0) {
			setCustomizeSubHeaderCheckbox({
				...customizeSubHeaderCheckbox,
				[_column.header + _column.subHeader[0].name]: true,
			});
		}
	};

	const initialHeaderCheckboxState = () => {
		let data = {};
		selectedColumns.map((columnHeader) => {
			columnHeader.visibility ? (data[columnHeader.header] = true) : null;
		});
		setCustomizeHeaderCheckbox(data);
	};

	const initialSubHeaderCheckboxState = () => {
		let data = {};
		selectedColumns.map((columnHeader) => {
			columnHeader.subHeader.forEach((columnSubHeader) => {
				data[columnHeader.header + columnSubHeader.name] = true;
			});
		});
		setCustomizeSubHeaderCheckbox(data);
	};

	useEffect(() => {
		initialHeaderCheckboxState();
		initialSubHeaderCheckboxState();
	}, []);

	const handleCustomizeModalClose = () => {
		setCustomizeModalOpen(false);
	};

	return (
		<div className={classes.root}>
			{customize && (
				<Grid container justifyContent="flex-end">
					<Button
						variant="contained"
						className={classes.filterOutlineBtn}
						disableElevation
						onClick={() => setCustomizeModalOpen(true)}
						startIcon={<img src="/icons/calendar.svg" />}
					>
						Customize Columns
					</Button>
					<Dialog
						fullWidth
						maxWidth="md"
						open={customizeModalOpen}
						onClose={handleCustomizeModalClose}
						aria-labelledby="customize-dialog"
					>
						<Typography className={classes.dialogTitle}>
							Customize Metrics
						</Typography>
						<DialogContent>
							<Grid container>
								<Grid item xs={5}>
									<FormControl
										component="fieldset"
										className={classes.subHeaderFormControl}
									>
										<FormLabel component="legend">Column Headers</FormLabel>
										<FormGroup>
											{allColumns.map((columnHeader, index) => {
												return (
													<FormControlLabel
														control={
															<Checkbox
																checked={
																	customizeHeaderCheckbox[columnHeader.header]
																}
																onChange={(event) => {
																	handleCustomizeHeaderCheckbox(
																		event,
																		columnHeader
																	);
																}}
																name={columnHeader.header}
															/>
														}
														label={columnHeader.header}
														key={index}
														style={{
															borderBottom: "1px solid #DCDCDC",
															marginRight: "0px",
														}}
													/>
												);
											})}
										</FormGroup>
									</FormControl>
								</Grid>
								<Grid item xs={7}>
									<FormControl
										component="fieldset"
										className={classes.subHeaderFormControl}
									>
										<FormLabel component="legend">Column Sub-Headers</FormLabel>
										<FormGroup>
											{allColumns.map((columnHeader, index) => {
												return (
													<Grid
														container
														direction="row"
														key={index}
														style={{ borderBottom: "1px solid #DCDCDC" }}
													>
														{columnHeader.subHeader.map(
															(columnSubHeader, index) => {
																return columnSubHeader.name !== "" ? (
																	<Grid item key={index}>
																		<FormControlLabel
																			control={
																				<Checkbox
																					checked={
																						customizeSubHeaderCheckbox[
																							columnHeader.header +
																								columnSubHeader.name
																						]
																					}
																					onChange={(event) => {
																						handleCustomizeSubHeaderCheckbox(
																							event,
																							columnHeader.header,
																							columnSubHeader.name
																						);
																					}}
																					name={
																						columnHeader.header +
																						columnSubHeader.name
																					}
																					{...(!customizeHeaderCheckbox[
																						columnHeader.header
																					]
																						? { disabled: true }
																						: {})}
																				/>
																			}
																			label={columnSubHeader.name}
																		/>
																	</Grid>
																) : (
																	<Grid item key={index}>
																		<FormControlLabel
																			control={
																				<Checkbox
																					checked={false}
																					onChange={(event) => {
																						handleCustomizeSubHeaderCheckbox(
																							event,
																							columnSubHeader.name
																						);
																					}}
																					name={
																						columnHeader.header +
																						columnSubHeader.name
																					}
																					disabled
																				/>
																			}
																			label="No Sub-Headers"
																			style={{ opacity: 0 }}
																		/>
																	</Grid>
																);
															}
														)}
													</Grid>
												);
											})}
										</FormGroup>
									</FormControl>
								</Grid>
							</Grid>
							<Button
								variant="contained"
								color="secondary"
								fullWidth
								className={classes.saveBtn}
								onClick={() => {
									setSelectedColumns(tempSelectedColumns);
									setCustomizeModalOpen(false);
								}}
							>
								{" "}
								Save
							</Button>
						</DialogContent>
					</Dialog>
				</Grid>
			)}
			<Grid
				container
				direction="column"
				justifyContent="flex-start"
				alignItems="flex-start"
			>
				<Grid item className={classes.fullWidth}>
					<TableContainer className={classes.tableContainer}>
						<Table aria-label="simple table" className={classes.table}>
							<TableHead>
								<TableRow className={classes.tableRowBorder}>
									{selectedColumns.map((columnHeader, index) => {
										return (
											columnHeader.visibility && (
												<TableCell
													align="center"
													colSpan={
														columnHeader.subHeader.filter(
															(subColumn) => subColumn.visibility === true
														).length
													}
													classes={{
														root: clsx(
															classes.darkBackground,
															classes.tableHeaderTitle
														),
													}}
													className={` ${
														columnHeader.header !== ""
															? classes.borderBottom
															: ""
													} ${index === 0 ? classes.stickyHeaderLeft : ""}`}
													key={columnHeader.header + index}
												>
													{columnHeader.header}
												</TableCell>
											)
										);
									})}
									<TableCell
										align="center"
										classes={{
											root: clsx(
												classes.darkBackground,
												classes.tableHeaderTitle
											),
										}}
										className={classes.stickyHeaderRight}
									></TableCell>
								</TableRow>
								<TableRow className={classes.tableRowBorder}>
									{selectedColumns.map((columnHeader, index) => {
										return index !== 0 ? (
											columnHeader.visibility &&
												columnHeader.subHeader.map((columnSubHeader) => {
													return columnSubHeader.visibility ? (
														<TableCell
															align="center"
															key={columnSubHeader.name + index}
															className={classes.bgWhite}
														>
															{columnSubHeader.name}
														</TableCell>
													) : null;
												})
										) : (
											<TableCell
												align="center"
												className={`${classes.bgWhite} ${classes.stickyHeaderLeft}`}
											></TableCell>
										);
									})}
									<TableCell
										align="center"
										className={`${classes.bgWhite} ${classes.stickyHeaderRight}`}
									></TableCell>
								</TableRow>
							</TableHead>
							{renderTableBody && renderTableBody(data, selectedColumns)}
						</Table>
					</TableContainer>
				</Grid>
			</Grid>
		</div>
	);
}
