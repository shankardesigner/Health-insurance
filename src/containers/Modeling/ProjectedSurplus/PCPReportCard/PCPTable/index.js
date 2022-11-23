import { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
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
import { IconButton } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import NemoIcon from "@components/NewLayout/NemoIcon";
//

import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgressBar from "@components/LinearProgressBar";
import commons from "@constants/common";
const { REQUEST, SUCCESS, PENDING, FAILURE, ACTION_SUCCESS, ACTION_FAILURE } =
  commons;

import { useSelector, useDispatch } from "react-redux";
import CustomizableTableComponent from "@components/CustomizableTableComponent";
import Filter from "./Filter";
import { MicNone } from "@material-ui/icons";

const TableCell = withStyles((theme) => ({
  root: {
    borderBottom: "none",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "17px",
    color: theme.palette.common.black,
    align: "center !important",
    // borderRight: "1px solid #EFEFF0",
    verticalAlign: "center",
    minWidth: "110px",
  },
}))(MuiTableCell);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    width: "100%",
  },
  darkBackground: {
    background: "#8c6b99",
    color: "white",
  },
  mutedBtn: {
    background: "white",
    color: "#5A2C6D",
    fontSize: 14,
    fontWeight: "bold",
    margin: "0px 5px",
    border: "1px solid #5A2C6D",
    borderRadius: 5,
  },
  filterOutlineBtn: {
    background: "white",
    color: "#06406D",
    fontSize: 14,
    fontWeight: "bold",
    margin: "0px 5px",
    border: "1px solid #06406D",
    borderRadius: 5,
    height: "40px",
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
  upRotate: {
    // transform: "rotate(-90deg)",
    color: "#1C752C",
  },
  downRotate: {
    transform: "rotate(180deg)",
    color: "#D83D3D",
  },
  info: {
    color: "rgba(61, 62, 100, 0.5)",
  },
  tableHeaderTitle: {
    fontWeight: "bold !important",
  },
  tableRowBorder: {
    borderBottom: "1px solid #DCDCDC",
  },
  noBorder: {
    border: "none !important",
  },
  noPadding: {
    padding: 0,
  },
  icon: {
    marginTop: 8,
  },
  stickyHeaderLeft: {
    position: "sticky",
    left: 0,
    zIndex: 10,
    minWidth: "160px",
  },
  bgWhite: {
    backgroundColor: "white",
  },
  greenColor: {
    color: "#1C752C",
  },
  floatingBtnContainer: {
    // position: "absolute",
    marginBottom: "-40px",
  },
  borderRight: { borderRight: "1px solid #DCDCDC", paddingRight: "8px" },
}));

export default function PCPTable(props) {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [tempFilters, setTempFilters] = useState({});
  const [dateRange, setDateRange] = useState("Last Quarter");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalTitle, setDetailModalTitle] = useState("");

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const allColumns = [
    { header: "PCP", subHeader: [{ name: "" }] },
    {
      header: "Summary",
      subHeader: [{ name: "Total Encounters" }, { name: "Response Rate" }],
    },
    {
      header: "Patient Favourable Response",
      subHeader: [
        { name: "Telemed" },
        { name: "In-person" },
        { name: "Messages" },
      ],
    },
    {
      header: "Peer Favourable Response",
      subHeader: [{ name: "" }],
    },

    {
      header: "Panel Size",
      subHeader: [{ name: "" }],
    },
    {
      header: "Engaged Members",
      subHeader: [{ name: "Count" }, { name: "% of members" }],
    },
    {
      header: "Non-Responding Patient",
      subHeader: [{ name: "Count" }, { name: "% of members" }],
    },
    {
      header: "Non-Responding Doctor",
      subHeader: [{ name: "Count" }, { name: "% of members" }],
    },
    {
      header: "Referral Rate",
      subHeader: [{ name: "Total" }, { name: "By Speciality >" }],
    },
    {
      header: "Curbsiding Rates",
      subHeader: [{ name: "Total" }, { name: "By Speciality >" }],
    },
    {
      header: "Good Citizenship Metric",
      subHeader: [{ name: "" }],
    },
    {
      header: "Participation Metric",
      subHeader: [{ name: "" }],
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
          { name: "Count ", value: "200", oldValue: "210" },
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
          { name: " Count", value: "200", oldValue: "180" },
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

  const handleFilterModalClose = () => {
    setFilterModalOpen(false);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
  };

  const renderTableBody = (data, selectedColumns) => {
    // 
    // data.map((rowData) => {
    //   rowData
    //     .filter(
    //       (columnData) =>
    //         columnData.header !== "PCP" && columnData.header !== "Summary"
    //     )
    //     .map((columnData) => {
    //       selectedColumns.find((column) => column.header === columnData.header)
    //         .visibility
    //         ? 
    //             "COL",
    //             selectedColumns
    //               .find(
    //                 (column) =>
    //                   column.header === columnData.header &&
    //                   column.visibility === true
    //               )
    //               .subHeader.filter(
    //                 (subHeaderData) => subHeaderData.visibility === true
    //               )
    //               .map((subHeaderData) => {})
    //           )
    //         : null;
    //     });
    // });

    return (
      <TableBody>
        {selectedColumns &&
          data.map((rowData) => {
            return (
              <TableRow className={classes.tableRowBorder}>
                <TableCell
                  className={`${classes.stickyHeaderLeft} ${classes.bgWhite}`}
                >
                  {rowData[0].subHeader[0].value}
                </TableCell>
                <TableCell align="right">
                  {rowData[1].subHeader[0].value}
                </TableCell>
                {rowData
                  .filter(
                    (columnData) =>
                      columnData.header !== "PCP" &&
                      columnData.header !== "Summary"
                  )
                  .map((columnData) => {
                    return selectedColumns.find(
                      (column) => column.header === columnData.header
                    ).visibility
                      ? selectedColumns
                          .find(
                            (column) =>
                              column.header === columnData.header &&
                              column.visibility === true
                          )
                          .subHeader.filter(
                            (subHeaderData) => subHeaderData.visibility === true
                          )
                          .map((subHeaderData) => {
                            return (
                              <TableCell component="th" scope="row">
                                <Grid
                                  container
                                  direction="row"
                                  justifyContent="flex-end"
                                  alignItems="center"
                                >
                                  <Typography
                                    variant="subtitle1"
                                    className={classes.greenColor}
                                  >
                                    90
                                  </Typography>
                                  <Typography className={classes.icon}>
                                    <ArrowUpwardIcon
                                      fontSize="small"
                                      className={classes.upRotate}
                                    />
                                  </Typography>
                                  <IconButton
                                    onClick={() => {
                                      setDetailModalOpen(true);
                                      setDetailModalTitle("Response Rate");
                                    }}
                                    className={classes.noPadding}
                                  >
                                    <InfoIcon
                                      fontSize="small"
                                      className={classes.info}
                                    />
                                  </IconButton>
                                </Grid>
                              </TableCell>
                            );
                          })
                      : null;
                  })}
                <TableCell component="th" scope="row">
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle1"
                      className={classes.greenColor}
                    >
                      90
                    </Typography>
                    <Typography className={classes.icon}>
                      <ArrowUpwardIcon
                        fontSize="small"
                        className={classes.upRotate}
                      />
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setDetailModalOpen(true);
                        setDetailModalTitle("Response Rate");
                      }}
                      className={classes.noPadding}
                    >
                      <InfoIcon fontSize="small" className={classes.info} />
                    </IconButton>
                  </Grid>
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    display: "flex",
                    position: "sticky",
                    right: 0,
                    backgroundColor: "white",
                  }}
                >
                  <Button
                    variant="contained"
                    className={classes.mutedBtn}
                    disableElevation
                  >
                    Reports
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.mutedBtn}
                    disableElevation
                    href="projected-surplus/surplus"
                  >
                    Surplus
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        <TableRow>
          <TableCell
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={`${classes.tableHeaderTitle} ${classes.stickyHeaderLeft}`}
          >
            Practice Score
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            833
          </TableCell>

          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            86%
          </TableCell>

          <TableCell
            component="th"
            scope="row"
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            94%
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            86%
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            88%
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          ></TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          ></TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={`${classes.tableHeaderTitle} ${classes.stickyHeaderLeft}`}
          >
            IPA Score
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            200
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            90%
          </TableCell>

          <TableCell
            component="th"
            scope="row"
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            95%
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            85%
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          >
            92%
          </TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          ></TableCell>
          <TableCell
            align="right"
            classes={{
              root: clsx(classes.darkBackground),
            }}
            className={classes.tableHeaderTitle}
          ></TableCell>
        </TableRow>
        <Dialog
          fullWidth
          maxWidth="md"
          open={detailModalOpen}
          onClose={handleDetailModalClose}
          aria-labelledby="detail-dialog"
        >
          <Typography className={classes.dialogTitle}>
            {detailModalTitle} Encounters
          </Typography>
          <DialogContent>
            <Grid container>
              <Grid item xs={6}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          className={`${classes.tableHeaderTitle} ${classes.noBorder}`}
                        >
                          Total Encounters
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${classes.noBorder}`}
                        >
                          200
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${classes.noBorder}`}
                        >
                          90%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          className={`${classes.tableHeaderTitle} ${classes.noBorder}`}
                        >
                          Telemed Encounters
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${classes.noBorder}`}
                        >
                          200
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${classes.noBorder}`}
                        >
                          90%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          className={`${classes.tableHeaderTitle} ${classes.noBorder}`}
                        >
                          Telemed Responses
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${classes.noBorder}`}
                        >
                          200
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${classes.noBorder}`}
                        >
                          90%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          className={`${classes.tableHeaderTitle} ${classes.noBorder}`}
                        >
                          Favourable Responses
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${classes.noBorder}`}
                        >
                          200
                        </TableCell>
                        <TableCell
                          align="center"
                          className={`${classes.noBorder}`}
                        >
                          90%
                        </TableCell>
                      </TableRow>
                    </TableHead>
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
              See Detail
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
      <>
        <div className={classes.floatingBtnContainer}>
          <FormControl variant="outlined">
            <Select
              value={dateRange}
              onChange={handleDateRangeChange}
              // className={classes.mutedDropdown}
              className={classes.filterOutlineBtn}
              disableUnderline
              renderValue={(value) => {
                return (
                  <Box
                    style={{ display: "flex", gap: 6, alignItems: "center" }}
                  >
                    <img src="/icons/calendar.svg" />
                    {value}
                  </Box>
                );
              }}
            >
              <MenuItem value="Last Quarter">Last Quarter</MenuItem>
              <MenuItem value="Last Week">Last Week</MenuItem>
              <MenuItem value="Last Month">Last Month</MenuItem>
              <MenuItem value="YTD">YTD</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            className={classes.filterOutlineBtn}
            disableElevation
            onClick={() => setFilterModalOpen(true)}
          >
            <Box display="flex" style={{ gap: 5 }}>
              <Grid
                item
                container
                direction="row"
                className={
                  Object.keys(filters).length !== 0 && classes.borderRight
                }
              >
                <Grid item container alignItems="center">
                  <img src="/new/filter.svg" />
                  &nbsp; Filter
                </Grid>
              </Grid>
              <Grid item>
                {Object.keys(filters).length !== 0 &&
                  Object.keys(filters).map((filter, index) => {
                    return (
                      <span className={classes.filterBtn}>
                        {filters[filter]}
                      </span>
                    );
                  })}
              </Grid>
            </Box>
          </Button>
          <Dialog
            fullWidth
            maxWidth="md"
            open={filterModalOpen}
            onClose={handleFilterModalClose}
            aria-labelledby="filter-dialog"
          >
            <Typography className={classes.dialogTitle}>
              Apply Filter
            </Typography>
            <DialogContent>
              <Grid container>
                <Filter
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                />
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                className={classes.saveBtn}
                onClick={() => {
                  setFilters(tempFilters);
                  setFilterModalOpen(false);
                }}
              >
                {" "}
                Save
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <CustomizableTableComponent
          allColumns={allColumns}
          data={tableData}
          renderTableBody={renderTableBody}
          customize
        />
      </>
    );
  }
}
