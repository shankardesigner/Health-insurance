import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import styles from "./boxwithtoggle.module.css";
import Switch from "@material-ui/core/Switch";
import clsx from "clsx";

import { useState } from "react";
import NemoSwitch from "src/shared/NemoSwitch";

const useStyles = makeStyles((theme) => ({
  toggleBox: {
    // background: 'red'
  },
}));

export default function BoxWithToggle({
  title,
  children,
  hideToggle,
  wrapperClass = "",
  ...props
}) {
  const classes = useStyles();
  const showToggle = hideToggle !== undefined ? !hideToggle : true;

  const [state, setState] = useState({
    checkedA: true,
    checkedB: true,
  });

  const handleChange = (event) => {
      
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div
      className={`${clsx(styles.toggleBox, classes.toggleBox)} ${wrapperClass}`}
      {...props}
    >
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item className={styles.fullWidth}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <span className={styles.toggleBoxTitle}>{title}</span>
            </Grid>
            <Grid item>
              {!hideToggle && (
                // <Switch
                //     checked={state.checkedA}
                //     onChange={handleChange}
                //     name="checkedA"
                //     inputProps={{ 'aria-label': 'secondary checkbox' }}
                // />
                <NemoSwitch
                //   checked={state.checkedA}
                  onChange={handleChange}
                //   name="checkA"
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={clsx(styles.fullWidth, styles.contentBox)}>
          {/* content box */}
          {children}
        </Grid>
      </Grid>
    </div>
  );
}
