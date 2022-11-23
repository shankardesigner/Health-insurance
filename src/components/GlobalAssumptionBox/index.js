import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import styles from "./globalassumptionbox.module.css";
import clsx from "clsx";
import React, { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
	useAssumptionBtn: {
		minWidth: "90px",
		margin: "7px 0 0",
		// "&:disabled": {
		//   opacity: 1,
		//   color: "#2B5C8D",
		//   border: "1px solid rgba(43, 92, 141, 0.5)",
		//   cursor: "not-allowed",
		// },
	},
	deselectButton: {
		background: "#3D3E64",
		borderRadius: "100px",
		lineHeight: "1",
		color: "#ffffff",
		border: "unset",
		"&:hover": {
			background: "#3D3E64",
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
	},
}));

export default function GlobalAssumption({
	data,
	callback,
	action,
	openDetails,
	checked = false,
}) {
	const classes = useStyles();

	const selection = action || "not-selected";

	const [selected, setSelected] = React.useState(false);

	const handleUseAssumption = (event) => {
		setSelected(true);
		callback(data.globalAssumption);
		openDetails(true);
	};

	const handleDeselectAssumption = (event) => {
		openDetails(false);
		setSelected(false);
		callback(null);
	};
	const { averagePremium, ipaAllocation, ipaAdmin, name, id, riskScore } =
		data.globalAssumption;
	const { planTypeName, avgMemberCount } = data.populationSummary;

	/* ipaAdmin and ipaAllocation in percentage */
	const ipaAllocationPercent = ipaAllocation * 100;
	const ipaAdminPercent = ipaAdmin * 100;

	useEffect(() => {
		if (!checked) {
			setSelected(false);
			handleDeselectAssumption();
		}
	}, [checked]);

	return (
		<div
			className={`${styles.assumptionBox} ${
				checked ? styles.selectedAssumptionBox : ""
			}`}
		>
			<Grid
				container
				direction="row"
				justifyContent="space-between"
				alignItems="center"
			>
				<Grid item xs={12}>
					{/* <span className={styles.title}>
                            {planTypeName}
                        </span> */}
					<span className={styles.subtitle}>Avg Prem.</span>
					<div className={clsx([styles.value, styles.bigAmount])}>
						${averagePremium}
					</div>
				</Grid>
				<Grid item>
					<div>
						<span className={styles.subtitle}>IPA Allocation</span>
						<div className={styles.value}>
							{`${ipaAllocationPercent}% (${ipaAdminPercent}% Admin)`}
						</div>
					</div>
				</Grid>

				{/* <div>
                    <Grid
                        container
                        direction="column"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <span className={styles.value}>
                            {`${lives} pop.`}
                        </span>
                    </Grid>
                </div>

                <div>
                    <Grid
                        container
                        direction="column"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <span className={styles.value}>
                            {`${risk} Risk`}
                        </span>
                    </Grid>
                </div> */}

				<div>
					<Grid
						container
						direction="column"
						justifyContent="space-between"
						alignItems="center"
					>
						{!selected && (
							<Button
								variant="outlined"
								color="primary"
								className={classes.useAssumptionBtn}
								onClick={(e) => {
									handleUseAssumption(e);
								}}
								disabled={!checked}
							>
								Modify
							</Button>
						)}
						{selected && checked && (
							<Button
								variant="outlined"
								color="primary"
								className={classes.useAssumptionBtn}
								onClick={(e) => {
									handleDeselectAssumption(e);
								}}
							>
								Deselect
							</Button>
						)}
					</Grid>
				</div>
			</Grid>
		</div>
	);
}
