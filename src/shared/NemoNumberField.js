import Grid from "@material-ui/core/Grid";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  inputStyle: {
    background: "#FFF",
    borderRadius: "3px",
    border: 0,
    width: "110px",
    padding: `2px 30px`,
    position: "relative",
    display: "block",
    "& .MuiInputBase-input, & .MuiInput-root": {
      textAlign: "center",
      position: "static",
      fontSize: "14px",
      fontWeight: "400",
    },

    "& input": {
      textOverflow: "ellipsis",
    },
  },
  icon: {
    color: "#fff",
  },
  inputWrapper: {
    paddingTop: "5px",
  },
  iconButton: {
    padding: 0,
    "&:hover, &.MuiButtonBase-root": {
      backgroundColor: "#42DEB4",
      width: "27px",
      height: "35px",
    },
  },
  iconButtonLeft: {
    // display: 'none !important',
    position: "absolute",
    right: 0,
    top: 3,
    "& div": {
      borderColor: "#64B6F5 !important",
    },
  },
  iconButtonRight: {
    position: "absolute",
    right: "auto",
    top: 3,
    left: 0,
    "& div": {
      borderColor: "#64B6F5 !important",
    },
  },
  // gridContainer: {
  //     width: 'auto !important'
  // }
}));

const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0;
};

const NemoNumberField = ({
  value,
  id,
  callback,
  start,
  type = "integer",
  factor = 1,
  allowNegative,
  defaultValue,
  disabled = false,
  max = Infinity,
  min = -Infinity,
}) => {
  const classes = useStyles();
  let startAt = start;
  if (!start) {
    startAt = 0;
  }
  /* convert into two decimal number if it is decimal */
  let twoDecimalValue = value;
  if (isFloat(Number(value)) && value !== "") {
    twoDecimalValue = parseFloat(Number(twoDecimalValue).toFixed(2));
  }
  const [inputValue, setInputValue] = useState(twoDecimalValue);

  useEffect(() => {
    if (disabled) {
      setInputValue(defaultValue);
    }
  }, [disabled]);


  const getTwoDecimal = (value) => {
    const decimalCount = type == "integer" ? 0 : 2;
    return parseFloat(Number(value).toFixed(decimalCount));
  };

  const handleClickIncrease = (e) => {
    let tempValue = inputValue;
    if (tempValue >= max) {
      toast.info(`Factors cannot be greater than ${max}`);
      return;
    }
    // if (inputValue == "") {
    //   tempValue = startAt - factor;
    // }
    tempValue = parseFloat(tempValue) + factor;
    tempValue = getTwoDecimal(tempValue);
    setInputValue(tempValue);
    callback(tempValue, id);
  };

  const handleClickDecrease = (e) => {
    let tempValue = inputValue;
    if (tempValue <= min) {
      toast.info(`Factors cannot be less than ${min}`);
      return;
    }

    if (!allowNegative) {
      if (inputValue < 0 || inputValue == "") {
        tempValue = startAt + factor;
      }
    }

    tempValue = Number(tempValue - factor);
    if (!allowNegative) {
      if (tempValue < 0) {
        tempValue = startAt;
      }
    }
    tempValue = getTwoDecimal(tempValue);
    setInputValue(tempValue);
    callback(tempValue, id);
  };

  // Needs to work here...
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    if(isNaN(newValue)) {
      toast.info(`Factors should not contain any word or string`);
      setInputValue(newValue);
      return;
    }
    if(e.target.value.includes(".") && e.target.value.split(".")[1].length > 1 ) {
      toast.info(`Factor can't have more than 1 digits after decimal`);
      setInputValue(newValue);
      callback(newValue, id);
      return;
    }

    if (newValue >= max) {
      toast.info(`Factors cannot be greater than ${max}`);
      setInputValue(newValue);
      callback(newValue, id);
      return;
    }

    if (newValue <= min) {
      toast.info(`Factors cannot be less than ${min}`);
      setInputValue(newValue);
      callback(newValue, id);
      return;
    }

    setInputValue(newValue);
    callback(newValue, id);

    return;

    if (newValue > max || newValue < min || (e.target.value.includes(".") && e.target.value.split(".")[1].length > 1 )) {
      toast.info(`Invalid value`);
      return;
    }

    if (isNaN(newValue)) return;
    if (type === "decimal") {
      setInputValue(e.target.value !== "" ? e.target.value.replace(/^0+/, '') : 0);
    } else {
      setInputValue(newValue);
    }
    callback(newValue, id);
  };

  // useEffect(() => {
  //   setInputValue(twoDecimalValue);
  // }, [twoDecimalValue]);

  // useEffect(() => {
  //   callback(inputValue, id);
  // }, [inputValue]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1}
      className={classes.gridContainer}
    >
      <Grid item xs={12} container justifyContent="center">
        <div className={classes.inputWrapper}>
          <TextField
            value={inputValue}
            name={"diagId" + id}
            type={type === "decimal" ? "text" : "tel"}
            disabled={disabled}
            onChange={(e) => handleInputChange(e)}
            InputProps={{
              "aria-label": "description",
              disableUnderline: true,
              endAdornment: (
                <IconButton
                  className={classes.iconButtonLeft}
                  size="small"
                  color="secondary"
                  aria-label="increase"
                  disabled={disabled}
                  onClick={(e) => handleClickIncrease(e)}
                >
                  <img src="/new/plus.svg" width={25} height={25} />
                </IconButton>
              ),
              startAdornment: (
                <IconButton
                  className={classes.iconButtonRight}
                  size="small"
                  color="primary"
                  aria-label="decrease"
                  disabled={disabled}
                  onClick={(e) => handleClickDecrease(e)}
                >
                  <img src="/new/minus.svg" width={25} height={25} />
                </IconButton>
              ),
            }}
            classes={{ root: clsx(classes.inputStyle) }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default NemoNumberField;
