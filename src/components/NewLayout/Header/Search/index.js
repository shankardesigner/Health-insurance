import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { InputBase, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    // background: 'red',
    border: '1px solid #B9BABA',
    // backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      // backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    right: '0',
    color: '#939698',
    fontSize: '10px',
  },
  inputRoot: {
    color: '#333333',
  },
  inputInput: {
    padding: theme.spacing(1, 0, 1, 1),
    fontSize: '12px',
    lineHeight: 1,
    height: '39px',
    boxSizing: 'border-box',
    // vertical padding + font size from searchIcon
    paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "290px",
      "&:focus": {
        width: '320px',
      },
    },
  },
}));

const Search = () => {
  const classes = useStyles();

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search Patients or Doctors"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
};

export default Search;
