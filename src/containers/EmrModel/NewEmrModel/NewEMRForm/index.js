import { useEffect, useState } from "react";
import { Grid, Table, TableBody, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputBase from "@material-ui/core/InputBase";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import { useRouter } from "next/router";

import { useSelector, useDispatch } from "react-redux";
import {
  emrModelState,
  addAction,
  getAction,
  editAction,
} from "@slices/emrModelSlice";

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3D3E64",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3D3E64",
  },
  gutterBottomLarge: {
    marginBottom: 40,
  },
  gutterBottomMedium: {
    marginBottom: 30,
  },
  gutterTopMedium: {
    marginTop: 30,
  },
  gutterBottomSmall: {
    marginBottom: 20,
  },
  addBtn: {
    color: "#3D3E64",
  },
  actionButton: {
    marginRight: "5px",
    borderRadius: "20px",
    border: "1px solid #000000",
    minWidth: "10px !important",
  },
  testBtn: {
    color: theme.palette.common.white,
    borderRadius: 20,
  },
  btnPadding: {
    padding: "5px",
  },
  leftMargin: {
    marginLeft: 10,
  },
  dropdownLabel: {
    paddingTop: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#C4C4C4",
  },
  newModelButton: {
    background: "#42DEB4",
    borderRadius: "100px",
    height: "47px",
    lineHeight: "1",
    color: "#ffffff",
    border: "unset",
    "&:hover": {
      background: "#42DEB4",
      border: "1px solid " + theme.palette.secondary.color,
    },
    width: "100%",
    fontSize: "18px",

    "& .MuiButton-startIcon": {
      position: "absolute",
      left: 24,
    },
    "& .MuiButton-startIcon span": {
      fontSize: "36px",
    },
    marginBottom: "40px",
    // position: "fixed",
    // bottom: "20px",
  },
}));

const EmrTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#3D3E64",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#3D3E64",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: 10,
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3D3E64",
      },
    },
    "& .MuiFormLabel-root": {
      paddingTop: 1,
      fontSize: 14,
      fontWeight: "bold",
      color: "#C4C4C4",
    },
  },
})(TextField);

const EmrInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 10,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 10,
      borderColor: "#3D3E64",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
  label: {
    paddingTop: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#C4C4C4",
  },
}))(InputBase);

const NemoCheckbox = withStyles({
  root: {
    color: "#3D3E64",
    "&$checked": {
      color: "#3D3E64",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const NemoTableCell = withStyles((theme) => ({
  root: {
    borderBottom: "none",
  },
  head: {
    color: "#3D3E64",
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    color: "#3D3E64",
    fontSize: 16,
    fontWeight: "bold",
  },
}))(TableCell);

export default function NewEmrForm() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const emrId = router.query.emrId ?? null;
  const [emrDataLoaded, setEmrDataLoaded] = useState(false);
  const [emrName, setEmrName] = useState("");
  const [implementor, setImplementor] = useState("");
  const [specType, setSpecType] = useState("");
  const [parameters, setParameters] = useState([]);
  const [paramName, setParamName] = useState("");
  const [paramValue, setParamValue] = useState("");
  const [VPNCheckbox, setVPNCheckbox] = useState(true);
  const [endpoints, setEndpoints] = useState([
    "Patient",
    "Encounter",
    "Appointment",
    "RX Order",
    "Lab Order",
    "Lab Result",
    "Vitals",
    "Allergy",
    "Immunization",
  ]);
  const [actions, setActions] = useState([
    "Create",
    "Search",
    "Retrieve",
    "Update",
    "Delete",
    "Subscription",
  ]);
  const { emrData, resStatus } = useSelector(emrModelState);

  const defaultMappedCheckbox = {
    "Patient": {
        "createYn": true,
        "searchYn": true,
        "retrieveYn": true,
        "updateYn": true,
        "deleteYn": false,
        "subscriptionYn": true
    },
    "Encounter": {
        "createYn": true,
        "searchYn": true,
        "retrieveYn": true,
        "updateYn": true,
        "deleteYn": false,
        "subscriptionYn": true
    },
    "Appointment": {
        "createYn": true,
        "searchYn": true,
        "retrieveYn": true,
        "updateYn": true,
        "deleteYn": true,
        "subscriptionYn": true
    },
    "RX Order": {
        "createYn": true,
        "searchYn": true,
        "retrieveYn": true,
        "updateYn": true,
        "deleteYn": false,
        "subscriptionYn": true
    },
    "Lab Order": {
        "createYn": true,
        "searchYn": true,
        "retrieveYn": true,
        "updateYn": true,
        "deleteYn": false,
        "subscriptionYn": false
    },
    "Lab Result": {
        "createYn": false,
        "searchYn": true,
        "retrieveYn": true,
        "updateYn": false,
        "deleteYn": false,
        "subscriptionYn": true
    },
    "Vitals": {
        "createYn": true,
        "searchYn": false,
        "retrieveYn": true,
        "updateYn": false,
        "deleteYn": false,
        "subscriptionYn": false
    },
    "Allergy": {
        "createYn": true,
        "searchYn": true,
        "retrieveYn": true,
        "updateYn": true,
        "deleteYn": true,
        "subscriptionYn": false
    },
    "Immunization": {
        "createYn": true,
        "searchYn": true,
        "retrieveYn": true,
        "updateYn": true,
        "deleteYn": false,
        "subscriptionYn": false
    }
}

  const [mappedCheckbox, setMappedCheckbox] = useState(
    // endpoints.reduce(
    //   (acc, cur) => ({
    //     ...acc,
    //     [cur]: actions.reduce((acc, cur) => ({ ...acc, [cur]: false }), {}),
    //   }),
    //   {}
    // )
    defaultMappedCheckbox
  );


  useEffect(() => {
    if (emrId !== null) {
      const payload = {
        emrId: emrId,
      };
      dispatch(getAction(payload));
    }
  }, [emrId]);

  useEffect(() => {
    if (emrData.length !== 0) {
      setEmrDataLoaded(true);
    }
  }, [emrData]);

  useEffect(() => {
    if (emrDataLoaded) {
      setEmrName(emrData.emrName);
      setImplementor(emrData.implementer);
      destructureResourceActivities(emrData.resourceActivities);
    }
  }, [emrDataLoaded]);

  const handleMappedCheckboxChange = (event) => {
    let endpointName = event.target
      .closest("[endpoint-label]")
      .getAttribute("endpoint-label");
    let endpointAction = event.target.name;
    setMappedCheckbox({
      ...mappedCheckbox,
      [endpointName]: {
        ...mappedCheckbox[endpointName],
        [endpointAction]: !mappedCheckbox[endpointName][endpointAction],
      },
    });
  };

  const handleAddParameter = () => {
    setParameters([
      ...parameters,
      { "paramName": paramName, "paramValue": paramValue },
    ]);
    setParamName("");
    setParamValue("");
  };

  const prepareResourceActivities = () => {
    let resourceActivities = [];
    Object.entries(mappedCheckbox).map(([endpoint, actions]) => {
      const obj = {};
      obj.resourceName = endpoint;
      Object.entries(actions).map(([action, value]) => {
        !emrDataLoaded
          ? (obj[action.toLowerCase() + "Yn"] = value)
          : (obj[action] = value);
      });
      resourceActivities.push(obj);
    });
    return resourceActivities;
  };

  const destructureResourceActivities = (resourceActivities = []) => {
    const tempResource = resourceActivities.map(
      ({ resourceName, emrId, ...actions }) => actions
    );
    setMappedCheckbox(
      resourceActivities.reduce(
        (acc, cur, index) => ({
          ...acc,
          [cur.resourceName]: tempResource[index],
        }),
        {}
      )
    );
  };

  

  const prepareEmrLookups = () => {
    let emrLookups = [];
    parameters.map((parameter) => {
      emrLookups.push({
        "description": "string",
        "isEnabled": true,
        "lookupName": parameter.paramName,
        "lookupValue": parameter.paramValue,
      });
    });
    return emrLookups;
  };

  const clearTextFields = () => {
    setEmrName("");
    setImplementor("");
    setSpecType("");
  };

  const handleSaveForm = () => {
    if (emrName !== "") {
      const payload = {
        "emrId": emrId ?? 0,
        "emrLookups": prepareEmrLookups(),
        "emrName": emrName,
        "implementer": implementor,
        "patients": 0,
        "practices": 0,
        "resourceActivities": prepareResourceActivities(),
      };
      emrDataLoaded
        ? dispatch(editAction(payload))
        : dispatch(addAction(payload));
      if (resStatus === "ACTION_SUCCESS" || resStatus === "SUCCESS") {
        router.push({
          pathname: "/clientManagement",
          query: { snack: "success", activeTabIndex: 1 },
        });
      } else if (resStatus === "ACTION_FAILURE" || resStatus === "FAILURE") {
        router.push({
          pathname: "/clientManagement",
          query: { snack: "fail", activeTabIndex: 1 },
        });
      }
      clearTextFields();
    }
  };

  return (
    <Grid container>
      <Grid
        container
        className={`${classes.gutterBottomMedium} ${classes.gutterTopMedium}`}
      >
        <Grid item xs={12}>
          <Typography className={classes.header} gutterBottom>
            EMRs
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} container direction="row">
            <Grid item xs={12} container alignItems="center">
              <Typography className={classes.subHeader} gutterBottom>
                EMR Name
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <EmrTextField
                label="EMR Name"
                value={emrDataLoaded ? emrData.emrName : emrName}
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setEmrName(event.target.value)}
                // {...(emrDataLoaded ? { disabled: true } : null)}
              />
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="row">
            <Grid item xs={12} container alignItems="center">
              <Typography className={classes.subHeader} gutterBottom>
                Implementor
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <EmrTextField
                label="Select Implementor"
                value={emrDataLoaded ? emrData.implementer : implementor}
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setImplementor(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="row">
            <Grid item xs={12} container alignItems="center">
              <Typography className={classes.subHeader} gutterBottom>
                Specification Type
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <EmrTextField
                label="Select Spec Type"
                value={specType}
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setSpecType(event.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.gutterBottomMedium}>
        <Grid item xs={12}>
          <Typography className={classes.header} gutterBottom>
            Parameters
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Typography className={classes.subHeader} gutterBottom>
                Param Name
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <EmrTextField
                label="Client Secret"
                value={paramName}
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setParamName(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="row">
            <Grid item xs={12}>
              <Typography className={classes.subHeader} gutterBottom>
                Param Value
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <EmrTextField
                label="xxxxxxxx"
                value={paramValue}
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setParamValue(event.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <IconButton
                classes={{ root: classes.btnPadding }}
                onClick={() =>
                  paramName !== "" && paramValue !== ""
                    ? handleAddParameter()
                    : null
                }
              >
                <AddCircleIcon
                  fontSize="large"
                  className={classes.addBtn}
                ></AddCircleIcon>
              </IconButton>
              <IconButton title="Edit" className={classes.actionButton}>
                <img width={12} height={10} src="/edit-icon.svg" />
              </IconButton>
              <IconButton
                title="Edit"
                className={classes.actionButton}
                onClick={() => setParameters([])}
              >
                <img width={12} height={10} src="/delete-icon.svg" />
              </IconButton>
              <Button
                variant="contained"
                color="secondary"
                className={classes.testBtn}
              >
                Test
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {parameters.length !== 0
          ? parameters.map((parameter, index) => {
              return (
                <Grid item xs={12} key={index}>
                  <Typography className={classes.subHeader}>
                    {parameter.paramName} : {parameter.paramValue}
                  </Typography>
                </Grid>
              );
            })
          : null}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={6}>
            {/* <Grid item xs={12}>
                <Typography className={classes.subHeader} gutterBottom>
                  Param Name
                </Typography>
              </Grid> */}
            <Grid item xs={12}>
              <EmrTextField
                label="Practice ID"
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setParamName(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="row">
            {/* <Grid item xs={12}>
                <Typography className={classes.subHeader} gutterBottom>
                  Param Value
                </Typography>
              </Grid> */}
            <Grid item xs={8}>
              <EmrTextField
                label="019"
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setParamValue(event.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <IconButton
                classes={{ root: classes.btnPadding }}
                // onClick={() =>
                //   paramName !== null && paramValue !== null
                //     ? setParameters([
                //         ...parameters,
                //         { "paramName": paramName, "paramValue": paramValue },
                //       ])
                //     : null
                // }
              >
                <AddCircleIcon
                  fontSize="large"
                  className={classes.addBtn}
                ></AddCircleIcon>
              </IconButton>
              <IconButton title="Edit" className={classes.actionButton}>
                <img width={12} height={10} src="/edit-icon.svg" />
              </IconButton>
              <IconButton
                title="Edit"
                className={classes.actionButton}
                onClick={() => setParameters([])}
              >
                <img width={12} height={10} src="/delete-icon.svg" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={6}>
            {/* <Grid item xs={12}>
                <Typography className={classes.subHeader} gutterBottom>
                  Param Name
                </Typography>
              </Grid> */}
            <Grid item xs={12}>
              <EmrTextField
                label=""
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setParamName(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid item xs={6} container direction="row">
            {/* <Grid item xs={12}>
                <Typography className={classes.subHeader} gutterBottom>
                  Param Value
                </Typography>
              </Grid> */}
            <Grid item xs={8}>
              <EmrTextField
                label=""
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => setParamValue(event.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={classes.gutterBottomMedium}>
        <Grid item xs={12}>
          <Typography className={classes.header} gutterBottom>
            Connection Params
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={6} container direction="row">
            <Grid item xs={12}>
              <Typography className={classes.subHeader} gutterBottom>
                Whitelisted IPs
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <EmrTextField
                label="101.102.103.104; 201.202.203.205"
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <FormControlLabel
                className={classes.leftMargin}
                control={
                  <NemoCheckbox
                    checked={VPNCheckbox}
                    onChange={() => setVPNCheckbox(!VPNCheckbox)}
                  />
                }
                label="VPN Tunnel"
              />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <Typography className={classes.subHeader} gutterBottom>
                Certificates
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <EmrTextField
                label="PGP Keys, certificate"
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={classes.gutterBottomMedium}>
        <Grid item xs={12}>
          <Typography className={classes.header} gutterBottom>
            Error handling and retry parameters
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} container direction="row">
            <Grid item xs={2}>
              <Typography className={classes.subHeader} gutterBottom>
                Error Handling Params
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <EmrTextField
                label="JSON"
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={1} container justifyContent="flex-end">
              <IconButton title="Edit" className={classes.actionButton}>
                <img width={12} height={10} src="/edit-icon.svg" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row">
            <Grid item xs={2}>
              <Typography className={classes.subHeader} gutterBottom>
                Retry Params
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <EmrTextField
                label="JSON"
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={1} container justifyContent="flex-end">
              <IconButton title="Edit" className={classes.actionButton}>
                <img width={12} height={10} src="/edit-icon.svg" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={classes.gutterBottomMedium}>
        <Grid item xs={12}>
          <Typography className={classes.header} gutterBottom>
            Mapped Endpoints
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={3}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <NemoTableCell></NemoTableCell>
                {actions.map((action, index) => {
                  return <NemoTableCell key={index}>{action}</NemoTableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(mappedCheckbox).map(([key, value], index) => {
                return (
                  <TableRow endpoint-label={key} key={index}>
                    <NemoTableCell>{key}</NemoTableCell>
                    {Object.entries(value).map(([key, value], index) => {
                      return (
                        <NemoTableCell key={index}>
                          <NemoCheckbox
                            checked={value}
                            onChange={handleMappedCheckboxChange}
                            name={key}
                          />
                        </NemoTableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              <TableRow>
                <NemoTableCell>
                  <Button variant="contained" disableElevation>
                    Expand More
                  </Button>
                </NemoTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      <Grid container className={classes.gutterBottomMedium}>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} container direction="row">
            <Grid item xs={12}>
              <Typography className={classes.subHeader} gutterBottom>
                eMPI Logic (override only)
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <EmrTextField
                label="eMPI Logic"
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={1} container justifyContent="flex-end">
              <IconButton title="Edit" className={classes.actionButton}>
                <img width={12} height={10} src="/edit-icon.svg" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container className={classes.gutterBottomMedium}>
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} container direction="row">
            <Grid item xs={12}>
              <Typography className={classes.subHeader} gutterBottom>
                Rate Limit Parameters
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <EmrTextField
                label=""
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={1} container justifyContent="flex-end">
              <IconButton title="Edit" className={classes.actionButton}>
                <img width={12} height={10} src="/edit-icon.svg" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row">
            <Grid item xs={12}>
              <Typography className={classes.subHeader} gutterBottom>
                Codable Concept/Terminology Server related parameters
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <EmrTextField
                label=""
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={1} container justifyContent="flex-end">
              <IconButton title="Edit" className={classes.actionButton}>
                <img width={12} height={10} src="/edit-icon.svg" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Button
          style={{
            width: "48%",
            height: "40px",
            background: "#C4C4C4",
            color: "#FFFFFF",
            borderRadius: "100px",
            marginRight: 20,
          }}
          variant="outlined"
          color="secondary"
          className={classes.newModelButton}
          onClick={() => router.back()}
        >
          Cancel{" "}
        </Button>
        <Button
          style={{
            width: "48%",
            height: "40px",
            borderRadius: "100px",
          }}
          variant="outlined"
          color="primary"
          className={classes.newModelButton}
          onClick={handleSaveForm}
        >
          Save{" "}
        </Button>
      </Grid>
    </Grid>
  );
}
