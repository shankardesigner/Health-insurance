import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import DashboardMenuItem from '@components/DashboardMenuItem';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TabComponent from '@components/TabComponent'; 
import Link from '@material-ui/core/Link';
import styles from './dashboardadmin.module.css';
import InboxComponent from '@components/InboxComponent';
// import {DashboardMenuItem} from '@nemo/uicomponents';

const useStyles = makeStyles((theme) => ({
  dashboardContainer: {
    marginTop: 20
  },
  menuItemsGrid: {
    [theme.breakpoints.up('sm')]: {
      width: '300px'
    },
    [theme.breakpoints.down('sm')]: {
      width: '340px'
    },
    [theme.breakpoints.up('lg')]: {
      width: '680px'
    },
  },
}));


export default function ReportingDashboard() {
  const menuItems = [
    {
      icon: '/eye.svg',
      alt: 'graph image',
      title: 'Risk Modelling',
      subtitle: 'Risk Modelling Tool',
      link: '/reporting'
    },
    {
      icon: '/graph-bar.svg',
      title: 'MedEcon Analyzer',
      alt: 'eye image',
      subtitle: 'Dashboarding and Reporting',
      link: 'https://nemo.zakipointhealth.com',
      form: true
    },
    {
      icon: '/graph-bar.svg',
      title: 'Business Report',
      subtitle: 'Business Report',
      link: '/dashboard/reporting/#'
    },
    {
      icon: '/graph-bar.svg',
      title: 'MD Score Card',
      subtitle: 'MD Score Card',
      link: '/dashboard/reporting/#'
    },
  ]

  const classes = useStyles();

  const moduleInfo = {
    name: "Reporting",
    icon: "/eye.svg",
  };

  return (
    <>
      <SessionLayoutWrapper type="module" info={moduleInfo}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <div>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              className={classes.dashboardContainer}
            >
                {menuItems.map((menuItem, index) => (
                  <DashboardMenuItem menuItem={menuItem} key={index} />
                ))}
            </Grid>
          </div>
        </Grid>
      </SessionLayoutWrapper>
    </>
  )
}