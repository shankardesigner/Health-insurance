import {useEffect} from 'react';
import Box from '@material-ui/core/Box';


import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import QuestionMap from '@containers/QuestionMap';

import { wrapper } from '../../store';
// import {
//   listAction as ListReportingModels,
// } from "@slices/reportingModelSlice";

export default function QuestionMapPage(){

  const moduleInfo = {
    name: 'Question Map', 
    icon: '/graph-bar.svg'
  }


    return (
        <>
          <SessionLayoutWrapper type="module" info={moduleInfo}>
              <QuestionMap/>
          </SessionLayoutWrapper>
        </>
      )
}

export const getStaticProps = wrapper.getStaticProps(
  async ({store, preview}) => {
     
    //  await store.dispatch(ListReportingModels({})); // calling from here will save reducer in server (redux-persist wont work)
    //  await store.dispatch(ListClients({}));
 }
);