import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import styles from './inboxcomponent.module.css';

const useStyles = makeStyles((theme) => ({
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

const InboxComponent = function InboxComponent() {

  const classes = useStyles();

  const inboxLink = '/inbox';

  const gotoInboxPage = () => {
    // router.push({
    //     pathname: inboxLink,
    // });
  }

  const InboxRow = (from) => {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        className={styles.menuTextGrid1}
        wrap="nowrap"
      >
        <img src="/profile-icon.svg" className={styles.profileIcon} />

        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          className={styles.menuTextGrid1}
          wrap="nowrap"
        >
          <div style={{ width: "65%" }} onClick={() => gotoInboxPage()}>
            <h1 className={styles.heading}>{from}</h1>
            <p className={styles.message}>
              Message preview text goes by here which is limited to two
              lines..
            </p>
          </div>
          <p className={styles.time} justifyContent="flex-end">
            1 min ago
          </p>
        </Grid>

      </Grid>
    );
  }

  return (
    <div >
      {InboxRow('Sarah Waters')}
      {InboxRow('Peter Benington')}
      {InboxRow('Bob Macintosh')}
      {InboxRow('John Smith')}
    </div>
  )
}

export default InboxComponent;