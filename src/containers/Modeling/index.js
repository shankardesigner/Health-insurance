import { alpha, makeStyles } from "@material-ui/core/styles";
// import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { useRouter } from "next/router";
import TableComponent from "@components/TableComponent/table-new";
import ConfirmDialog from "@components/ConfirmDialog";
import commons from "@constants/common";
import FavModels from "@containers/Modeling/FavModels";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;
import _debounce from "lodash/debounce";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";

/* redux part */
import {
	deleteModelAction,
	favouriteModelAction,
	listAction,
	reportingModelState,
} from "@slices/reportingModelSlice";
import { setTabStateAction, updateLastActiveTab } from "@slices/tabModelSlice";
import { saveUsedNemoFactorAction } from "@slices/nemoFactorSlice";

import {
	resetClientModelAction,
	saveModelInfoAction,
	initialState as clientModelInitialState,
	clientModelState,
} from "@slices/clientModelSlice";

import {
	saveUsedAssumptionAction,
	setShowAssumptionDetailsAction,
} from "@slices/globalAssumptionAlice";

import {
	generatePdfAction,
	// resetResStatusAction,
	riskModelerState,
	savedModel,
	loadIntialModelDataAction,
	restRiskModeler,
} from "@slices/riskModelerSlice";

import { resetWhatIfFetchAction } from "@slices/whatIfSlice";

import { setModuleInfoAction, moduleInfoState } from "@slices/moduleInfoSlice";

import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import theme from "@utils/theme";
import NemoSelect from "src/shared/NemoSelect";
import {
	FormControl,
	FormGroup,
	MenuItem,
	Typography,
} from "@material-ui/core";
import NemoPopOver from "src/shared/NemoPopOver";
import NemoLoader from "src/shared/NemoLoader";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: alpha(theme.palette.common.white, 0.15),
		flex: 1,
		"&:hover": {
			backgroundColor: alpha(theme.palette.common.white, 0.25),
		},
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(1),
			width: "auto",
		},
		marginRight: "20px",
		[theme.breakpoints.down("sm")]: {
			paddingBottom: "10px",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		right: 0,
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		border: "1px solid #B9BABA",
		boxSizing: "border-box",
		borderRadius: "5px",
		// flex: 1,
		width: "100%",
	},
	inputInput: {
		height: "39px",
		padding: theme.spacing(0, 0, 0, 1),
		// vertical padding + font size from searchIcon
		paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		fontSize: "14px",
		lineHeight: "1.5",

		"&:placeholder": {
			color: "rgba(51, 51, 51, 0.2)",
		},
		[theme.breakpoints.up("sm")]: {
			// width: "72ch",
			"&:focus": {
				// width: "72ch",
			},
		},
		[theme.breakpoints.down("sm")]: {
			// width: "16ch",
			"&:focus": {
				// width: "16ch",
			},
		},
	},
	globalAssumptionButton: {
		background: "none !important",
		border: "1px solid #5A2C6D !important",
		color: "#5A2C6D",
		borderRadius: "3px",
		height: "39px",
		lineHeight: "0.8",
		[theme.breakpoints.up("sm")]: {
			width: "247px",
		},

		"&:hover": {
			background: "#5A2C6D !important",
			color: "#fff !important",
		},

		position: "relative",
		"& .MuiButton-startIcon": {
			position: "absolute",
			left: 24,
		},
	},
	searchRow: {
		padding: `0 10px`,
		margin: `-4px 0 22px`,
	},
	filterRow: {
		padding: `8px 20px 0 0`,
		margin: `0 0 15px`,
	},
	newModelButton: {
		fontSize: "16px",
		lineHeight: "19px",
		color: "#fff",
		background: "#06406D",
		boxShadow: `1px 1px 5px rgba(0, 0, 0, 0.25)`,
		borderRadius: `3px`,
		padding: "10px 20px",

		"&:hover": {
			color: "#06406D",
			background: "#fff",
		},
	},
	headerActionButton: {
		background: "#42DEB4",
		borderRadius: "100px",
		height: "47px",
		lineHeight: "1",
		color: "#ffffff",
		border: "unset",
		"&:hover": {
			background: "#42DEB4",
			border: "none",
		},
		fontSize: "18px",
	},
	breadcrumbs: {
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
	label: {
		color: "#3D3E64",
		fontWeight: "bold",
	},

	infoButton: {
		border: "1px solid #06406D",
		borderRadius: "3px",
		padding: "0 10px",
		color: "#06406D",
		fontSize: "12px",
		lineHeight: "14px",
		marginRight: "12px",
		height: "39px",
		display: "inline-flex",
		alignItems: "center",
		fontWeight: 600,

		"& img": {
			marginRight: 5,
		},
	},
	notificationText: {
		display: "inline-block",
		verticalAlign: "top",
		background: "#EB6924",
		padding: "2px 4px",
		borderRadius: "100%",
		color: "#fff",
		lineHeight: 1,
		fontSize: "10px",
		marginLeft: "5px",
		fontWeight: 400,
	},
	reportingHolder: {
		minHeight: `100%`,
		overflow: "auto !important",
		overflowX: "hidden !important",
	},
	tableButtonHolder: {
		border: `1px solid #DCDCDC`,
		boxShadow: `1px 6px 15px rgb(0 0 0 / 5%)`,
		borderRadius: `3px`,
		// paddingBottom: 15,
		margin: `0 11px`,

		"& button": {
			margin: `0 15px 0 auto`,
			display: "block",
		},
	},
}));

const qualityIcon = (
	<Icon>
		<img alt="quality icon" src="/quality-icon-black.svg" />
	</Icon>
);

const addIcon = <Icon>+</Icon>;

const columns = [
	{ name: "Model Name", component: "TextComponent", sourceKey: "modelName" },
	// { name: "Payor", component: "TextComponent", sourceKey: "clientId" }, // TODO: hiding payor name for demo only; uncomment later
	{ name: "Plan Type", component: "TagComponent", sourceKey: "planType" }, // TODO: set blank name field as blank
	{
		name: "Lives",
		component: "PopulationComponent",
		sourceKey: "averageMemberCount",
	},
	{
		name: "Saving PMPM",
		component: "CurrencyComponent",
		sourceKey: "totalSavingsPmpm",
		attributes: {
			decimalCount: 2,
		},
	},
	{ name: "Status", component: "StatusComponent", sourceKey: "status" },
	{
		name: "Saving Paid Amount",
		component: "CurrencyComponent",
		sourceKey: "totalSavingsPaidAmount",
		attributes: { decimalCount: 0 },
	},
	{
		name: "Created/Modified Date",
		component: "DateComponent",
		sourceKey: "lastModifiedDate",
	},
	{ name: "User", component: "TagComponent", sourceKey: "userName" },

	{ name: "", component: "TextComponent", sourceKey: "ACTION" }, // for edit and results action
];

const Modeling = () => {
	const classes = useStyles();
	const router = useRouter();
	const dispatch = useDispatch();
	const {user} = useUser();

	const [checkbox, setCheckbox] = useState({
		payer: false,
		product: false,
		practiceGroup: false,
		pcp: false,
	});
	const [timeout, settimeOut] = useState(0);
	const [openDialog, setOpenDialog] = useState(false);
	const [modelSelected, setModelSelected] = useState(null);
	const [tableKey, setTableKey] = useState(new Date().getTime());
	const [selectedFilter, setSelectedFilter] = useState({
		payer: "",
		product: "",
		practice: "",
		pcp: "",
	});
	const [sortAnchorEl, setSortAnchorEl] = useState(null);
	const [filterAnchorEl, setFilterAnchorEl] = useState(null);
	const [sortDesc, setSortDesc] = useState(true);
	const [isFav, setIsFav] = useState(false);

	const handleSortClick = (event) => {
		setSortAnchorEl(event.currentTarget);
		if (sortDesc) {
			setInitialReportingModelList(
				initialReportingModelList.sort(
					(a, b) => new Date(a.lastModifiedDate) - new Date(b.lastModifiedDate)
				)
			);
			setSortDesc(false);
		} else {
			setInitialReportingModelList(
				initialReportingModelList.sort(
					(a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate)
				)
			);
			setSortDesc(true);
		}
	};

	const handleFilterClick = (event) => {
		setFilterAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setFilterAnchorEl(null);
		setSortAnchorEl(null);
	};

	const sortOpen = Boolean(sortAnchorEl);
	const filterOpen = Boolean(filterAnchorEl);

	const handleCheckboxChange = (event) => {
		setCheckbox({ ...checkbox, [event.target.name]: event.target.checked });
	};

	const handleFilterChange = (event) => {
		const currentPayload = event.target;

		switch (currentPayload.name) {
			case "payer":
				setSelectedFilter({
					payer: currentPayload.value,
					product: "",
					practice: "",
					pcp: "",
				});
				break;
			case "product":
				setSelectedFilter({
					...selectedFilter,
					product: currentPayload.value,
					practice: "",
					pcp: "",
				});
				break;
			case "practice":
				setSelectedFilter({
					...selectedFilter,
					practice: currentPayload.value,
					pcp: "",
				});
				break;

			case "pcp":
				setSelectedFilter({
					...selectedFilter,
					pcp: currentPayload.value,
				});
				break;
		}
	};

	useEffect(() => {
		let filteredModelList = [];
		if (selectedFilter.payer) {
			filteredModelList = [...reportingModelList].filter(
				(model) => model.loa1Id === selectedFilter.payer
			);
		}
		if (selectedFilter.payer && selectedFilter.product) {
			filteredModelList = [...reportingModelList].filter(
				(model) =>
					model.loa1Id === selectedFilter.payer &&
					model.planType === selectedFilter.product
			);
		}

		if (
			selectedFilter.payer &&
			selectedFilter.product &&
			selectedFilter.practice
		) {
			filteredModelList = [...reportingModelList].filter(
				(model) =>
					model.loa1Id === selectedFilter.payer &&
					model.planType === selectedFilter.product &&
					model.loa4Id === selectedFilter.practice
			);
		}

		if (
			selectedFilter.payer &&
			selectedFilter.product &&
			selectedFilter.practice &&
			selectedFilter.pcp
		) {
			filteredModelList = [...reportingModelList].filter(
				(model) =>
					model.loa1Id === selectedFilter.payer &&
					model.planType === selectedFilter.product &&
					model.loa4Id === selectedFilter.practice &&
					model.loa2Id === selectedFilter.pcp
			);
		}

		setInitialReportingModelList(filteredModelList);
	}, [selectedFilter]);

	useEffect(() => {
		const payload = {
			userName : user?.nickname
		}
		dispatch(listAction(payload));
		dispatch(
			setTabStateAction(
				{ key: "newModelTabs", data: null },
				{ key: "whatIfTabs", data: null }
			)
		); //clear new model tab data
		dispatch(resetClientModelAction({}));
		dispatch(saveUsedAssumptionAction({}));
		dispatch(saveUsedNemoFactorAction([]));
		dispatch(setShowAssumptionDetailsAction(false));
		dispatch(restRiskModeler()); // results modeling
		dispatch(resetWhatIfFetchAction());
		dispatch(setModuleInfoAction({})); // clear the module info
	}, []);

	const { reportingModelList, resStatus, favouriteModels } =
		useSelector(reportingModelState);
	const { generatePdfStatus } = useSelector(riskModelerState);

	//store all models to application
	const [initialReportingModelList, setInitialReportingModelList] = useState(
		[...reportingModelList] || []
	);

	const handleNewModelClick = (e) => {
		// e.preventDefault();
		// router.push('/reporting/resultsclaims');
		dispatch(updateLastActiveTab(0));
		router.push("/reporting/newmodel");
	};

	const handleExportClick = (selectedRowData) => {
		if (selectedRowData.modelId) {
			let payload = {
				modelId: selectedRowData.modelId,
				clientId: selectedRowData.clientId,
				loa1Id: selectedRowData.loa1Id,
			};
			dispatch(generatePdfAction(payload));
		}
	};

	const handleEditAction = (selectedModel, result = null) => {
		//
		/* edge case handling */
		let edgeCaseObject = {};
		edgeCaseObject.loa2Id = selectedModel.loa2Id || "ALL";
		edgeCaseObject.loa3Id = selectedModel.loa3Id || "ALL";
		edgeCaseObject.loa4Id = selectedModel.loa4Id || "ALL";
		edgeCaseObject.loa5Id = selectedModel.loa5Id || "ALL";
		edgeCaseObject.loa6Id = selectedModel.loa6Id || "ALL";
		/* save model info */
		dispatch(
			loadIntialModelDataAction({
				...selectedModel,
				name: selectedModel.modelName,
				...edgeCaseObject,
			})
		);

		dispatch(
			saveModelInfoAction({
				...clientModelInitialState.modelInfo,
				...selectedModel,
				...edgeCaseObject,
			})
		);

		// if (result) {
		//   const payload = {
		//     key: "newModelTabs",
		//     data: {
		//       lastactive: 7,
		//     },
		//   };
		//   dispatch(setTabStateAction(payload));
		// }
		// need to update current Tab state if result claims
		if (result) {
			dispatch(updateLastActiveTab(6));
		} else {
			dispatch(updateLastActiveTab(0));
		}
		router.push("/reporting/editmodel/" + selectedModel.modelId);
	};

	const handleDelete = (selectedModel) => {
		setOpenDialog(true);
		setModelSelected(selectedModel);
	};

	const handleDeleteAction = () => {
		dispatch(deleteModelAction(modelSelected.modelId));
		setOpenDialog(false);
	};

	const handleFav = (selectedModel) => {
		if (selectedModel.status !== "Done") {
			toast.error("Unable to favourite incomplete model");
			return;
		}
		selectedModel.isFavourite = !selectedModel.isFavourite;
		dispatch(favouriteModelAction(selectedModel));
		setInitialReportingModelList((prev) => {
		 prev = prev.map((model) => {
		     const newModel = { ...model };
		     if (model.modelId === selectedModel.modelId) {
		         newModel.isFavourite = selectedModel.isFavourite;
		     }
		     return newModel;
		 });
		 return prev;
		});
		setTableKey(new Date().getTime());
	};

	const actions = [
		{
			name: "FAV",
			icon: "/inactive_favourite.svg",
			active_icon: "/active_favourite.svg",
			component: "CallbackComponent",
			attributes: { callback: handleFav },
		},
		{
			name: "Results",
			component: "CallbackComponent",
			attributes: {
				callback: (editData) => handleEditAction(editData, "result"),
			},
		},
		{
			name: "Export",
			icon: "/export-icon.svg",
			component: "CallbackComponent",
			attributes: { callback: handleExportClick },
		},
		{
			name: "Edit",
			icon: "/edit-icon.svg",
			component: "CallbackComponent",
			attributes: { callback: handleEditAction },
		},
		{
			name: "Delete",
			icon: "/delete-icon.svg",
			component: "CallbackComponent",
			attributes: { callback: handleDelete },
		},
	];

	const generateModalList = (arr = initialReportingModelList) =>
		arr.map((model) => ({
			...model,
			status: model.isActive ? "Done" : "Draft",
		}));

	function handleDebounceFn(searchTerm) {
		const searchText = searchTerm.trim().toLowerCase();

		if (searchText.length >= 1 && !!reportingModelList) {
			const filteredModelList = [...reportingModelList].filter((model) =>
				model.modelName.toLowerCase().includes(searchText)
			);
			// debugger;
			setInitialReportingModelList(filteredModelList);
			setTableKey(new Date().getTime());
		} else {
			setInitialReportingModelList(reportingModelList);
		}
	}

	// const debounceFn = useCallback(_debounce(handleDebounceFn, 500), []);

	const handleSearch = (event) => {
		if (timeout) clearTimeout(timeout);
		let changetimeout = setTimeout(() => {
			handleDebounceFn(event.target.value);
		}, 500);
		settimeOut(changetimeout);
		// debounceFn(event.target.value);
	};

	useEffect(() => {
		if (reportingModelList.length > 0 && !isFav) {
			setInitialReportingModelList([...reportingModelList]);
			setIsFav(true);
		}
	}, [reportingModelList]);

	const options = [
		{
			id: 1,
			name: "test data",
		},
		{
			id: 2,
			name: "test data",
		},
		{
			id: 3,
			name: "test data",
		},
		{
			id: 4,
			name: "test data",
		},
		{
			id: 1,
			name: "test data",
		},
	];

	const generateList = (key) =>
		Array.from(new Set([...reportingModelList]?.map((mdl) => mdl[key])))
			?.filter((al) => al !== "" && al !== null)
			?.map((al) => {
				return {
					id: al,
					name: al,
				};
			}) || [];

	if (resStatus === PENDING)
		return (
			<Box p={3} className={classes.reportingHolder}>
				<NemoLoader />
			</Box>
		);

	return (
		<Box p={3} className={classes.reportingHolder}>
			{/* breadcrumb header */}
			<Grid
				container
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				className={`${classes.filterRow} d-none`}
				spacing={4}
			>
				<Grid item xs={3}>
					<FormGroup>
						<Typography
							variant="h4"
							gutterBottom
							// className={styles.selectClientWrapper}
						>
							Select Payor
						</Typography>
						<NemoSelect
							fullWidth
							disabled={!!!generateList("loa1Id")}
							labelId="demo-simple-select-filled-label"
							id="demo-simple-select-filled"
							name="payer"
							value={selectedFilter.payer || ""}
							onChange={handleFilterChange}
							displayEmpty
							disableUnderline
							placeholder="Select Payor"
							options={generateList("loa1Id")}
						/>
					</FormGroup>
				</Grid>
				<Grid item xs={3}>
					<FormGroup>
						<Typography
							variant="h4"
							gutterBottom
							// className={styles.selectClientWrapper}
						>
							Select Product
						</Typography>
						<NemoSelect
							fullWidth
							disabled={!!!selectedFilter.payer}
							labelId="demo-simple-select-filled-label"
							id="demo-simple-select-filled"
							name="product"
							value={selectedFilter.product}
							onChange={handleFilterChange}
							displayEmpty
							disableUnderline
							placeholder="Select Product"
							options={generateList("planType")}
						/>
					</FormGroup>
				</Grid>
				<Grid item xs={3}>
					<FormGroup>
						<Typography
							variant="h4"
							gutterBottom
							// className={styles.selectClientWrapper}
						>
							Select Practice
						</Typography>
						<NemoSelect
							fullWidth
							disabled={!selectedFilter.product}
							labelId="demo-simple-select-filled-label"
							id="demo-simple-select-filled"
							name="practice"
							value={selectedFilter.practice}
							onChange={handleFilterChange}
							displayEmpty
							disableUnderline
							placeholder="Select Practice"
							options={generateList("loa2Id")}
						/>
					</FormGroup>
				</Grid>
				<Grid item xs={3}>
					<FormGroup>
						<Typography
							variant="h4"
							gutterBottom
							// className={styles.selectClientWrapper}
						>
							Select PCP
						</Typography>
						<NemoSelect
							fullWidth
							disabled={!selectedFilter.practice}
							labelId="demo-simple-select-filled-label"
							id="demo-simple-select-filled"
							name="pcp"
							value={selectedFilter.pcp}
							onChange={handleFilterChange}
							displayEmpty
							disableUnderline
							placeholder="Select PCP"
							options={generateList("loa4Id")}
						/>
					</FormGroup>
				</Grid>
			</Grid>
			<FavModels models={favouriteModels} />
			{/* search header */}
			<Grid
				container
				direction="row"
				justifyContent="flex-start"
				alignItems="flex-start"
				className={classes.searchRow}
			>
				{/* search bar */}
				<Button
					variant="outlined"
					color="primary"
					className={classes.infoButton}
					onClick={handleFilterClick}
				>
					<img src="/new/filter.svg" />
					Filter <span className={classes.notificationText}>2</span>
				</Button>
				<NemoPopOver
					// open={filterOpen}
					open={false}
					onClose={handleClose}
					anchorEl={filterAnchorEl?.target}
				>
					this is filter nemo popover...
				</NemoPopOver>
				<div
					style={{
						position: "relative",
					}}
				>
					<Button
						variant="outlined"
						color="primary"
						className={classes.infoButton}
						onClick={handleSortClick}
					>
						<img src="/new/sort.svg" />
						Sort by
					</Button>
					<NemoPopOver
						// open={sortOpen}
						open={false}
						onClose={handleClose}
						anchorEl={sortAnchorEl?.target}
					>
						this is sort nemo popover...
					</NemoPopOver>
				</div>
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<img src="/new/search.svg" alt="search" />
					</div>
					<InputBase
						placeholder="Search for Model name"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{ "aria-label": "search" }}
						onChange={handleSearch}
					/>
				</div>

				{/* global assumption button */}
				{/* <Button
          variant="outlined"
          color="primary"
          className={classes.globalAssumptionButton}
          // startIcon={qualityIcon}
        >
          Manage Global Assumptions
        </Button> */}
			</Grid>
			{/* Table component here... */}
			<div className={classes.tableButtonHolder}>
				{/* table component */}
				{initialReportingModelList?.length > 0 ? (
					<TableComponent
						headers={columns}
						data={generateModalList(initialReportingModelList)}
						actions={actions}
						key={tableKey}
					/>
				) : (
					<div
						style={{
							marginBottom: theme.spacing(8),
						}}
					>
						{resStatus !== "PENDING" && "No models found"}
					</div>
				)}
			</div>

			{/* new model button */}
			<div className="addModalHolder">
				<Button
						variant="outlined"
						color="primary"
						className={classes.newModelButton}
						onClick={(e) => handleNewModelClick(e)}
					>
						Add New Model
					</Button>
			</div>
			<ConfirmDialog
				handleConfirm={handleDeleteAction}
				close={() => setOpenDialog(false)}
				title="Delete Confirmation"
				subtitle="Do you want to delete this model?"
				open={openDialog}
			/>
		</Box>
	);
};

export default withPageAuthRequired(Modeling);
