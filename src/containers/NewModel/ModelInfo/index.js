import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import styles from "./modelinfo.module.css";

import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

/* redux part */
import {
	listAction,
	getLoa1ByIdAction,
	getLoa2ByIdAction,
	getLoa3ByIdAction,
	getLoa4ByIdAction,
	getPlansByIdAction,
	getPopulationSummaryAction,
	saveModelInfoAction,
	saveClientListAction,
	resetClientModelAction,
	updateLabelListAction,
	clientModelState,
	initialState,
} from "@slices/clientModelSlice";

import {
	setModuleInfoAction,
	moduleInfoState,
	getAllData,
} from "@slices/moduleInfoSlice";

import {
	getGlobalAssumption,
	saveUsedAssumptionAction,
	globalAssumptionModelState,
} from "@slices/globalAssumptionAlice";

import { useSelector, useDispatch } from "react-redux";
import {
	NumberComponent,
	PopulationComponent,
	CurrencyComponent,
} from "@components/FormatNumber";
import NemoInput from "src/shared/NemoInput";
import NemoCheckBox from "src/shared/NemoCheckBox";
import NemoSelect from "src/shared/NemoSelect";
import clsx from "clsx";
import ModelResultBox from "@containers/ModelResultBox";
import { updateTabEdited } from "@slices/tabModelSlice";
import {checkIfModelExists, riskModelerState} from "@slices/riskModelerSlice";

const useStyles = makeStyles((theme) => ({
	search: {
		[theme.breakpoints.down("sm")]: {
			paddingBottom: "10px",
		},
	},
	inputStyle: {
		background: "#EFEFF0",
		borderRadius: "7px !important",
		paddingLeft: "10px",
	},
	selectStyle: {
		root: {
			height: "18px",
			borderRadius: "7px",
			minHeight: "unset !important",
			"&.MuiFilledInput-input": {
				color: "grey",
			},
		},
	},
	formGroup: {
		marginBottom: "22px",
	},
	premiumStyle: {
		fontWeight: "600 !important",
	},
}));

export default function ModelInfo({ tabIndex, ...props }) {
	console.log("props",props);
	const {setTabError,tabError}=props;
	const classes = useStyles();
	const router = useRouter();
	const { modelid: editModelId } = router.query;
	const [timeout, settimeOut] = useState(0);
	const [editMode, setEditMode] = useState(editModelId ? true : false);
	const dispatch = useDispatch();
	const {savedModel} = useSelector(riskModelerState);
	const [isUniqueModel,setIsUniqueModel] = useState(true);
	const [autoModelNameFlag, setAutoModelNameFlag] = useState(
		editModelId ? false : true
	);

	const {
		modelInfo,
		clientModelList,
		clientModel,
		populationSummary,
		loaList,
		loaLabel,
		planTypeList,
		resStatus,
		clientListResStatus,
	} = useSelector(clientModelState);

	const { moduleInfo } = useSelector(moduleInfoState);
	const { modelDetail, usedAssumption } = useSelector(
		globalAssumptionModelState
	);

	useEffect(() => {
		if(savedModel.error){
			setIsUniqueModel(false);
			setTabError(prev => ({...prev, errorDuplicate:"model name already exists"}))
		}
		else{
			setIsUniqueModel(true);
			setTabError(prev => {
				const {errorDuplicate, ...rest} = prev;
				return rest;
			})
		}
		if (modelDetail) {
			saveModelInfoAction({
				...initialState.modelInfo,
				modelName: modelInfo.modelName,
				//event.target.name]: event.target.value,
			});
		}
	}, [modelDetail]);

	const handleClientChange = (event) => {
		/* if client changes, reset everything */
		dispatch(updateTabEdited(tabIndex));
		dispatch(resetClientModelAction());
		dispatch(saveClientListAction(clientModelList));
		dispatch(
			saveModelInfoAction({
				...initialState.modelInfo,
				modelName: modelInfo.modelName,
				[event.target.name]: event.target.value,
			})
		);
	};

	useEffect(() => {
		if (editModelId) {
			dispatch(getGlobalAssumption(editModelId));
		}
	}, []);

    const checkIfModelExist=async (payload)=>{
		const data = await dispatch(
			checkIfModelExists(payload)
		);
		setIsUniqueModel(data.payload)
		if(data.payload===false){
			setTabError(prev => ({...prev, errorDuplicate:"model name already exists"}))
		}
		else{
			setTabError(prev => {
				const {errorDuplicate, ...rest} = prev;
				return rest;
			})
		}
    }

	const handleChange = (event) => {
		/* if client changes, reset everything */
		if (event.target.name === "modelName") {
			setAutoModelNameFlag(false);
		}
		dispatch(updateTabEdited(tabIndex));
		dispatch(
			saveModelInfoAction({
				...modelInfo,
				[event.target.name]: event.target.value,
			})
		);
		timeOutModelExists(event.target.value);
    };

    const timeOutModelExists=(name)=>{
		if (timeout) clearTimeout(timeout);
		if(name){
			let changetimeout = setTimeout(() => {
				checkIfModelExist({name});
			}, 500);
			settimeOut(changetimeout);
		}
	}

	const {
		loa1Id: loa1Label,
		loa2Id: loa2Label,
		loa3Id: loa3Label,
		loa4Id: loa4Label,
	} = loaLabel;
	const { modelName, clientId, planType, loa1Id, loa2Id, loa3Id, loa4Id } =
		modelInfo;

	const { loa1List, loa2List, loa3List, loa4List } = loaList;

	const generateModalName = () => {
		/* auto model name */
		const uniqueId = String(new Date().getTime())
			.split("")
			.reverse()
			.join("")
			.substring(0, 5);
		dispatch(
			saveModelInfoAction({
				...modelInfo,
				modelName: `Model-${clientId}-${loa1Id}-${uniqueId}`,
			})
		);
		timeOutModelExists(`Model-${clientId}-${loa1Id}-${uniqueId}`);
	};

	const SummaryItem = (props) => {
		const { title, children } = props;
		return (
			<div className={styles.summaryBox}>
				<span className={styles.summaryTitle}>{title}</span>
				<div className={styles.summaryValue}>{children}</div>
			</div>
		);
	};

	const handleAutoModelNameCheckbox = (e) => {
		dispatch(updateTabEdited(tabIndex));
		if (!editMode) {
			const isChecked = e.target.checked;
			setAutoModelNameFlag(isChecked);
			// generateModalName();
			if (clientId && loa1Id) {
				if (isChecked) {
					generateModalName();
					return;
				}
				dispatch(
					saveModelInfoAction({
						...modelInfo,
						modelName: `Model-${clientId}-${loa1Id}`,
					})
				);
			}
		}
	};

	const planTypeListArr = Object.keys(planTypeList).map((plan) => {
		return {
			id: plan,
			name: planTypeList[plan].name,
		};
	});

	const loa1ListArr = Object.keys(loa1List).map((loa) => {
		return {
			id: loa,
			name: loa1List[loa].name,
		};
	});

	/**
	 *
	 * @param {list} list as a object
	 * @returns [] as a options arr {id, name}[]
	 */

	//

	const makeListOptionArr = (list) => {
		return Object.keys(list).map((item) => {
			return {
				//id: list[item].name,
				id: item,
				name: list[item].name,
			};
		});
	};

	useEffect(() => {
		dispatch(listAction());
	}, []);

	useEffect(() => {
		if (clientModelList.length !== 0) {
			// /* update label list on client id update */
			dispatch(updateLabelListAction(clientId));
		}
	}, [clientId, clientModelList]);

	useEffect(() => {
		if (loa1Label) {
			const payload = {
				clientId,
			};
			dispatch(getLoa1ByIdAction(payload));
		}
	}, [clientId, loa1Label]);

	// fetch programs or plan type list on loa1 changes
	useEffect(() => {
		if (loa1Id) {
			const payload = {
				clientId,
				loa1Id: loa1Id,
			};
			dispatch(getPlansByIdAction(payload));
		}
	}, [loa1Id, loa1Label]);

	// fetch practice on product or plan type changes
	useEffect(() => {
		if (planType && loa2Label) {
			const payload = {
				clientId,
				planTypeId: planType,
				loa1Id: loa1Id,
			};
			dispatch(getLoa2ByIdAction(payload));
		}
	}, [planType, loa2Label]);

	// fetch practice on product or plan type changes
	useEffect(() => {
		if (planType && loa3Label) {
			const payload = {
				clientId,
				planTypeId: planType,
				loa1Id: loa1Id,
				loa2Id: loa2Id,
			};
			dispatch(getLoa3ByIdAction(payload));
		}
	}, [loa2Id, loa3Label]);

	useEffect(() => {
		if (planType && loa4Label) {
			const payload = {
				clientId,
				planTypeId: planType,
				loa1Id: loa1Id,
				loa2Id: loa2Id,
				loa3Id: loa3Id,
			};
			dispatch(getLoa4ByIdAction(payload));
		}
	}, [loa3Id, loa4Label]);

	useEffect(() => {
		if (loa1Id && clientId) {
			const {
				clientId,
				planType,
				loa1Id,
				loa2Id,
				loa3Id,
				loa4Id,
				loa5Id,
				loa6Id,
			} = modelInfo;
			let payload = {
				loa1Id,
				clientId,
			};

			if (planType) {
				if (planType != "ALL") {
					payload.planTypeId = planType;
				}
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

			dispatch(getPopulationSummaryAction(payload));
			// dispatch(resetUsedAssumptionAction());
		}
	}, [modelInfo]);

	console.log("populationSUmmary", populationSummary);

	useEffect(() => {
		if (modelInfo.loa1Id && modelInfo.clientId && !modelInfo.modelName) {
			generateModalName();
		}
	}, [modelInfo.loa1Id, modelInfo.clientId]);

	useEffect(() => {
		if (modelInfo.modelName) {
			dispatch(
				setModuleInfoAction({
					...moduleInfo,
					NewModelPage: {
						...moduleInfo["NewModelPage"],
						title: modelInfo.modelName,
					},
				})
			);
		}
	}, [modelInfo.modelName]);

	useEffect(() => {
		if (editMode) {
			let dataToUpdate = {
				id: "GLA-1",
				pcpCount: modelInfo.noOfPcp,
				ipaAllocationPercent: modelInfo.ipaAlloc * 100,
				ipaAdminPercent: modelInfo.ipaAdmin * 100,
				ipaAllocation: modelInfo.ipaAlloc,
				ipaAdmin: modelInfo.ipaAdmin,
				name: "PGLBL",
				riskScore: 0.5,
				averagePremium: modelInfo.premium,
			};
			dispatch(saveUsedAssumptionAction(dataToUpdate));
		}
	}, [
		modelInfo.noOfPcp,
		modelInfo.ipaAlloc,
		modelInfo.ipaAdmin,
		modelInfo.premium,
		editMode,
	]);

	return (
		<Box p={3}>
			{editModelId ? (
				<>
					<Grid container spacing={3}>
						<Grid item xs={4}>
							<Typography variant="h4" gutterBottom>
								Name Your Model*
							</Typography>

							<form noValidate autoComplete="off">
								<NemoInput
									id="modelName"
									name="modelName"
									onChange={handleChange}
									disabled={editModelId}
									placeholder="Model Name"
									value={modelDetail?.name}
									fullWidth
								/>
								<NemoCheckBox
									name="autoModelNameFlag"
									checked={!editMode ? autoModelNameFlag : false}
									onChange={handleAutoModelNameCheckbox}
									disabled={editMode}
									label="Automatically generate a model name based on my input"
									labelPlacement="end"
								/>
							</form>
						</Grid>
					</Grid>
					<Grid container spacing={3}>
						<Grid item xs={4}>
							<div className={classes.formGroup}>
								<Typography
									variant="h4"
									gutterBottom
									className={styles.selectClientWrapper}
								>
									Select Client*
								</Typography>
								{modelDetail?.clientId && (
									<NemoSelect
										fullWidth
										disabled={!clientModelList || editModelId}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="clientId"
										defaultValue={modelDetail?.clientId}
										onChange={handleClientChange}
										displayEmpty
										disableUnderline
										placeholder="Select Client"
										options={clientModelList}
									/>
								)}
							</div>
							{(loa1Label || modelDetail?.clientId) && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select {loa2Label}
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList || editModelId}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="loa2Id"
										defaultValue={modelDetail?.loa2}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder={`Select ${loa2Label}`}
										options={makeListOptionArr(loa2List)}
									/>
								</div>
							)}
						</Grid>
						<Grid item xs={4}>
							{(loa1Label || modelDetail?.loa1) && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select {loa1Label}*
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList || editModelId}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="loa1Id"
										defaultValue={modelDetail?.loa1}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder={`Select ${loa1Label}`}
										options={makeListOptionArr(loa1List)}
									/>
								</div>
							)}

							{(modelDetail?.loa1 || modelDetail?.clientId) && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select {loa3Label}
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList || editModelId}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="loa3Id"
										defaultValue={modelDetail?.loa3}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder={`Select ${loa3Label}`}
										options={makeListOptionArr(loa3List)}
									/>
								</div>
							)}
						</Grid>
						<Grid item xs={4}>
							{(loa1Label || modelDetail?.clientId) && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select Product*
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList || !loa1Id || editModelId}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="planType"
										defaultValue={planType}
										value={planType}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder="Select Product"
										options={makeListOptionArr(planTypeList)}
									/>
								</div>
							)}
							{(loa1Label || modelDetail?.clientId) && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select {loa4Label}
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList || editModelId}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="loa4Id"
										defaultValue={modelDetail?.loa4}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder={`Select ${loa4Label}`}
										options={makeListOptionArr(loa4List)}
									/>
								</div>
							)}
						</Grid>
					</Grid>

					<Grid
						container
						direction="row"
						justifyContent="space-between"
						alignItems="flex-start"
						spacing={3}
					>
						{/* Population Summary */}
						{populationSummary.planTypeName && (
							<Grid item xs={12}>
								<Typography
									variant="h4"
									gutterBottom
									className={clsx(
										styles.selectClientWrapper,
										styles.summaryPopulationTitle
									)}
								>
									Population Summary
								</Typography>
								<Grid
									container
									direction="row"
									justifyContent="space-between"
									alignItems="flex-start"
									spacing={6}
									className={styles.summaryPopulationWrapper}
								>
									<Grid item xs={3}>
										<SummaryItem title="Product">
											{populationSummary.planTypeName}
										</SummaryItem>
									</Grid>
									<Grid item xs={3}>
										<SummaryItem title="Average Member Count">
											<PopulationComponent>
												{populationSummary.avgMemberCount}
											</PopulationComponent>
										</SummaryItem>
									</Grid>
									<Grid item xs={3}>
										<SummaryItem title="Avg. Premium">
											<CurrencyComponent
												decimalCount={2}
												className={classes.premiumStyle}
											>
												{modelDetail?.premium ?? populationSummary.avgPremium}
											</CurrencyComponent>
										</SummaryItem>
									</Grid>
									<Grid item xs={3}>
										<SummaryItem title="Number of PCPs">
											<NumberComponent withComma={true} decimal={false}>
												{usedAssumption.pcpCount ?? populationSummary.pcpCount}
											</NumberComponent>
										</SummaryItem>
									</Grid>
								</Grid>
							</Grid>
						)}
					</Grid>
				</>
			) : (
				<>
					<Grid container spacing={3}>
						<Grid item xs={4}>
							<Typography variant="h4" gutterBottom>
								Name Your Model*
							</Typography>

							<form noValidate autoComplete="off">
								<NemoInput
									id="modelName"
									name="modelName"
									onChange={handleChange}
									placeholder="Model Name"
									value={modelName}
									fullWidth
								/>
								<NemoCheckBox
									name="autoModelNameFlag"
									checked={!editMode ? autoModelNameFlag : false}
									onChange={handleAutoModelNameCheckbox}
									disabled={editMode}
									label="Automatically generate a model name based on my input"
									labelPlacement="end"
								/>
							</form>
							{!isUniqueModel?<small style={{color: "red"}}>Model Name already exists</small>:''}
						</Grid>
					</Grid>
					<Grid container spacing={3}>
						<Grid item xs={4}>
							<div className={classes.formGroup}>
								<Typography
									variant="h4"
									gutterBottom
									className={styles.selectClientWrapper}
								>
									Select Client*
								</Typography>

								<NemoSelect
									fullWidth
									disabled={!clientModelList}
									labelId="demo-simple-select-filled-label"
									id="demo-simple-select-filled"
									name="clientId"
									value={clientId}
									onChange={handleClientChange}
									displayEmpty
									disableUnderline
									placeholder="Select Client"
									options={clientModelList}
								/>
							</div>
							{loa2Label && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select {loa2Label}
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="loa2Id"
										value={loa2Id}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder={`Select ${loa2Label}`}
										options={makeListOptionArr(loa2List)}
									/>
								</div>
							)}
						</Grid>
						<Grid item xs={4}>
							{loa1Label && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select {loa1Label}*
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="loa1Id"
										value={loa1Id}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder={`Select ${loa1Label}`}
										options={makeListOptionArr(loa1List)}
									/>
								</div>
							)}
							{loa3Label && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select {loa3Label}
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="loa3Id"
										value={loa3Id}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder={`Select ${loa3Label}`}
										options={makeListOptionArr(loa3List)}
									/>
								</div>
							)}
						</Grid>
						<Grid item xs={4}>
							{loa1Label && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select Product*
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList || !loa1Id}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="planType"
										value={planType}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder="Select Product"
										options={makeListOptionArr(planTypeList)}
									/>
								</div>
							)}
							{loa4Label && (
								<div className={classes.formGroup}>
									<Typography
										variant="h4"
										gutterBottom
										className={styles.selectClientWrapper}
									>
										Select {loa4Label}
									</Typography>
									<NemoSelect
										fullWidth
										disabled={!clientModelList}
										labelId="demo-simple-select-filled-label"
										id="demo-simple-select-filled"
										name="loa4Id"
										value={loa4Id}
										onChange={handleChange}
										displayEmpty
										disableUnderline
										placeholder={`Select ${loa4Label}`}
										options={makeListOptionArr(loa4List)}
									/>
								</div>
							)}
						</Grid>
					</Grid>

					<Grid
						container
						direction="row"
						justifyContent="space-between"
						alignItems="flex-start"
						spacing={3}
					>
						{/* Population Summary */}
						{populationSummary.planTypeName && (
							<Grid item xs={12}>
								<Typography
									variant="h4"
									gutterBottom
									className={clsx(
										styles.selectClientWrapper,
										styles.summaryPopulationTitle
									)}
								>
									Population Summary
								</Typography>
								<Grid
									container
									direction="row"
									justifyContent="space-between"
									alignItems="flex-start"
									spacing={6}
									className={styles.summaryPopulationWrapper}
								>
									<Grid item xs={3}>
										<SummaryItem title="Product">
											{populationSummary.planTypeName}
										</SummaryItem>
									</Grid>
									<Grid item xs={3}>
										<SummaryItem title="Average Member Count">
											<PopulationComponent>
												{populationSummary.avgMemberCount}
											</PopulationComponent>
										</SummaryItem>
									</Grid>
									<Grid item xs={3}>
										<SummaryItem title="Avg. Premium">
											<CurrencyComponent
												decimalCount={2}
												className={classes.premiumStyle}
											>
												{modelDetail?.premium ?? populationSummary.avgPremium}
											</CurrencyComponent>
										</SummaryItem>
									</Grid>
									<Grid item xs={3}>
										<SummaryItem title="Number of PCPs">
											<NumberComponent withComma={true} decimal={false}>
												{usedAssumption.pcpCount ?? populationSummary.pcpCount}
											</NumberComponent>
										</SummaryItem>
									</Grid>
								</Grid>
							</Grid>
						)}
					</Grid>
				</>
			)}

			{clientId && loa1Id && planType && (
				<Box component="div" sx={{ visibility: "hidden" }}>
					<ModelResultBox next="nemo-tab-1" displayButton={false} />
				</Box>
			)}
		</Box>
	);
}
