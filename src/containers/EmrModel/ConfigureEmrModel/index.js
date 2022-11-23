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
import { emrModelState, addAction } from "@slices/emrModelSlice";

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
    width: "80%",
    fontSize: "18px",

    "& .MuiButton-startIcon": {
      position: "absolute",
      left: 24,
    },
    "& .MuiButton-startIcon span": {
      fontSize: "36px",
    },
    marginLeft:'10px',
    marginTop:'10px',
    marginBottom: "40px",
    // position: "fixed",
    // bottom: "20px",
  },
  cancelButton: {
    background: "#C4C4C4",
    borderRadius: "100px",
    height: "47px",
    lineHeight: "1",
    color: "#ffffff",
    border: "unset",
    marginTop:'10px',

    "&:hover": {
      background: "#42DEB4",
      border: "1px solid " + theme.palette.secondary.color,
    },
    width: "80%",
    fontSize: "18px",
    marginLeft:'10px',

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 340,
   
  },
  saveButton: {
    marginTop:'40px'
  }

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
  ]);
  const [actions, setActions] = useState([
    "Create",
    "Search",
    "Retrieve",
    "Update",
    "Delete",
  ]);
  const { resStatus } = useSelector(emrModelState);

  const [mappedCheckbox, setMappedCheckbox] = useState(
    endpoints.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: actions.reduce((acc, cur) => ({ ...acc, [cur]: true }), {}),
      }),
      {}
    )
  );


  const [practice, setPractice] =useState('');
  const [emr, setEmr] =useState('');
  const [name, setName] =useState('');



  const handleChange = (event) => {
    setPractice(event.target.value);
    //setName(practice);
  };
  const handleEmrChange = (event) => {
    setEmr(event.target.value);
    //setName(practice + ' ' +  emr);
    
  };
  const handleName = (event) => {
    setName(event.target.value);
    //setName(practice + ' ' +  emr);
    
  };
  

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
        obj[action.toLowerCase() + "Yn"] = value;
      });
      resourceActivities.push(obj);
    });
    return resourceActivities;
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
    // if (emrName !== "") {
    //   const payload = {
    //     "emrId": 0,
    //     "emrLookups": prepareEmrLookups(),
    //     "emrName": emrName,
    //     "implementer": implementor,
    //     "patients": 0,
    //     "practices": 0,
    //     "resourceActivities": prepareResourceActivities(),
    //   };
    //   dispatch(addAction(payload));
    //   
    //   if (resStatus === "ACTION_SUCCESS" || resStatus === "SUCCESS") {
    //     router.push({
    //       pathname: "/clientManagement",
    //       query: { snack: "success", activeTabIndex: 1 },
    //     });
    //   } else if (resStatus === "ACTION_FAILURE" || resStatus === "FAILURE") {
    //     router.push({
    //       pathname: "/clientManagement",
    //       query: { snack: "fail", activeTabIndex: 1 },
    //     });
    //   }
    //   clearTextFields();
    // }
    router.push({
        pathname: "/clientManagement",
    });

  };

  // const handleCancel =()=>{
  //   router.push({
  //     pathname: "/clientManagement",
  //     query: { snack: "fail", activeTabIndex: 1 },
  //   });
  // }

  return (
    <Grid container>
      <Grid
        container
        className={`${classes.gutterBottomMedium} ${classes.gutterTopMedium}`}
      >
       
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} container direction="row">
            <Grid item xs={1} container alignItems="center">
              <Typography className={classes.subHeader} gutterBottom>
                Practice
              </Typography>
            </Grid>
            <Grid item xs={9}>
                <FormControl variant="filled" className={classes.formControl} margin="dense" style={{ height: 50 }}>
            <Select
              native
              
              onChange={handleChange}
            
            >
              <option value={'Alpha Doctors Group'}>Alpha Doctors Group</option>
              <option value={'Beta Doctors Group'}>Beta Doctors Group</option>
              
              
            </Select>
           
            </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row">
            <Grid item xs={1} container alignItems="center">
              <Typography className={classes.subHeader} gutterBottom>
                EMR Driver
              </Typography>
            </Grid>
            <Grid item xs={9}>
            <FormControl variant="filled" className={classes.formControl} margin="dense" style={{ height: 50 }}>
            <Select
              native
            
              onChange={handleEmrChange}
            
            >
              <option value={'Elation - Direct'}>Elation - Direct</option>
              <option value={'Athena - Direct'}>Athena - Direct</option>
              <option value={'Athena - Intelli'}>Athena - Intelli</option>
              <option value={'EPIC Onprem - PartnersHC'}>EPIC Onprem - PartnersHC</option>
              <option value={'EPIC Cloud'}>EPIC Cloud</option>
              <option value={'OpenEMR - Direct'}>OpenEMR - Direct</option>
              <option value={'CommonwellHA'}>CommonwellHA</option>
              <option value={'Greenway - Direct'}>Greenway - Direct</option>


            </Select>
           
            </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row">
            <Grid item xs={1} container alignItems="center">
              <Typography className={classes.subHeader} gutterBottom>
                EMR Name
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={name?(name):(practice + ' ' +emr)}
                variant="outlined"
                color="primary"
                fullWidth
                size="small"
                onChange={(event) => handleName(event)}
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
          ? parameters.map((parameter) => {
              return (
                <Grid item xs={12}>
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
      <Grid container item xs={6} lg={6}>
        <Button
          variant="outlined"
          color="primary"
          className={classes.cancelButton}
          onClick={handleSaveForm}
        >
          Cancel{" "}
        </Button>
      </Grid>
  
     
      <Grid container item xs={6} lg={6}>
        <Button
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
