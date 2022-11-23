import {
  Box,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useState } from "react";
import NemoCheckBox from "src/shared/NemoCheckBox";
import NemoSelect from "src/shared/NemoSelect";
import EditNemoFactorsRow from "../EditNemoFactor/editNemoFactorsRow";

import styles from "./nemofactortable.module.scss";

const CollapsableRow = ({
  uniqueKey,
  isSelected,
  nemoFactorName,
  intensity,
  toggleFactorSelect,
  handleIntensityChange,
  nemoFactorsDetails,
  handleEditClick,
  tabIndex,
  data,
}) => {
  const [open, setOpen] = useState(false);
  const handleCollapsableRow = () => {
    setOpen((open) => !open);
    // handleEditClick(uniqueKey);
  };
  return (
    <React.Fragment>
      <TableRow key={uniqueKey}>
        <TableCell align="left" className={styles.nemoTableCell}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={`${styles.nemoFactorsCheckboxWrapper} ${
              isSelected ? styles.changeWrapperBorder : ""
            }`}
          >
            <div className={styles.nemoInfoHolder}>
              <NemoCheckBox
                label={
                  <div className={styles.nemoInfoTextHolder}>
                    <div className={styles.headerTitle}>{nemoFactorName}</div>
                    {/* <div className={styles.headerSubtitle}>
                      {nemoFactorsDetails[nemoFactorName]}
                    </div> */}
                    {/* TODO:// Disabling the description field for now, needs to come up with better description */}
                  </div>
                }
                onChange={() => toggleFactorSelect(uniqueKey, isSelected)}
                checked={isSelected}
                labelPlacement="end"
              />
            </div>

            <div>
              {/* action items */}
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <NemoSelect
                    value={intensity}
                    onChange={(e) => handleIntensityChange(e, uniqueKey)}
                    disableUnderline
                  >
                    <MenuItem value={"Aggressive"}>Aggressive</MenuItem>
                    <MenuItem value={"Moderate"}>Moderate</MenuItem>
                    <MenuItem value={"Conservative"}>Conservative</MenuItem>
                    <MenuItem value={"Custom"} disabled>
                      Custom
                    </MenuItem>
                  </NemoSelect>
                </Grid>
                <Grid item>
                  <IconButton
                    title="Edit"
                    className={clsx(styles.iconButton)}
                    size="small"
                    // onClick={() => handleEditClick(uniqueKey)}
                    onClick={handleCollapsableRow}
                  >
                    <img src="/edit-icon.svg" width={12} height={12} />
                  </IconButton>
                </Grid>
              </Grid>
            </div>
            <Grid item xs={12}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 15 }}>
                    <EditNemoFactorsRow data={data} onCancel={handleCollapsableRow} tabIndex={tabIndex}/>
                  </Box>
              </Collapse>
            </Grid>
          </Grid>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default CollapsableRow;
