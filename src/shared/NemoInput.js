import { makeStyles, TextField, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  inputFrame: {
    background: "#FFF",
    boxSizing: "border-box",
    color: "#B9BABA",

    "& .MuiInputBase-root": {
      border: "1px solid #B9BABA",
      borderRadius: "3px",
    },

    "& .MuiInputBase-input": {
      padding: "10px",
      height: "30px",
      boxSizing: "border-box",
      fontSize: "14px !important",
      lineHeight: 1,
      minWidth: "130px",
    },

    "& .MuiInput-formControl": {
      marginTop: 0,
    },

    "& .MuiInputLabel-formControl": {
      left: 10,
      background: "#FFF",
      transform: `translate(0, 9px) scale(1)`,
      padding: "0px 2px",

      '&.Mui-focused': {
        transform: 'translate(0, -5px) scale(0.75)'
      }
    }
  },
  formGroup: {
    marginBottom: "10px",
  },
}));

const NemoInput = ({
  id,
  placeholder,
  value,
  onChange,
  wrapperClass,
  name,
  fullWidth = false,
  label = "",
  disabled = false,
  animated = false,
  ...props
}) => {
  const classes = useStyles();
  if (!label)
    return (
      <TextField
        id={id}
        name={name}
        InputProps={{
          "aria-label": placeholder,
          disableUnderline: true,
        }}
        classes={{ root: classes.inputFrame }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth={fullWidth}
        disabled={disabled}
        {...props}
      />
    );
  return (
    <div className={classes.formGroup}>
      {!animated && (
        <Typography variant="h4" gutterBottom>
          {label}
        </Typography>
      )}
      <TextField
        id={id}
        name={name}
        InputProps={{
          "aria-label": placeholder,
          disableUnderline: true,
        }}
        label={animated ? label : ""}
        classes={{ root: classes.inputFrame }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        fullWidth={fullWidth}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export default NemoInput;
