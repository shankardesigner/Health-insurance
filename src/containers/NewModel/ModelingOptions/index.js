import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ModelResultBox from "../../ModelResultBox";
import BoxWithToggle from "@components/BoxWithToggle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";

import styles from "./modelingoptions.module.css";

import { useState } from "react";

/* redux part */

import { useDispatch } from "react-redux";
import NemoSelect from "src/shared/NemoSelect";
import NemoInput from "src/shared/NemoInput";
import NemoRadio from "src/shared/NemoRadio";
import NemoCheckBox from "src/shared/NemoCheckBox";

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: "5px",
  },
  standardSuccess: {
    backgroundColor: "#D9D9D9",
  },
  addBtn: {
    background: "#42DEB4",
    borderRadius: "100px",
    lineHeight: "1",
    color: "#ffffff",
    border: "unset",
    "&:hover": {
      background: "#42DEB4",
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
  inputStyle: {
    background: "#EFEFF0",
    borderRadius: "7px",
    width: "40px",
  },
  inputBase: {
    padding: "0px",
  },
  alert: {
    border: "1px solid #6F7376",
    boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.1)",
    borderRadius: "3px",
    background: "#FFF",
    fontSize: "12px",
    lineHeight: "14px",
    color: "#6F7376",
    padding: "0 10px",
    position: "relative",

    "& .MuiAlert-action": {
      position: "absolute",
      right: 1,
      top: "-5px",
      width: 11,
      height: 11,
      borderRadius: "50%",
      overflow: "hidden",
      background: "#D83D3D",
      padding: 0,

      // '&:before': {
      //   content: '-',
      //     color: '#FFF',
      //     display: 'block',
      // },

      "& .MuiSvgIcon-root": {
        display: "none",
      },

      "& .MuiIconButton-label": {
        position: "absolute",
        width: 6,
        height: 1,
        borderRadius: 2,
        background: "#FFF",
      },

      "& button": {
        width: "100%",
        height: "100%",
        color: "#FFF",
      },
    },
  },
}));

const CustomRadioLabel = ({ title, subtitle }) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <span className={styles.radioButtonLabelTitle}>{title}</span>
      <span className={styles.radioButtonLabelSubTitle}>{subtitle}</span>
    </Grid>
  );
};

const CustomRadioLabelWithInput = ({
  name,
  title,
  subtitle,
  onChange,
  value,
}) => {
  const classes = useStyles();
  const handleInputChange = (e) => {
    onChange(e);
  };
  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="flex-start"
    >
      <Grid item>
        <span className={styles.radioButtonLabelTitle}>{title}</span>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <NemoInput
              value={value}
              name={name}
              onChange={handleInputChange}
              label={subtitle}
              animated={true}
              fullWidth
              style={{
                marginTop: 8,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default function ModelingOptions() {
  const classes = useStyles();

  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
  });

  const [ibnrValue, setIBNRValue] = useState("12/15");
  const [trendsValue, setTrendsValue] = useState("medical");
  const [checkboxState, setCheckboxState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
    membersOverCheckbox: false,
    membersCostCheckbox: false,
  });

  const [radioInputValues, setRadioInputValues] = useState({
    custom: "",
    medical: "",
    rx: "",
  });

  const [membersOver, setMembersOber] = useState("$100k");

  const handleMembersOverChange = (event) => {
    setMembersOber(event.target.value);
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleIBNRRadioChange = (event) => {
    setIBNRValue(event.target.value);
  };

  const handleTrendsRadioChange = (event) => {
    setTrendsValue(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setCheckboxState({
      ...checkboxState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleAddClick = (event) => {
    
  };

  const handleRemoveAlert = (event) => {
    const button = event.target;
    const alert = button.parentNode.parentNode.parentNode;
    //handle remove member health conditions through api call
    //if success, remove alert
    alert.remove();
  };

  const handleRadioInputChange = (e) => {
    setRadioInputValues({
      ...radioInputValues,
      [e.target.name]: e.target.value,
    });
  };

  const { gilad, jason, antoine, membersOverCheckbox, membersCostCheckbox } =
    checkboxState;
  const { custom, medical, rx } = radioInputValues;

  return (
    <Box p={3}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={4}
      >
        {/* column 1 */}
        <Grid item xs={7} sm={6} md={6}>
          <BoxWithToggle title="Adjust for IBNR" hideToggle>
            <CustomRadioLabelWithInput
              name="custom"
              title="" // if title
              subtitle="% Adjustment"
              value={custom}
              onChange={handleRadioInputChange}
            />
          </BoxWithToggle>
          <BoxWithToggle title="Adjust for Medical Cost Increase" hideToggle>
            <CustomRadioLabelWithInput
              name="custom"
              title="" // if title
              subtitle="% Adjustment"
              value={custom}
              onChange={handleRadioInputChange}
            />
          </BoxWithToggle>
          <BoxWithToggle title="Adjust for Pharmacy Cost Increase" hideToggle>
            <CustomRadioLabelWithInput
              name="custom"
              title="" // if title
              subtitle="% Adjustment"
              value={custom}
              onChange={handleRadioInputChange}
            />
          </BoxWithToggle>
        </Grid>

        {/* column 2 */}
        <Grid item xs={5} sm={6} md={6} className={styles.rightBorder}>
          <BoxWithToggle title="Exclude Outlier Patients" hideToggle>
            <FormControl component="fieldset">
              <FormLabel component="legend">Based on:</FormLabel>
              <FormGroup>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={3}
                >
                  <Grid item>
                    <NemoCheckBox
                      labelPlacement="end"
                      checked={membersOverCheckbox}
                      onChange={handleCheckboxChange}
                      name="membersOverCheckbox"
                      label="Members Over"
                    />
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <NemoSelect
                        id="demo-simple-select-filled"
                        value={membersOver}
                        displayEmpty
                        onChange={handleMembersOverChange}
                      >
                        <MenuItem value="$50k">$50k</MenuItem>
                        <MenuItem value="$75k">$75k</MenuItem>
                        <MenuItem value="$100k">$100k</MenuItem>
                        <MenuItem value="$125k">$125k</MenuItem>
                        <MenuItem value="$150k">$150k</MenuItem>
                        <MenuItem value="$175k">$175k</MenuItem>
                        <MenuItem value="$200k">$200k</MenuItem>
                        <MenuItem value="$225k">$225k</MenuItem>
                        <MenuItem value="$500k">$500k</MenuItem>
                      </NemoSelect>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  <Grid
                    item
                    style={{
                      display: "flex",
                    }}
                  >
                    <NemoCheckBox
                      checked={antoine}
                      onChange={handleCheckboxChange}
                      name="antoine"
                      labelPlacement="end"
                      label="Members with conditions"
                    />
                    <img
                      src="/new/edit.svg"
                      alt="edit"
                      onClick={handleAddClick}
                      style={{
                        marginLeft: 8,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center"
                      spacing={1}
                      style={{
                        paddingLeft: 44
                      }}
                    >
                      <Grid item>
                        <Alert
                          onClose={handleRemoveAlert}
                          color={"success"}
                          icon={false}
                          classes={{
                            root: classes.alert,
                            standardSuccess: classes.standardSuccess,
                          }}
                        >
                          HIV
                        </Alert>
                      </Grid>
                      <Grid item>
                        <Alert
                          onClose={handleRemoveAlert}
                          icon={false}
                          color={"success"}
                          classes={{
                            root: classes.alert,
                            standardSuccess: classes.standardSuccess,
                          }}
                        >
                          Cancer
                        </Alert>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </FormGroup>
            </FormControl>
          </BoxWithToggle>
          <BoxWithToggle title="Adjust by Predicted Risk" hideToggle>
            <CustomRadioLabelWithInput
              name="custom"
              title="" // if title
              subtitle="% Adjustment"
              value={custom}
              onChange={handleRadioInputChange}
            />
          </BoxWithToggle>
        </Grid>
      </Grid>

      <ModelResultBox next="nemo-tab-3" displayButton={false} />
    </Box>
  );
}
