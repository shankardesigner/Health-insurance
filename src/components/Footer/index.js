import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/styles/makeStyles";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  topbarContainer: {
    backgroundColor: "#ffffff",
    boxShadow: "0px 1px 8px rgba(61, 62, 100, 0.1)",
    height: "50px",
    width: "100%",
    paddingLeft: "62px",
    paddingRight: "55px",
    position: "fixed",
    bottom: 0,
    zIndex: 1200,
    borderTop: "1px solid" + theme.palette.primary.main,
  },
  logo: {
    width: "85px",
    height: "16px",
  },
  copyrightInfo: {
    color: "#939698",
    fontSize: "12px",
  },
  contactInfo: {
    fontSize: "12px",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  pipe: {
    color: "#939698",
    fontSize: "18px",
  },
}));

export default function Footer({ logo }) {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Grid container direction="row" className={classes.topbarContainer}>
      <Grid item xs={5} container direction="row" alignItems="center">
        <img src={logo} alt="nemo logo" className={` ${classes.logo}`} />
      </Grid>
      <Grid item xs={7} container direction="row">
        <Grid item xs container alignItems="center" justifyContent="flex-end">
          <Box marginLeft={2}>
            <Typography className={classes.copyrightInfo} color="primary">
              Copyright @ 2022 NEMO | All Rights Reserved.
            </Typography>
          </Box>
          <Box marginLeft={1}>
            <Typography className={classes.pipe} color="primary">
              |
            </Typography>
          </Box>
          <Box marginLeft={1}>
            <Typography className={classes.contactInfo} color="primary">
              Contact Us
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
