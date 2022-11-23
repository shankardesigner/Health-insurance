import { useEffect, useState } from 'react';
import TabComponent from '@components/TabComponent';

import HighCostEvents from './HighCostEvents'
import ClaimCategoryVariance from './ClaimCategoryVariance';
import DiagnosisPrevalence from './DiagnosisPrevalence';

/* redux part */
import {
    setTabStateAction,
    tabModelState,
} from "@slices/tabModelSlice";
import { useSelector, useDispatch } from "react-redux";

export default function NewModel() {
    const TestComponent = () => {
        return (
            <>Test Component</>
        )
    }
    const tabdata = [
        {
            name: 'High Cost Events/ Episodes',
            component: HighCostEvents,
        },
        {
            name: 'Diagnosis Prevalence',
            component: DiagnosisPrevalence,
        },
        {
            name: 'Claim Category Variance',
            component: ClaimCategoryVariance
        }
    ]

    const [tabNewState, setTabNewState] = useState(undefined);
    const { tabState, resStatus } = useSelector(tabModelState);
    const dispatch = useDispatch();

    const tabKey = "whatIfTabs";

    useEffect(()=>{
        const payload = {
            key: tabKey,
            data: tabNewState
        }
        dispatch(setTabStateAction(payload));
    }, [tabNewState]);

    return (
        <>
            <TabComponent tabdata={tabdata} id="what-if-tab" tabState={tabState[tabKey]} onStateChange={setTabNewState}/>
        </>
    )
}