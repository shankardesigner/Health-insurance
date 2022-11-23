import { Container, Grid } from "@material-ui/core";
import React from "react";
import { useStyles } from "./useStyles";

const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <Container maxWidth="xl">
        <div className={classes.container}>{children}</div>
      </Container>
    </main>
  );
};

export default Layout;
