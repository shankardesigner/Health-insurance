const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}`;

const API_URLS = {
	PAYER_API: `${API_BASE}/payors`,
	REPORTING_MODEL_API: `${API_BASE}/model`,
	CLIENT_API: `${API_BASE}/client`,
	STOPLOSS_API: `${API_BASE}/stop-loss`,
	GLOBAL_ASSUMPTION_API: `${API_BASE}/global-assumption`,
	NEMO_FACTOR_API: `${API_BASE}/nemo-factor`,
	RESULTS_CLAIMS_API: `${API_BASE}/results-claims`,
	RISKMODELER_API: `${API_BASE}/riskmodeler`,
	WHAT_IF_API: `${API_BASE}/whatif`,
	NEMO_CLIENTS_API: `${API_BASE}/manage/nemo-clients`,
	EMR_API: `${API_BASE}/emr`,
	MODELOPTION_API: `${API_BASE}/modeling-options`,
};

const drawerLinks = [
	{
		icon: "/eye.svg",
		title: "Signal",
		alt: "eye image",
		subtitle: "Referrals, wait times & NPS",
		link: "/questionmap",
	},
	{
		icon: "/graph-bar.svg",
		alt: "graph image",
		title: "Reporting",
		subtitle: "Modeling, reports & factors",
		link: "/reporting",
	},
	{
		icon: "/dollar.svg",
		title: "Compensation",
		subtitle: "Groups, vendors & MDs",
		link: "/dashboard",
	},
	{
		icon: "/toggle-on.svg",
		title: "Active",
		subtitle: "Admissions, SNF & Referrals",
		link: "/dashboard",
	},
	{
		icon: "/alert-line.svg",
		title: "Claims",
		subtitle: "MDS, RS & Hospital",
		link: "/dashboard",
	},
	{
		icon: "/quality-icon.svg",
		title: "Quality",
		subtitle: "Clinical & Admin",
		link: "/dashboard",
	},
];

let ROUTES = {
	LANDING_ROUTE: "/dashboard",
	EDITING_REPORT_ROUTE: "/reporting/editmodel/",
	NEW_MODAL_REPORT_ROUTE: "/reporting/newmodel",
};

let MENUS = [
	"/dashboard",
	"/questionmap",
	"/reporting",
	"/projected-surplus",
	"/clientManagement",
	"/",
];

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE;
let CUSTOM_ROUTES = {};
let CUSTOM_MENUS = {};

if (APP_MODE == "RISK_MODELER") {
	CUSTOM_ROUTES = {
		LANDING_ROUTE: "/reporting",
	};

	CUSTOM_MENUS = ["/reporting"];

	ROUTES = { ...ROUTES, ...CUSTOM_ROUTES };
	MENUS = CUSTOM_MENUS;
}

const ModelingOptions = [
	{
		optionId: "Adjust_Ibnr",
		optionName: "Adjust for IBNR",
		name: "ibnr",
	},
	{
		optionId: "Adjust_Medical_Cost_Increase",
		optionName: "Adjust for Medical Cost Increase",
		name: "mcr",
	},
	{
		optionId: "Adjust_Pharmacy_Cost_Increase",
		optionName: "Adjust for Pharmacy Cost Increase",
		name: "pci",
	},
	{
		optionId: "Adjust_Predicted_Risk",
		optionName: "Adjust by Predicted Risk",
		name: "pr",
	},
];

const ModelOptionsMap = {
	Adjust_Pharmacy_Cost_Increase: "pci",
	Adjust_Predicted_Risk: "pr",
	Adjust_Ibnr: "ibnr",
	Adjust_Medical_Cost_Increase: "mcr",
};

const globalConstants = {
	...API_URLS,
	drawerLinks: drawerLinks,
	ROUTES: ROUTES,
	MENUS: MENUS,
	ModelingOptions,
	ModelOptionsMap,
};

export default globalConstants;
