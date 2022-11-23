import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import NewClientModel from '@containers/NewClientModel/index'

// import { wrapper } from '../../../store';
// import {
//     listAction,
// } from "@slices/reportingModelSlice";

import { useSelector, useDispatch } from "react-redux";

export default function NewClientPage() {
    
    const moduleInfo = {
        key: "NewClientPage",
        name: 'New Client Creation',
      
    }

    return (
        <>
            <SessionLayoutWrapper type="module" info={moduleInfo}>
                <NewClientModel />
            </SessionLayoutWrapper>
        </>
    )
}

// export const getStaticProps = wrapper.getStaticProps(
//     async ({ store, preview }) => {
//         
//         // await store.dispatch(listAction({}));
//     }
// );