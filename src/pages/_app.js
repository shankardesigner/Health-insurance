import { Provider } from "next-auth/client";
import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import theme from "@utils/theme";
import { wrapper } from "../store";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "@auth0/nextjs-auth0";

import "react-toastify/dist/ReactToastify.css";
import "../styles/styles.css";
import ErrorBoundary from "./ErrorBoundary";
import NemoLoader from "src/shared/NemoLoader";

const MyApp = (props) => {
  const { Component, pageProps } = props;

  const store = useStore();

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <React.Fragment>
      <UserProvider>
        <Head>
          <title>Nemo : New Era Medical Operation</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ToastContainer
          position="top-right"
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <PersistGate
            persistor={store.__persistor}
            loading={<NemoLoader />}
          >
            <div suppressHydrationWarning>
              {typeof window === "undefined" ? null : (<>
                {/* <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary> */}
                <Component {...pageProps} />
                </>
              )}
            </div>
          </PersistGate>
        </ThemeProvider>
      </UserProvider>
    </React.Fragment>
  );
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default wrapper.withRedux(MyApp);
