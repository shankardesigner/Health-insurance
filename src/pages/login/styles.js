// xs, extra-small: 0px
// sm, small: 600px
// md, medium: 960px
// lg, large: 1280px
// xl, extra-large: 1920px

const styles = theme => ({
    containerWidth: {
        [theme.breakpoints.up('sm')]: {
            minWidth: '665px',
        },
        // [theme.breakpoints.up('md')]: {
        //     backgroundColor: theme.palette.primary.main,
        // },
        // [theme.breakpoints.up('lg')]: {
        //     backgroundColor: green[500],
        // },
    },
});

export default styles;