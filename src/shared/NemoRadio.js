import { FormControlLabel, makeStyles, Radio } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,

    "& .MuiSvgIcon-root:first-child path": {
      fill: "#B9BABA",
    },

    "& .MuiSvgIcon-root": {
      width: 25,
      height: 25,
    }
  },
  alignTop: {
    // alignItems: 'flex-start',
    // marginTop: -9
  }
}));

const NemoRadio = ({
  wrapperClass = "",
  name,
  size = "small",
  label,
  checked,
  onChange,
  disabled,
  value,
  color = "primary",
  labelPlacement = "end",
  alignTop = false,
  ...props
}) => {
  const classes = useStyles();
  return (
    <FormControlLabel
      className={`${classes.root} ${wrapperClass} ${alignTop ? classes.alignTop : ''}`}
      control={
        <Radio
          className={wrapperClass}
          size={size}
          name={name}
          onChange={onChange}
          disabled={disabled}
          label={label}
          value={value}
          color={color}
          {...props}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

export default NemoRadio;
