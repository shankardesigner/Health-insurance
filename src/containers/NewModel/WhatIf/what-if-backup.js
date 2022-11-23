import { useEffect, useState } from 'react';
import TableComponent from '@components/TableComponent';
import ModelResultBox from '../../ModelResultBox';
import Box from '@material-ui/core/Box';

/* redux part */
import {
    setTabStateAction,
    tabModelState,
} from "@slices/tabModelSlice";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/router'

export default function WhatIf() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const { tabState, resStatus } = useSelector(tabModelState);

    const handleEditAction = (selectedRow) =>{
        const tabKey = "whatIfTabs";
        const payload = {
            key: tabKey,
            data: {
                ...tabState[tabKey], 
                lastactive: selectedRow.id
            }
        }
        
        dispatch(setTabStateAction(payload));
        router.push('/reporting/whatif');
    }
    const whatIfList = [
        { id: 0, title: 'High Cost Events/Episodes' },
        { id: 1, title: 'Diagnosis Prevalence' },
        { id: 2, title: 'Claim Category Variance' },
    ]
    const columns = [
        { name: '', component: 'TextComponent', sourceKey: 'title' },
        { name: '', component: 'TextComponent', sourceKey: 'ACTION' } // for edit and results action
    ]

    const actions = [
        // { name: 'Edit', component: 'RouteComponent', data: { href: '/reporting/whatif', params: [] } }
        { name: 'Edit', icon: '/edit-icon.svg' ,component: 'CallbackComponent', attributes: { callback: handleEditAction } }
    ]
    return (
        <Box p={3}>
            <TableComponent headers={columns}
                data={whatIfList} actions={actions} key={1}
                options={{ displayPagination: false }}
                activeTabIndex={activeTabIndex}
            />
            <ModelResultBox next='nemo-tab-7' displayButton={false}/>
        </Box>
    )
}