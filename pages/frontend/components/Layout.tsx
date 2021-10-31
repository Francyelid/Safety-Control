import React, {useState, useEffect} from "react";
import { useSession, signIn, signOut } from "next-auth/client"
import NavSidebar from "./NavSidebar";
import BodyWrapper from "./BodyWrapper";
import { Button, AppBar,ListItemButton, Toolbar, IconButton, Typography, Avatar, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Collapse} from "@material-ui/core";
import MenuIcon  from "@material-ui/icons/Menu";
import  {Mail, Inbox, ExpandLess, ExpandMore} from "@material-ui/icons";
import useSWR from 'swr';
import cookie from 'js-cookie';
import Router from 'next/router';

const Layout = ({ children }) => {
  const [state, setStateDrawer] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const  [session, loading] = useSession();
  
  useEffect(()=>{
    if((!session)){
      Router.push('/');
    }
  }, [session, loading]);

  const [open, setOpen] = React.useState(true);

  const handleClick = (event) => {
    event.preventDefault();
    setOpen(!open);
  };


  const toggleDrawer =
    (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setStateDrawer(open);
    };

    const handleListItemClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: number,
    ) => {
      setSelectedIndex(index);
    };

  /*let {data, error, mutate} = useSWR('../../api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });*/

  function ChangePage(url){
    Router.push(url);
  }
  
  function Logout() {      
    signOut();
  };

  const list = () => (
    <Box
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader">
          <ListItem key={"home"}>
            <ListItemButton selected={selectedIndex === 0} onClick={(e)=>{ toggleDrawer(false);ChangePage("/frontend/pages/home");handleListItemClick(e, 0); }}>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Dashboard"}>
            <ListItemButton selected={selectedIndex === 1} onClick={(e)=>{ toggleDrawer(false);ChangePage("/frontend/pages/dashboard");handleListItemClick(e, 1); }}>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Ocorrencias"}>
            <ListItemButton selected={selectedIndex === 2} onClick={(e)=>{ toggleDrawer(false);ChangePage("/frontend/pages/event");handleListItemClick(e, 2); }}>
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary={"Ocorrências"} />
            </ListItemButton>
          </ListItem>
          <ListItemButton onClick={e=>handleClick(e)}>
            <ListItemIcon>
              <Inbox />
            </ListItemIcon>
            <ListItemText primary="Cadastros" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton selected={selectedIndex === 3} onClick={(e)=>{ toggleDrawer(false);ChangePage("/frontend/pages/user/userIndex");handleListItemClick(e, 3); }}>
                <ListItemIcon>
                  <Inbox />
                </ListItemIcon>
                <ListItemText primary="Usuário" />
              </ListItemButton>
            </List>
          </Collapse>
      </List>
      <Divider />
      <List className="absolute bottom-0 w-full my-8">
          <ListItem key="Logout">
            <ListItemButton selected={selectedIndex === 5}  onClick={(e)=>{Logout();handleListItemClick(e, 5)}}> 
              <ListItemIcon>
                <Mail />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  if (loading) 
    return (<Box style={{height:"100vh", background:"#6E4582"}}></Box>);

  if(session){
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
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="left"
            open={state}
            onClose={toggleDrawer(false)}
          >
            {list()}
          </Drawer>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color="white">
            Safety Control
          </Typography>
          <Avatar>K</Avatar>
        </Toolbar>
        <Box className="flex" style={{height:"90vh", background:"#6E4582"}}>
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
  }else{
    return (<p>Access Denied</p>);
  }
};

export default Layout;

