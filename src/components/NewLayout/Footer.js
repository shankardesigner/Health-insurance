import { AppBar, Link, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    top: "auto !important",
    left: 0,
    right: 0,
    bottom: "0 !important",
    zIndex: 9999,
    height: "55px",
    background: "#FFFFFF",
    boxShadow: "none",
    borderTop: "1px solid #06406D",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "15px 59px",
    fontSize: "12px",
    lineHeight: "17px",
  },
  logoArea: {
    width: "88px",

    "& img": {
      width: "100%",
      height: "auto",
    },
  },
  infoArea: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    color: "#939698",
    display: "flex",

    "& li": {
      "& + li::before": {
        content: "''",
        display: "inline-block",
        verticalAlign: "middle",
        width: "1px",
        height: "17px",
        background: "#939698",
        margin: "0 9px 0 8px",
      },
    },

    '& a': {
      fontWeight: '500',
    }
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.root}>
      <div className={classes.logoArea}>
        <img
          src="/logo-new-plain.svg"
          alt="nemo logo"
          className={classes.logo}
        />
      </div>
      <ul className={classes.infoArea}>
        <li>Copyright &copy; 2022 NEMO | All Rights Reserved.</li>
        <li>
          <Link>Contact Us</Link>
        </li>
      </ul>
    </AppBar>
  );
};

export default Footer;
