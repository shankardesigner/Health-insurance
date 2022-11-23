import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import styles from "./tabcomponent.module.css";
import React, { useCallback, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import ModelFooter from "@components/NewLayout/ModelFooter";
import clsx from "clsx";
import { BootstrapTooltip } from "./BootstrapToolTip";
import { useDispatch, useSelector } from "react-redux";
import { tabModelState, updateHandleChange } from "@slices/tabModelSlice";
import { clientModelState, selectClientModel } from "@slices/clientModelSlice";
import {
  calculateSavingsAction, changeStatusOnNextTab,
  riskModelerState,
  saveNewModelAction
} from "@slices/riskModelerSlice";
import { useRouter } from "next/router";
import constants from "@constants/index";
import { globalAssumptionModelState, listAction } from "@slices/globalAssumptionAlice";
import {
  modelOptionState,
  saveModelingOptionsAction,
} from "@slices/modelingOptionsSlice";
import { useUser } from '@auth0/nextjs-auth0';


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
    position: "relative",
    minHeight: "100%",
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
      fontSize: 16,
      paddingBottom: 0,
    },
  },
  tabRoot: {
    transition: "all 0.2s",
    background: "#FFFFFF",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
    borderRadius: "3px",
    fontWeight: "bold",
    padding: "0 5px 5px",
    minWidth: "auto",
    height: "100% !important",
    position: "relative",
    zIndex: 2,

    "& .MuiTab-labelIcon": {
      minHeight: "unset",
      paddingTop: "5px",
    },
    "&.MuiTab-root": {
      transition: "all 0.2s",
      // background: "#FEFEFE",
      // boxShadow: "0 1px 8px rgba(61, 62, 100, 0.1)",
      // borderRadius: "10px",
      boxShadow: "none",
      padding: "24px 10px 10px",
      marginRight: "5px",
      opacity: `1 !important`,
      maxWidth: 355,
      // minWidth: 'auto',

      "&.edited .MuiGrid-item": {
        // opacity: 1,
        color: "#06406D",
      },

      [theme.breakpoints.down("md")]: {
        padding: 10,
      },
    },
    "& .MuiGrid-item": {
      color: "#4D5154",
      fontWeight: `600 !important`,
    },
    "&.Mui-selected": {
      // background: "#ECF1F4",
      opacity: "1 !important",

      "& .MuiGrid-item": {
        color: "#64B6F5 !important",
      },
    },
    // "& .MuiGrid-root": {
    //   "&.edited": {
    //     "& .MuiGrid-item": {
    //       color: "#4D5154",
    //     },
    //   },
    // },
  },
  tabContainer: {
    alignItems: "flex-start",
    transition: "all 0.2s",
    justityItems: "flex-start",
    height: "100%",
  },
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
  modelInfoName: {
    background: `rgba(194, 228, 255,0.2)`,
    borderRadius: "0px 0px 5px 5px",
    color: "#06406D",
    fontSize: 20,
    lineHeight: 1.3,
    fontWeight: 500,
    height: 43,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function TabModalComponent({
  id,
  tabdata,
  activeTabIndex,
  dropDownClick,
  tabSwitch = false,
  tabError,
  setTabError,
  ...props
}) {
  const classes = useStyles();
  const tabIndex = activeTabIndex || 0;
  const [value, setValue] = useState(tabIndex);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dropdownData, setDropDownData] = useState([]);
  const { tabState } = useSelector(tabModelState);
  const selectCurrentClientModal = useSelector(selectClientModel);
  const { clientId, loa1Id, planType, modelName } = selectCurrentClientModal;
  const dispatch = useDispatch();
  const { modelInfo, populationSummary } = useSelector(clientModelState);
  const {isNext} = useSelector(riskModelerState);

  const { modelingOptionsInfo, savedModelingOptions, resStatus } =
    useSelector(modelOptionState);
  const { usedAssumption,modelDetail } = useSelector(globalAssumptionModelState);
  const router = useRouter();
  const { ROUTES, ModelingOptions } = constants;
  const { user } = useUser();


  //Button properties for the footer
  const [buttonProps, setButtonProps] = useState({
    prev: value === 0,
    next: value === tabdata?.length - 1,
  });

  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    console.log(isNext,"isnext isnext")
    if(router.query.modelid && isNext === false && tabState.lastactive !== tabdata.length - 1){
      // console.log(activeTabIndex, value, 'active tab index...');
      dispatch(calculateSavingsAction({ modelId: router.query.modelid }));
      return () => {
        console.log("unmounted");
      };
    }
    else{
      dispatch(changeStatusOnNextTab({isNext: false}))
    }
  },[])


  // handle tabIndex wise form  submit and handleNexr
  const handleChange = useCallback(
    async (previousValue, newValue) => {

      switch (previousValue) {
        case 0:
          let payloadNewModel = {
            ...modelInfo,
            name: modelInfo.modelName,
            modelId: router.query.modelid,
            ...populationSummary,
            averageEmployeeCount: populationSummary.avgEmployeeCount,
            averageMemberCount: populationSummary.avgMemberCount,
            lives: populationSummary.avgEmployeeCount,
            premium: populationSummary.avgPremium,
            noOfPcp: populationSummary.pcpCount,
            userName: user?.nickname
          }
          // debugger;

          if(router.query.modelid) {
            payloadNewModel = {...payloadNewModel, ...usedAssumption,  ipaAlloc: usedAssumption.ipaAllocation,
              premium: usedAssumption.averagePremium || modelDetail?.premium,
              noOfPcp: usedAssumption.pcpCount,}
            payloadNewModel.name=modelInfo.modelName;
          }
          else{
            payloadNewModel.ipaAdmin=0;
            payloadNewModel.ipaAdminPercent=0;
            payloadNewModel.ipaAlloc=0.87;
            payloadNewModel.ipaAllocation=0.87;
            payloadNewModel.ipaAllocationPercent=87;
          }
            const data = await dispatch(
                saveNewModelAction(payloadNewModel)
            );
            if (data?.payload?.modelId) {
              dispatch(updateHandleChange(newValue));
              if(newValue !== tabdata.length - 1) {
                dispatch(calculateSavingsAction({ modelId: data?.payload?.modelId }));
              }
              dispatch(listAction());
              dispatch(changeStatusOnNextTab({isNext: true}))
              router.push(ROUTES.EDITING_REPORT_ROUTE + data?.payload?.modelId);
          }
          break;
          case 1:
            const globalAssumptionData = await dispatch(
            saveNewModelAction({
              ...modelInfo, ...populationSummary,
              ...usedAssumption,
              averageEmployeeCount: populationSummary.avgEmployeeCount,
              averageMemberCount: populationSummary.avgMemberCount,
              lives: populationSummary.avgEmployeeCount,
              name: modelInfo.modelName,
              modelId: router.query.modelid,
              ipaAlloc: usedAssumption.ipaAllocation,
              premium: usedAssumption.averagePremium,
              noOfPcp: usedAssumption.pcpCount,
              userName: user?.nickname
            })
          );
          if (globalAssumptionData?.payload?.modelId) {
            const getModelingOptionsPayload = ModelingOptions.map(
              (mOptions) => ({
                id: 0,
                modelingOptionsFieldId: mOptions.optionId,
                value: modelingOptionsInfo[mOptions.name] ?? "",
              })
            ).filter((payload) => payload.value && payload.value !== "");
            if (getModelingOptionsPayload.length !== 0) {
              dispatch(
                saveModelingOptionsAction({
                  modelId: globalAssumptionData?.payload?.modelId,
                  options: getModelingOptionsPayload,
                })
              );
            }
            if(newValue !== tabdata.length - 1) {
              dispatch(calculateSavingsAction({ modelId: router?.query?.modelid }));
            }
            dispatch(updateHandleChange(newValue));

            // router.push(ROUTES.EDITING_REPORT_ROUTE + data?.payload?.modelId);
            setValue(newValue);
          }
            break;
          default:
          dispatch(updateHandleChange(newValue));
          if(newValue !== tabdata.length - 1) {
            dispatch(calculateSavingsAction({ modelId: router?.query?.modelid }));
          }
          setValue(newValue);
      }
    },
    [modelInfo, modelingOptionsInfo, usedAssumption, populationSummary]
  );

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
    setValue(Number(tabState?.lastactive || 0));

    // return () => {
    //   dispatch(editTabRest());
    // }
  }, []);

  const open = Boolean(anchorEl);

  const handleTabSwitchButton = (event, key) => {
    event.stopPropagation();
    console.log("HERE", value)
    if (key === "next") {
      handleChange(value, value + 1);
      return;
    }
    handleChange(value, value - 1);
  };

  /**
   * update the disable status of next and previous button.
   * @param {prev | next} key
   * @param {boolean} value
   * @returns void
   */
  const updateSwitchButtonStatus = (changedButtonProps) => {
    if (!changedButtonProps) return;
    setButtonProps({
      ...changedButtonProps,
    });
  };

  const giveAccessToNextTab = clientId && loa1Id && planType && modelName;

  useEffect(() => {
    if (giveAccessToNextTab) {
      setButtonProps({
        ...buttonProps,
        next: false,
      });
    } else {
      setButtonProps({
        ...buttonProps,
        next: true,
      });
    }
  }, [selectCurrentClientModal]);

  const labelComponent = (label, tabIndex) => {
    return (
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item>
          {label}
          {tabState[tabIndex] && (
            <BootstrapTooltip title="Contents Edited">
              <span className={styles.editedBtn}>{tabState[tabIndex]}</span>
            </BootstrapTooltip>
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color={"inherit"} elevation={0}>
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
                  disabled={!giveAccessToNextTab || tab.disabledOnError
                    ? true : false}
                  classes={{
                    wrapper: classes.tabWrapper,
                    selected: classes.selectedTab,
                    root: clsx([
                      classes.tabRoot,
                      tabState[index] ? "edited" : "",
                    ]),
                    // textColorPrimary: styles.textColorPrimary,
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
                  className={clsx([
                    classes.tabRoot,
                    tabState[index] ? "edited" : "",
                  ])}
                  key={index}
                  disabled={
                    !giveAccessToNextTab ||
                    router.asPath === ROUTES.NEW_MODAL_REPORT_ROUTE ||
                    tab.disabledOnError
                      ? true
                      : false
                  }
                  // disabled={tabState[index] ? false : true}
                  classes={{
                    wrapper: classes.tabWrapper,
                    selected: classes.selectedTab,
                    root: classes.tabRoot,
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
            <Component
              {...params}
              onChange={handleChange}
              index={value}
              tabIndex={value}
              setTabError={setTabError}
            />
          </TabPanel>
        );
      })}

      {tabSwitch && (
        <ModelFooter
          handleTabSwitchButton={handleTabSwitchButton}
          buttonProps={buttonProps}
          updateSwitchButtonStatus={updateSwitchButtonStatus}
          currentTab={value}
          tabLength={tabdata.length - 1}
          tabError={tabError}
          setTabError={setTabError}
        />
      )}

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
