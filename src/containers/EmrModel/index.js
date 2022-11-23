import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";

import TableComponent from "@components/TableComponent";
import ConfirmDialog from "@components/ConfirmDialog";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import commons from "@constants/common";
const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

/* redux part */

import {
  listAction as listEMRData,
  emrModelState,
  deleteAction as deleteEMRData,
} from "@slices/emrModelSlice";

import { setTabStateAction } from "@slices/tabModelSlice";
import { saveUsedNemoFactorAction } from "@slices/nemoFactorSlice";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

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
}));

const addIcon = <Icon>+</Icon>;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const columns = [
  {
    name: "EMR",
    component: "TextComponent",
    sourceKey: "emrName",
    align: "left",
  },
  {
    name: "Type",
    component: "TextComponent",
    sourceKey: "implementer",
    align: "left",
  },
  {
    name: "Practices",
    component: "TextComponent",
    sourceKey: "practices",
    align: "left",
  },
  {
    name: "Patients",
    component: "TextComponent",
    sourceKey: "patients",
    align: "left",
  },
  { name: "", component: "TextComponent", sourceKey: "ACTION" }, // for edit and results action
];

export default function NemoEmrModel() {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [EMRselected, setEMRSelected] = useState(null);
  const [successSnackOpen, setSuccessSnackOpen] = useState(false);
  const [failSnackOpen, setFailSnackOpen] = useState(false);
  const { emrModelList, resStatus } = useSelector(emrModelState);
  const [searchParam, setSearchParam] = useState(null);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessSnackOpen(false);
    setFailSnackOpen(false);
  };

  useEffect(() => {
    if (router.query.snack) {
      if (router.query.snack === "success") {
        setSuccessSnackOpen(true);
      } else if (router.query.snack === "fail") {
        setFailSnackOpen(true);
      }
      router.replace("/clientManagement");
    }
  }, []);

  useEffect(() => {
    dispatch(listEMRData());
  }, []);

  useEffect(() => {
    const payload = {
      "searchParam": searchParam,
    };
    dispatch(listEMRData(payload));
  }, [searchParam]);

  const handleNewClientModelClick = (e) => {
    router.push("/clientManagement/newEmr");
  };

  const handleDelete = (selectedEMR) => {
    setOpenDialog(true);
    setEMRSelected(selectedEMR);
  };

  const handleDeleteAction = () => {
    dispatch(deleteEMRData(EMRselected.emrId));
    setOpenDialog(false);
  };

  const handleEdit = () => {
    
  };

  const handleConfigure = (selectedEmr) => {
    router.push("/clientManagement/emr/" + selectedEmr.emrId);
  };

  const actions = [
    {
      name: "Configure",
      component: "CallbackComponent",
      attributes: { "callback": handleConfigure },
    },
    {
      name: "Export",
      icon: "/export-icon.svg",
      component: "CallbackComponent",
    },
    {
      name: "Edit",
      icon: "/edit-icon.svg",
      component: "CallbackComponent",
      attributes: { "callback": handleEdit },
    },
    {
      name: "Delete",
      icon: "/delete-icon.svg",
      component: "CallbackComponent",
      attributes: { "callback": handleDelete },
    },
  ];
  const modelList = emrModelList.map((model) => ({ ...model }));

  return (
    <Box p={3}>
      {/* search header */}
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        className={classes.searchRow}
      >
        {/* search bar */}
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setSearchParam(e.target.value)}
          />
        </div>
      </Grid>

      {/* table component */}
      {
        <TableComponent
          headers={columns}
          data={modelList}
          actions={actions}
          key={1}
        />
      }
      {/* new model button */}
      {resStatus !== "PENDING" && (
        <Button
          variant="outlined"
          color="primary"
          className={classes.newModelButton}
          startIcon={addIcon}
          onClick={(e) => handleNewClientModelClick(e)}
          style={{
            bottom: '80px',
            width: '82%',
        }}
        >
          New EMR
        </Button>
      )}
      <ConfirmDialog
        handleConfirm={handleDeleteAction}
        close={() => setOpenDialog(false)}
        title="Delete Confirmation"
        subtitle="Do you want to delete this model?"
        open={openDialog}
      />
      <Snackbar
        open={successSnackOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity="success">
          New EMR Saved Successfully !!!
        </Alert>
      </Snackbar>
      <Snackbar
        open={failSnackOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity="error">
          Some Error Occured. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
}
