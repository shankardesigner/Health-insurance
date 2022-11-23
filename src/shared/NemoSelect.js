import { FormControl, MenuItem, Select, makeStyles } from "@material-ui/core";
import React from "react";
import NemoArrow from "./NemoArrow";

const useClasses = makeStyles((theme) => ({
  inputStyle: {
    background: "#FFFFFF",
    border: "1px solid #B9BABA",
    boxSizing: "border-box",
    borderRadius: "3px",
    margin: 0,

    "& .MuiInputBase-input": {
      padding: "0 10px",
      boxSizing: "border-box",
      color: "#B9BABA",
      fontSize: "14px !important",
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      minHeight: "34px",
      minWidth: "130px",
    },
  },
  iconStyle: {
    position: "absolute",
    right: "13px",
  },
  disabled: {
    opacity: 0.5
  }
}));

const NemoSelect = ({
  fullWidth = false,
  disabled = false,
  id,
  name,
  value,
  onChange,
  displayEmpty = true,
  disableUnderline = true,
  placeholder = "",
  options = {},
  children,
  ...props
}) => {
  const classes = useClasses();
  if (!options) return null;

  return (
    <FormControl
      fullWidth
      disabled={ disabled || !options}
      classes={{ root: classes.inputStyle }}
      className={(disabled || !options) ? classes.disabled : ''}
    >
      <Select
        labelId={id}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        displayEmpty
        disableUnderline
        classes={{ root: classes.selectStyle }}
        placeholder={placeholder}
        renderValue={value !== "" ? undefined : () => <>{placeholder}</>}
        IconComponent={() => <NemoArrow className={classes.iconStyle} />}
        {...props}
      >
        {children && children}
        {!children &&
          options &&
          options.map((opt, index) => {
            return (
              <MenuItem value={opt.id} key={index}>
                {opt.name}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};

export default NemoSelect;
