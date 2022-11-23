import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import styles from "./modelresultbox.module.scss";
import { CurrencyComponent } from "@components/FormatNumber";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useRouter } from "next/router";

/* redux part */
import { globalAssumptionModelState } from "@slices/globalAssumptionAlice";

import {
	riskModelerState,
	saveNewModelAction,
	calculateSavingsAction,
	recalculateSavingsAction,
} from "@slices/riskModelerSlice";

import { clientModelState } from "@slices/clientModelSlice";

import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import commons from "@constants/common";
const { REQUEST } = commons;

const TableCell = withStyles({
	root: {
		border: "none",
		fontWeight: "bold",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
		verticalAlign: "bottom",
	},
})(MuiTableCell);

export default function ModelResultBox({ next, displayResult = true }) {
	/* save or update new model */
	const dispatch = useDispatch();

	

	const { usedAssumption } = useSelector(globalAssumptionModelState);
	const { modelInfo, populationSummary } = useSelector(clientModelState);
	const { savedModel, savings, recalculateSavings, calculateSavingResStatus } =
		useSelector(riskModelerState);

	const {
		clientId,
		modelName,
		loa1Id,
		loa2Id,
		loa3Id,
		loa4Id,
		loa5Id,
		loa6Id,
		planType,
	} = modelInfo;
	const {
		avgEmployeeCount,
		avgMemberCount,
		em,
		employeeCountActive,
		employeeCountTotal,
		memberCountActive,
		memberCountTotal,
		mm,
		// pcpCount,
	} = populationSummary;
	const {
		ipaAdmin = 0,
		ipaAllocation = 0,
		averagePremium,
		pcpCount,
	} = usedAssumption;

	const [cachedModelRef, setCachedModelRef] = useState();
	const [modelPayload, setModelPayload] = useState();

	const calculateSavings = () => {
		if (savedModel.modelId) {
			// dispatch(calculateSavingsAction({ modelId: savedModel.modelId }));
		}
	};

	// when there is change in model data, it compares if anything has changed or not, and uses
	// memoised function to generate new token if there is changes in data
	// If the token is changed..then it goes for new calculation.
	const modelMomoisedRef = useMemo(() => {
		return (Math.random() + 1).toString(36).substring(7);
	}, [savedModel]);

	const generateNewCachedModel = useCallback(() => {
		setCachedModelRef(modelMomoisedRef);
	}, [savedModel]);

	const setModelPayloadCallback = useCallback(
		(payload) => {
			setModelPayload(payload);
		},
		[modelPayload]
	);

	useEffect(() => {
		if (savedModel) {
			/* save model as inactive */
			let payload = {
				clientId: clientId,
				loa1Id,
				name: modelName,
				...modelInfo,
			};

			if (planType) {
				payload.planType = planType;
			}

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

			// null validation
			if (avgEmployeeCount) {
				payload.lives = avgEmployeeCount;
				payload.averageEmployeeCount = avgEmployeeCount;
			}
			if (avgMemberCount) {
				payload.averageMemberCount = avgMemberCount;
			}
			if (em) {
				payload.em = em;
			}
			if (employeeCountActive) {
				payload.employeeCountActive = employeeCountActive;
			}
			if (employeeCountTotal) {
				payload.employeeCountTotal = employeeCountTotal;
			}
			if (ipaAdmin !== null && ipaAdmin !== undefined) {
				payload.ipaAdmin = ipaAdmin;
			}
			if (ipaAllocation !== null && ipaAllocation !== undefined) {
				payload.ipaAlloc = ipaAllocation;
			}
			if (memberCountActive) {
				payload.memberCountActive = memberCountActive;
			}
			if (memberCountTotal) {
				payload.memberCountTotal = memberCountTotal;
			}
			if (mm) {
				payload.mm = mm;
			}
			if (pcpCount !== null && pcpCount !== undefined) {
				payload.noOfPcp = Number(pcpCount);
			}
			if (averagePremium !== null && averagePremium !== undefined) {
				payload.premium = averagePremium;
			}
			const newPayload = { ...savedModel, ...payload };
			// 
			// 
			// 
			//if (averagePremium !== null && averagePremium !== undefined) { // blocking null premium creation
			setModelPayloadCallback(newPayload);
			//}
		}
	}, []);

	useEffect(() => {
		generateNewCachedModel();
		// dispatch(recalculateSavingsAction(true));
	}, [modelPayload]);

	useEffect(() => {
		if (cachedModelRef) {
			// 
			//dispatch(saveNewModelAction(modelPayload));
		}
	}, [cachedModelRef]);

	useEffect(() => {
		
	}, [next]);

	// useEffect(() => {
	// 	if (cachedModelRef) {
	// 		// console.clear();
	// 		//
	// 		calculateSavings();
	// 	}
	// }, [savedModel]);

	// useEffect(() => {
	// 	if (recalculateSavings) {
	// 		calculateSavings();
	// 	}
	// }, [recalculateSavings]);

	// useEffect(() => {
	// 	calculateSavings();
	// }, []);

	if (!displayResult) return null;
	return null;

	const getClassForNegativeValue = (amount = 0) => {
		return Math.sign(amount) === -1 ? styles.textRed : "";
	};

	const getTableData = (pmpm, total) => {
		return (
			<TableContainer style={{ border: 0 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>PMPM</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>PMPM</TableCell>
							<TableCell>
								<CurrencyComponent classProp={getClassForNegativeValue(pmpm)}>
									{pmpm}
								</CurrencyComponent>
							</TableCell>
							<TableCell>
								<CurrencyComponent classProp={getClassForNegativeValue(total)}>
									{total}
								</CurrencyComponent>
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
				{savings?.map((item) => {
					return (
						<Grid item xs={6} className={styles.tableGrid}>
							<h3 className={styles.tableHeading}>{item.amountTypeName}</h3>
							{calculateSavingResStatus === REQUEST ? (
								<Skeleton count={2} height={22} />
							) : (
								getTableData(item.pmPm, item.totalAmount)
							)}
						</Grid>
					);
				})}
			</Grid>
		</div>
	);
}
