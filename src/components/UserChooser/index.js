import styles from './userchooser.module.css';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  containerWidth: {
    [theme.breakpoints.up('sm')]: {
      minWidth: '640px',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '250px',
    },
  },
  userTypeIcon: {
    [theme.breakpoints.up('sm')]: {
      width: '100px',
      height: '100px',
      marginRight: '5px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '40px !important',
      height: '40px !important',
      marginRight: '5px',
    },
  },
  careTeam: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: '48px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '24px'
    },
  }
}));

export default function UserChooser({ setUserType }) {

  const classes = useStyles();

  const goToLogin = (userType) => {
    // Router.push(`/login?as=${userType}`);
    setUserType(userType);
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      className={styles.userTypeContainer}
    >
      <Typography variant="h5" gutterBottom className={styles.chooseText}>
        I'm a...
      </Typography>

      {/* patient */}
      <Link href="#" onClick={() => { goToLogin('patient'); }} className={styles.links}>
        <div className={`${styles.cardContainer}  ${classes.containerWidth}`}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={styles.userTypeGrid}
          >
            <img
              src="/patient.svg"
              alt="patient image"
              className={classes.userTypeIcon}
            />
            <Typography variant="h5" className={styles.userTypeTitle}>
              Patient
            </Typography>
            <img
              src="/right-arrow.svg"
              alt="right arrow"
              width={30}
              height={30}
            />
          </Grid>
        </div>
      </Link>

      {/* care team */}
      <Link href="#" onClick={() => { goToLogin('careteam'); }} className={`${styles.links} ${classes.careTeam}`} >
        <div className={`${styles.cardContainer}  ${classes.containerWidth}`}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={styles.userTypeGrid}
          >
            <img
              src="/care-team.svg"
              alt="care team image"
              className={classes.userTypeIcon}
            />
            <Typography variant="h5" className={styles.userTypeTitle}>
              Care Team
            </Typography>
            <img
              src="/right-arrow.svg"
              alt="right arrow"
              width={30}
              height={30}
            />
          </Grid>
        </div>
      </Link>

      {/* doctor */}
      <Link href="#" onClick={() => { goToLogin('doctor'); }} className={styles.links}>
        <div className={`${styles.cardContainer}  ${classes.containerWidth}`}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={styles.userTypeGrid}
          >
            <img
              src="/stethoscope.svg"
              alt="stethoscope image"
              className={classes.userTypeIcon}
            />
            <Typography variant="h5" className={styles.userTypeTitle}>
              Doctor
            </Typography>
            <img
              src="/right-arrow.svg"
              alt="right arrow"
              width={30}
              height={30}
            />
          </Grid>
        </div>
      </Link>



      {/* administrator */}
      <Link href="#" onClick={() => { goToLogin('admin'); }} className={`${styles.links} ${styles.adminLink}`}>
        Administrator
      </Link>
    </Grid>
  )
};
