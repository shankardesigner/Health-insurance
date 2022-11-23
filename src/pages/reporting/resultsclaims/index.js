import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import EditResultsClaims from '@containers/EditResultsClaims';
import EditResultsClaimsProfessional from '@containers/EditResultsClaimsProfessional';

import { wrapper } from '../../../store';
import {
    listAction,
} from "@slices/reportingModelSlice";

export default function ResultsClaims() {
    const router = useRouter();
    const headerPrefix = "Edit "
    const headerName = `${headerPrefix} ${router.query.serviceCategoryName}`;
    
    const moduleInfo = {
        name:  headerName,
        header: {
            displayBack: true
        }
    }

    let editClaimsServiceCategoryData = {
        clientId: "",
        loa1Id: "",
        serviceCategoryId: ""
    }

    editClaimsServiceCategoryData = {...editClaimsServiceCategoryData, ...router.query}

    

    const resultClaimsDropdown = [
        {
            name: 'All Claims Categories',
            subCategories: [
                { 
                    name: 'Inpatient Facility'
                },
                { 
                    name: 'Outpatient Facility'
                },
                { 
                    name: 'Professional'
                },
                { 
                    name: 'Other Services'
                },
                { 
                    name: 'RX'
                },
            ]
        },
    ];

    return (
        <>
            <SessionLayoutWrapper type="module" info={moduleInfo}>
                {editClaimsServiceCategoryData.serviceCategoryId === 'PROF_COM' && <EditResultsClaimsProfessional data={editClaimsServiceCategoryData}/>}
                {editClaimsServiceCategoryData.serviceCategoryId !== 'PROF_COM' && <EditResultsClaims data={editClaimsServiceCategoryData}/>}
            </SessionLayoutWrapper>
        </>
    )
}

export const getStaticProps = wrapper.getStaticProps(
    async ({ store, preview }) => {
        
        // await store.dispatch(listAction({}));
    }
);