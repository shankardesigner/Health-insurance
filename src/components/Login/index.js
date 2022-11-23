import { getCsrfToken } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        docnemo.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login({ csrfToken, userType, setUserType, setLoginError }) {
  const router = useRouter();
  const { error } = router.query;
  const [userTypeText, setUserTypeText] = useState();

  useEffect(() => {
    if (userType === 'admin') {
      setUserTypeText('Administrator');
    } else if (userType === 'careteam') {
      setUserTypeText('Care Team');
    } else if (userType === 'doctor') {
      setUserTypeText('Doctor')
    } else if (userType === 'patient') {
      setUserTypeText('Patient');
    }
    setLoginError(null);
  }, [userType])

  const handleBack = () => {
    // setUserType(null);
    const PORTAL_BASE_URL = `${process.env.NEXT_PUBLIC_PORTAL_BASE_URL}`
    window.location.replace(PORTAL_BASE_URL);
  }

  // return (
  //   <div>
  //     {
  //     (error === 'CredentialsSignin') && "Login Failed"
  //     }
  //   Login for {userType}
  //   <form method='post' action='/api/auth/callback/credentials'>
  //     <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
  //     <label>
  //       Username
  //       <input name='username' type='text'/>
  //     </label>
  //     <label>
  //       Password
  //       <input name='password' type='password'/>
  //     </label>
  //     <button type='submit'>Sign in</button>
  //     <button type='submit' onClick={()=>{handleBack()}}>Back</button>
  //   </form>
  //   </div>
  // )


  const useStyles = makeStyles((theme) => ({

    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        marginTop: theme.spacing(8)
      },
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.color,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: theme.palette.secondary.color,
    },
  }));

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper} >
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login As {userTypeText}
        </Typography>
        <form className={classes.form} noValidate method='post' action='/api/auth/callback/credentials'>
          <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
          <input name="usertype" type="hidden" value={userType} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            {/* <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
            />
          </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
        </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={() => { handleBack() }}>
                Change user type
            </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

// // This is the recommended way for Next.js 9.3 or newer
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context)
//     }
//   }
// }

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context)
  }
}
*/