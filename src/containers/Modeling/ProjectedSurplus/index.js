import Box from "@material-ui/core/Box";
import TabComponent from "@components/TabComponent";
import PCPReportCard from "@containers/Modeling/ProjectedSurplus/PCPReportCard";

export default function ProjectedSurplus() {
  const testComponent1 = function TestComponent() {
    return <Box p={3}>Tab2</Box>;
  };

  const tabdata = [
    {
      name: "PCP/SCP Report Cards",
      component: PCPReportCard,
    },
    {
      name: "Cost Utilization",
      component: testComponent1,
    },
    {
      name: "Business Reports",
      component: testComponent1,
    },

    {
      name: "Referral Report",
      component: testComponent1,
    },
    {
      name: "Order Report",
      component: testComponent1,
    },
    {
      name: "Clinical Quality Report",
      component: testComponent1,
    },
  ];

  return <TabComponent tabdata={tabdata} />;
}
