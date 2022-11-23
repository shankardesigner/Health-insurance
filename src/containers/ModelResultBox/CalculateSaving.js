import { riskModelerState } from "@slices/riskModelerSlice";
import React from "react";
import { useSelector } from "react-redux";
import styles from "./modelresultbox.module.scss";
import commons from "@constants/common";
import { Skeleton } from "@material-ui/lab";
import {
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { CurrencyComponent } from "@components/FormatNumber";
const { REQUEST } = commons;

const CalculateSaving = () => {
	const { savings, calculateSavingResStatus } = useSelector(riskModelerState);

	const getTableData = (pmpm, total) => {
		return (
			<TableContainer style={{ border: 0 }} className={styles.calculateSaving}>
				<Table>
					<TableHead>
						<TableRow>
							{/* <TableCell>PMPM</TableCell> */}
							<TableCell>PMPM</TableCell>
							<TableCell>Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							{/* <TableCell>PMPM</TableCell> */}
							<TableCell>
								<CurrencyComponent decimalCount={2}>{pmpm}</CurrencyComponent>
							</TableCell>
							<TableCell>
								<CurrencyComponent decimalCount={0}>{total}</CurrencyComponent>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		);
	};

	return (
		<div className={styles.resultModelingWrapper}>
			<Grid container spacing={6} className={styles.gridHolder}>
				{savings?.map((item, key) => {
					return (
						<Grid item xs={6} className={styles.tableGrid} key={key}>
							<h3 className={styles.tableHeading}>{item.amountTypeName}</h3>
							{calculateSavingResStatus === REQUEST ? (
								<Skeleton count={4} height={50} />
							) : (
								getTableData(item.pmPm, item.totalAmount)
							)}
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
};

export default CalculateSaving;
