import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MuiFormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import GlobalAssumptionBox from "@components/GlobalAssumptionBox";
import ModelResultBox from "../../ModelResultBox";
import styles from "./globalassumption.module.css";
import NemoSkeleton from "@components/NemoSkeleton";
import _debounce from "lodash/debounce";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { makeid } from "@utils/common";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;
import {
	addAction,
	getModelingOptionsAction,
	modelOptionState, saveModelingOptionsAction,
	saveModelingOptionsInfoAction,
} from "@slices/modelingOptionsSlice";

import React, { useState, useEffect, useCallback } from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getGlobalAssumption } from "@slices/globalAssumptionAlice";

const responsive = {
	desktop: {
		breakpoint: { max: 3000, min: 1024 },
		items: 3,
		slidesToSlide: 1,
		partialVisibilityGutter: 40, // this is needed to tell the amount of px that should be visible.
	},
	tablet: {
		breakpoint: { max: 1024, min: 464 },
		items: 2,
		partialVisibilityGutter: 30, // this is needed to tell the amount of px that should be visible.
	},
	mobile: {
		breakpoint: { max: 464, min: 0 },
		items: 1,
		partialVisibilityGutter: 30, // this is needed to tell the amount of px that should be visible.
	},
};

/* redux part */
import {
	listAction,
	saveUsedAssumptionAction,
	setShowAssumptionDetailsAction,
	globalAssumptionModelState,
} from "@slices/globalAssumptionAlice";

import { clientModelState } from "@slices/clientModelSlice";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import NemoInput from "src/shared/NemoInput";
import { setTabStateAction, updateTabEdited } from "@slices/tabModelSlice";
import { Divider, TextField } from "@material-ui/core";
import globalConstants from "@constants/index";
import {
	calculateSavingsAction,
	saveNewModelAction,
} from "@slices/riskModelerSlice";
import { useUser } from '@auth0/nextjs-auth0';
import constants from "@constants/index";


const useStyles = makeStyles((theme) => ({
	newModelButton: {
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
		width: "100%",
		fontSize: "18px",

		position: "relative",
		"& .MuiButton-startIcon": {
			position: "absolute",
			left: 24,
		},
		"& .MuiButton-startIcon span": {
			fontSize: "36px",
		},
		marginTop: "20px",
	},
	inputStyle: {
		border: "1px solid",
		background: "#EFEFF0",
		borderRadius: "7px !important",
		paddingLeft: "10px",
	},
	inputAdornment: {
		fontSize: 14,
		paddingLeft: "3px",
		height: "unset",
	},
	formcontrolLabel: {
		width: "100%",
		margin: "0px",
	},
	formControlRoot: {
		margin: "0px",
		position: "relative",

		"& .MuiRadio-root": {
			position: "absolute",
			right: "14px",
			top: "14px",
		},
	},
	carousel: {
		"&.react-multi-carousel-list": {
			width: "100% !important",
			margin: "0px -15px !important",
			//   padding: '0 80px !important',
		},
		"& .react-multi-carousel-item": {
			width: "300px !important",
			margin: "0px 15px",
		},
	},
	dividerStyle: {
		marginTop: "20px",
		marginBottom: "20px",
	},
	typoStyle: {
		fontFamily: "Roboto",
		fontStyle: "normal",
		fontWeight: 500,
		fontSize: "20px",
		lineHeight: "23px",
		textAlign: "flex-start",
		color: "#06406D",
		marginBottom: "20px",
	},
	prStyle: {
		width: "257px",
	},
}));

const FormControl = withStyles({
	root: {
		width: "100%",
		margin: "0px",
	},
})(MuiFormControl);

export default function GlobalAssumption({ tabIndex, setTabError }) {
	const classes = useStyles();
	const { ROUTES, ModelingOptions } = constants;
	const dispatch = useDispatch();
	const router = useRouter();
	const { modelid: editModelId } = router.query;
	const [editMode, setEditMode] = useState(editModelId ? true : false);
	const {
		globalAssumptionModelList,
		usedAssumption,
		globalAssumptionModelListResStatus,
		showAssumptionDetails,
		resStatus,
	} = useSelector(globalAssumptionModelState);

	const { modelingOptionsInfo, savedModelingOptions } =
		useSelector(modelOptionState);

	useEffect(() => {
		if (globalAssumptionModelListResStatus !== SUCCESS) {
			dispatch(listAction());
		}
	}, []);

	const { modelInfo, populationSummary } = useSelector(clientModelState);

	// const { oneGlobalAssumption, usedAssumption } = useSelector(
	// 	globalAssumptionModelState
	// );

	const [ipa, setIpa] = useState(null);

	// setIpa(oneGlobalAssumption?.ipaAllocation);

	//

	const [selectedAssumption, setSelectedAssumption] = useState(null);
	const [disabledAvgPremium, setDisabledAvgPremiun] = useState(true);
	const [selectedAssumptionByRadio, setSelectedAssumptionByRadio] =
		useState("");
	const [modalBoxId, refreshModalBox] = useState(makeid(5));
	const [optionValues, setOptionValues] = useState([]);

	const setShowAssumptionDetails = (val) => {
		dispatch(setShowAssumptionDetailsAction(val));
	};
	const modelOption = useSelector(modelOptionState);

	const [rem, setRem] = useState();
	const [first, setFirst] = useState();
	const [second, setSecond] = useState();
	const [timeout, settimeOut] = useState(0);
	const [errorrr, setErrorrr] = useState(false);
	const [textInput, setTextInput] = useState(true);
	const [sum, setSum] = useState(0);

	const [tempVal, setTempVal] = useState();

	const {user} = useUser();

	useEffect(() => {
		setSum(Number(first) + Number(second));
		setTabError(prev => {
			const {ipaSum, ...rest} = prev;
			return rest;
		})
		if (sum > 100) {
			setErrorrr(true);
			setTabError(prev => ({...prev, ipaSum: "Sum cannot be greater than 100"}))
		}
		if(first < second) {
			setTabError(prev => ({...prev, ipaSum1: "IPA Admin cannot be greater than IPA Allocation"}))
		}else {
			setTabError(prev => {
				const {ipaSum1, ...rest} = prev;
				return rest;
			})
		}
	}, [first, second, sum]);

	useEffect(() => {
		setFirst(usedAssumption?.ipaAllocationPercent)
		setSecond(usedAssumption?.ipaAdminPercent)
	}, [usedAssumption])


	const [temp, setTemp] = useState(null);

	function handleKeyUp(name, value) {
		//   handleUpdate(e);
		// const { name, value } = e.target;
		
		let payloadObj = {};
		if (name === "ipaAllocationPercent") {
			payloadObj.ipaAlloc = value / 100;
			payloadObj.ipaAllocation = value/100;
			payloadObj.ipaAllocationPercent = value;
		}
		if (name === "ipaAdminPercent") {
			payloadObj.ipaAdmin = value / 100;
			payloadObj.ipaAdminPercent = value;
		}
		if (name === "pcpCount") {
			payloadObj.noOfPcp = Number(value);
		}
		if (name === "averagePremium") {
			payloadObj.premium = Number(value);
		}
		if (usedAssumption[name] !== value) {
			dispatch(
				saveNewModelAction({
					...modelInfo,
					...populationSummary,
					...usedAssumption,
					averageEmployeeCount: populationSummary.avgEmployeeCount,
					averageMemberCount: populationSummary.avgMemberCount,
					lives: populationSummary.avgEmployeeCount,
					name: modelInfo.modelName,
					modelId: router.query.modelid,
					ipaAlloc: usedAssumption.ipaAllocation,
					premium: usedAssumption.averagePremium,
					noOfPcp: usedAssumption.pcpCount,
					userName: user?.nickname,
					...payloadObj,
				})
			);
			dispatch(calculateSavingsAction({ modelId: router?.query?.modelid }));
		}
	}

	const handleUpdate = (event, isHandleKeyUp) => {
		let { name, value } = event.target;
		let tempObj = {};
		let tempSum;
		dispatch(updateTabEdited(tabIndex));

		// convert into decimal while saving
		if (name === "ipaAllocationPercent") {
			setFirst(value);
			setTemp(value);
			tempSum = Number(value) + Number(second);
			//setIpaNew(value);

			tempObj.ipaAlloc = value / 100;
			tempObj.ipaAllocation = value / 100;
			tempObj.ipaAllocationPercent = value;
		}
		if (name === "ipaAdminPercent") {
			setSecond(value);
			tempSum = Number(value) + Number(first);

			tempObj.ipaAdmin = value / 100;
			tempObj.ipaAdminPercent = value;
		}
		
		
		const payload = { ...usedAssumption, [name]: value, ...tempObj };
		dispatch(saveUsedAssumptionAction(payload));

		if (name === "ipaAllocationPercent" && value < second) {
			if (timeout) clearTimeout(timeout);
			return;
	}

		if (name === "ipaAdminPercent" && value > first) {
				if (timeout) clearTimeout(timeout);
				return;
		}

		if(tempSum > 100 && (name !== "averagePremium" || name !== "pcpCount")) {
			if (timeout) clearTimeout(timeout);
			return;
		};
		// handleKeyUp(event);

		if (isHandleKeyUp && (tempSum<=100 || name === "averagePremium" || name === "pcpCount")) {
			if (timeout) clearTimeout(timeout);
			let changetimeout = setTimeout(() => {
				handleKeyUp(name, value);
			}, 500);
			settimeOut(changetimeout);
		}
	};

	useEffect(() => {

	}, [sum])

	// const handleMathCheck = (val) => {
	//
	//
	//

	// 	if (val <= 100 && val >= 0) {
	// 		first && second && first + second < 101
	// 			?
	// 			:
	// 	} else {
	//
	// 	}
	// };

	useEffect(() => {
		/* default used assumption */
		//need to give option to check if there is any assumption in the list
		// if (editMode) {
		const assumption = {
			averagePremium: modelInfo.premium,
			id: "GLA-1",
			ipaAdmin: modelInfo.ipaAdmin,
			ipaAllocation: modelInfo.ipaAlloc,
			name: "PGLBL",
			riskScore: 0.5,
		};
		setShowAssumptionDetails(true);
		// setSelectedAssumption(assumption);
		// } else

		if (selectedAssumptionByRadio) {
			const selecteddata = globalAssumptionModelList.filter(
				(globalAssumption, index) => {
					return globalAssumption.id === selectedAssumptionByRadio;
				}
			);

			if (selecteddata[0]) {
				setSelectedAssumption(selecteddata[0]);
			}
		}
	}, [selectedAssumptionByRadio]);

	useEffect(() => {
		if (
			globalAssumptionModelList[0] &&
			Object.keys(usedAssumption).length === 0
		) {
			setSelectedAssumptionByRadio(globalAssumptionModelList[0].id);
		} else {
			/* set what is set on used assumption */
			setSelectedAssumptionByRadio(usedAssumption.id);
		}
	}, [globalAssumptionModelList]);

	useEffect(() => {
		if (selectedAssumption) {
			//Need to remove this if we uncomment radio later...
			const ipaAllocationPercent = selectedAssumption.ipaAllocation * 100;
			const ipaAdminPercent = selectedAssumption.ipaAdmin * 100;

			setFirst(ipaAllocationPercent);
			setSecond(ipaAdminPercent);

			const { avgPremium } = populationSummary;
			let dataToUpdate = {
				...selectedAssumption,
				pcpCount: populationSummary.pcpCount,
				ipaAllocationPercent: ipaAllocationPercent,
				ipaAdminPercent: ipaAdminPercent,
				averagePremium: editMode
					? selectedAssumption.averagePremium
					: avgPremium,
			};
			dispatch(saveUsedAssumptionAction(dataToUpdate));
			return;

			if (selectedAssumption.id !== usedAssumption.id) {
				const ipaAllocationPercent = selectedAssumption.ipaAllocation * 100;
				const ipaAdminPercent = selectedAssumption.ipaAdmin * 100;
				const { avgPremium } = populationSummary;
				let dataToUpdate = {
					...selectedAssumption,
					pcpCount: populationSummary.pcpCount,
					ipaAllocationPercent: ipaAllocationPercent,
					ipaAdminPercent: ipaAdminPercent,
					averagePremium: editMode
						? selectedAssumption.averagePremium
						: avgPremium,
				};
				// if(selectedAssumption.id === usedAssumption.id){
				//     dataToUpdate = {...dataToUpdate, ...usedAssumption};
				// }
				dispatch(saveUsedAssumptionAction(dataToUpdate));

				/* change radio state */
				setSelectedAssumptionByRadio(selectedAssumption.id);
			}
		} else {
			// openDetails false (callback: null from globalassumptionbox)
			// setShowAssumptionDetails(false);
		}
	}, [selectedAssumption]);

	const handleRadioChange = (e) => {
		dispatch(updateTabEdited(tabIndex));
		setSelectedAssumptionByRadio(e.target.value);
	};

	useEffect(() => {
		/* recalculate on used assumption change */
		refreshModalBox(makeid(5)); // refresh modal box
		// dispatch(recalculateSavingsAction());
	}, [usedAssumption]);

	useEffect(() => {
		if (editModelId) {
			dispatch(getGlobalAssumption(editModelId));
			dispatch(getModelingOptionsAction(editModelId));
		}
	}, []);

	const handleChange = (e) => {
		setTextInput(e.target.value);
	};

	// useEffect(() => {
	// 	if(modelingResStatus === SUCCESS) {
	// 		refreshModalBox(makeid(5)); // refresh modal box
	// 	}
	// },[modelingResStatus]);
	const renderGlobalAssumptionDetails = () => {
		let { ipaAllocationPercent, ipaAdminPercent, pcpCount, averagePremium } =
			usedAssumption;

		// ipaAllocationPercent = oneGlobalAssumption?.ipaAllocation * 100;
		// if (!temp) {
		// 	setTemp(ipaAllocationPercent);
		// }
		function handleDebounceFn(e) {
			const option = {
				name: e.target.name,
				value: e.target.value,
			};
			setOptionValues((optionValue) => [...optionValue, option]);
		}
		useEffect(() => {
			const payload = {
				modelId: 924,
				options: optionValues,
			};

			dispatch(addAction(payload));
		}, [optionValues]);

		const debounceFn = useCallback(_debounce(handleDebounceFn, 600), []);

		// const handleTextChange = (e) => {
		// 	debounceFn(e);
		// 	debugger
		// 	dispatch(updateTabEdited(tabIndex));
		// };

		const saveModellingOptions= async (modellingOptionsPayload)=>{
			if (modellingOptionsPayload.length !== 0) {
				dispatch(
					saveModelingOptionsAction(modellingOptionsPayload)
				);
			}
		}
		const handleTextChange = (event) => {
			if (timeout) clearTimeout(timeout);
			if((Number(event.target.value) <= 100 && Number(event.target.value) > 0) || event.target.value===''){
				const modellingOptionsPayload={
					"modelId": router?.query?.modelid,
					"options": [
						{
							"modelingOptionsFieldId": ModelingOptions.find(option=>option.name===event.target.name).optionId,
							"value": event.target.value
						}
					]
				}
				let changetimeout = setTimeout(async () => {
					await saveModellingOptions(modellingOptionsPayload);
					dispatch(calculateSavingsAction({ modelId: router?.query?.modelid }));
				}, 500);
				settimeOut(changetimeout);
			}
			if(Number(event.target.value) > 100 || Number(event.target.value) < 0) {
				setTabError(prev => ({...prev, [event.target.name]: "Value must be between 0 and 100"}))
			} else {
				setTabError(prev => {
					const {[event.target.name]: ibnr, ...rest} = prev;
					return rest;
				})
			}
			dispatch(updateTabEdited(tabIndex));
			dispatch(
				saveModelingOptionsInfoAction({
					name: event.target.name,
					value: event.target.value,
				})
			);
		};

		//

		return (
			<>
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={3}
				>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="planTypeName"
							name="planTypeName"
							placeholder="Plan Type"
							value={populationSummary?.planTypeName}
							label="Product"
							fullWidth
							disabled={true}
						/>
					</Grid>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="ipaAllocation"
							name="ipaAllocationPercent"
							value={ipaAllocationPercent}
							onChange={(e) => handleUpdate(e, true)}
							placeholder="IPA Allocation"
							label="IPA Allocation"
							fullWidth
							error={sum > 100 || first < second}
							helperText={sum > 100 || first < second ? "Invalid entry" : ""}
							InputProps={{
								disableUnderline: sum <= 100 && first > second,
								endAdornment: (
									<InputAdornment position="start">
										<Icon className={classes.inputAdornment}>%</Icon>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={3}
				>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="avgMemberCount"
							name="avgMemberCount"
							placeholder="Avg. Member Count"
							value={populationSummary?.avgMemberCount}
							label="Avg. Member Count"
							fullWidth
							disabled={true}
						/>
					</Grid>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="ipaAdmin"
							fullWidth
							name="ipaAdminPercent"
							value={ipaAdminPercent}
							onChange={(e) => handleUpdate(e, true)}
							placeholder="IPA Admin"
							label="IPA Admin"
							error={sum > 100 || first < second}
							helperText={sum > 100 || first < second ? "Invalid entry" : ""}
							InputProps={{
								disableUnderline: sum <= 100 && first > second,
								endAdornment: (
									<InputAdornment position="start">
										<Icon className={classes.inputAdornment}>%</Icon>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={3}
				>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="averagePremium"
							fullWidth
							name="averagePremium"
							// disabled={disabledAvgPremium}
							value={
								disabledAvgPremium
									? Number(averagePremium).toFixed(2)
									: averagePremium
							}
							onChange={(e) => handleUpdate(e, true)}
							placeholder="Average Premium"
							label="Average Premium"
							onFocus={() => setDisabledAvgPremiun(false)}
							// onBlur = {()=>setDisabledAvgPremiun(true)}
							InputProps={{
								disableUnderline: true,
								startAdornment: (
									<InputAdornment position="start">
										<Icon className={classes.inputAdornment}>$</Icon>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="pcpCount"
							fullWidth
							name="pcpCount"
							key="pcpCount"
							value={pcpCount}
							onChange={(e) => handleUpdate(e, true)}
							placeholder="Number of PCPs"
							label="Number of PCPs"
						/>
					</Grid>
				</Grid>
				<Divider className={classes.dividerStyle}></Divider>

				<Grid xs={12}>
					<Typography className={classes.typoStyle}>
						Modeling Options
					</Typography>
				</Grid>
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={3}
				>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="ibnr"
							fullWidth
							name="ibnr"
							key="ibnr"
							className={classes.prStyle}
							value={modelingOptionsInfo?.["ibnr"] ?? ""}
							onChange={handleTextChange}
							label="Adjust for IBNR"
							helperText={
								Number(modelingOptionsInfo?.["ibnr"]) > 100 ||
								Number(modelingOptionsInfo?.["ibnr"]) < 0
									? "Must be in between 0 and 100"
									: ""
							}
							error={
								Number(modelingOptionsInfo?.["ibnr"]) > 100 ||
								Number(modelingOptionsInfo?.["ibnr"]) < 0
									? "Must be in between 0 and 100"
									: ""
							}
							placeholder="%Adjustment"
						/>
						<Divider className={classes.dividerStyle}></Divider>
					</Grid>

					<Grid item xs={6} lg={5}>
						<NemoInput
							id="mcr"
							fullWidth
							name="mcr"
							key="mcr"
							className={classes.prStyle}
							value={modelingOptionsInfo?.["mcr"] ?? ""}
							onChange={handleTextChange}
							label="Adjust for Medical Cost Increase"
							helperText={
								Number(modelingOptionsInfo?.["mcr"]) > 100 ||
								Number(modelingOptionsInfo?.["mcr"]) < 0
									? "Must be in between 0 and 100"
									: ""
							}
							error={
								Number(modelingOptionsInfo?.["mcr"]) > 100 ||
								Number(modelingOptionsInfo?.["mcr"]) < 0
									? "Must be in between 0 and 100"
									: ""
							}
							placeholder="%Adjustment"
						/>
						<Divider className={classes.dividerStyle}></Divider>
					</Grid>
				</Grid>
				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="flex-start"
					spacing={3}
				>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="pci"
							fullWidth
							name="pci"
							key="pci"
							className={classes.prStyle}
							value={modelingOptionsInfo?.["pci"] ?? ""}
							onChange={handleTextChange}
							label="Adjust for Pharmacy Cost Increase"
							helperText={
								Number(modelingOptionsInfo?.["pci"]) > 100 ||
								Number(modelingOptionsInfo?.["pci"]) < 0
									? "Must be in between 0 and 100"
									: ""
							}
							error={
								Number(modelingOptionsInfo?.["pci"]) > 100 ||
								Number(modelingOptionsInfo?.["pci"]) < 0
									? "Must be in between 0 and 100"
									: ""
							}
							placeholder="%Adjustment"
						/>
						<Divider className={classes.dividerStyle}></Divider>
					</Grid>
					<Grid item xs={6} lg={5}>
						<NemoInput
							id="pr"
							className={classes.prStyle}
							name="pr"
							key="pr"
							value={modelingOptionsInfo?.["pr"] ?? ""}
							onChange={handleTextChange}
							label="Adjust for Predicted Risk"
							helperText={
								Number(modelingOptionsInfo?.["pr"]) > 100 ||
								Number(modelingOptionsInfo?.["pr"]) < 0
									? "Must be in between 0 and 100"
									: ""
							}
							error={
								Number(modelingOptionsInfo?.["pr"]) > 100 ||
								Number(modelingOptionsInfo?.["pr"]) < 0
									? "Must be in between 0 and 100"
									: ""
							}
							placeholder="%Adjustment"
						/>
						<Divider className={classes.dividerStyle}></Divider>
					</Grid>
				</Grid>
			</>
		);
	};

	// if (!selectedAssumptionByRadio) return "Loading...";

	return (
		<Box p={3}>
			<Typography
				variant="h4"
				gutterBottom
				className={styles.selectAssumptionTitle}
				style={{
					display: "none",
				}}
			>
				Select Assumption
			</Typography>

			<FormControl
				component="fieldset"
				style={{
					display: "none",
				}}
			>
				<RadioGroup
					aria-label="assumption"
					name="assumption"
					value={selectedAssumptionByRadio}
					onChange={handleRadioChange}
					className={styles.formGroup}
				>
					{globalAssumptionModelListResStatus === SUCCESS && (
						<>
							<Carousel
								responsive={responsive}
								autoPlay={false}
								arrows={true}
								className={classes.carousel}
							>
								{globalAssumptionModelList.map((data, index) => {
									const gaData = {
										modelInfo,
										populationSummary,
										globalAssumption: data,
									};
									const value = data.id;
									return (
										<FormControlLabel
											key={index}
											value={value}
											control={
												<Radio
													checkedIcon={
														<img
															src="/new/tick-checked.svg"
															alt="nemo logo"
															className={classes.logo}
														/>
													}
													icon={
														<img
															src="/new/tick.svg"
															alt="nemo logo"
															className={classes.logo}
														/>
													}
												/>
											}
											classes={{
												label: classes.formcontrolLabel,
												root: classes.formControlRoot,
											}}
											label={
												<GlobalAssumptionBox
													data={gaData}
													key={index}
													callback={setSelectedAssumption}
													openDetails={setShowAssumptionDetails}
													checked={selectedAssumptionByRadio === value}
												/>
											}
										/>
									);
								})}
							</Carousel>
							{globalAssumptionModelListResStatus === REQUEST && (
								<React.Fragment>
									<FormControlLabel
										control={<Radio />}
										classes={{ label: classes.formcontrolLabel }}
										label={<NemoSkeleton count={1} height={80} />}
									/>
									<FormControlLabel
										control={<Radio />}
										classes={{ label: classes.formcontrolLabel }}
										label={<NemoSkeleton count={1} height={80} />}
									/>
								</React.Fragment>
							)}
						</>
					)}
				</RadioGroup>
			</FormControl>

			{/* {showAssumptionDetails &&
        selectedAssumption &&
        usedAssumption &&
        renderGlobalAssumptionDetails()} */}
			{usedAssumption && renderGlobalAssumptionDetails()}

			<Box component="div" sx={{ visibility: "hidden" }}>
				<ModelResultBox
					next="nemo-tab-2"
					key={modalBoxId}
					displayButton={false}
				/>
			</Box>
		</Box>
	);
}
