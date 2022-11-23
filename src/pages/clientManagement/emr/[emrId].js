import SessionLayoutWrapper from "@containers/SessionLayoutWrapper";
import NewEmrModel from "@containers/EmrModel/NewEmrModel";
import { useRouter } from "next/router";

// import { wrapper } from '../../../store';
// import {
//     listAction,
// } from "@slices/reportingModelSlice";

import { useSelector, useDispatch } from "react-redux";

export default function NewEmrPage() {
  const router = useRouter();
  const emrId = router.query.emrId;
  
  const moduleInfo = {
    key: "NewEmrPage",
    name: "New EMR",
  };

  return (
    <>
      <SessionLayoutWrapper type="module" info={moduleInfo}>
        <NewEmrModel />
      </SessionLayoutWrapper>
    </>
  );
}
