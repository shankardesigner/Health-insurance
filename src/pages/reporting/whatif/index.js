import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import WhatIf from '@containers/WhatIf'

import {
    riskModelerState,
    recalculateSavingsAction,
} from "@slices/riskModelerSlice";
import { useSelector, useDispatch } from "react-redux";

export default function WhatIfPage() {

    const dispatch = useDispatch();
    const forceRecalculate = () => {
        // dispatch(recalculateSavingsAction());
    }

    const moduleInfo = {
        name: 'What If ?...',
        header: {
            displayBack: true,
            forceReload: true
        },
        actions: {
            forceRecalculate: forceRecalculate
        }
    }

    return (
        <>
            <SessionLayoutWrapper type="module" info={moduleInfo}>
                <WhatIf />
            </SessionLayoutWrapper>
        </>
    )
}