import ModelResultBox from "../../ModelResultBox";
import Box from "@material-ui/core/Box";
import WhatIfComponent from "@containers/WhatIf";
import { Tab, Tabs, Button } from "@material-ui/core";
import React from "react";
import TabPanel from "../StopLoss/TabUtils";
import HighCostEvents from "./HighCostEvents";
import styles from "./whatif.module.scss";
import DiagnosisPrevalence from "./DiagnosisPrevalence";
import ClaimCategoryVariance from "./ClaimCategoryVariance";

export default function WhatIf({ tabIndex }) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box p={3} pt={0} pl={3} pr={3}>
			{/* <WhatIfComponent /> */}
			<div className={styles.nemoFactorTabHolder}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="wrapped label tabs example"
					className={styles.whatIfTabHolder}
					textColor="secondary"
					indicatorColor="secondary"
				>
					<Tab value={0} label="High Cost Events/Episodes" />
					<Tab value={1} label="Diagnosis Prevalence" />
					<Tab value={2} label="Claim Category Variance" />
				</Tabs>
				{/* <Button className={styles.filterButton}>
					<img src="/new/filter.svg" width={20} height={20} />
					Search
				</Button> */}
			</div>
			<TabPanel className={styles.nemoFactorTabBody} value={value} index={0}>
				<HighCostEvents tabIndex={tabIndex} />
			</TabPanel>
			<TabPanel className={styles.nemoFactorTabBody} value={value} index={1}>
				<DiagnosisPrevalence tabIndex={tabIndex} />
			</TabPanel>
			<TabPanel className={styles.nemoFactorTabBody} value={value} index={2}>
				<ClaimCategoryVariance tabIndex={tabIndex} />
			</TabPanel>
			<ModelResultBox next="nemo-tab-7" displayButton={false} />
		</Box>
	);
}
