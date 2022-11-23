import React, { useEffect, useState } from "react";
import Grid from '@material-ui/core/Grid';
import styles from './loginportal.module.css';
import Container from '@material-ui/core/Container';

import { useRouter } from 'next/router';

import UserChooser from '@components/UserChooser';
// import { UserChooser } from '@nemo/uicomponents';
import Login from '@components/Login';
import { getSession, signOut, useSession } from 'next-auth/client';
import { getCsrfToken } from 'next-auth/client';
import Alert from '@material-ui/lab/Alert';
import constants from '@constants/index'
import { destroyCookie } from "nookies";

export default function LoginPage({ csrfToken }) {
  const router = useRouter();
  const { ROUTES } = constants;
  const [session, loading] = useSession()

  const [loginAs, setLoginAs] = useState('admin');
  const { error, on } = router.query;
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (session) {
        router.push(ROUTES.LANDING_ROUTE);
      } else {
        console.log('this logout is calling')
          destroyCookie(null, 'next-auth.callback-url');
          destroyCookie(null, 'next-auth.csrf-token');
          destroyCookie(null, 'next-auth.session-token');
          localStorage.setItem('persist:nemo-admin', "{}");
  
          const NEXTAUTH_SIGNOUT_CALLBACK_URL = `${process.env.NEXTAUTH_SIGNOUT_CALLBACK_URL}`;
          signOut({ callbackUrl: NEXTAUTH_SIGNOUT_CALLBACK_URL });
      }
    }
  }, [session, loading])

  useEffect(() => {
    // 
    if (error) {
      setLoginError('Authentication failed. Please try again!');
      // on is not set for now:: (needs some process)
      // if (on) {
      //   setLoginAs(on);
      // }
    }
  }, [error])

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <img
          src="/nemo-logo.jpg"
          alt="Nemo Logo"
          width={238}
          height={71}
        />

        {loginError &&
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Alert severity="error">{loginError}</Alert>
          </Grid>
        }


        {loginAs && <Login csrfToken={csrfToken} userType={loginAs} setUserType={setLoginAs} setLoginError={setLoginError} />}
        {!loginAs && <UserChooser setUserType={setLoginAs} />}
      </Grid>
    </Container>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      session: await getSession(context)
    }
  }
}
