import { useEffect, useState } from "react";
import EditServiceCategory from "./EditServiceCategory";
import EditSpeciality from "./EditSpeciality";
import TabComponent from "@components/TabComponent";
import styles from './editresultsclaimsprofessional.module.scss';

/* redux part */
import { setTabStateAction, tabModelState } from "@slices/tabModelSlice";
import { useSelector, useDispatch } from "react-redux";

function EditResultsClaimsProfessional({ data }) {
  const testComponent = function TestComponent() {
    return <div>Inbox is Empty</div>;
  };
  const tabdata = [
    {
      name: "Service Category",
      component: EditServiceCategory,
      params: {
        data: data,
      },
    },
    {
      name: "Speciality",
      component: EditSpeciality,
      params: {
        data: data,
      },
    },
  ];

  const [tabNewState, setTabNewState] = useState(undefined);
  const { tabState, resStatus } = useSelector(tabModelState);
  const dispatch = useDispatch();

  const tabKey = "editProfessionals";

  useEffect(() => {
    const payload = {
      key: tabKey,
      data: tabNewState,
    };
    dispatch(setTabStateAction(payload));
  }, [tabNewState]);

  return (
    <div className={styles.tabWrapper}>
      <TabComponent
        tabdata={tabdata}
        id="edit-professional-tab"
        tabState={tabState[tabKey]}
        onStateChange={setTabNewState}
      />
    </div>
  );
}

export default EditResultsClaimsProfessional;
