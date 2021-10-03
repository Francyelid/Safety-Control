import React from "react";
//import { BrowserRouter, Switch, Route } from "react-router-dom";
import Link from 'next/link'

import LoginPage from "./login";
import SettingsPage from "./settings";
import ProjectsPage from "./projects";
import MembersPage from "./members";
import AboutPage from "./about";
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
        <Link href="/frontend/home">
          <HomePage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/members">
          <MembersPage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/about">
          <AboutPage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/projects">
          <ProjectsPage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/teams">
        <TeamsPage />
        </Link>
      </li>
      <li>
        <Link href="/frontend/settings">
          <SettingsPage />
        </Link>
      </li>
    </ul>
  );
};

export default Routes;
