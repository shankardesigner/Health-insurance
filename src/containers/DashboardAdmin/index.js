import SessionLayoutWrapper from "@containers/SessionLayoutWrapper";
import DashboardMenuItem from "@components/DashboardMenuItem";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TabComponent from "@components/TabComponent";
import Link from "@material-ui/core/Link";
import styles from "./dashboardadmin.module.css";
import InboxComponent from "@components/InboxComponent";
import { withPageAuthRequired, useUser} from '@auth0/nextjs-auth0';
// import {DashboardMenuItem} from '@nemo/uicomponents';

const useStyles = makeStyles((theme) => ({
  menuItemsGrid: {
    [theme.breakpoints.up("sm")]: {
      width: "300px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "340px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "680px",
    },
  },
}));

function Dashboard() {
  const menuItems = [
    {
      icon: "/eye.svg",
      title: "Signal",
      alt: "eye image",
      subtitle: "Referrals, wait times & NPS",
      link: "/questionmap",
    },
    {
      icon: "/graph-bar.svg",
      alt: "graph image",
      title: "Reporting",
      subtitle: "Modeling, reports & factors",
      link: "/dashboard/reporting",
    },
    {
      icon: "/dollar.svg",
      title: "Compensation",
      subtitle: "Groups, vendors & MDs",
      link: "/projected-surplus",
    },
    {
      icon: "/toggle-on.svg",
      title: "Active",
      subtitle: "Admissions, SNF & Referrals",
      link: "/dashboard/#",
    },
    {
      icon: "/alert-line.svg",
      title: "Claims",
      subtitle: "MDS, RS & Hospital",
      link: "/dashboard/#",
    },
    {
      icon: "/quality-icon.svg",
      title: "Quality",
      subtitle: "Clinical & Admin",
      link: "/dashboard/#",
    },
    {
      icon: "/quality-icon.svg",
      title: "Client Manage",
      subtitle: "Client Management",
      link: "/clientManagement",
    },
  ];

  const classes = useStyles();

  const testComponent = function TestComponent() {
    return <div>Inbox is Empty</div>;
  };

  const testComponent1 = function TestComponent() {
    return <div>No new tasks</div>;
  };

  const tabdata = [
    {
      name: "Inbox",
      component: InboxComponent,
    },
    {
      name: "Tasks",
      component: testComponent1,
    },
  ];

  return (
    <>
      <SessionLayoutWrapper type="app">
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={3}
         >
          <Grid item xs={7} className={classes.menuItemsGrid}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              {menuItems.map((menuItem, index) => (
                <DashboardMenuItem menuItem={menuItem} key={index} />
              ))}
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Hidden xsDown className={styles.hiddenBox}>
              <TabComponent tabdata={tabdata} />
            </Hidden>
          </Grid>
        </Grid>
      </SessionLayoutWrapper>
    </>
  );
}
export default withPageAuthRequired(Dashboard);
