import SessionLayoutWrapper from "@containers/SessionLayoutWrapper";
import ConfigureEmrModel from "@containers/EmrModel/ConfigureEmrModel";
import { useRouter } from "next/router";
// import { wrapper } from '../../../store';
// import {
//     listAction,
// } from "@slices/reportingModelSlice";

import { useSelector, useDispatch } from "react-redux";

export default function ConfigureEmr() {
  const router =useRouter();
  const practiceName =router.query.practice;
  
  const moduleInfo = {
    key: "NewEmrPage",
    name: "New EMR for" + ' ' +practiceName  ,
  };

  return (
    <>
      <SessionLayoutWrapper type="module" info={moduleInfo}>
        <ConfigureEmrModel />
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
