import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import Configure from '../../../containers/ClientModel/Configure';
import TabComponent from '@components/TabComponent';
import Box from '@material-ui/core/Box';
import Location from "../../../containers/ClientModel/Location";
import Providers from "../../../containers/ClientModel/ProvidersModel";
import Emrs from "../../../containers/ClientModel/Emrs";

export default function NewClientPage() {
    
    const moduleInfo = {
        key: "practices",
        name: 'Alpha IPA',
      
    }

    const testComponent1 = function TestComponent() {
        return (
          <Box p={3}>Payers</Box>
        )
      }
    
      const tabdata = [
        {
          name: 'Practices',
          component: Configure
        },
        {
          name: 'Location',
          component: Location
        },
        {
          name: 'Providers',
          component: Providers
        },
        {
          name: 'EMRs',
          component: Emrs
        },
        {
            name: 'Payers',
            component: testComponent1
          },
          {
            name: 'Practice Management System',
            component: testComponent1
          }
      ]
    
    
        return (
            <>
              <SessionLayoutWrapper type="module" info={moduleInfo}>
                  <TabComponent tabdata={tabdata}/>
              </SessionLayoutWrapper>
            </>
          )

}
