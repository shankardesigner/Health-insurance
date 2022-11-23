const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles((theme) => ({
  main: {
    flexGrow: 1,
    overflow: "auto",
    paddingBottom: "55px",
    background: "#F2F5F7",
    minHeight: "100vh",
    height: "100vh",
    paddingTop: '64px',
  },
  container: {
    margin: '24px 0',
    position: "relative",
    zIndex: 1,
    overflow: 'auto',
    minHeight: 'calc(100vh - 169px)',
    borderRadius: "0 0 14px 14px",
    boxShadow: "1px 6px 15px rgba(0, 0, 0, 0.05)",
    background: "#FFFFFF",
    padding: '0 0 80px'
  },
}));
