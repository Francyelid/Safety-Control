import React, {useState, useEffect} from "react";
import { useSession, signIn, signOut } from "next-auth/client"
import NavSidebar from "./NavSidebar";
import BodyWrapper from "./BodyWrapper";
import { Button, Modal, TextField, InputAdornment, BoxProps, Menu, MenuItem ,ListItemButton, Toolbar, IconButton, Typography, Avatar, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Collapse, Backdrop, CircularProgress, Alert} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import  {Mail, Inbox, ExpandLess, ExpandMore, Home, Dashboard, EventAvailable, Storage, Person, ExitToApp, Lock} from "@material-ui/icons";
import useSWR from 'swr';
import cookie from 'js-cookie';
import Router from 'next/router';
import User from '../../api/models/UserModel';

function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        color: 'white',
        p: 1,
        m: 1,
        borderRadius: 1,
        textAlign: 'center',
        fontSize: 19,
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

const initialPass = {
  atualPass:"",
  pass1:"",
  pass2:""
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorEl);
  const [editError, setEditError] = useState('');
  const [editLinePass, setLinePass] = useState(initialPass);

  const handleClickProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  const handleLoadProfile = () => {
    setOpenModal(true);
    setLinePass(initialPass);
    setEditError("");
    handleCloseProfile();
  };

  function changeInputEdit (event: React.ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target;
    setLinePass({ ...editLinePass, [name]: value} );
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleCloseModal = () => setOpenModal(false);

  const updateValue = (e) => {
    e.preventDefault();
    
    var user = new User();

    if(!editLinePass.pass1 || !editLinePass.pass2)
    {
      setEditError("Preencha a nova senha corretamente.");
    }else if(editLinePass.pass1 != editLinePass.pass2)
    {
      setEditError("Nova senha não confere com o campo de confirmação.");
    }else{

      fetch('../../../api/servicos/User/userService', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPass: editLinePass.atualPass,
          newPass: editLinePass.pass1
        }),
      }).then((r) => {
          return r.json();
      })
      .then((data) => {
          if(data.error){
            var message = "";
            for (var key of Object.keys(data.error)) {
              var val = data.error[key];
              message += val + "; ";
            }
            setEditError(message);
          }else if(data)
          {
              alert("Senha alterada com sucesso.");
              handleCloseModal();
          }
      });
    }
    
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

  const [openLoading, setOpenLoading] = React.useState(false);
  const handleLoadingClose = () => {
    setOpenLoading(false);
  };
  const handleLoadingToggle = () => {
    setOpenLoading(!openLoading);
  };

  function ChangePage(url){
    handleLoadingToggle();
    Router.push(url);
  }
  
  function Logout() {    
    handleLoadingToggle();  
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
                <Home />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Dashboard"}>
            <ListItemButton selected={selectedIndex === 1} onClick={(e)=>{ toggleDrawer(false);ChangePage("/frontend/pages/dashboard");handleListItemClick(e, 1); }}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Ocorrencias"}>
            <ListItemButton selected={selectedIndex === 2} onClick={(e)=>{ toggleDrawer(false);ChangePage("/frontend/pages/event");handleListItemClick(e, 2); }}>
              <ListItemIcon>
                <EventAvailable />
              </ListItemIcon>
              <ListItemText primary={"Ocorrências"} />
            </ListItemButton>
          </ListItem>
          <ListItemButton onClick={e=>handleClick(e)}>
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Cadastros" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton selected={selectedIndex === 3} onClick={(e)=>{ toggleDrawer(false);ChangePage("/frontend/pages/user/userIndex");handleListItemClick(e, 3); }}>
                <ListItemIcon>
                  <Person />
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
                <ExitToApp />
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
          <Button
            id="basic-button"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={openProfile ? 'true' : undefined}
            onClick={handleClickProfile}
          >
            <Avatar>{(session && session.user)?  session.user.name[0].toUpperCase(): ""}</Avatar>
          </Button>
          
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openProfile}
            onClose={handleCloseProfile}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleLoadProfile}>
              <Lock/> Alterar Senha
            </MenuItem>
          </Menu>
          <div>
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Box component="form" alignItems="center" sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 2fr)'}}>
                  <Item><Typography variant="h4" align="center">Alterar Senha</Typography></Item>
                  <Item>
                      <TextField variant="outlined" label="Senha Atual" fullWidth type="password" name="atualPass" value={editLinePass.atualPass} onChange={changeInputEdit}
                      InputProps={{startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>),}}/>
                  </Item>
                  <Item>
                      <TextField variant="outlined" label="Nova Senha" fullWidth type="password" name="pass1"  value={editLinePass.pass1} onChange={changeInputEdit}
                      InputProps={{startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>),}} />
                  </Item>
                  <Item>
                      <TextField variant="outlined" label="Confirme a Nova Senha" type="password" fullWidth name="pass2"  value={editLinePass.pass2} onChange={changeInputEdit}
                      InputProps={{startAdornment: (<InputAdornment position="start"><Lock /></InputAdornment>),}} />
                  </Item>
                  <Item><Button color="secondary" size="large" variant = "contained" type="submit" onClick={updateValue}>Salvar</Button></Item>
                  {editError && 
                  <Item><Typography paragraph align="center" color="error">{editError}</Typography></Item>}
                </Box>
            </Box>
        </Modal>
        </div>
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
      <div>
      
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openLoading}
          onClick={handleLoadingToggle}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </Box>
  );
  }else{
    return (<p>Access Denied</p>);
  }
};

export default Layout;

