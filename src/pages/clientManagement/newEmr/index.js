import SessionLayoutWrapper from "@containers/SessionLayoutWrapper";
import NewEmrModel from "@containers/EmrModel/NewEmrModel";

// import { wrapper } from '../../../store';
// import {
//     listAction,
// } from "@slices/reportingModelSlice";

import { useSelector, useDispatch } from "react-redux";

export default function NewEmrPage() {
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

// export const getStaticProps = wrapper.getStaticProps(
//     async ({ store, preview }) => {
//         
//         // await store.dispatch(listAction({}));
//     }
// );
