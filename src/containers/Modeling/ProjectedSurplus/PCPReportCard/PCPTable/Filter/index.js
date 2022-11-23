import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import styles from "./filter.module.css";

import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

/* redux part */
import {
  listAction,
  getDetailsByIdAction,
  getLoa1ByIdAction,
  getLoa2ByIdAction,
  getLoa3ByIdAction,
  getLoa4ByIdAction,
  getPlansByIdAction,
  getPopulationSummaryAction,
  saveModelInfoAction,
  saveClientListAction,
  resetClientModelAction,
  updateLabelListAction,
  clientModelState,
  initialState,
} from "@slices/clientModelSlice";

import { setModuleInfoAction, moduleInfoState } from "@slices/moduleInfoSlice";

import {
  resetUsedAssumptionAction,
  saveUsedAssumptionAction,
} from "@slices/globalAssumptionAlice";

import { useSelector, useDispatch } from "react-redux";
import {
  NumberComponent,
  PopulationComponent,
  CurrencyComponent,
} from "@components/FormatNumber";

const useStyles = makeStyles((theme) => ({
  search: {
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "10px",
    },
  },
  inputStyle: {
    background: "#EFEFF0",
    borderRadius: "7px !important",
    paddingLeft: "10px",
  },
  selectStyle: {
    root: {
      height: "18px",
      borderRadius: "7px",
      minHeight: "unset !important",
      "&.MuiFilledInput-input": {
        color: "grey",
      },
    },
  },
}));

export default function Filter({ tempFilters, setTempFilters }) {
  const classes = useStyles();
  const router = useRouter();
  const { modelid: editModelId } = router.query;
  const [editMode, setEditMode] = useState(editModelId ? true : false);
  const dispatch = useDispatch();

  const [autoModelNameFlag, setAutoModelNameFlag] = useState(
    editModelId ? false : true
  );

  useEffect(() => {
    dispatch(listAction());
  }, []);

  const {
    modelInfo,
    clientModelList,
    clientModel,
    populationSummary,
    loaList,
    loaLabel,
    planTypeList,
    resStatus,
    clientListResStatus,
  } = useSelector(clientModelState);

  const { moduleInfo } = useSelector(moduleInfoState);

  const handleClientChange = (event) => {
    setTempFilters({ ...tempFilters, [event.target.name]: event.target.value });
    /* if client changes, reset everything */
    dispatch(resetClientModelAction());
    dispatch(saveClientListAction(clientModelList));
    dispatch(
      saveModelInfoAction({
        ...initialState.modelInfo,
        modelName: modelInfo.modelName,
        [event.target.name]: event.target.value,
      })
    );
  };

  const handleChange = (event) => {
    setTempFilters({ ...tempFilters, [event.target.name]: event.target.value });
    /* if client changes, reset everything */
    if (event.target.name === "modelName") {
      setAutoModelNameFlag(false);
    }
    dispatch(
      saveModelInfoAction({
        ...modelInfo,
        [event.target.name]: event.target.value,
      })
    );
  };

  const {
    loa1Id: loa1Label,
    loa2Id: loa2Label,
    loa3Id: loa3Label,
    loa4Id: loa4Label,
  } = loaLabel;
  const { clientId, planType, loa1Id, loa2Id, loa3Id, loa4Id } = modelInfo;

  const { loa1List, loa2List, loa3List, loa4List } = loaList;

  useEffect(() => {
    if (clientModelList.length !== 0) {
      /* update label list on client id update */
      dispatch(updateLabelListAction(clientId));
    }
  }, [clientId, clientModelList]);

  useEffect(() => {
    if (loa1Label) {
      const payload = {
        clientId,
      };
      dispatch(getLoa1ByIdAction(payload));
    }
  }, [clientId, loa1Label]);

  // fetch programs or plan type list on loa1 changes
  useEffect(() => {
    if (loa1Id) {
      const payload = {
        clientId,
        loa1Id: loa1Id,
      };
      dispatch(getPlansByIdAction(payload));
    }
  }, [loa1Id, loa1Label]);

  // fetch practice on product or plan type changes
  useEffect(() => {
    if (planType && loa2Label) {
      const payload = {
        clientId,
        planTypeId: planType,
        loa1Id: loa1Id,
      };
      dispatch(getLoa2ByIdAction(payload));
    }
  }, [planType, loa2Label]);

  // fetch practice on product or plan type changes
  useEffect(() => {
    if (planType && loa3Label) {
      const payload = {
        clientId,
        planTypeId: planType,
        loa1Id: loa1Id,
        loa2Id: loa2Id,
      };
      dispatch(getLoa3ByIdAction(payload));
    }
  }, [loa2Id, loa3Label]);

  useEffect(() => {
    if (planType && loa4Label) {
      const payload = {
        clientId,
        planTypeId: planType,
        loa1Id: loa1Id,
        loa2Id: loa2Id,
        loa3Id: loa3Id,
      };
      dispatch(getLoa4ByIdAction(payload));
    }
  }, [loa3Id, loa4Label]);

  useEffect(() => {
    if (loa1Id && clientId) {
      const {
        clientId,
        planType,
        loa1Id,
        loa2Id,
        loa3Id,
        loa4Id,
        loa5Id,
        loa6Id,
      } = modelInfo;
      let payload = {
        loa1Id,
        clientId,
      };

      if (planType) {
        if (planType != "ALL") {
          payload.planTypeId = planType;
        }
      }

      if (loa2Id && loa2Id != "ALL") {
        payload.loa2Id = loa2Id;
      }
      if (loa3Id && loa3Id != "ALL") {
        payload.loa3Id = loa3Id;
      }
      if (loa4Id && loa4Id != "ALL") {
        payload.loa4Id = loa4Id;
      }
      if (loa5Id && loa5Id != "ALL") {
        payload.loa5Id = loa5Id;
      }
      if (loa6Id && loa6Id != "ALL") {
        payload.loa6Id = loa6Id;
      }

      dispatch(getPopulationSummaryAction(payload));
      // dispatch(resetUsedAssumptionAction());
    }
  }, [modelInfo]);

  useEffect(() => {
    if (modelInfo.loa1Id && modelInfo.clientId) {
      /* auto model name */
      if (autoModelNameFlag) {
        const uniqueId = String(new Date().getTime())
          .split("")
          .reverse()
          .join("")
          .substring(0, 5);
        dispatch(
          saveModelInfoAction({
            ...modelInfo,
            modelName: `Model-${clientId}-${loa1Id}-${uniqueId}`,
          })
        );
      }
    }
  }, [modelInfo.loa1Id, modelInfo.clientId]);

  useEffect(() => {
    if (modelInfo.modelName) {
      dispatch(
        setModuleInfoAction({
          ...moduleInfo,
          NewModelPage: {
            ...moduleInfo["NewModelPage"],
            title: modelInfo.modelName,
          },
        })
      );
    }
  }, [modelInfo.modelName]);

  useEffect(() => {
    if (editMode) {
      let dataToUpdate = {
        id: "GLA-1",
        pcpCount: modelInfo.noOfPcp,
        ipaAllocationPercent: modelInfo.ipaAlloc * 100,
        ipaAdminPercent: modelInfo.ipaAdmin * 100,
        ipaAllocation: modelInfo.ipaAlloc,
        ipaAdmin: modelInfo.ipaAdmin,
        name: "PGLBL",
        riskScore: 0.5,
        averagePremium: modelInfo.premium,
      };
      dispatch(saveUsedAssumptionAction(dataToUpdate));
    }
  }, [
    modelInfo.noOfPcp,
    modelInfo.ipaAlloc,
    modelInfo.ipaAdmin,
    modelInfo.premium,
    editMode,
  ]);

  return (
    <Box component={Grid} xs={12}>
      <Typography variant="h6" gutterBottom>
        Select Client*
      </Typography>

      <FormControl
        fullWidth
        disabled={!clientModelList}
        classes={{ root: classes.inputStyle }}
      >
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          name="clientId"
          value={clientId}
          onChange={handleClientChange}
          displayEmpty
          disableUnderline
          classes={{ root: classes.selectStyle }}
          placeholder="Select Client"
          renderValue={clientId !== "" ? undefined : () => <>Select Client</>}
        >
          {clientModelList &&
            clientModelList.map((client, index) => {
              return (
                <MenuItem value={client.id} key={index}>
                  {client.name}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        {loa1Label && (
          <Grid item sm={5} xs={12}>
            <>
              <Typography
                variant="h6"
                gutterBottom
                className={styles.selectClientWrapper}
              >
                Select {loa1Label}*
              </Typography>
              <FormControl
                fullWidth
                disabled={!clientModelList}
                classes={{ root: classes.inputStyle }}
              >
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="loa1Id"
                  value={loa1Id}
                  onChange={handleChange}
                  displayEmpty
                  disableUnderline
                  classes={{ root: classes.selectStyle }}
                  renderValue={
                    loa1Id !== "" ? undefined : () => <>Select {loa1Label}</>
                  }
                >
                  {loa1List &&
                    Object.keys(loa1List).map((loa1Id, index) => {
                      return (
                        <MenuItem value={loa1Id} key={index}>
                          {loa1List[loa1Id].name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </>
          </Grid>
        )}
        {loa1Label && (
          <Grid item sm={5} xs={12}>
            <>
              <Typography
                variant="h6"
                gutterBottom
                className={styles.selectClientWrapper}
              >
                Select Product
              </Typography>
              <FormControl
                fullWidth
                disabled={!clientModelList}
                classes={{ root: classes.inputStyle }}
              >
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="planType"
                  value={planType}
                  onChange={handleChange}
                  displayEmpty
                  disableUnderline
                  classes={{ root: classes.selectStyle }}
                  renderValue={
                    planType !== "" ? undefined : () => <>Select Product</>
                  }
                >
                  {planTypeList &&
                    Object.keys(planTypeList).map((planId, index) => {
                      return (
                        <MenuItem value={planId} key={index}>
                          {planTypeList[planId].name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </>
          </Grid>
        )}
        {loa2Label && (
          <Grid item sm={5} xs={12}>
            <>
              <Typography
                variant="h6"
                gutterBottom
                className={styles.selectClientWrapper}
              >
                Select {loa2Label}
              </Typography>
              <FormControl
                fullWidth
                disabled={!clientModelList}
                classes={{ root: classes.inputStyle }}
              >
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="loa2Id"
                  value={loa2Id}
                  onChange={handleChange}
                  displayEmpty
                  disableUnderline
                  classes={{ root: classes.selectStyle }}
                  renderValue={
                    loa2Id !== "" ? undefined : () => <>Select {loa2Label}</>
                  }
                >
                  {loa2List &&
                    Object.keys(loa2List).map((loa2Id, index) => {
                      return (
                        <MenuItem value={loa2Id} key={index}>
                          {loa2List[loa2Id].name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </>
          </Grid>
        )}
        {loa3Label && (
          <Grid item sm={5} xs={12}>
            <>
              <Typography
                variant="h6"
                gutterBottom
                className={styles.selectClientWrapper}
              >
                Select {loa3Label}
              </Typography>
              <FormControl
                fullWidth
                disabled={!clientModelList}
                classes={{ root: classes.inputStyle }}
              >
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="loa3Id"
                  value={loa3Id}
                  onChange={handleChange}
                  displayEmpty
                  disableUnderline
                  classes={{ root: classes.selectStyle }}
                  renderValue={
                    loa3Id !== "" ? undefined : () => <>Select {loa3Label}</>
                  }
                >
                  {loa3List &&
                    Object.keys(loa3List).map((loa3Id, index) => {
                      return (
                        <MenuItem value={loa3Id} key={index}>
                          {loa3List[loa3Id].name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </>
          </Grid>
        )}
        {loa4Label && (
          <Grid item sm={5} xs={12}>
            <>
              <Typography
                variant="h6"
                gutterBottom
                className={styles.selectClientWrapper}
              >
                Select {loa4Label}
              </Typography>
              <FormControl
                fullWidth
                disabled={!clientModelList}
                classes={{ root: classes.inputStyle }}
              >
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="loa4Id"
                  value={loa4Id}
                  onChange={handleChange}
                  displayEmpty
                  disableUnderline
                  classes={{ root: classes.selectStyle }}
                  renderValue={
                    loa4Id !== "" ? undefined : () => <>Select {loa4Label}</>
                  }
                >
                  {loa4List &&
                    Object.keys(loa4List).map((loa4Id, index) => {
                      return (
                        <MenuItem value={loa4Id} key={index}>
                          {loa4List[loa4Id].name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
