import {
	makeStyles,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { selectStopLossLoading } from "@slices/stopLoss/selectors";
import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
	table: {
		font: "400 14px/1 Roboto, Arial, Helvetica, sans-serif",
		color: "#333333",
		margin: "0 0 7px",

		"& .MuiTableCell-head": {
			padding: "10px 0 9px",
		},

		"& .MuiTableCell-body": {
			padding: "10px 0 9px",
		},

		"& .MuiTableCell-root": {
			borderColor: "#3D3E64",
		},

		"& .MuiTableBody-root tr:last-child > *": {
			borderBottom: "none",
		},
	},
	title: {
		color: "#5A2C6D",
		margin: 0,
		textDecoration: "underline",
		fontWeight: 500,
		fontSize: "16px",
	},
	tableTitle: {
		fontWeight: 600,
		fontSize: "16px",
	},
	tableBodyTitle: {
		fontSize: "14px",
	},
	lastTableDefination: {
		//color: "#632200",
	},
}));

function createData(name, totalSpend, inpatient, allFacility) {
	return {
		name,
		totalSpend,
		inpatient,
		allFacility,
	};
}

const claimSummaryRows = [
	createData("Total Spend", "-", "-", "-"),
	createData("All Facility (IP+OP)", "-", "-", "-"),
	createData("Professional", "-", "-", "-"),
	createData("", "-", "-", "-"),
];

const membersSummaryRows = [
	createData("Total Spend", "-", "-", "-"),
	createData("All Facility (IP+OP)", "-", "-", "-"),
	createData("Professional", "-", "-", "-"),
	createData("", "-", "-", "-"),
];

const summaryTable = () => {
	const classes = useStyles();
	const loading = useSelector(selectStopLossLoading);
	const [smRows, setSmRows] = React.useState(claimSummaryRows);
	const [mdRows, setMdRows] = React.useState(membersSummaryRows);

	const generateRandomValues = (value) => {
		if (value === "-") return "-";
		const amount = value.toString().replace(/[$,-,' ']/g, "");
		const random = Math.floor(Math.random() * 10) * amount;

		return Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			// maximumFractionDigits: 0,
		}).format(random);
	};

	useEffect(() => {
		if (loading) {
			setTimeout(() => {
				const newSmRows = claimSummaryRows.map((row) => {
					return {
						...row,
						totalSpend: generateRandomValues(row.totalSpend),
						inpatient: generateRandomValues(row.inpatient),
						allFacility: generateRandomValues(row.allFacility),
					};
				});
				setSmRows(newSmRows);
				const newMdRows = membersSummaryRows.map((row) => {
					return {
						...row,
						totalSpend: generateRandomValues(row.totalSpend),
						inpatient: generateRandomValues(row.inpatient),
						allFacility: generateRandomValues(row.allFacility),
					};
				});
				setMdRows(newMdRows);
			}, 1000);
		}
	}, [loading]);

	return (
		<Fragment>
			<h3 className={classes.title}>Claims Over Specific</h3>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell align="right" className={classes.tableTitle}>
							Manual
						</TableCell>
						<TableCell align="right" className={classes.tableTitle}>
							Data
						</TableCell>
						<TableCell align="right" className={classes.tableTitle}>
							Blended Average
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{smRows.map((row) => (
						<TableRow key={row.name}>
							<TableCell
								component="th"
								className={`${classes.tableTitle} ${classes.tableBodyTitle}`}
							>
								{row.name}
							</TableCell>
							<TableCell align="right">{row.totalSpend}</TableCell>
							<TableCell align="right">{row.inpatient}</TableCell>
							<TableCell align="right" className={classes.lastTableDefination}>
								{row.allFacility}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<h3 className={classes.title}>Members Over Specific Deductible</h3>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell></TableCell>
						<TableCell align="right" className={classes.tableTitle}>
							Manual
						</TableCell>
						<TableCell align="right" className={classes.tableTitle}>
							Data
						</TableCell>
						<TableCell align="right" className={classes.tableTitle}>
							Blended Average
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{mdRows.map((row) => (
						<TableRow key={row.name}>
							<TableCell
								component="th"
								className={`${classes.tableTitle} ${classes.tableBodyTitle}`}
							>
								{row.name}
							</TableCell>
							<TableCell align="right">{row.totalSpend}</TableCell>
							<TableCell align="right">{row.inpatient}</TableCell>
							<TableCell align="right" className={classes.lastTableDefination}>
								{row.allFacility}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Fragment>
	);
};

export default summaryTable;
