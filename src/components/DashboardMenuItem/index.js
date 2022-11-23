import styles from './dashboardmenuitem.module.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    dashboardMenuIcon: {
        [theme.breakpoints.up('sm')]: {
            width: '32px',
            height: '32px',
        },
        [theme.breakpoints.down('sm')]: {
            width: '32px',
            height: '32px',
        },
    },
    cardContainer: {
        [theme.breakpoints.up('xs')]: {
            marginLeft: '10px',
            marginRight: '10px'
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: '0px',
            marginRight: '0px'
        },
    },
    menuItemsWrapper: {
        [theme.breakpoints.up('sm')]: {
            width: '310px'
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
}));

export default function DashboardMenuItem({ menuItem }) {
    const classes = useStyles();
    const { icon, alt, title, subtitle, link, form } = menuItem;
    if(form){
        return (
            <div className={clsx(styles.cardContainer, classes.cardContainer, classes.menuItemsWrapper)}>
                <form action="https://sso.zakipointhealth.com/j_spring_security_check" target="_blank" method="POST">
                    <input type="hidden" name="j_username"  value="todd.stockard@docnemo.com" />
                    <input type="hidden" name="j_password" value="Nemo2022$" />
                    <button style={{backgroundColor: 'transparent', border: 'none', cursor: 'pointer'}} type="submit" className={styles.links}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <div>
                                <Grid
                                    container
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="flex-start"
                                    className={styles.menuTextGrid}
                                >
                                    <img
                                        src={icon}
                                        alt={alt}
                                        className={classes.dashboardMenuIcon}
                                    />
                                    <Typography variant="h5" className={styles.menuText}>
                                        {title}
                                    </Typography>
                                    <Typography variant="subtitle1" className={styles.menuSubText}>
                                        {subtitle}
                                    </Typography>
                                </Grid>
                            </div>
                            <img
                                src="/right-arrow.svg"
                                alt="right arrow"
                                width={30}
                                height={30}
                            />
                        </Grid>
                    </button>
                </form>
            </div>
    
        )
    }
    return (
        <div className={clsx(styles.cardContainer, classes.cardContainer, classes.menuItemsWrapper)}>
            <Link href={link} className={styles.links}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <div>
                        <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-start"
                            className={styles.menuTextGrid}
                        >
                            <img
                                src={icon}
                                alt={alt}
                                className={classes.dashboardMenuIcon}
                            />
                            <Typography variant="h5" className={styles.menuText}>
                                {title}
                            </Typography>
                            <Typography variant="subtitle1" className={styles.menuSubText}>
                                {subtitle}
                            </Typography>
                        </Grid>
                    </div>
                    <img
                        src="/right-arrow.svg"
                        alt="right arrow"
                        width={30}
                        height={30}
                    />
                </Grid>
            </Link>
        </div>

    )
}
