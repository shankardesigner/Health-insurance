import { useRouter } from 'next/router';
import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import NewModel from '@containers/NewModel'
import { globalAssumptionModelState } from "@slices/globalAssumptionAlice";
import { useEffect } from "react";
import {
    clientModelState,
    getLoa1ByIdAction,
    getLoa2ByIdAction,
    getPlansByIdAction,
    getPopulationSummaryAction,
    savePlanTypeOthers,
} from "@slices/clientModelSlice";
import {useDispatch, useSelector} from "react-redux";
// import { wrapper } from '../../../store';
// import {
//     listAction,
// } from "@slices/reportingModelSlice";

export default function EditModelPage() {
    const { modelDetail } = useSelector(globalAssumptionModelState);
    const { modelInfo } = useSelector(clientModelState);

    const dispatch = useDispatch();

    // check
    useEffect(() => {
        if (modelInfo.loa1Id === "") {
            if (modelDetail.loa1) {
                const payload = {
                    clientId: modelDetail.clientId,
                };
                dispatch(getLoa1ByIdAction(payload));
            }
        }
    }, [modelDetail]);
    // fetch programs or plan type list on loa1 changes
    useEffect(() => {
        if (
            modelInfo.modelId === "" &&
            modelInfo.clientId === "" &&
            modelInfo.modelName === ""
        ) {
            if (modelDetail.loa1) {
                const payload = {
                    clientId: modelDetail.clientId,
                    loa1Id: modelDetail.loa1,
                };
                dispatch(getPlansByIdAction(payload));
                dispatch(savePlanTypeOthers(modelDetail));
                dispatch(
                    getPopulationSummaryAction({
                        planTypeId: modelDetail?.planType,
                        clientId: modelDetail?.clientId,
                        loa1Id: modelDetail?.loa1,
                    })
                );
            }
        }
    }, [modelDetail.loa1]);
    const moduleInfo = {
        key: "EditModelPage",
        name: 'Edit Model'
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