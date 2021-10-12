import React from 'react';
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