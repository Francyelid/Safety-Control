import React from "react";
//import { BrowserRouter, Switch, Route } from "react-router-dom";
import Link from 'next/link'

import LoginPage from "./login";
import SettingsPage from "./settings";
import ProjectsPage from "./projects";
import DashboardPage from "./dashboard";
import TeamsPage from "./teams";
import HomePage from "./home";


const Routes = () => {
  return (
    
    <ul> 
      <li>
        <Link href="/">
          <LoginPage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/pages/home">
          <HomePage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/pages/dashboard">
          <DashboardPage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/pages/projects">
          <ProjectsPage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/pages/teams">
        <TeamsPage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/pages/settings">
          <SettingsPage />
        </Link>
      </li>
    </ul>
  );
};

export default Routes;
