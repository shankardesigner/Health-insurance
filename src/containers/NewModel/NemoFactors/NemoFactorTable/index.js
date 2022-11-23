import { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import NemoSkeleton from "@components/NemoSkeleton";
import EditNemoFactor from "../EditNemoFactor";
import commons from "@constants/common";
const { SUCCESS, REQUEST } = commons;

import styles from "./nemofactortable.module.scss";

/* redux part */
import {
	storeNemoFactorListAction,
	saveUsedNemoFactorAction,
	nemoFactorModelState,
	getNemoFactorsByModelIdAction,
} from "@slices/nemoFactorSlice";

import {
	calculateSavingsAction,
	riskModelerState,
} from "@slices/riskModelerSlice";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import NemoCheckBox from "src/shared/NemoCheckBox";
import NemoSelect from "src/shared/NemoSelect";
import CollapsableRow from "./collapsableRow";
import { updateTabEdited } from "@slices/tabModelSlice";

const nemoFactorsDetails = {
	"Rethinking Primary Care Visits":
		"Accelerated engagement of all chronically ill patients, via telemedicine.",
	"EHRMAs (Analytics->Outreach)":
		"Emerging high-risk member analyses, updated after each medical encounter.",
	"Behavioral Assist":
		"Automatic mental health support for all chronically ill patients.",
	"ER Intercept":
		"Dedicated triage channel connecting patient, PCP and ER physician.",
	"Rx Concierge":
		"single click to NEMO personnel for questions and for best pricing.",
	"Curbside Consultation":
		"Dedicated channel for asynchronous PCP:Specialist communication.",
	"Remote Monitoring":
		"Wireless devices + curated alerts for all those with chronic disease.",
	"Acute-care-at-home":
		"Paramedical personnel + in-home nursing + RPM + doctor via telemedicine.",
};

const TableCell = withStyles({
	root: {
		fontWeight: "bold",
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
		paddingTop: "10px",
		paddingBottom: "10px",
	},
})(MuiTableCell);

const useStyles = makeStyles(() => ({
	headerTitle: {
		fontSize: "14px",
		lineHeight: "17px",
		color: "#3D3E64",
		fontWeight: 600,
	},
	topBorderRadius: {
		borderTopLeftRadius: "10px",
		borderTopRightRadius: "10px",
	},
	bottomBorderRadius: {
		borderBottomLeftRadius: "10px",
		borderBottomRightRadius: "10px",
	},
	lightGreenBackground: {
		background: "rgba(236, 252, 247, 0.5)",
	},
	actionButton: {
		marginRight: "5px",
		borderRadius: "100px",
		border: "1px solid #000000",
		minWidth: "60px !important",
	},
	headerSubtitle: {
		fontSize: 12,
		display: "block",
		fontWeight: "normal",
	},
}));

export default function NemoFactorTable(props) {
	const classes = useStyles();
	const dispatch = useDispatch();
	const router = useRouter();
	const { modelid: editModelId } = router.query;
	const [editMode, setEditMode] = useState(editModelId ? true : false);
	const { data, factorData, setFactorData, resStatus, tabIndex } = props;

	const [openEditModal, setEditModalOpen] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState({});

	const { usedNemoFactor } = useSelector(nemoFactorModelState);

	const { savedModel } = useSelector(riskModelerState);

	useEffect(() => {
		if (editMode) {
			dispatch(getNemoFactorsByModelIdAction({ modelId: editModelId }));
		}
	}, [editModelId]);

	useEffect(() => {
		/* initialize dynamic fields: delta pmpm and %change */
		let initialFactorData = {};
		if (data && data.length !== 0) {
			data.map((nemofactor) => {
				const { id, nemoFactorName, value } = nemofactor;
				const intensity = usedNemoFactor.hasOwnProperty(id)
					? usedNemoFactor[id].intensity
					: "Moderate";
				let rowData = {
					id: id,
					nemoFactorName: nemoFactorName,
					deltaPmpm: -2.3,
					percentageChange: "",
					isSelected: Object.keys(usedNemoFactor).includes(id),
					intensity,
					value,
				};
				initialFactorData[id] = rowData;
			});

			setFactorData(initialFactorData);
		}
	}, [data, usedNemoFactor]);

	const storeNemoFactorList = (payload) => {
		const { modelId } = savedModel;
		const { nemoFactorId, intensity, isSelected } = payload;
		if (modelId) {
			const payload = {
				modelId,
				nemoFactorId,
				intensity,
				isSelected,
			};
			dispatch(storeNemoFactorListAction(payload));
		}
	};

	const toggleFactorSelect = async (uniqueKey, currentSelectionStatus) => {
		const { intensity } = factorData[uniqueKey];
		// debugger
		// save nemo factor into db
		const payload = {
			nemoFactorId: uniqueKey,
			intensity,
			isSelected: !currentSelectionStatus == true ? 1 : 0,
		};
		storeNemoFactorList(payload);
		const newFactorData = {
			...factorData,
			[uniqueKey]: {
				...factorData[uniqueKey],
				isSelected: !currentSelectionStatus,
			},
		};
		setFactorData(newFactorData);

		const selectedFactorsEntries = Object.entries(newFactorData).filter(
			(arr) => {
				return arr[1].isSelected === true;
			}
		);
		const selectedFactors = Object.fromEntries(selectedFactorsEntries);
		let resp = await dispatch(saveUsedNemoFactorAction(selectedFactors));
		if (resp) {
			dispatch(updateTabEdited(tabIndex));
			dispatch(calculateSavingsAction({ modelId: router.query?.modelid }));
		}
	};

	const handleEditClick = (uniqueKey) => {
		/* set selected row data */
		setSelectedRowData(factorData[uniqueKey]);
		// setEditModalOpen(true);
	};

	const handleIntensityChange = async (e, uniqueKey) => {
		const intensity = e.target.value;
		const newFactorData = {
			...factorData,
			[uniqueKey]: { ...factorData[uniqueKey], intensity, isSelected: true },
		};
		setFactorData(newFactorData);
		// save nemo factor into db
		const payload = {
			nemoFactorId: uniqueKey,
			intensity,
			isSelected: 1,
		};
		storeNemoFactorList(payload);

		const selectedFactorsEntries = Object.entries(newFactorData).filter(
			(arr) => {
				return arr[1].isSelected === true;
			}
		);

		const selectedFactors = Object.fromEntries(selectedFactorsEntries);
		const response = await dispatch(saveUsedNemoFactorAction(selectedFactors));
		if (response) {
			dispatch(calculateSavingsAction({ modelId: router.query?.modelid }));
		}
		dispatch(updateTabEdited(tabIndex));
	};

	return (
		<>
			<TableContainer className={styles.tableContainer}>
				<Table aria-label="simple table" className={styles.table}>
					<TableHead>
						<TableRow>
							<TableCell align="left" className={styles.tableHead}>
								<Grid
									container
									direction="row"
									justifyContent="space-between"
									alignItems="flex-start"
								>
									<span className={styles.tableHeaderSubTitle}>
										Program Impacts
									</span>
									<div>{/* action items */}</div>
								</Grid>
							</TableCell>
							{/* <TableCell align="left">
                                <span className={styles.tableHeaderSubTitle}></span>
                            </TableCell> */}

							{/* <TableCell classes={{ root: classes.lightGreenBackground }} className={styles.tableHeaderSubTitle}> Delta PMPM (%)</TableCell>
                            <TableCell classes={{ root: classes.lightGreenBackground }} className={styles.tableHeaderSubTitle} align={'right'}> % Change</TableCell>
                             */}
						</TableRow>
					</TableHead>

					{resStatus === REQUEST && (
						<TableBody>
							<TableRow>
								<TableCell align="left" colSpan={2}>
									<NemoSkeleton count={1} height={30} />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" colSpan={2}>
									<NemoSkeleton count={1} height={30} />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" colSpan={2}>
									<NemoSkeleton count={1} height={30} />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="left" colSpan={2}>
									<NemoSkeleton count={1} height={30} />
								</TableCell>
							</TableRow>
						</TableBody>
					)}

					<TableBody>
						{resStatus === SUCCESS &&
							Object.keys(factorData).length !== 0 &&
							Object.keys(factorData).map((uniqueKey) => {
								if (factorData[uniqueKey]) {
									const { isSelected, nemoFactorName, intensity } =
										factorData[uniqueKey];
									return (
										<CollapsableRow
											isSelected={isSelected}
											nemoFactorName={nemoFactorName}
											intensity={intensity}
											uniqueKey={uniqueKey}
											toggleFactorSelect={toggleFactorSelect}
											handleIntensityChange={handleIntensityChange}
											nemoFactorsDetails={nemoFactorsDetails}
											handleEditClick={handleEditClick}
											data={factorData[uniqueKey]}
											key={uniqueKey}
											tabIndex={tabIndex}
											// setSelectedRowData={setSelectedRowData}
										/>
									);
								}
							})}
					</TableBody>
				</Table>
			</TableContainer>
			{openEditModal && (
				<EditNemoFactor
					openModal={openEditModal}
					setModalOpen={setEditModalOpen}
					data={selectedRowData}
					setSelectedRowData={setSelectedRowData}
				/>
			)}
		</>
	);
}
