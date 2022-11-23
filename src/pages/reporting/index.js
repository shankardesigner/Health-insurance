import {useEffect} from 'react';
import Box from '@material-ui/core/Box';
import SessionLayoutWrapper from '@containers/SessionLayoutWrapper';
import TabComponent from '@components/TabComponent';

import Modeling from '@containers/Modeling'

import { wrapper } from '../../store';
import {Button, Paper} from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import Star from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarHalf from '@material-ui/icons/StarHalf';
// import {
//   listAction as ListReportingModels,
// } from "@slices/reportingModelSlice";

export default function Reporting(){

  const moduleInfo = {
    name: 'Risk Modeler',
    icon: '/graph-bar.svg'
  }

  const testComponent1 = function TestComponent() {
    return (
      <Box p={3}>Tab2</Box>
    )
  }

    function Item(props) {
        return (
            <Paper>
                <h2>{props.item.name}</h2>
                <p>{props.item.description}</p>

                <Button className="CheckButton">
                    Check it out!
                </Button>
            </Paper>
        )
    }

    const carouselComponent = function Example(props) {
        var items = [
            {
                name: "Random Name #1",
                description: "Probably the most random thing you have ever seen!"
            },
            {
                name: "Random Name #2",
                description: "Hello World!"
            }
        ]

        return (
            <div>
            <Carousel
                NextIcon=">>"
                PrevIcon="<<"
            >
                {
                    items.map((item, i) => <Item key={i} item={item}/>)
                }
            </Carousel>
            <div><Star htmlColor={'blue'}></Star></div>
            <div><StarHalf htmlColor={'blue'}></StarHalf></div>
            <div><StarOutlineIcon htmlColor={'blue'}></StarOutlineIcon></div>
            <div><StarOutlineIcon htmlColor={'blue'}></StarOutlineIcon></div>
            </div>
        )
    }

  const tabdata = [
    {
      name: 'Modeling',
      component: Modeling
    },
    {
      name: 'Admin Reports',
      component: testComponent1
    }
  ]


    return (
        <>
          <SessionLayoutWrapper type="module" info={moduleInfo}>
              {/* <TabComponent tabdata={tabdata} style={{
                padding: '0 20px'
              }}/> */}
              <Modeling />
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