import { Grid } from "@material-ui/core";
import TabComponent from "@components/TabComponent";
import NewEmrForm from "./NewEMRForm";

export default function NewClientModel() {
  const tabdata = [
    {
      name: "EMR",
      component: NewEmrForm,
    },
  ];

  return (
    <Grid>
      <TabComponent tabdata={tabdata} />
    </Grid>
  );
}
