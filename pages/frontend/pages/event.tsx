import React, {useEffect} from 'react';
import { useSession } from "next-auth/client";
import Router from 'next/router';
import Typography from '@material-ui/core/Typography';

import DashboardLayout from '../components/Layout';
import TopsonList from '../components/TopsonList';
import {Grid} from '@material-ui/core';

const EventsPage = () => {
  return (
    <DashboardLayout>
      <Grid container justifyContent="center" alignItems="flex-start" direction="column" spacing={5} style={{width:"100%",height:"100%", background:"#FFFFFF", 
        backgroundImage: "url(https://raw.githubusercontent.com/Francyelid/Safety-Control/main/pages/frontend/components/background/list_background.png)",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: "100%"
        }}>
        <TopsonList/>
      </Grid>
      
    </DashboardLayout>
  )
}

export default EventsPage;