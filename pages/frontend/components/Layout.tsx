
import React from "react";
import NavSidebar from "./NavSidebar";
import BodyWrapper from "./BodyWrapper";
import { Button, AppBar, Toolbar, IconButton, Typography, Avatar, Box } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu"

const Layout = ({ children }) => {
  return (
    <Box style={{height:"100vh", background:"#6E4582"}}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <BodyWrapper>
        <Toolbar variant="dense" style={{ height:"10vh", background:"#030303"}}>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="white">
            Safety Control
          </Typography>
          <Avatar>K</Avatar>
        </Toolbar>
        <Box className="flex" style={{height:"90vh", background:"#6E4582"}}>
          <NavSidebar />
          <Box style={{height:"90vh",width:"95%", paddingTop:"10vh", paddingLeft:"3%"}}>
            <div
              className="content-box"
              style={{ flexGrow: 2, flexBasis: "0%" }}
            >
              {children}
            </div>
          </Box>
        </Box>
      </BodyWrapper>
    </Box>
  );
};

export default Layout;

