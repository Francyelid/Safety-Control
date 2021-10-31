import Routes from "./frontend/pages/_routes";


import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import LoginPage from './frontend/pages/login';
import Home from './frontend/pages/home';

const App = () => {
  //return   <Home></Home>
  return  <LoginPage/>
    
};

export default App;
