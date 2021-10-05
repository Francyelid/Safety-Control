import React from 'react';

import DashboardLayout from '../components/Layout';
import TopsonList from '../components/TopsonList';

const EventsPage = () => {
  return (
    <DashboardLayout>
      <h2>Ocorrências Page</h2>
      <TopsonList/>
    </DashboardLayout>
  )
}

export default EventsPage;