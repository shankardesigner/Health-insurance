import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import { useEffect, useState } from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import styles from "./tabcomponent.module.css";
import React from "react";
import Grid from "@material-ui/core/Grid";

function TabPanel(props) {
	const { children, value, index, ...other } = props;
	const childrenWithProps = React.Children.map(children, (child) => {
		// checking isValidElement is the safe way and avoids a typescript error too
		if (React.isValidElement(child)) {
			let compProps = {}; // for extra props
			return React.cloneElement(child, compProps);
		}
		return child;
	});

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`nemo-tabpanel-${index}`}
			aria-labelledby={`nemo-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box>
					{" "}
					{/* p={3} for padding*/}
					{childrenWithProps}
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `nemo-tab-${index}`,
		"aria-controls": `nemo-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",

		// background: '#E5E5E5',
	},
	tabWrapper: {
		alignItems: "flex-end",
		flexDirection: "row-reverse !important",
		overflowWrap: "break-word",
		textTransform: "none",
		fontSize: "18px",
		lineHeight: "1.3",
		paddingBottom: "10px",
		[theme.breakpoints.down("md")]: {
			maxWidth: "100px",
		},
	},
	tabRoot: {
		marginRight: "5px",

		transition: "all 0.2s",
		[theme.breakpoints.down("md")]: {
			minWidth: "150px !important",
		},
		height: "100% !important",
		"& .MuiTab-labelIcon": {
			minHeight: "unset",
			paddingTop: "5px",
		},
		"&.MuiTab-root": {
			transition: "all 0.2s",
			background: "#FEFEFE",
			color: "#4D5154",
			// boxShadow: "0 1px 8px rgba(61, 62, 100, 0.1)",
			borderRadius: "10px",
			opacity: '1 !important'
		},
		"&.Mui-selected": {
			// background: "#ECF1F4",
			color: "#64B6F5",
			fontSize: "16px",
		},
	},
	tabContainer: {
		alignItems: "flex-start",
		transition: "all 0.2s",
		justityItems: "flex-start",
		height: "100%",
		[theme.breakpoints.down("md")]: {
			height: "85px !important",
			width: "150px !important",
		},
	},
	// labelContainer: {
	//   padding: 0,
	// },
	tabPanelRoot: {
		"& .MuiBox-root": {
			padding: "0px",
		},
	},
	selectedTab: {
		// background: "#71DBB61A",
		color: "#64B6F5",
		fontWeight: "bold",
		boxShadow: "none !important",
	},
	bottomBorderShadow: {
		boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
		padding: "0px 20px 10px",
	},
}));

export default function TabComponent({
	id,
	tabdata,
	activeTabIndex,
	tabState,
	onStateChange,
	dropDownClick,
}) {
	const classes = useStyles();
	const tabIndex = activeTabIndex || 0;
	const [value, setValue] = useState(tabIndex);
	const [anchorEl, setAnchorEl] = useState(null);
	const [dropdownData, setDropDownData] = useState([]);

	if (!tabState) {
		tabState = {
			lastactive: 0,
		};
	}

	if (!onStateChange) {
		onStateChange = function () {};
	}

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChange = (event, newValue) => {
		onStateChange({
			...tabState,
			[tabState.lastactive]: "Edited",
			lastactive: newValue,
		});
		setValue(newValue);
	};

	const handleMenuItemClick = (menuItem) => {
		dropDownClick(menuItem);
		handleClose();
	};

	const handleClick = (event, dropdown) => {
		event.stopPropagation();
		setDropDownData(dropdown);
		setAnchorEl(event.currentTarget);
	};

	useEffect(() => {
		setValue(tabState.lastactive);
		onStateChange({ ...tabState });
	}, []);

	const open = Boolean(anchorEl);

	const labelComponent = (label, tabIndex) => {
		return (
			<Grid
				container
				direction="column"
				justifyContent="flex-start"
				alignItems="center"
			>
				<Grid item>
					{tabState[tabIndex] && (
						<span className={styles.editedBtn}>{tabState[tabIndex]}</span>
					)}
					{!tabState[tabIndex] && <span>&nbsp;</span>}
				</Grid>
				<Grid item>{label}</Grid>
			</Grid>
		);
	};

	return (
		<div className={classes.root}>
			<AppBar
				position="static"
				color={"inherit"}
				elevation={0}
				className={classes.bottomBorderShadow}
			>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="nemo tab"
					variant="scrollable"
					scrollButtons="auto"
					classes={{
						root: classes.tabRoot,
						indicator: styles.indicator,
						flexContainer: classes.tabContainer,
						labelContainer: classes.labelContainer,
					}}
				>
					{tabdata.map((tab, index) => {
						if (tab.dropdown) {
							return (
								<Tab
									label={labelComponent(tab.name, index)}
									{...a11yProps(index)}
									className={classes.tabRoot}
									key={index}
									disabled={tab.disabled ? true : false}
									classes={{
										wrapper: classes.tabWrapper,
										selected: classes.selectedTab,
										root: classes.tabRoot,
										textColorPrimary: styles.textColorPrimary,
									}}
									icon={
										<ArrowDropDownIcon
											onClick={(e) => handleClick(e, tab.dropdown)}
										/>
									}
								/>
							);
						} else {
							return (
								<Tab
									label={labelComponent(tab.name, index)}
									{...a11yProps(index)}
									className={classes.tabRoot}
									key={index}
									disabled={tab.disabled ? true : false}
									classes={{
										wrapper: classes.tabWrapper,
										selected: classes.selectedTab,
										root: classes.tabRoot,
										textColorPrimary: styles.textColorPrimary,
									}}
								/>
							);
						}
					})}
				</Tabs>
			</AppBar>

			{tabdata.map((tab, index) => {
				const Component = tab.component;
				const params = tab.params ? tab.params : {};
				return (
					<TabPanel
						value={value}
						index={index}
						key={index}
						classes={{ root: classes.tabPanelRoot }}
					>
						<Component {...params} />
					</TabPanel>
				);
			})}

			{open && (
				<Popover
					open={true}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "center",
					}}
					className={styles.topMargin}
				>
					{dropdownData &&
						dropdownData.map((dropdownItem, index) => {
							return (
								<MenuItem key={index} className={styles.nestedMenuItems}>
									{dropdownItem.name}
									<MenuList>
										{dropdownItem.subCategories &&
											dropdownItem.subCategories.map(
												(submenuItem, subIndex) => {
													return (
														<MenuItem
															onClick={() =>
																handleMenuItemClick({
																	...submenuItem,
																	subIndex,
																	dropdownItem,
																})
															}
															key={index + "" + subIndex}
														>
															{submenuItem.name}
														</MenuItem>
													);
												}
											)}
									</MenuList>
								</MenuItem>
							);
						})}
				</Popover>
			)}
		</div>
	);
}
