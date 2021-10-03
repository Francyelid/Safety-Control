import React from "react";
//import { BrowserRouter, Switch, Route } from "react-router-dom";
import Link from 'next/link'
import SettingsPage from "./settings";
import ProjectsPage from "./projects";
import MembersPage from "./members";
import AboutPage from "./about";
import TeamsPage from "./teams";
import HomePage from "./home";

const Routes = () => {
  return (
    
      <ul> <li>
      <Link href="/home">
        <HomePage />
      </Link>
    </li>
      <li>
        <Link href="/about/members">
          <MembersPage />
        </Link>
      </li>
      <li>
        <Link href="/about">
          <AboutPage />
        </Link>
      </li>
      <li>
        <Link href="/about/projects">
        <ProjectsPage />
        </Link>
      </li>
      <li>
        <Link href="/another/teams">
        <TeamsPage />
        </Link>
      </li>
      <li>
        <Link href="/settings">
        <SettingsPage />
        </Link>
      </li>
    </ul>
  );
};

export default Routes;
