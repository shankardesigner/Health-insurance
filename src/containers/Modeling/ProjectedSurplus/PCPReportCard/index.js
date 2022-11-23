import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { useRouter } from "next/router";
import { useState } from "react";

import PCPTable from "./PCPTable";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
    marginRight: "20px",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "10px",
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
  },
  inputRoot: {
    border: "1px solid #CED5EB",
    boxSizing: "border-box",
    borderRadius: "6px",
  },
  inputInput: {
    height: "34px",
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "25ch",
      "&:focus": {
        width: "25ch",
      },
    },
    [theme.breakpoints.down("sm")]: {
      width: "16ch",
      "&:focus": {
        width: "16ch",
      },
    },
  },
  globalAssumptionButton: {
    background: "rgba(150, 167, 235, 0.1) !important",
    borderRadius: "6px",
    height: "52px",
    lineHeight: "0.8",
    border: "unset",
    [theme.breakpoints.up("sm")]: {
      width: "35ch",
    },

    position: "relative",
    "& .MuiButton-startIcon": {
      position: "absolute",
      left: 24,
    },
  },
  searchRow: {
    marginBottom: "15px",
  },
  newModelButton: {
    background: '#42DEB4',
    borderRadius: '100px',
    height: '47px',
    lineHeight: '1',
    color: '#ffffff',
    border: 'unset',
    '&:hover': {
        background: '#42DEB4',
        border: '1px solid ' + theme.palette.secondary.color
    },
    width: '80%',
    fontSize: '18px',

    "& .MuiButton-startIcon": {
        position: "absolute",
        left: 24
    },
    "& .MuiButton-startIcon span": {
        fontSize: '36px'
    },
    marginTop: '20px',
    position: 'fixed',
    bottom: '80px',
},
  headerActionButton: {
    background: "#42DEB4",
    borderRadius: "100px",
    height: "47px",
    lineHeight: "1",
    color: "#ffffff",
    border: "unset",
    "&:hover": {
      background: "#42DEB4",
      border: "none",
    },
    fontSize: "18px",
  },
  breadcrumbs: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  label: {
    color: "#3D3E64",
    fontWeight: "bold",
  },
}));

const qualityIcon = (
  <Icon>
    <img alt="quality icon" src="/quality-icon-black.svg" />
  </Icon>
);

const addIcon = <Icon>+</Icon>;

const columns = [
  { name: "Model Name", component: "TextComponent", sourceKey: "modelName" },
  { name: "Payor", component: "TextComponent", sourceKey: "clientId" },
  { name: "", component: "TagComponent", sourceKey: "planType" },
  { name: "Lives", component: "PopulationComponent", sourceKey: "lives" },
  {
    name: "Saving PMPM",
    component: "CurrencyComponent",
    sourceKey: "totalSavingsPmpm",
  },
  { name: "Status", component: "StatusComponent", sourceKey: "status" },
  {
    name: "Saving Paid Amount",
    component: "CurrencyComponent",
    sourceKey: "totalSavingsPaidAmount",
    attributes: { decimalCount: 0 },
  },
  { name: "", component: "TextComponent", sourceKey: "ACTION" }, // for edit and results action
];

export default function PCPReportCard() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [checkbox, setCheckbox] = useState({
    payer: false,
    product: false,
    practiceGroup: false,
    pcp: false,
    specialist: false,
    nppa: false,
  });

  const handleCheckboxChange = (event) => {
    setCheckbox({ ...checkbox, [event.target.name]: event.target.checked });
  };

  return (
    <Box p={3}>
      {/* breadcrumb header */}
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        className={classes.searchRow}
      >
        {/* breadcrumb bar */}
      </Grid>

      {/* search header */}
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className={classes.searchRow}
      ></Grid>

      {/* table component */}
      {<PCPTable />}
    </Box>
  );
}
