import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import styles from "./nemoTable.module.scss";

/**
 * @description gets the table row including the all table definition
 * @param {Array} row
 */
const getTableRow = (row = []) => (
  <TableRow>
    {row?.map((cell) => (
      <TableCell>{cell}</TableCell>
    ))}
  </TableRow>
);

/**
 * @description Customized Nemo table | accepts table or with data
 * @param { Array } tableData
 * @param { Array } headers
 * @returns void
 */
const NemoTable = ({
  tableData = [],
  headers = [],
  stickyBoth = true,
  stickyHeader = false,
  sideColumn = true,
  hasFooter = true,
  minHeight = "auto",
  maxHeight = "auto",
  children,
}) => {
  return (
    <TableContainer
      component={Paper}
      classes={{ root: styles.nemoTableContainer }}
      className={`${stickyBoth ? "stickyBoth" : ""} 
      ${stickyHeader && !stickyBoth ? "stickyHeader" : ""}
       ${sideColumn ? styles.tableWithSideColumn : ""} ${
        hasFooter ? styles.tableWithFooter : ""
      } ${stickyHeader ? styles.stickyHeader : ""} ${
        stickyBoth ? styles.stickyBoth : ""
      }`}
      style={{ minHeight, maxHeight }}
    >
      <Table aria-label="customized table">
        {!!tableData && !!headers && !children ? (
          <React.Fragment>
            <TableHead>
              <TableRow>
                {headers?.map((header) => (
                  <TableCell>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{tableData?.map((row) => getTableRow(row))}</TableBody>
          </React.Fragment>
        ) : (
          children
        )}
      </Table>
    </TableContainer>
  );
};

export default NemoTable;
