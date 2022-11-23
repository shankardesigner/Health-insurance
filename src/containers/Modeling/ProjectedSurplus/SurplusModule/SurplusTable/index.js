import { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import withWidth from "@material-ui/core/withWidth";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Router, { useRouter } from "next/router";
import { NumberComponent, CurrencyComponent } from "@components/FormatNumber";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import FilterListIcon from "@material-ui/icons/FilterList";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import InfoIcon from "@material-ui/icons/Info";
import { Divider, IconButton } from "@material-ui/core";
import SearchBoxAuto from "@components/SearchBoxAuto";
import FormHelperText from "@material-ui/core/FormHelperText";
import CloseIcon from "@material-ui/icons/Close";

//

import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgressBar from "@components/LinearProgressBar";
import commons from "@constants/common";
const { REQUEST, SUCCESS, PENDING, FAILURE, ACTION_SUCCESS, ACTION_FAILURE } =
  commons;

import { useSelector, useDispatch } from "react-redux";
import CustomizableTableComponent from "@components/CustomizableTableComponent";
import ServiceCategoryTable from "./ServiceCategoryTable";
import ModelResultBox from "@containers/ModelResultBox";

const TableCell = withStyles({
  root: {
    borderBottom: "none",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "17px",
    color: "#3D3E64",
    align: "center !important",
    borderRight: "1px solid #EFEFF0",
    verticalAlign: "center",
  },
})(MuiTableCell);

const TableCellInput = withStyles({
  root: {
    minWidth: "100px",
    borderBottom: "none",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#3D3E64",
    padding: "15px !important",
    lineHeight: "unset",
    borderRight: "1px solid #EFEFF0",
  },
})(MuiTableCell);

const SurplusTextField = withStyles((theme) => ({
  root: {
    "& label.Mui-focused": {
      color: theme.palette.primary.main,
    },
    "& input.MuiInputBase-input": {
      padding: "7.5px 14px",
      textAlign: "center",
    },
  },
}))(TextField);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    width: "100%",
  },
  inputStyle: {
    background: "#EFEFF0",
    borderRadius: "7px",
  },
  darkBackground: {
    background: "#EFEFF0",
  },
  mutedBtn: {
    background: "#EFEFF0",
    color: "#3D3E64",
    fontSize: 14,
    fontWeight: "bold",
    margin: "0px 5px",
    borderRadius: 5,
  },
  fullWidth: {
    width: "100%",
  },
  dialogTitle: {
    color: "#3D3E64",
    fontWeight: "bold",
    borderBottom: "3px solid #3D3E64",
    padding: 10,
    fontSize: 20,
    marginBottom: 10,
  },
  saveBtn: {
    borderRadius: 20,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  filterBtn: {
    backgroundColor: "#3D3E64",
    borderRadius: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    padding: "2px 7px",
    margin: "0px 2px",
  },
  gutterBottom: {
    marginBottom: 10,
  },
  mutedDropdown: {
    backgroundColor: "#EFEFF0 !important",
    borderRadius: 5,
  },
  upRotate: {
    transform: "rotate(-90deg)",
    color: "#42DEB4",
  },
  downRotate: {
    transform: "rotate(90deg)",
    color: "#FF7676",
  },
  info: {
    color: "rgba(61, 62, 100, 0.5)",
  },
  tableHeaderTitle: {
    fontWeight: "bold !important",
  },
  tableRowBorder: {
    borderBottom: "1px solid #EFEFF0",
  },
  boldGreenText: {
    color: "#42DEB4 !important",
    fontWeight: "bold",
    fontSize: 16,
  },
  noBorder: {
    border: "none !important",
  },
  totalBox: {
    background: "#EFEFF0",
    margin: 20,
    border: "1px solid #EFEFF0",
    borderRadius: 20,
  },
  addBtn: {
    width: "30px !important",
    borderRadius: 20,
  },
}));

export default function SurplusTable(props) {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [serviceCategoriesModalOpen, setServiceCategoriesModalOpen] =
    useState(false);
  const [qualityMetricsModalOpen, setQualityMetricsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [tempFilters, setTempFilters] = useState({});
  const [dateRange, setDateRange] = useState("Last Quarter");
  const [serviceCategories, setServiceCategories] = useState([
    "Inpatient Facility",
    "Outpatient Facility",
    "Avoidable ER",
    "Urgent Care",
    "Professional",
  ]);
  const [newServiceCategory, setNewServiceCategory] = useState(null);

  const [qualityMetrics, setQualityMetrics] = useState([
    "Cancer Screening",
    "Wellness Visits",
    "Preventative Maintainence",
    "Vaccination",
    "Chronic Care Coordination",
  ]);
  const [newQualityMetric, setNewQualityMetric] = useState(null);

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleAddServiceCategory = () => {
    if (newServiceCategory != null)
      setServiceCategories([...serviceCategories, newServiceCategory]);
  };

  const handleAddQualityMetric = () => {
    if (newQualityMetric != null)
      setQualityMetrics([...qualityMetrics, newQualityMetric]);
  };

  const handleDeleteServiceCategory = (deleteServiceCategory) => {
    setServiceCategories(
      serviceCategories.filter(
        (serviceCategory) => serviceCategory !== deleteServiceCategory
      )
    );
  };

  const handleDeleteQualityMetric = (deleteQualityMetric) => {
    setQualityMetrics(
      qualityMetrics.filter(
        (qualityMetric) => qualityMetric !== deleteQualityMetric
      )
    );
  };

  const allColumns = [
    { header: "", subHeader: [{ name: "" }] },
    {
      header: "",
      subHeader: [{ name: "Impact on Comp" }],
    },
    {
      header: "",
      subHeader: [{ name: "Actual Comp" }],
    },
    {
      header: "Rating (vs IPA)",
      subHeader: [{ name: "This Doc" }, { name: "Practice" }],
    },
  ];

  const serviceTableColumns = [
    { header: "", subHeader: [{ name: "" }] },
    {
      header: "",
      subHeader: [{ name: "" }],
    },
    {
      header: "Rating (vs IPA)",
      subHeader: [{ name: "This Doc" }, { name: "Practice" }, { name: "IPA" }],
    },
  ];

  const qualityTableColumns = [
    { header: "", subHeader: [{ name: "" }] },
    {
      header: "",
      subHeader: [{ name: "" }],
    },
    {
      header: "Compliance Rate",
      subHeader: [{ name: "This Doc" }, { name: "Practice" }, { name: "IPA" }],
    },
  ];

  const tableData = [
    [
      { header: "PCP", subHeader: [{ name: "", value: "Dr. John Smith" }] },
      {
        header: "Summary",
        subHeader: [
          { name: "Total Encounters", value: "200" },
          { name: "Response Rate", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Patient Favourable Response",
        subHeader: [
          { name: "Telemed", value: "85", oldValue: "90" },
          { name: "In-person", value: "85", oldValue: "90" },
          { name: "Messages", value: "92", oldValue: "80" },
        ],
      },
      {
        header: "Peer Favourable Response",
        subHeader: [{ name: "", value: "85", oldValue: "85" }],
      },
      {
        header: "Panel Size",
        subHeader: [{ name: "", value: "80", oldValue: "90" }],
      },
      {
        header: "Engaged Members",
        subHeader: [
          { name: "Count", value: "200", oldValue: "180" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Non-Responding Patient",
        subHeader: [
          { name: "Count", value: "200", oldValue: "210" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Non-Responding Doctor",
        subHeader: [
          { name: "Total", value: "200", oldValue: "210" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Referral Rate",
        subHeader: [
          { name: "Count", value: "200", oldValue: "180" },
          { name: "By Speciality >", value: "90", oldValue: "95" },
        ],
      },
      {
        header: "Curbsiding Rates",
        subHeader: [
          { name: "Count", value: "200", oldValue: "210" },
          { name: "By Speciality >", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Good Citizenship Metric",
        subHeader: [{ name: "", value: "90", oldValue: "85" }],
      },
      {
        header: "Participation Metric",
        subHeader: [{ name: "", value: "90", oldValue: "85" }],
      },
    ],
    [
      { header: "PCP", subHeader: [{ name: "", value: "Dr. Peter Smith" }] },
      {
        header: "Summary",
        subHeader: [
          { name: "Total Encounters", value: "300" },
          { name: "Response Rate", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Patient Favourable Response",
        subHeader: [
          { name: "Telemed", value: "85", oldValue: "90" },
          { name: "In-person", value: "85", oldValue: "90" },
          { name: "Messages", value: "92", oldValue: "80" },
        ],
      },
      {
        header: "Peer Favourable Response",
        subHeader: [{ name: "", value: "85", oldValue: "85" }],
      },
      {
        header: "Panel Size",
        subHeader: [{ name: "", value: "80", oldValue: "90" }],
      },
      {
        header: "Engaged Members",
        subHeader: [
          { name: "Count", value: "200", oldValue: "180" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Non-Responding Patient",
        subHeader: [
          { name: "Count", value: "200", oldValue: "210" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Non-Responding Doctor",
        subHeader: [
          { name: "Total", value: "200", oldValue: "210" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Referral Rate",
        subHeader: [
          { name: "Count", value: "200", oldValue: "180" },
          { name: "By Speciality >", value: "90", oldValue: "95" },
        ],
      },
      {
        header: "Curbsiding Rates",
        subHeader: [
          { name: "Count", value: "200", oldValue: "210" },
          { name: "By Speciality >", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Good Citizenship Metric",
        subHeader: [{ name: "", value: "90", oldValue: "85" }],
      },
      {
        header: "Participation Metric",
        subHeader: [{ name: "", value: "90", oldValue: "85" }],
      },
    ],
    [
      { header: "PCP", subHeader: [{ name: "", value: "Dr. Eric Mountain" }] },
      {
        header: "Summary",
        subHeader: [
          { name: "Total Encounters", value: "200" },
          { name: "Response Rate", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Patient Favourable Response",
        subHeader: [
          { name: "Telemed", value: "85", oldValue: "90" },
          { name: "In-person", value: "85", oldValue: "90" },
          { name: "Messages", value: "92", oldValue: "80" },
        ],
      },
      {
        header: "Peer Favourable Response",
        subHeader: [{ name: "", value: "85", oldValue: "85" }],
      },
      {
        header: "Panel Size",
        subHeader: [{ name: "", value: "80", oldValue: "90" }],
      },
      {
        header: "Engaged Members",
        subHeader: [
          { name: "Count", value: "200", oldValue: "180" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Non-Responding Patient",
        subHeader: [
          { name: "Count", value: "200", oldValue: "210" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Non-Responding Doctor",
        subHeader: [
          { name: "Total", value: "200", oldValue: "210" },
          { name: "% of members", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Referral Rate",
        subHeader: [
          { name: "Count", value: "200", oldValue: "180" },
          { name: "By Speciality >", value: "90", oldValue: "95" },
        ],
      },
      {
        header: "Curbsiding Rates",
        subHeader: [
          { name: "Count", value: "200", oldValue: "210" },
          { name: "By Speciality >", value: "90", oldValue: "85" },
        ],
      },
      {
        header: "Good Citizenship Metric",
        subHeader: [{ name: "", value: "90", oldValue: "85" }],
      },
      {
        header: "Participation Metric",
        subHeader: [{ name: "", value: "90", oldValue: "85" }],
      },
    ],
  ];

  const handleServiceCategoriesModalClose = () => {
    setServiceCategoriesModalOpen(false);
  };
  const handleQualityMetricsModalClose = () => {
    setQualityMetricsModalOpen(false);
  };
  const renderServiceTableBody = () => {
    return (
      <TableBody>
        {serviceCategories &&
          serviceCategories.map((serviceCategory, index) => {
            return (
              <TableRow key={index}>
                <TableCell className={classes.tableHeaderTitle}>
                  {serviceCategory}
                </TableCell>
                <TableCellInput align="center">
                  <SurplusTextField
                    defaultValue={20 + "%"}
                    type="percent"
                    variant="outlined"
                    InputProps={{ "aria-label": "description" }}
                    classes={{ root: clsx(classes.inputStyle) }}
                  />
                </TableCellInput>
                <TableCell align="center" className={classes.boldGreenText}>
                  $53000
                </TableCell>
                <TableCell align="center">80% tile</TableCell>
                <TableCell align="center">75% tile</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleDeleteServiceCategory(serviceCategory)}
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    );
  };
  const renderQualityTableBody = () => {
    return (
      <TableBody>
        {qualityMetrics &&
          qualityMetrics.map((qualityMetric, index) => {
            return (
              <TableRow key={index}>
                <TableCell className={classes.tableHeaderTitle}>
                  {qualityMetric}
                </TableCell>
                <TableCellInput align="center">
                  <SurplusTextField
                    defaultValue={20 + "%"}
                    type="percent"
                    variant="outlined"
                    InputProps={{ "aria-label": "description" }}
                    classes={{ root: clsx(classes.inputStyle) }}
                  />
                </TableCellInput>
                <TableCell align="center" className={classes.boldGreenText}>
                  $53000
                </TableCell>
                <TableCell align="center">80% tile</TableCell>
                <TableCell align="center">75% tile</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleDeleteQualityMetric(qualityMetric)}
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    );
  };

  const renderTableBody = (data, selectedColumns) => {
    return (
      <TableBody>
        <TableRow className={classes.tableRowBorder}>
          <TableCell className={classes.tableHeaderTitle}>
            Patient Satisfaction
          </TableCell>
          <TableCellInput align="center">
            <SurplusTextField
              defaultValue={20 + "%"}
              type="percent"
              variant="outlined"
              InputProps={{ "aria-label": "description" }}
              classes={{ root: clsx(classes.inputStyle) }}
            />
          </TableCellInput>
          <TableCell align="center" className={classes.boldGreenText}>
            $53000
          </TableCell>
          <TableCell align="center">80% tile</TableCell>
          <TableCell align="center">75% tile</TableCell>

          <TableCell align="right" style={{ display: "flex" }}></TableCell>
        </TableRow>
        <TableRow className={classes.tableRowBorder}>
          <TableCell className={classes.tableHeaderTitle}>
            Peer Satisfaction
          </TableCell>
          <TableCellInput align="center">
            <SurplusTextField
              defaultValue={20 + "%"}
              type="percent"
              variant="outlined"
              InputProps={{ "aria-label": "description" }}
              classes={{ root: clsx(classes.inputStyle) }}
            />
          </TableCellInput>
          <TableCell align="center" className={classes.boldGreenText}>
            $53000
          </TableCell>
          <TableCell align="center">80% tile</TableCell>
          <TableCell align="center">75% tile</TableCell>

          <TableCell align="right" style={{ display: "flex" }}></TableCell>
        </TableRow>
        <TableRow className={classes.tableRowBorder}>
          <TableCell className={classes.tableHeaderTitle}>
            PMPM Individual*
          </TableCell>
          <TableCellInput align="center">
            <SurplusTextField
              defaultValue={20 + "%"}
              type="percent"
              variant="outlined"
              InputProps={{ "aria-label": "description" }}
              classes={{ root: clsx(classes.inputStyle) }}
            />
          </TableCellInput>
          <TableCell align="center" className={classes.boldGreenText}>
            $53000
          </TableCell>
          <TableCell align="center">80% tile</TableCell>
          <TableCell align="center">75% tile</TableCell>

          <TableCell align="right" style={{ display: "flex" }}>
            <Button
              variant="contained"
              className={classes.mutedBtn}
              disableElevation
              onClick={() => setServiceCategoriesModalOpen(true)}
            >
              Components
            </Button>
          </TableCell>
        </TableRow>
        <Dialog
          fullWidth
          maxWidth="md"
          open={serviceCategoriesModalOpen}
          onClose={handleServiceCategoriesModalClose}
          aria-labelledby="service-categories-dialog"
        >
          <Typography className={classes.dialogTitle}>
            Service Categories
          </Typography>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomizableTableComponent
                  allColumns={serviceTableColumns}
                  renderTableBody={renderServiceTableBody}
                />
              </Grid>
              <Grid item xs={6} container>
                <TextField
                  id="outlined-basic"
                  label="Search Service Category"
                  variant="outlined"
                  fullWidth
                  onChange={(event) =>
                    setNewServiceCategory(event.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6} container>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.addBtn}
                  onClick={() => handleAddServiceCategory()}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Grid item md={12}>
                <Grid
                  container
                  justifyContent="flex-start"
                  alignItems="center"
                  direction="row"
                  spacing={1}
                ></Grid>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              className={classes.saveBtn}
              onClick={() => {
                setServiceCategoriesModalOpen(false);
              }}
            >
              {" "}
              Save
            </Button>
          </DialogContent>
        </Dialog>

        <TableRow className={classes.tableRowBorder}>
          <TableCell className={classes.tableHeaderTitle}>PMPM Group</TableCell>
          <TableCellInput align="center">
            <SurplusTextField
              defaultValue={20 + "%"}
              type="percent"
              variant="outlined"
              InputProps={{ "aria-label": "description" }}
              classes={{ root: clsx(classes.inputStyle) }}
            />
          </TableCellInput>
          <TableCell align="center" className={classes.boldGreenText}>
            $53000
          </TableCell>
          <TableCell align="center">80% tile</TableCell>
          <TableCell align="center">75% tile</TableCell>

          <TableCell align="right" style={{ display: "flex" }}></TableCell>
        </TableRow>
        <TableRow className={classes.tableRowBorder}>
          <TableCell className={classes.tableHeaderTitle}>
            Quality Score for Individual PCP
          </TableCell>
          <TableCellInput align="center">
            <SurplusTextField
              defaultValue={20 + "%"}
              type="percent"
              variant="outlined"
              InputProps={{ "aria-label": "description" }}
              classes={{ root: clsx(classes.inputStyle) }}
            />
          </TableCellInput>
          <TableCell align="center" className={classes.boldGreenText}>
            $53000
          </TableCell>
          <TableCell align="center">80% tile</TableCell>
          <TableCell align="center">75% tile</TableCell>

          <TableCell align="right" style={{ display: "flex" }}>
            <Button
              variant="contained"
              className={classes.mutedBtn}
              disableElevation
              onClick={() => setQualityMetricsModalOpen(true)}
            >
              Components
            </Button>
          </TableCell>
        </TableRow>
        <TableRow className={classes.tableRowBorder}>
          <TableCell className={classes.tableHeaderTitle}>
            Actual Surplus Compensation
          </TableCell>

          <TableCell align="center" className={classes.boldGreenText}>
            $265,000
          </TableCell>
        </TableRow>
        <Dialog
          fullWidth
          maxWidth="md"
          open={qualityMetricsModalOpen}
          onClose={handleQualityMetricsModalClose}
          aria-labelledby="service-categories-dialog"
        >
          <Typography className={classes.dialogTitle}>
            Quality Metrics
          </Typography>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomizableTableComponent
                  allColumns={qualityTableColumns}
                  renderTableBody={renderQualityTableBody}
                />
              </Grid>
              <Grid item xs={6} container>
                <TextField
                  id="outlined-basic"
                  label="Search Service Category"
                  variant="outlined"
                  fullWidth
                  onChange={(event) => setNewQualityMetric(event.target.value)}
                />
              </Grid>
              <Grid item xs={6} container>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.addBtn}
                  onClick={() => handleAddQualityMetric()}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              className={classes.saveBtn}
              onClick={() => {
                setServiceCategoriesModalOpen(false);
              }}
            >
              {" "}
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </TableBody>
    );
  };

  if (false) {
    return <LinearProgressBar />;
  } else if (true) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <CustomizableTableComponent
            allColumns={allColumns}
            data={tableData}
            renderTableBody={renderTableBody}
          />
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <Grid item xs={4} className={classes.totalBox}>
            <TableContainer>
              <Table>
                <TableRow>
                  <TableCell
                    align="center"
                    className={`${classes.tableHeaderTitle} ${classes.noBorder}`}
                  >
                    Base Compensation
                  </TableCell>
                  <TableCell
                    align="center"
                    className={`${classes.noBorder} ${classes.boldGreenText}`}
                  >
                    $332,000
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="center"
                    className={`${classes.tableHeaderTitle} ${classes.noBorder}`}
                  >
                    Surplus
                  </TableCell>

                  <TableCell
                    align="center"
                    className={`${classes.noBorder} ${classes.boldGreenText}`}
                  >
                    $265,000
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    align="center"
                    className={`${classes.tableHeaderTitle} ${classes.noBorder}`}
                  >
                    Total Compensation
                  </TableCell>
                  <TableCell
                    align="center"
                    className={`${classes.noBorder} ${classes.boldGreenText}`}
                  >
                    $597,000
                  </TableCell>
                </TableRow>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          className={classes.saveBtn}
        >
          Save
        </Button>
        <FormHelperText id="my-helper-text">
          *Risk adjusted and factoring for outliers
        </FormHelperText>
      </Grid>
    );
  }
}
