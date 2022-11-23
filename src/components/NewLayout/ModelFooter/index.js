import { Button, Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./modelFooter.module.scss";

import {
	activateNewModelAction,
	riskModelerState,
} from "@slices/riskModelerSlice";

import commons from "@constants/common";
import ModelResultBox from "@containers/ModelResultBox";
import CalculateSaving from "@containers/ModelResultBox/CalculateSaving";
import { editTabRest } from "@slices/tabModelSlice";
const { REQUEST } = commons;
import { useRouter } from "next/router";

const ModelFooter = ({
	buttonProps,
	handleTabSwitchButton,
	currentTab,
	tabLength,
	tabError,
	setTabError,
}) => {
	const footerRef = React.createRef(null);
	const { newModelActivationStatus, savedModel } =
		useSelector(riskModelerState);
	const dispatch = useDispatch();
	const router = useRouter();
	const { modelid: editModelId } = router.query;

	const [editMode, setEditMode] = useState(editModelId ? true : false);

	const handleSaveClick = () => {
		const { modelId } = savedModel;
		const payload = { modelId };
		/*Append created and modified date to the payload*/
		if (editMode) {
			payload.modifiedAt = new Date().toISOString();
		}

		dispatch(activateNewModelAction(payload));
		dispatch(editTabRest());
	};

	useEffect(() => {
		document.querySelector("body")?.classList.add("sticky-footer");

		return () => {
			document.querySelector("body")?.classList.remove("sticky-footer");
		};
	}, []);

	const showResultModeling = currentTab > 0 && currentTab !== tabLength;

	return (
		<div>
			<Grid
				container
				spacing={0}
				className={`${styles.footer}`}
				justifyContent="flex-end"
				alignItems="center"
				ref={footerRef}
			>
				<Grid item xs={7}>
					{showResultModeling && <CalculateSaving displayButton={false} />}
				</Grid>
				<Grid
					item
					xs={5}
					style={{
						textAlign: "right",
					}}
				>
					<Button
						variant="outlined"
						className={styles.prevBtn}
						onClick={(e) => handleTabSwitchButton(e, "prev")}
						disabled={currentTab === 0 || Object.keys(tabError).length !== 0}
					>
						Previous
					</Button>

					{currentTab < tabLength && (
						<Button
							variant="contained"
							className={styles.nextBtn}
							disabled={buttonProps?.next || Object.keys(tabError).length !== 0}
							onClick={(e) => handleTabSwitchButton(e, "next")}
						>
							Next
						</Button>
					)}
					{currentTab === tabLength && (
						<Button
							variant="contained"
							className={styles.nextBtn}
							onClick={handleSaveClick}
							disabled={Object.keys(tabError).length !== 0}
						>
							{newModelActivationStatus === REQUEST && "Saving Model"}
							{newModelActivationStatus !== REQUEST && "Save Model"}
						</Button>
					)}
				</Grid>
			</Grid>
		</div>
	);
};

export default ModelFooter;
