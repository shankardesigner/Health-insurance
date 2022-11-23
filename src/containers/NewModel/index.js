import React, { useEffect, useState } from "react";
import TabModalComponent from "@components/TabComponent/TabModalNew";

import ModelInfo from "./ModelInfo";
import GlobalAssumption from "./GlobalAssumption";
import ModelingOptions from "./ModelingOptions";
import NemoFactors from "./NemoFactors";
import ResultsClaims from "./ResultsClaims";
import ResultsModeling from "./ResultsModeling";
import WhatIf from "./WhatIf";

/* redux part */
import { setTabStateAction, tabModelState } from "@slices/tabModelSlice";

import { clientModelState } from "@slices/clientModelSlice";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { riskModelerState } from "@slices/riskModelerSlice";
import StopLoss from "./StopLoss";
import { resetStopLoss } from "@slices/stopLoss";

export default function NewModel({ props }) {
	// return <NewReporting />
	const router = useRouter();

	const { modelInfo: modelInformation } = useSelector(clientModelState);
	const [isTabDisabled, setTabAsDisabled] = useState(false);
	const [isTabDisabledOnError, setTabAsDisabledOnError] = useState(false);
	const { savedModel } = useSelector(riskModelerState);
	const [tabError, setTabError] = useState({});

	useEffect(() => {
		if (modelInformation.modelName == "") {
			setTabAsDisabled(true);
		} else {
			setTabAsDisabled(false);
		}
	}, [modelInformation.modelName]);

	useEffect(() => {
		if (Object.keys(tabError).length !== 0) {
			setTabAsDisabledOnError(true);
		} else {
			setTabAsDisabledOnError(false);
		}
	}, [tabError]);

	const resultClaimsDropdown = [
		{
			name: "All Claims Categories",
			subCategories: [
				{
					name: "Inpatient Facility",
					id: "IP_F_COM",
				},
				{
					name: "Outpatient Facility",
					id: "OP_F_COM",
				},
				{
					name: "Professional",
					id: "PROF_COM",
				},
				{
					name: "Other Services",
					id: "OTHER_COM",
				},
				{
					name: "RX",
					id: "RX_COM",
				},
			],
		},
	];

	const resultModelingDropdown = [
		{
			name: "Total Premium",
			subCategories: [
				{
					name: "IPA Allocation",
				},
				{
					name: "Projected Medical Expense",
				},
				{
					name: "Total Savings",
				},
				{
					name: "IPA Admin",
				},
				{
					name: "Net Income",
				},
			],
		},
	];

	const whatIfDropdown = [
		{
			subCategories: [
				{
					name: "High Cost Events/Episodes",
				},
				{
					name: "Diagnosis Prevalence	",
				},
				{
					name: "Claim Category Variance	",
				},
			],
		},
	];

	let tabdata = [
		{
			name: "Model Info",
			component: ModelInfo,
			disabledOnError: isTabDisabledOnError,
		},
		{
			name: "Assumptions",
			component: GlobalAssumption,
			disabled: isTabDisabled,
			disabledOnError: isTabDisabledOnError,
		},
		// {
		// 	name: "Modeling Options",
		// 	component: ModelingOptions,
		// 	disabled: isTabDisabled,
		// },
		{
			name: "Stop Loss",
			component: StopLoss,
			disabled: isTabDisabled,
			disabledOnError: isTabDisabledOnError,
		},
		{
			name: "Program Impacts",
			component: NemoFactors,
			disabled: isTabDisabled,
			disabledOnError: isTabDisabledOnError,
		},
		{
			name: "Cost Modeling",
			component: ResultsClaims,
			// dropdown: resultClaimsDropdown,
			disabled: isTabDisabled,
			disabledOnError: isTabDisabledOnError,
		},
		{
			name: "What If?",
			component: WhatIf,
			disabled: isTabDisabled,
			disabledOnError: isTabDisabledOnError,

			// dropdown: whatIfDropdown,
		},
		{
			name: "Results ",
			component: ResultsModeling,
			disabled: isTabDisabled,
			disabledOnError: isTabDisabledOnError,
		},
	];

	const [tabNewState, setTabNewState] = useState(undefined);
	const { tabState, resStatus } = useSelector(tabModelState);
	const { modelInfo } = useSelector(clientModelState);

	const dispatch = useDispatch();

	const tabKey = "newModelTabs";

	const onDropdownClicked = (data) => {
		// if (!data) return;
		if (data.dropdownItem.name === "All Claims Categories") {
			const { clientId, loa1Id } = savedModel;
			const params = {
				serviceCategoryName: data.name,
				serviceCategoryId: data.id,
				clientId,
				loa1Id,
			};
			router.push({ pathname: "/reporting/resultsclaims", query: params });
			return;
		}
		const tabKey = "whatIfTabs";
		const payload = {
			key: tabKey,
			data: {
				lastactive: data && data.subIndex,
			},
		};
		dispatch(setTabStateAction(payload));
		router.push("/reporting/whatif");
	};

	// useEffect(() => {
	//   if (!!!tabNewState) return;

	//   const payload = {
	//     key: tabKey,
	//     data: tabNewState,
	//   };
	//   dispatch(setTabStateAction(payload));
	// }, [tabNewState]);

	return (
		<TabModalComponent
			tabdata={tabdata}
			dropDownClick={onDropdownClicked}
			id="new-model-tab"
			tabState={tabState[tabKey]}
			onStateChange={setTabNewState}
			tabError={tabError}
			setTabError={setTabError}
			tabSwitch
		/>
	);
}
