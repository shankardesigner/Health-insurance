import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import NewModel from '@containers/NewModel'

// import { wrapper } from '../../../store';
// import {
//     listAction,
// } from "@slices/reportingModelSlice";

import {
    riskModelerState,
    recalculateSavingsAction,
} from "@slices/riskModelerSlice";
import { useSelector, useDispatch } from "react-redux";

export default function NewModelPage() {
    
    const dispatch = useDispatch();
    const forceRecalculate = () => {
        // dispatch(recalculateSavingsAction());
    }

    const moduleInfo = {
        key: "NewModelPage",
        name: 'New Model',
        header: {
            forceReload: true
        },
        actions: {
            forceRecalculate: forceRecalculate
        }
    }

    return (
        <>
            <SessionLayoutWrapper type="module" info={moduleInfo}>
                <NewModel />
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