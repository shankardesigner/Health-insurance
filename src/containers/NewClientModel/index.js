import { Grid, Typography, TextField, Button } from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { addAction } from "@slices/nemoClientSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  newModelButton: {
    background: "#3D3E64",
    borderRadius: "100px",
    height: "35px",
    lineHeight: "1",
    color: "#ffffff",
    border: "unset",
    "&:hover": {
      background: "#3D3E64",
      border: "1px solid " + theme.palette.secondary.color,
    },
    fontSize: "16px",
    textTransform: "capitalize",

    position: "relative",
    "& .MuiButton-startIcon": {
      position: "absolute",
      left: 24,
    },
    "& .MuiButton-startIcon span": {
      fontSize: "36px",
    },
  },
  visualBtn: {
    backgroundColor: "#8A9FC3",
    color: "white",
    "&:hover": {
      background: "#8A9FC3",
    },
  },
  btn: {
    backgroundColor: "white",
    height: 40,
  },
  severityButton: {
    color: "white",
    height: 30,
  },
  highSeverity: {
    backgroundColor: "#FF7676",
  },
  mediumSeverity: {
    backgroundColor: "#FFB800",
  },
  lowSeverity: {
    backgroundColor: "#99DE42",
  },
  container: {
    marginTop: "35px",
    paddingTop: "30px",
    padding: 30
  },
  stickyBar: {
    position: "sticky",
    top: 79,
    backgroundColor: "white",
    zIndex: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  stickyDialogBar: {
    position: "sticky",
    top: 0,
    backgroundColor: "white",

    paddingTop: 0,
  },
  empi: {
    marginTop: "30px",
    fontSize: 20
  },
  margingap: {
    marginTop: "150px",
  },
  left: {
    left: 0,
  },
  right: {
    float: "right",
  },
  sms: {
    right: "0",
  },
  bor: {
    border: "1px solid black",
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    marginTop: 30
  }
}));

export default function NewClientModel() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const [checkBoxState, setCheckBoxState] = useState({
    priorAppointment: false,
    newCreated: false,
    dailyRemainder: false,
    mobilePush: false,
    textSms: false,
    email: false,
    roboTelephone: false,
    manualTelephone: false
  });

  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
  });

  const [selectAutomatically, setSelectAutomatically] = useState(false)

  const [doneButton, setDoneButton] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientType, setClientType] = useState("");

  useEffect(() => {
    if (doneButton) {
      const payload = {
        name: clientName,
        type: clientType,
      };
      dispatch(addAction(payload));
    }
  }, [doneButton]);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleCheckboxChange = (e) => {
    setCheckBoxState({
      ...checkBoxState,
      [e.target.name]: e.target.checked
    })
  }

  const handleDone = () => {
    setDoneButton(true);
    router.push("/clientManagement");
  };
  const handleClientInput = (event) => {
    setClientName(event.target.value);
  };
  const handleClientType = (event) => {
    setClientType(event.target.value);
  };

  return (
    <Grid container item xs={12} className={classes.container}>
      <Grid item xs={12}>
        <Typography>Client Name</Typography>
        <TextField
          size='small'
          fullWidth
          variant="outlined"
          onChange={(event) => handleClientInput(event)}
        ></TextField>
      </Grid>
      <Grid item xs={12} className={classes.empi}>
        <Typography>eMPI Logic</Typography>
        <TextField
          size='small'
          fullWidth
          variant="outlined"
          onChange={(event) => handleClientType(event)}
        ></TextField>
      </Grid>
      <Grid
        container
        xs={12}
        lg={12}
      >
        <Grid
          container
          item
          direction='column'
          xs={6}
          lg={6}
        >
          <Typography className={classes.empi}>
            Appointment Reminder Policy
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkBoxState.priorAppointment}
                onChange={handleCheckboxChange}
                name="priorAppointment"
                color="primary"
              />
            }
            label="Days Prior to appointment"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkBoxState.newCreated}
                onChange={handleCheckboxChange}
                name="newCreated"
                color="primary"
              />
            }
            label="New Created- Get patient Confirmation"
          />
          <FormControlLabel
            className={classes.left}
            control={
              <Checkbox
                checked={checkBoxState.dailyRemainder}
                onChange={handleCheckboxChange}
                name="dailyRemainder"
                color="primary"
              />
            }
            label="Daily reminder"
          />
        </Grid> 
        <Grid
          container
          item
          direction='column'
          xs={6}
          lg={6}
        >
          <div className={classes.titleContainer}>

            <Typography className={classes.empi} style={{marginTop: 0}}>Reminder Media:</Typography>
                  
            <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    checked={selectAutomatically}
                    onChange={(e)=>setSelectAutomatically(e.target.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Select automatically"
              />
          </div>
          
          <FormControlLabel
              labelPlacement="end"
              control={
                <Checkbox
                  checked={checkBoxState.mobilePush}
                  onChange={handleCheckboxChange}
                  name="mobilePush"
                  color="primary"
                />
              }
              label="Mobile App Push Notification"
            />
          <FormControlLabel
              labelPlacement="end"
              control={
                <Checkbox
                  checked={checkBoxState.textSms}
                  onChange={handleCheckboxChange}
                  name="textSms"
                  color="primary"
                />
              }
              label="Text/SMS"
            />
          <FormControlLabel
              labelPlacement="end"
              control={
                <Checkbox
                  checked={checkBoxState.email}
                  onChange={handleCheckboxChange}
                  name="email"
                  color="primary"
                />
              }
              label="Email"
            />
          <FormControlLabel
              labelPlacement="end"
              control={
                <Checkbox
                  checked={checkBoxState.roboTelephone}
                  onChange={handleCheckboxChange}
                  name="roboTelephone"
                  color="primary"
                />
              }
              label="Robo Telephone Remainder"
            />
          <FormControlLabel
              labelPlacement="end"
              control={
                <Checkbox
                  checked={checkBoxState.manualTelephone}
                  onChange={handleCheckboxChange}
                  name="manualTelephone"
                  color="primary"
                />
              }
              label="Manual Telephone Remainder"
            />
        </Grid>
      </Grid>

      <Grid item xs={12} className={classes.margingap}>
        <Button
          className={classes.left}
          style={{
            width: "49%",
            height: "40px",
            background: "#C4C4C4",
            color: "#FFFFFF",
            borderRadius: "100px",
          }}
          onClick={() => handleDone()}
        >
          Cancel
        </Button>
        <Button
          className={classes.right}
          style={{
            width: "49%",
            height: "40px",
            background: "#42DEB4",
            color: "#FFFFFF",
            borderRadius: "100px",
          }}
          onClick={() => handleDone()}
        >
          Done
        </Button>
      </Grid>
    </Grid>
  );
}
