/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import { Navigation } from "../../../node_modules/react-minimal-side-navigation";
//import { useHistory, useLocation } from "react-router-dom";
import {  useRouter } from 'next/router'
import Router from 'next/router'
import Icon from "awesome-react-icons";
import React, { useState } from "react";
import useSWR from 'swr';
import cookie from 'js-cookie';

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

export const NavSidebar = () => {
  //const history = useHistory();
  //const location = useLocation();
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  let {data, error, mutate} = useSWR('../../api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });

  function Logout() {      
      console.log('logout')   
      console.log(data) 
      cookie.remove('token');
      mutate(data,true)
      console.log('aqui')
      console.log(data) 
      Router.push('/frontend/pages/login');
  };

  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }

  return (
    <React.Fragment>
      {/* Sidebar Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      />

      <div>
        <button
          className="btn-menu"
          onClick={(): void => setIsSidebarOpen(true)}
          type="button"
        >
          <Icon name="burger" className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
        }`}
      >
        {/* https://github.com/abhijithvijayan/react-minimal-side-navigation */}
        <Navigation
          activeItemId={router.pathname}
          onSelect={({ itemId }) => {
            //history.push(itemId);
            router.push(itemId)
          }}
          items={[
            {
              title: "Home",
              itemId: "/frontend/pages/home",
              // Optional
              elemBefore: () => <Icon name="coffee" />
            },
            {
              title: "About",
              itemId: "/frontend/pages/about",
              elemBefore: () => <Icon name="user" />,
              subNav: [
                {
                  title: "Projects",
                  itemId: "/frontend/pages/projects",
                  // Optional
                  elemBefore: () => <Icon name="cloud-snow" />
                },
                {
                  title: "Members",
                  itemId: "/frontend/pages/members",
                  elemBefore: () => <Icon name="coffee" />
                }
              ]
            },
            {
              title: "Another Tab",
              itemId: "/frontend/pages/another",
              subNav: [
                {
                  title: "Teams",
                  itemId: "/frontend/pages/teams"
                  // Optional
                  // elemBefore: () => <Icon name="calendar" />
                }
              ]
            }
          ]}
        />

        <div className="absolute bottom-0 w-full my-8">
          <Navigation
            activeItemId={router.pathname}
            items={[
              {
                title: "Logout",
                itemId: "/frontend/pages/login",
                elemBefore: () => <Icon name="activity" />
              }
            ]}
            onSelect={({ itemId }) => {
              //history.push(itemId);
              //router.push(itemId)
              Logout()
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
