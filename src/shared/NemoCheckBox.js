import { Checkbox, FormControlLabel, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,

    "& .MuiTypography-root": {
      fontSize: "12px",
    lineHeight: 1,
    color: "#333",
    }
  },
}));

const NemoCheckBox = ({
  wrapperClass = "",
  name,
  size = "small",
  label,
  checked,
  onChange,
  disabled,
  value,
  color = "primary",
  labelPlacement = "start",
  ...props
}) => {
  const classes = useStyles();
  return (
    <FormControlLabel
      value="start"
      className={`${classes.root} ${wrapperClass}`}
      control={
        <Checkbox
          className={wrapperClass}
          size={size}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          label={label}
          value={value}
          color={color}
          icon={<img src="/new/unchecked.svg" width={25} height={25}/>}
          checkedIcon={<img src="/new/checked.svg" width={25} height={25}/>}
          {...props}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

export default NemoCheckBox;
