import React, {useEffect} from 'react';
import { useSession } from "next-auth/client"
import DashboardLayout from '../components/Layout';
import Router from 'next/router';

const HomePage = () => {
  return (
    <DashboardLayout>
      <h2>Home Page</h2>
    </DashboardLayout>
  )
}

export default HomePage;

