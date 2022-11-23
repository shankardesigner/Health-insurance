import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import CompareImpact from '@containers/NewModel/CompareImpact'

export default function WhatIfPage() {
    const moduleInfo = {
        name: 'Compare the impact'
    }

    return (
        <>
            <SessionLayoutWrapper type="module" info={moduleInfo}>
                <CompareImpact />
            </SessionLayoutWrapper>
        </>
    )
}