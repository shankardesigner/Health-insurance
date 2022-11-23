import TableComponent from "@components/TableComponent/table-new";
import { makeStyles } from "@material-ui/core/styles";
import apiHandler from "@utils/apiHandler";
import React, { useEffect, useState } from "react";
import rootConstants from "@constants/index";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { CurrencyComponent } from "@components/FormatNumber";
import { Skeleton } from "@material-ui/lab";
const riskModelerBaseURL = rootConstants.RISKMODELER_API;

import styles from "./carousal-item.module.scss";

const columns = [
	{ name: "", component: "TextComponent", sourceKey: "amountTypeName" },
	{ name: "PMPM", component: "CurrencyComponent", sourceKey: "pmPm" },
	{ name: "Total", component: "CurrencyComponent", sourceKey: "totalAmount" },
];

const useStyles = makeStyles((theme) => ({
	carouselContainer: {
		marginBottom: "30px",
		marginTop: 30,
		[theme.breakpoints.down("md")]: {
			marginBottom: 0,
		},
	},
	carousel: {
		marginRight: "20px",
		marginBottom: 10,
		border: "1px solid #DCDCDC",
		padding: "8px 20px",
		backgroundColor: "white",
		borderRadius: 14,

		[theme.breakpoints.down("md")]: {
			padding: 12,
			marginBottom: 0,
		},
	},
	carouselHeading: {
		marginBottom: "9px",
		paddingBottom: 0,
		fontWeight: 600,
		fontSize: "18px",
		lineHeight: "21px",
		color: "#06406D",
		[theme.breakpoints.down("md")]: {
			fontSize: 16,
			marginBottom: 5,
		},
	},
	carouselSubHeading: {
		marginTop: 0,
		marginBottom: "-1px",
		paddingTop: 0,
		fontWeight: 500,
		fontSize: "16px",
		lineHeight: "19px",
		color: "#5A2C6D",

		[theme.breakpoints.down("md")]: {
			fontSize: 14,
		},
	},
}));

const includeList = [
	"Total Premium",
	"IPA Allocation",
	"Total Savings",
	"Net Income",
	"Medical Loss Ratio (MLR)",
];

const CarouselItem = ({ item }) => {
	const [result, setResult] = useState([]);

	useEffect(async () => {
		const results = await apiHandler.post(`${riskModelerBaseURL}/results`, {
			modelId: item.modelId,
		});
		const filteredResult = (results.data || []).filter((d) =>
			includeList.includes(d.amountTypeName)
		);
		setResult(filteredResult);
	}, [item.modelId]);

	const classes = useStyles();

	return (
		<div className={classes.carousel}>
			<h1 className={classes.carouselHeading}>{item.modelName}</h1>
			<h3 className={classes.carouselSubHeading}>
				{item.clientId} | {item.loa1Id}
			</h3>
			<TableContainer component={Paper} className={styles.tableContainer}>
				<Table className={styles.table}>
					{result?.length > 0 ? (
						<React.Fragment>
							<TableHead>
								<TableRow>
									{columns?.map((clmn, idx) => (
										<TableCell key={idx} align="right">
											{clmn.name}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{result.map((rs, idx) => (
									<TableRow key={idx}>
										<TableCell>{rs.amountTypeName}</TableCell>
										<TableCell align="right">
											{rs?.displayDataType === "int" ? (
												<CurrencyComponent decimalCount={2}>
													{rs.pmPm}
												</CurrencyComponent>
											) : (
												rs.pmPm + "%"
											)}
										</TableCell>
										<TableCell align="right">
											{rs?.displayDataType === "int" ? (
												<CurrencyComponent decimalCount={0}>
													{rs.totalAmount}
												</CurrencyComponent>
											) : (
												Number(rs.totalAmount).toFixed(2) + "%"
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</React.Fragment>
					) : (
						<TableBody>
							<TableRow>
								<TableCell>
									<Skeleton
										count={1}
										height={55}
										style={{
											padding: `0 5px`,
											margin: 0,
										}}
									/>
									<Skeleton
										count={2}
										height={55}
										style={{
											padding: `0 5px`,
											margin: 0,
										}}
									/>
									<Skeleton
										count={3}
										height={55}
										style={{
											padding: `0 5px`,
											margin: 0,
										}}
									/>
									<Skeleton
										count={4}
										height={55}
										style={{
											padding: `0 5px`,
											margin: 0,
										}}
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					)}
				</Table>
			</TableContainer>
		</div>
	);
};

export default CarouselItem;
