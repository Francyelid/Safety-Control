import React, {useEffect} from 'react';
import { useSession } from "next-auth/client";
import Router from 'next/router';
import Typography from '@material-ui/core/Typography';

import DashboardLayout from '../components/Layout';
import TopsonList from '../components/TopsonList';

const EventsPage = () => {
  return (
    <DashboardLayout>
      <TopsonList/>
    </DashboardLayout>
  )
}

export default EventsPage;