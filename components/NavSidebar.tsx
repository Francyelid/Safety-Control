/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import { Navigation } from "../node_modules/react-minimal-side-navigation";
//import { useHistory, useLocation } from "react-router-dom";
import { useRouter } from 'next/router'
import Icon from "awesome-react-icons";
import React, { useState } from "react";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

export const NavSidebar = () => {
  //const history = useHistory();
  //const location = useLocation();
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <React.Fragment>
      {/* Sidebar Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      />

      <div className="absolute right-0">
        <a href="https://github.com/abhijithvijayan/react-minimal-side-navigation">
          View on GitHub
        </a>
      </div>

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
        <div className="flex items-center justify-center mt-10 text-center py-6">
          <span className="mx-2 text-2xl font-semibold text-black">
            react-minimal-side-navigation
          </span>
        </div>

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
              itemId: "/frontend/home",
              // Optional
              elemBefore: () => <Icon name="coffee" />
            },
            {
              title: "About",
              itemId: "/frontend/about",
              elemBefore: () => <Icon name="user" />,
              subNav: [
                {
                  title: "Projects",
                  itemId: "/frontend/projects",
                  // Optional
                  elemBefore: () => <Icon name="cloud-snow" />
                },
                {
                  title: "Members",
                  itemId: "/frontend/members",
                  elemBefore: () => <Icon name="coffee" />
                }
              ]
            },
            {
              title: "Another Tab",
              itemId: "/frontend/another",
              subNav: [
                {
                  title: "Teams",
                  itemId: "/frontend/teams"
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
                title: "Settings",
                itemId: "/frontend/settings",
                elemBefore: () => <Icon name="activity" />
              }
            ]}
            onSelect={({ itemId }) => {
              //history.push(itemId);
              router.push(itemId)
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
