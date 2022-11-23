import Header from "@components/Header";
import ModuleHeader from "@components/ModuleHeader";
import SQLDebugger from "../SQLDebugger";
import styles from "./sessionlayoutwrapper.module.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import dynamic from "next/dynamic";
const FeedbackImport = dynamic(() => import("simple-screenshot-feedback"), {
  ssr: false,
});

import { setModuleInfoAction, moduleInfoState } from "@slices/moduleInfoSlice";
import { useRouter } from "next/router";
import { Box, makeStyles } from "@material-ui/core";
import Topbar from "@components/TopbarComponent";
import Sidebar from "@components/Sidebar";
import Footer from "@components/Footer";
import { menuSelector } from "@slices/menuToggleSlice";
import { Skeleton } from "@material-ui/lab";
import constants from '@constants/index'
import NemoLoader from "src/shared/NemoLoader";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: "216px",
    paddingRight: "30px",
    paddingTop: "95px",
    paddingBottom: "23px",
    // removed for now since we do not need footer sticky
    // height: "calc( 100vh - 50px)",
    height: `100vh`,
    overflow: "hidden",
    position: "relative",
    transition: "padding-left 0.3s ease-in-out",
  },
  dashboardBg: {
    backgroundColor: "#F2F5F7",
  },
  whiteBg: {
    backgroundColor: "white",
  },
  containerHolder: {
    "& > div": {
      backgroundColor: "#fff",
      boxShadow: `1px 6px 15px rgba(0, 0, 0, 0.05)`,
      height: `100%`,
      overflowY: "scroll",
      borderRadius: `3px`,

      [theme.breakpoints.down("md")]: {
        padding: `0 15px 30px`,
      },
    },

    "& div[role='tabpanel']": {
      height: `100%`,
      overflowY: "auto",
      overflowX: "hidden",
      paddingBottom: 165,
    },
  },
  drawerClose: {
    paddingLeft: theme.spacing(10),
  },
}));

const defaultMenuItems = [
  {
    text: "Dashboard",
    icon: "home",
    path: "/dashboard",
    subMenu: [],
  },
  {
    text: "Signal",
    icon: "chart",
    path: "/questionmap",
  },
  {
    text: "Reporting",
    icon: "list",
    active: true,
    path: "/reporting",
  },
  {
    text: "Compensation",
    icon: "wallet",
    path: "/projected-surplus",
  },
  {
    text: "Active",
    icon: "star",
    path: "/",
  },
  {
    text: "Claims",
    icon: "discount",
    path: "/",
  },
  {
    text: "Quality",
    icon: "ticket",
    path: "/",
  },
  {
    text: "Client Management",
    icon: "setting",
    path: "/clientManagement",
  },
];

export default function SessionLayoutWrapper({
  type,
  info,
  children,
  defaultWrapper = true,
}) {
  const classes = useStyles();
  const router = useRouter();
  // const dashboard =
  //   router.route === "/dashboard" ||
  //   router.route.includes("/calendar") ||
  //   router.route.includes("/patient");
  // const { user, isLoading } = useUser();
  // const userInfo = auth.getUserInfo(user);

  const slackToken = `${process.env.NEXT_PUBLIC_SLACK_TOKEN}`;
  const slackChannel = `${process.env.NEXT_PUBLIC_SLACK_FEEDBACK_CHANNEL}`;
  const [pageInfo, setPageInfo] = useState({});

  const { moduleInfo } = useSelector(moduleInfoState);

  const handleSubmitError = (err) => {
    
  };

  const { open } = useSelector(menuSelector);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  const { MENUS } =  constants;

  useEffect(()=>{
    const newMenuItems = defaultMenuItems.filter((v)=> MENUS.includes(v.path));
    setMenuItems(newMenuItems);
  }, [MENUS])

  useEffect(() => {
    setPageInfo(info);
  }, [info]);

  useEffect(() => {
    if (info && info.hasOwnProperty("key")) {
      if (moduleInfo.hasOwnProperty(info.key)) {
        setPageInfo({ ...info, name: moduleInfo[info.key].title });
      }
    }
  }, [moduleInfo]);

  const [pageLoading, setPageLoading] = React.useState(false);
  React.useEffect(() => {
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    // <>
    //     {type === 'app' ? <Header /> : <ModuleHeader info={pageInfo} />}
    //     <div className={styles.container}>
    //         {children}
    //         {/* <SQLDebugger /> */}
    //         {/* <FeedbackImport slackToken={slackToken} slackChannel={slackChannel} handleSubmitError={(err) => handleSubmitError(err)} location="bottom-right" /> */}
    //     </div>
    // </>
    <React.Fragment>
      {defaultWrapper ? (
        <Box>
          {/* {type === "app" ? <Header /> : <ModuleHeader info={info} />} */}
          <Topbar patientList={[]} />
          <Sidebar menuItems={menuItems} logo="/logo-plain.svg" />
          {pageLoading ? <NemoLoader /> : (
            <div
              className={`${classes.container} ${
                !open ? classes.drawerClose : ""
              } ${classes.dashboardBg} containerHolder ${
                classes.containerHolder
              }`}
            >
              {children}
              {/* <SQLDebugger /> */}
              {/* <FeedbackImport slackToken={slackToken} slackChannel={slackChannel} handleSubmitError={(err) => handleSubmitError(err)} location="bottom-right" /> */}
            </div>
          )}
          {/* Commented for now */}
          {/* <Footer logo="/logo-plain.svg" /> */}
        </Box>
      ) : (
        children
      )}
    </React.Fragment>
  );
}
