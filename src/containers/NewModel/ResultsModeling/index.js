import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import {
	PieChart,
	Pie,
	Sector,
	ResponsiveContainer,
	Cell,
	Legend,
} from "recharts";

import TableComponent from "@components/TableComponent";

import { useEffect, useState } from "react";

import styles from "./resultsmodeling.module.css";
import "react-circular-progressbar/dist/styles.css";

import formatDataForNestedTable from "../../../utils/formatDataForNestedTable";
/* redux part */
import {
	changeStatusOnNextTab,
	getResultsAction,
	riskModelerState,
} from "@slices/riskModelerSlice";

import { useSelector, useDispatch } from "react-redux";

import commons from "@constants/common";
const { SUCCESS, REQUEST } = commons;
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
	search: {
		[theme.breakpoints.down("sm")]: {
			paddingBottom: "10px",
		},
	},
	newModelButton: {
		background: "#42DEB4",
		borderRadius: "100px",
		height: "47px",
		lineHeight: "1",
		color: "#ffffff",
		marginBottom: "50px",
		border: "unset",
		"&:hover": {
			background: "#42DEB4",
			border: "1px solid " + theme.palette.secondary.color,
		},
		width: "80%",
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
		bottom: "20px",
	},
	greenTextSmall: {
		fontFamily: "Montserrat",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: "14px",
		lineHeight: "16px",
		//color: "#632200",
	},
	boxStyle: {
		marginBottom: 70,
	},
	containerStyle: {
		border: "1px solid #DCDCDC",
		borderRadius: "3px",
		marginTop: "12px",
		marginBottom: "12px",
	},
}));

const renderActiveShape = (props) => {
	const RADIAN = Math.PI / 180;
	const {
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		startAngle,
		endAngle,
		fill,
		payload,
		percent,
		value,
	} = props;
	const sin = Math.sin(-RADIAN * midAngle);
	const cos = Math.cos(-RADIAN * midAngle);
	const sx = cx + (outerRadius + 10) * cos;
	const sy = cy + (outerRadius + 10) * sin;
	const mx = cx + (outerRadius + 30) * cos;
	const my = cy + (outerRadius + 30) * sin;
	const ex = mx + (cos >= 0 ? 1 : -1) * 22;
	const ey = my;
	const textAnchor = cos >= 0 ? "start" : "end";

	let valueInCommas = Number(value)
		.toFixed(0)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return (
		<g>
			{/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.title}
            </text> */}
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
				// textAnchor
			/>
			<Sector
				cx={cx}
				cy={cy}
				startAngle={startAngle}
				endAngle={endAngle}
				innerRadius={outerRadius}
				outerRadius={outerRadius + 10}
				fill={fill}
			/>
			{/* <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      /> */}
			{/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
			<text
				// x={(cos >= 0 ? 1 : 18.5) * 12}
				// y={ey}
				x={20}
				y={50}
				// dy={40}
				// textAnchor={textAnchor}
				fill="#333"
				// scaleToFitBoolean={true}
			>{`${payload.amountTypeName}: $${valueInCommas}`}</text>
			{/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text> */}
		</g>
	);
};

const generateRgba = (hex, alpha) => {
	const r = parseInt(hex.slice(1, 3), 16),
		g = parseInt(hex.slice(3, 5), 16),
		b = parseInt(hex.slice(5, 7), 16);
	if (alpha) {
		return "rgba(" + r + ", " + g + ", " + b + ", " + (alpha / 10) * 3 + ")";
	} else {
		return "rgb(" + r + ", " + g + ", " + b + ")";
	}
};

const renderCusomizedLegend = (props) => {
	const { payload } = props;
	const handleClick = (index) => {
		renderActiveShape(payload[index].payload);
	};

	const circleStyle = {
		color: "#fff",
		width: "10px",
		height: "10px",
		borderRadius: "5px",
		marginRight: "5px",
	};

	const rootStyle = {
		display: "flex",
		direction: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		marginBottom: "5px",
	};

	const textStyle = {
		fontStyle: "normal",
		fontWeight: 300,
		fontSize: "12px",
		lineHeight: "15px",
		color: "#3D3E64",
	};

	return (
		<div className="customized-legend">
			{payload.map((entry, index) => {
				const { payload, color } = entry;
				const { amountTypeName, cx, cy } = payload;
				return (
					<span
						className="legend-item"
						onClick={() => handleClick(index)}
						key={index}
						style={rootStyle}
					>
						<span style={{ ...circleStyle, backgroundColor: color }}></span>
						<span onClick={() => handleClick(index)} style={textStyle}>
							{amountTypeName}
						</span>
					</span>
				);
			})}
		</div>
	);
};

export default function ResultsModeling() {
	const classes = useStyles();
	const router = useRouter();
	//const [heightFix, setHeightFix] = useState(true);

	const [graphActiveIndex, setGraphActiveIndex] = useState(0);

	const [rmStyle, setRmStyle] = useState(true);

	const dispatch = useDispatch();

	const {
		newModelActivationStatus,
		savedModel,
		results,
		resultsResStatus,
		isNext,
	} = useSelector(riskModelerState);

	const formattedResult = formatDataForNestedTable(results, "amountTypeId");

	useEffect(() => {
		// if(router.query.modelid && isNext === false){
		if (router.query.modelid && isNext === false) {
			const payload = {
				modelId: router.query.modelid,
			};
			dispatch(getResultsAction(payload));
			return () => {
				console.log("unmounted");
			};
		} else {
			dispatch(changeStatusOnNextTab({ isNext: false }));
		}
	}, []);

	useEffect(() => {
		if (newModelActivationStatus === SUCCESS) {
			window.location = "/reporting";
		}
	}, [newModelActivationStatus]);

	const columns = [
		{ name: "", component: "TextComponent", sourceKey: "amountTypeName" },
		{
			name: "PMPM",
			component: "CurrencyComponent",
			sourceKey: "pmPm",
			attributes: { decimalCount: 2 },
		},
		{
			name: "Total",
			component: "CurrencyComponent",
			sourceKey: "totalAmount",
			attributes: { classProp: classes.greenTextSmall, decimalCount: 0 },
		},
	];

	const columnsData = [
		{
			id: "1",
			amountTypeName: "Total Premium",
			pmPm: "93.32",
			totalAmount: 5000,
		},
		{
			id: "2",
			amountTypeName: "IPA Allocation",
			pmPm: "93.32",
			totalAmount: 3000,
		},
		{
			id: "3",
			amountTypeName: "Projected Expenses",
			pmPm: "93.32",
			totalAmount: 12000,
		},
		{
			id: "4",
			amountTypeName: "NET Reinsurgence Expenses",
			pmPm: "93.32",
			totalAmount: 5000,
		},
		{
			id: "5",
			amountTypeName: "Total Savings",
			pmPm: "93.32",
			totalAmount: 6000,
		},
		{
			id: "6",
			amountTypeName: "IPA Admin",
			pmPm: "93.32",
			totalAmount: 15000,
		},
		{
			id: "7",
			amountTypeName: "NET INCOME",
			pmPm: "93.32",
			totalAmount: 7800,
		},
	];

	const COLORS = [
		"#6A83E5",
		"#42DEB4",
		"#2FCDFF",
		"#FFD74A",
		"#00B3E6",
		"#E6B333",
		"#3366E6",
		"#999966",
		"#99FF99",
		"#B34D4D",
		"#80B300",
		"#809900",
		"#E6B3B3",
		"#6680B3",
		"#66991A",
		"#FF99E6",
		"#CCFF1A",
		"#FF1A66",
		"#E6331A",
		"#33FFCC",
		"#66994D",
		"#B366CC",
		"#4D8000",
		"#B33300",
		"#CC80CC",
		"#66664D",
		"#991AFF",
		"#E666FF",
		"#4DB3FF",
		"#1AB399",
		"#E666B3",
		"#33991A",
		"#CC9999",
		"#B3B31A",
		"#00E680",
		"#4D8066",
		"#809980",
		"#E6FF80",
		"#1AFF33",
		"#999933",
		"#FF3380",
		"#CCCC00",
		"#66E64D",
		"#4D80CC",
		"#9900B3",
		"#E64D66",
		"#4DB380",
		"#FF4D4D",
		"#99E6E6",
		"#6666FF",
	];

	const actions = [
		// { name: 'Edit' }
	];

	const onPieEnter = (_, index) => {
		setGraphActiveIndex(index);
	};
	if (resultsResStatus == REQUEST) {
		return (
			<Grid
				container
				direction="row"
				justifyContent="center"
				alignItems="center"
				spacing={4}
			>
				<Grid item className={styles.graphContainer}>
					<Skeleton count={8} height={40} />
				</Grid>
			</Grid>
		);
	} else {
		return (
			<Box p={3} className={classes.boxStyle}>
				<Grid container spacing={3}>
					<Grid item xs={8}>
						{formattedResult && (
							<TableComponent
								// rmStyle
								headers={columns}
								data={formattedResult}
								actions={actions}
								key={1}
								options={{ displayPagination: false }}
							/>
						)}
					</Grid>
					<Grid item xs={4} className={classes.containerStyle}>
						{/* <ResponsiveContainer width="100%" height="100%"> */}
						<PieChart width={400} height={500}>
							<Legend
								content={renderCusomizedLegend}
								layout="horizontal"
								verticalAlign="bottom"
								align="right"
								style={{
									width: "100%",
									display: "flex",
								}}
							/>
							<Pie
								activeIndex={graphActiveIndex}
								activeShape={renderActiveShape}
								data={results}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={80}
								fill="#8884d8"
								dataKey="totalAmount"
								onMouseEnter={onPieEnter}
							>
								{results.map((coldata, index) => (
									// <Cell key={index} fill={generateRgba("#5A2C6D", index)} />
									<Cell fill={COLORS[index % COLORS.length]} key={index} />
								))}
							</Pie>
						</PieChart>
						{/* </ResponsiveContainer> */}
					</Grid>
				</Grid>
			</Box>
		);
	}
}
