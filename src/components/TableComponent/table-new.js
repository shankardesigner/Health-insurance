import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Alert from "@material-ui/lab/Alert";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import clsx from "clsx";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import {
	CurrencyComponent,
	PopulationComponent,
	DateComponent,
} from "@components/FormatNumber";
import ArrowDropDownCircleIcon from "@material-ui/icons/ArrowDropDownCircle";

import { format } from "sql-formatter";
import theme from "@utils/theme";
import { List, ListItem } from "@material-ui/core";
import NemoPopOver from "src/shared/NemoPopOver";
import { Pagination, PaginationItem } from "@material-ui/lab";

// examples for future reference
// edit action  { name: 'Edit', component:'NemoFactorEditComponent', attributes: { id: nemoFactorPreset + "_##id##", class: "editNemoFactorBtn", dataid: nemoFactorPreset + "_##id##" } }
// route { name: 'Edit', component: 'RouteComponent', data: { href: '/reporting/resultsclaims', params: ['clientId', 'clientLoaId', 'serviceCategoryId', 'serviceCategoryName'] }}
// columns { name: 'Future Factor', component: 'InputComponent', defaultValue: '', attributes: { width: 90, id: nemoFactorPreset + "_##id##", class: "hideElement" } }, // #id# will be replaced by the data values id

import styles from "./table-new.module.scss";
const useStyles = makeStyles({
	table: {
		// minWidth: 650,
		// [theme.breakpoints.down('md')]:{
		//   background: `red !important`,
		// },
		"&:not(.sideColumned)": {
			backgroundColor: theme.palette.background.paper,
		},
	},
	bottomIndent: {
		// marginBottom: theme.spacing(9),
	},
	sideColumnedContainer: {
		boxShadow: "none !important",
	},
	sideColumned: {
		"& th": {
			background: "none",
		},

		"& tr td:first-child": {
			fontWeight: 600,
		},

		"& tr:last-child td": {
			fontWeight: 600,
			borderBottom: "none",

			"&:last-child span": {
				color: "#EB6924 !important",
			},
		},
	},
	// textComponent: {
	//   fontWeight: 600,
	//   fontSize: "16px",
	//   lineHeight: "21px",
	//   color: "#333333",
	// },
	tagComponent: {
		background: "rgba(150, 167, 235, 0.1)",
		borderRadius: "6px",
		lineHeight: "0.5em",
	},
	actionButton: {
		marginRight: "5px",
		borderRadius: "20px",
		// border: "1px solid #000000",
		minWidth: "10px !important",
	},
	actionIcon: {
		marginRight: "5px",
		borderRadius: "50%",
		border: "1px solid #000000",
	},
	links: {
		textDecoration: "none !important",
		color: "unset !important",
	},
	inputStyle: {
		border: "1px solid",
		background: "#EFEFF0",
		borderRadius: "7px !important",
		paddingLeft: "10px",
	},
	done: {
		color: "#1C752C",
		display: "inline-flex",
		minWidth: "87px",
		// fontWeight: "bold",
	},
	draft: {
		color: "#D83D3D",
		minWidth: "87px",
		display: "inline-flex",
		// fontWeight: "bold",
	},
	openerButton: {
		background: "none",
		padding: "0px !important",
		boxShadow: "none",
		minWidth: "20px",
		minHeight: "20px",

		"&:hover": {
			background: "none",
			boxShadow: "none",
		},
	},
	actionList: {
		padding: "0px !important",
		minWidth: "141px",
	},
	actionListItem: {
		padding: "0px !important",
		display: "block",

		"&:last-child button": {
			color: "#D83D3D !important",
		},
	},
	actionListButton: {
		color: "#333333",
		fontSize: "12px",
		lineHeight: "14px",
		textAlign: "left",
		width: "100%",
		justifyContent: "flex-start",
		padding: "10px",
	},
	paginationFooterWrapper: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "center",
		padding: "15px 0 0",
		fontSize: "14px",
		lineHeight: "16px",
		color: "#939698",
	},
	paginationRoot: {
		"& button": {
			fontSize: "14px",
			lineHeight: "16px",
			color: "#939698",
		},

		"& .Mui-selected": {
			background: `rgba(194, 228, 255, 0.4)`,
			color: "#06406D",
		},
	},
	tableRowReporting: {
		"& td > *": {
			pointerEvents: "none !important",
			margin: 0,
		},
		"& td:first-child > *": {
			pointerEvents: "auto !important",
		},
		"& td:last-child > *": {
			pointerEvents: "auto !important",
		},
	},
});

const useStyles1 = makeStyles((theme) => ({
	root: {
		flexShrink: 0,
		marginLeft: theme.spacing(2.5),
	},
}));

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const CallbackComponent = (props) => {
	const { children, rowData, callback } = props;

	const handleClick = () => {
		callback(rowData);
	};

	return <span onClick={() => handleClick()}>{children}</span>;
};

const NemoFactorEditComponent = (props) => {
	const { children } = props;
	const { id, dataid } = children.props;

	useEffect(() => {
		// hide input component
	}, []);

	const handleClick = (inputId) => {
		const editBtnId = document.getElementById(id);
		const elementId = document.getElementById(inputId);
		const childrenElem = elementId.children[0];
		const inputElementId = document.getElementById("input" + inputId);
		if (editBtnId.textContent === "Edit") {
			elementId.setAttribute("style", "display: unset !important");
			inputElementId.removeAttribute("readonly");
			if (childrenElem.hasAttribute("old-style")) {
				const oldStyle = childrenElem.getAttribute("old-style");
				childrenElem.setAttribute("style", oldStyle);
			}
			editBtnId.textContent = "Save";
			editBtnId.setAttribute("style", "background: #42DEB4;");
		} else {
			inputElementId.setAttribute("readonly", "true");
			const oldStyle = childrenElem.getAttribute("style");
			childrenElem.setAttribute("old-style", oldStyle);
			childrenElem.setAttribute(
				"style",
				oldStyle + "border: unset !important; background: unset !important"
			);
			editBtnId.textContent = "Edit";
			editBtnId.removeAttribute("style");
		}
	};

	return <span onClick={() => handleClick(dataid)}>{children}</span>;
};

function TablePaginationActions(props) {
	const classes = useStyles1();
	const theme = useTheme();
	const { count, page, rowsPerPage, onChangePage } = props;

	const handleFirstPageButtonClick = (event) => {
		onChangePage(event, 0);
	};

	const handleBackButtonClick = (event) => {
		onChangePage(event, page - 1);
	};

	const handleNextButtonClick = (event) => {
		onChangePage(event, page + 1);
	};

	const handleLastPageButtonClick = (event) => {
		onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<div className={classes.root}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</div>
	);
}

const RenderTableComponent = (props) => {
	const classes = useStyles();

	const defaultFunction = function () {};

	const {
		headers,
		data,
		actions,
		options,
		getCalculatedTotal = defaultFunction,
	} = props.tableProps;
	const sideColumned = props.sideColumned;
	const [currentRow, setCurrentRow] = React.useState(null);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(options.rowsPerPage);
	const [order, setOrder] = useState("asc");
	const [total, setTotal] = useState({});
	const [showDropDown, setShowDropdown] = useState({});

	const defaultOrderBy = Object.keys(data[0])[0];
	const [orderBy, setOrderBy] = React.useState(defaultOrderBy);

	const handlePopOverClose = () => {
		setAnchorEl(null);
		setCurrentRow(null);
	};

	const popOverOpen = Boolean(anchorEl);

	const handlePopOverClick = (event, currentRow) => {
		const favButton = document.querySelector(".fav-button");
		const isFavButton = favButton.contains(event.target);

		if (isFavButton) return;
		if (popOverOpen) {
			handlePopOverClose();
		} else {
			setAnchorEl(event);
			setCurrentRow(currentRow);
		}
	};

	const newKeys = headers.reduce((acc, value) => {
		if (value.hasOwnProperty("newKey")) {
			acc.push(value);
		}
		return acc;
	}, []);

	// const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(1);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

	const DefaultComponent = function TextComponent({ children }) {
		return children;
	};

	const TextComponent = function TextComponent(props) {
		const { children } = props;
		const styleClasses = [classes.textComponent];
		if (props.classProp) {
			styleClasses.push(props.classProp);
		}
		return <span className={clsx(...styleClasses)}>{children}</span>;
	};

	const PercentComponent = function TextComponent(props) {
		const { children } = props;
		const styleClasses = [classes.textComponent];
		if (props.classProp) {
			styleClasses.push(props.classProp);
		}
		return (
			<span className={clsx(...styleClasses)}>
				{children && children.toFixed(2)} {children ? "%" : "-"}
			</span>
		);
	};

	const TagComponent = function TagComponent({ children }) {
		return (
			<Alert icon={false} severity="success" className={classes.tagComponent}>
				{children}
			</Alert>
		);
	};

	const StatusComponent = function StatusComponent({ children }) {
		const extractImage = (status) => {
			switch (status) {
				case "Draft":
					return "cross";
				case "Done":
					return "tick-green";
				default:
					return "";
			}
		};
		//
		return (
			<span
				className={
					children === "Draft"
						? styles.draft
						: children === "Done"
						? styles.done
						: ""
				}
			>
				<img src={`/new/${extractImage(children)}.svg`} />
				{children === "Draft" ? "Incomplete" : children}
			</span>
		);
	};

	const RouteComponent = function RouteComponent({ rowData, data, children }) {
		const { href, params } = data;
		let paramsObj = {};
		params.forEach((parameter, index) => {
			if (rowData[parameter]) {
				// excluding null on url parameters
				paramsObj[parameter] = rowData[parameter];
			}
		});
		const urlParams = new URLSearchParams(paramsObj);
		return (
			<Link href={href + "?" + urlParams} className={classes.links}>
				{children}
			</Link>
		);
	};

	const InputComponent = function InputComponent(props) {
		const { id, value, width } = props;
		return (
			<Box component="div" id={id}>
				<TextField
					id={"input" + id}
					InputProps={{ "aria-label": "model name", disableUnderline: true }}
					name={id}
					value={value}
					style={{ width: width }}
					classes={{ root: classes.inputStyle }}
				/>
			</Box>
		);
	};

	const JsonComponent = function JsonComponent({ children }) {
		// const json = JSON.parse(children);
		// return (
		//   <JsonView obj={children} showLineNumbers />
		// );
		return JSON.stringify(children);
	};

	const SQLComponent = function SQLComponent({ children }) {
		return (
			<>
				{format(children, {
					language: "sql", // Defaults to "sql" (see the above list of supported dialects)
					indent: "    ", // Defaults to two spaces
					uppercase: true, // Defaults to false
					linesBetweenQueries: 2, // Defaults to 1
				})}
			</>
		);
	};

	const getRenderer = (componentName) => {
		switch (componentName) {
			case "TextComponent":
				return TextComponent;
			case "TagComponent":
				return TextComponent;
			case "StatusComponent":
				return StatusComponent;
			case "PopulationComponent":
				return PopulationComponent;
			case "CurrencyComponent":
				return CurrencyComponent;
			case "InputComponent":
				return InputComponent;
			case "DateComponent":
				return DateComponent;
			case "JsonComponent":
				return JsonComponent;
			case "SQLComponent":
				return SQLComponent;
			case "DefaultComponent":
				return DefaultComponent;
			case "PercentComponent":
				return PercentComponent;
			default:
				return null;
		}
	};

	const getActionRenderer = (actionData) => {
		const renderer = actionData
			? actionData.component
				? actionData.component
				: "DefaultComponent"
			: null;

		switch (renderer) {
			case "RouteComponent":
				return RouteComponent;
			case "DefaultComponent":
				return DefaultComponent;
			// component specific
			case "NemoFactorEditComponent":
				return NemoFactorEditComponent;
			case "CallbackComponent":
				return CallbackComponent;
			default:
				return null;
		}
	};

	let paginationColspan = 1;
	if (headers) {
		paginationColspan = actions ? headers.length + 1 : headers.length;
	}

	// const displayData = stableSort(data, getComparator(order, orderBy))
	//   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const displayData = data.slice(
		(page - 1) * rowsPerPage,
		(page - 1) * rowsPerPage + rowsPerPage
	);

	const pageMin = (page - 1) * rowsPerPage + 1;
	const tempPageMax = page * rowsPerPage;
	const pageMax = tempPageMax > data.length ? data.length : tempPageMax;

	const prepareIdAttribute = (attributes, row, prefix) => {
		// let newAttributes = JSON.parse(JSON.stringify(attributes));
		let newAttributes = attributes;

		const getIdStr = (idStr) => {
			// find id of the value to be found
			const matches = idStr.matchAll(/##(.*?)##/g);
			const ids = Array.from(matches, (x) => x[1]);
			ids.map((idToReplace, index) => {
				idStr = idStr.replaceAll("##" + idToReplace + "##", row[idToReplace]);
			});
			return idStr;
		};

		if (newAttributes.hasOwnProperty("id")) {
			let idStr = newAttributes.id;
			const prefixValue = prefix ? prefix : "";
			newAttributes.id = prefixValue + getIdStr(idStr);
		}

		if (newAttributes.hasOwnProperty("dataid")) {
			let idStr = newAttributes.dataid;
			newAttributes.dataid = getIdStr(idStr);
		}

		return newAttributes;
	};

	const calculate = (key) => {
		return displayData.reduce((ac, v) => {
			ac += Number(v[key]);
			return ac;
		}, 0);
	};

	const calculateTotal = (key) => {
		if (options.total.display) {
			const columns = options.total.columns;
			if (!columns.length) {
				const total = calculate(key);
				return total;
			} else {
				if (columns.includes(key)) {
					const total = calculate(key);
					return total;
				}
			}
			return "";
		}
		return "";
	};

	const CustomCheckBoxIcon = () => (
		<Icon>
			<img alt="checkbox icon" src="/check-box-icon.svg" />
		</Icon>
	);

	const CustomCheckBoxOutlineBlankIcon = () => (
		<Icon>
			<img alt="checkbox marked icon" src="/check-box-icon-checked.svg" />
		</Icon>
	);

	const [checkboxState, setCheckboxState] = useState({});

	useEffect(() => {
		/* check all bind action */
		if (options.rowSelect) {
			// initialize checkbox
			const { id, rowClass } = options.rowSelect;
			let initialCheckboxState = {};
			displayData.map((d, index) => {
				initialCheckboxState = {
					...initialCheckboxState,
					[rowClass + index]: false,
				};
			});
			setCheckboxState(initialCheckboxState);
		}

		/* initialize total */
		let initializeTotal = {};
		headers.map((header, headerIndex) => {
			initializeTotal[header.sourceKey] = calculateTotal(header.sourceKey);
		});
		setTotal(initializeTotal);
	}, []);

	const toggleRootCheckbox = function (e) {
		if (options.rowSelect) {
			const newStatus = e.target.checked;
			const { id, rowClass } = options.rowSelect;
			let initialCheckboxState = {};
			displayData.map((d, index) => {
				initialCheckboxState = {
					...initialCheckboxState,
					[rowClass + index]: newStatus,
				};
			});
			setCheckboxState(initialCheckboxState);
		}
	};

	const handleCheckboxChange = (e) => {
		const checkboxName = e.target.name;
		setCheckboxState({
			...checkboxState,
			[checkboxName]: !checkboxState[checkboxName],
		});
	};

	useEffect(() => {
		if (Object.keys(total).length > 0) {
			getCalculatedTotal(total);
		}
	}, [total]);

	//

	const getActionButton = (data, action, classAttr) => {
		// if(!!!data || !!!action) return <>No Button</>;

		if (action.name === "FAV" && data.isFavourite) {
			return (
				<IconButton
					title={action.name}
					className={clsx(
						classes.actionButton,
						classAttr,
						"fav-button",
						styles.favButton
					)}
				>
					<img width={16} height={16} src={action.active_icon} />
				</IconButton>
			);
		} else {
			return (
				<IconButton
					title={action.name}
					className={clsx(
						classes.actionButton,
						classAttr,
						"fav-button",
						styles.favButton
					)}
				>
					<img width={16} height={16} src={action.icon} />
				</IconButton>
			);
		}
	};

	/**
	 * @description this function is used to get button attributes
	 * @param {Object} action
	 * @param {Object} row
	 * @returns {{attributes, classAttr}}
	 */
	const getButtonAttributes = (action, row) => {
		if (!!!action || !!!row)
			return {
				callback: () => {},
			};

		let attributes = action.hasOwnProperty("attributes")
			? action.attributes
			: {};

		attributes = prepareIdAttribute(attributes, row, action.name);

		let classAttr = "";
		if (attributes.hasOwnProperty("class")) {
			classAttr = attributes.class;
			delete attributes.class;
		}
		return { attributes, classAttr };
	};

	const actionButtons = (row, attributes, classAttr, action, actionIndex) => (
		<ListItem disableGutters key={actionIndex}>
			<Button
				variant="text"
				onClick={() => handleActionClick(row, attributes, classAttr)}
			>{`${action.name}`}</Button>
		</ListItem>
	);

	useEffect(() => {
		document.querySelector("body")?.classList.add("sticky-button");
		return () => {
			document.querySelector("body")?.classList.remove("sticky-button");
		};
	}, []);

	return (
		<TableContainer
			component={Paper}
			elevation={0}
			className={styles.tableContainer}
		>
			<Table
				className={[
					classes.table,
					options.displayPagination ? classes.bottomIndent : "",
					sideColumned ? classes.sideColumned : "",
				].join(" ")}
				aria-label="simple table"
			>
				<TableHead>
					<TableRow>
						{actions?.length > 0 && (
							<TableCell
								component="th"
								scope="row"
								align={"left"}
								// colSpan={actions.length}
							></TableCell>
						)}
						{headers.map((column, index) => {
							if (index === 0) {
								if (options.rowSelect) {
									const { id } = options.rowSelect;
									return (
										<TableCell
											align={column.align ? column.align : "left"}
											key={index}
										>
											<FormControlLabel
												control={
													<Checkbox
														icon={<CustomCheckBoxOutlineBlankIcon />}
														checkedIcon={<CustomCheckBoxIcon />}
														name={id}
														id={id}
														onChange={(e) => toggleRootCheckbox(e)}
													/>
												}
												label={
													<span className={classes.headerTitle}>
														NEMO Factors
													</span>
												}
											/>
										</TableCell>
									);
								} else {
									return (
										<TableCell
											align={column.align ? column.align : "left"}
											key={index}
										>
											{column.name}
										</TableCell>
									);
								}
							} else {
								return (
									<TableCell
										align={column.align ? column.align : "right"}
										key={index}
									>
										{column.name}
									</TableCell>
								);
							}
						})}
						{actions?.length > 0 && (
							<TableCell
								component="th"
								scope="row"
								align={"left"}
								className={styles.actionTableCell}
								// colSpan={actions.length}
							></TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{displayData.map((row, index) => {
						let firstCol = -1;
						const favComponent = actions.find(
							(action) => action.name === "FAV"
						);
						const newActions = actions.filter(
							(action) => action.name !== "FAV"
						);
						const FavActionRenderer = getActionRenderer(favComponent);
						// console.clear();
						//
						const favAttributes = getButtonAttributes(favComponent, row);

						//

						return (
							<TableRow
								key={index}
								onClick={(ev) => handlePopOverClick(ev, row)}
								className={classes.tableRowReporting}
							>
								{newActions?.length > 0 && (
									<TableCell component="td" scope="row" align={"right"}>
										<React.Fragment>
											{favComponent && (
												<FavActionRenderer
													rowData={row}
													data={favComponent}
													{...favAttributes.attributes}
												>
													{getActionButton(
														row,
														favComponent,
														favAttributes.classAttr
													)}
												</FavActionRenderer>
											)}
										</React.Fragment>
									</TableCell>
								)}
								{headers.map((header, headerIndex) => {
									let rowValue = "";
									if (header.hasOwnProperty("sourceKey")) {
										const rowKey = header.sourceKey;
										rowValue = row[rowKey] ? row[rowKey] : "";
									}
									if (header.hasOwnProperty("defaultValue")) {
										rowValue = header.defaultValue;
									}
									let attributes = header.hasOwnProperty("attributes")
										? header.attributes
										: {};
									// prepare id: parse id value
									attributes = prepareIdAttribute(attributes, row);

									let Renderer = getRenderer(header.component);
									const key = index + "_" + headerIndex;
									Renderer && firstCol++;
									if (firstCol === 0) {
										if (options.rowSelect) {
											const { rowClass } = options.rowSelect;
											const checkboxName = rowClass + index;

											return (
												Renderer && (
													<TableCell
														component="td"
														scope="row"
														key={key}
														align={header.align ? header.align : "left"}
													>
														<Renderer {...attributes}>
															<FormControlLabel
																control={
																	<Checkbox
																		icon={<CustomCheckBoxOutlineBlankIcon />}
																		checkedIcon={<CustomCheckBoxIcon />}
																		name={checkboxName}
																		onChange={(e) => handleCheckboxChange(e)}
																		checked={checkboxState[checkboxName]}
																	/>
																}
																label={
																	<span className={classes.headerRowTitle}>
																		{" "}
																		{rowValue}
																	</span>
																}
															/>
														</Renderer>
													</TableCell>
												)
											);
										} else {
											return (
												Renderer && (
													<TableCell
														component="td"
														scope="row"
														key={key}
														align={header.align ? header.align : "left"}
													>
														<Renderer {...attributes}>{rowValue}</Renderer>
														{(row.children || []).length > 0 && (
															<ArrowDropDownCircleIcon
																style={{
																	position: "relative",
																	top: 5,
																	left: 5,
																	cursor: "pointer",
																}}
																onClick={(e) =>
																	setShowDropdown({
																		...showDropDown,
																		[row.id]: !showDropDown[row.id],
																	})
																}
															></ArrowDropDownCircleIcon>
														)}
													</TableCell>
												)
											);
										}
									} else {
										if (row.displayDataType) {
											if (row.displayDataType === "int") {
												Renderer = getRenderer("CurrencyComponent");
											} else if (row.displayDataType === "pct") {
												Renderer = getRenderer("PercentComponent");
											} else if (row.displayDataType === "num") {
												Renderer = getRenderer("TextComponent");
											}
										}
										return (
											Renderer && (
												<TableCell
													component="td"
													scope="row"
													key={key}
													align={header.align ? header.align : "right"}
												>
													<Renderer {...attributes}>{rowValue}</Renderer>
												</TableCell>
											)
										);
									}
								})}
								{actions && (
									<TableCell component="td" scope="row" align={"right"}>
										<Button
											aria-describedby={1}
											variant="contained"
											// onClick={(ev) => handlePopOverClick(ev, row)}
											className={classes.openerButton}
										>
											<img src="/new/dots.svg" />
										</Button>
										<NemoPopOver
											id={`action-popover-${row.modelId}`}
											open={popOverOpen}
											anchorEl={anchorEl?.target}
											onClose={handlePopOverClose}
										>
											<List className={classes.actionList}>
												{newActions.map((action, actionIndex) => {
													// if (action.name === "FAV") return;
													const { attributes, classAttr } = getButtonAttributes(
														action,
														row
													);
													return (
														<ListItem
															className={classes.actionListItem}
															key={actionIndex}
														>
															<Button
																onClick={() => {
																	handlePopOverClose();
																	attributes.callback(currentRow);
																}}
																className={classes.actionListButton}
															>
																{action.name}
															</Button>
														</ListItem>
													);
												})}
											</List>
										</NemoPopOver>
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</TableBody>
				{options.displayPagination && data?.length > 10 && (
					<TableFooter>
						<TableRow>
							<td colSpan={10}>
								<div className={classes.paginationFooterWrapper}>
									<span>
										{`${pageMin}-${pageMax}`} of {data.length}
									</span>
									&nbsp;&nbsp; |
									<Pagination
										count={Math.ceil(data.length / rowsPerPage)}
										page={page}
										onChange={handleChangePage}
										// rowsPerPage={rowsPerPage}
										classes={{
											root: classes.paginationRoot,
											ul: classes.paginationUl,
											text: classes.paginationText,
										}}
										renderItem={(item) => (
											<PaginationItem
												components={{
													previous: "<",
													next: ">",
												}}
												{...item}
											/>
										)}
										shape="rounded"
									/>
								</div>
							</td>
						</TableRow>
					</TableFooter>
				)}
			</Table>
		</TableContainer>
	);
};

export default function TableComponent({
	headers,
	data,
	actions,
	options,
	getCalculatedTotal,
	type = undefined,
}) {
	actions = actions ? actions : [];
	headers = headers ? headers : [];
	data = data ? data : [];
	const sideColumned = type === "sideColumn";

	// const {pathname} = useRouter();
	// if(pathname !== "/reporting") return null;

	const defaultOptions = {
		displayPagination: true,
		rowsPerPage: 10,
		dataStatus: "SUCCESS",
		rowSelect: false,
		total: { display: false, columns: [] },
	};
	options = options ? { ...defaultOptions, ...options } : defaultOptions;

	if (!options.displayPagination) {
		options = { ...options, rowsPerPage: data.length };
	}

	const tableProps = { headers, data, actions, options, getCalculatedTotal };

	if (!data || !data.length || options.dataStatus === "PENDING") {
		// return <LinearProgressBar />
		return <Skeleton count={4} height={50} />;
	} else {
		return (
			<RenderTableComponent
				tableProps={tableProps}
				sideColumned={sideColumned}
			/>
		);
	}
}
