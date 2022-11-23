import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { useRouter } from "next/router";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Box from "@material-ui/core/Box";
import ModelResultBox from "../../ModelResultBox";
import BoxWithToggle from "@components/BoxWithToggle";
import TableComponentNemoFactor from "@components/TableComponentNemoFactor";
import NemoFactorTable from "./NemoFactorTable";
import NemoSkeleton from "@components/NemoSkeleton";
import { makeid } from "@utils/common";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import { useState } from "react";

import styles from "./nemofactors.module.css";

/* redux part */
import {
	listAction,
	storeNemoFactorAction,
	saveUsedNemoFactorAction,
	nemoFactorModelState,
} from "@slices/nemoFactorSlice";

import {
	riskModelerState,
	recalculateSavingsAction,
} from "@slices/riskModelerSlice";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
	search: {
		[theme.breakpoints.down("sm")]: {
			paddingBottom: "10px",
		},
	},
	linearProgress: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
}));

export default function NemoFactors(props) {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(listAction());
	}, []);

	const {
		nemoFactorModelList,
		nemoFactorModelListResStatus,
		storeNemoFactorResStatus,
	} = useSelector(nemoFactorModelState);
	const { savedModel } = useSelector(riskModelerState);

	const [nemoFactorPreset, setNemoFactorPreset] = useState("moderate");
	const [columnsData, setColumnsData] = useState([]);
	const [factorData, setFactorData] = useState({});

	useEffect(() => {
		setColumnsData(nemoFactorModelList[nemoFactorPreset]);
	}, [nemoFactorPreset, nemoFactorModelList]);

	useEffect(() => {
		/* save used nemo factors */
		// wait for the saving model is done
		if (storeNemoFactorResStatus === SUCCESS) {
			// dispatch(recalculateSavingsAction());
		}
	}, [factorData, storeNemoFactorResStatus]);

	return (
		<Box p={3}>
			{/* table component */}
			<NemoFactorTable
				data={columnsData}
				resStatus={nemoFactorModelListResStatus}
				tabIndex={props.tabIndex}
				nemoFactorPreset={nemoFactorPreset}
				factorData={factorData}
				setFactorData={setFactorData}
			/>

			<ModelResultBox next="nemo-tab-5" displayButton={false} />
		</Box>
	);
}
