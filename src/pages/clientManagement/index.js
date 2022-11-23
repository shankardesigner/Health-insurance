//import {useEffect} from 'react';
import Box from "@material-ui/core/Box";
import SessionLayoutWrapper from "@containers/SessionLayoutWrapper";
import TabComponent from "@components/TabComponent";
import ClientModel from "@containers/ClientModel";
import EmrModel from "@containers/EmrModel";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
// import Modeling from '@containers/Modeling'

//import { wrapper } from '../../store';
// import {
//   listAction as ListReportingModels,
// } from "@slices/reportingModelSlice";

export default function clientManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (router.query.activeTabIndex !== undefined) {
      setActiveTab(parseInt(router.query.activeTabIndex));
    }
  }, [router.query.activeTabIndex]);

  const moduleInfo = {
    name: "Client Management",
    icon: "/graph-bar.svg",
  };

  const testComponent1 = function TestComponent() {
    return <Box p={3}>Tab2</Box>;
  };

  const tabdata = [
    {
      name: "Client",
      component: ClientModel,
    },
    {
      name: "EMRs",
      component: EmrModel,
    },
    {
      name: "Practice Management System",
      component: testComponent1,
    },
    {
      name: "MDM",
      component: testComponent1,
    },
  ];

  return (
    <>
      <SessionLayoutWrapper type="module" info={moduleInfo}>
        {activeTab && (
          <TabComponent
            tabdata={tabdata}
            tabState={{ lastactive: activeTab }}
          />
        )}
        {!activeTab && <TabComponent tabdata={tabdata} />}
      </SessionLayoutWrapper>
    </>
  );
}
