import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';
import {Grid, Box, TextField, Button, Typography, BoxProps, InputAdornment, Backdrop, CircularProgress } from '@material-ui/core';
import { MailOutline, LockOutlined } from '@material-ui/icons'
import { debug } from 'console';
import { useSession, signIn, signOut } from "next-auth/client"
import { useRouter} from 'next/router'
import Link from 'next/link'
import style from "../../../styles/login.module.css"

const LoginPage = () => {
  const [loginError, setLoginError] = useState('');
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  const [failValidation, setFailValidation] = useState('');
  const [session] = useSession();

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(()=>{
    if(session && session.user){
      Router.push('./frontend/pages/home');
    }
  },[]);

  function Item(props: BoxProps) {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
          color: 'white',
          padding: '1vh',
          margin: '1vh',
          borderRadius: 1,
          textAlign: 'center',
          minHeight: '5vh',
          maxHeight: '10vh', 
          ...sx,
        }}
        {...other}
      />
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    handleToggle();
    var email = (document.getElementById('email') as (HTMLInputElement)).value;
    var password = (document.getElementById('password') as (HTMLInputElement)).value;
    
    if(!email)
    {
      setLoginError("E-mail precisa ser preenchido");
      setFailValidation('true');
      handleClose();
    }else if(!password){
      setLoginError("Senha precisa ser preenchida");
      setFailValidation('true');
      handleClose();
    }else{
      var result = await signIn("credentials", { redirect: false, email: email, password:password });
      
      if(result.error)
      {
        if(result.error == "CredentialsSignin")
          setLoginError("E-mail ou senha invalido");
        else
          setLoginError(result.error);
        setFailValidation('true');
      }else if(result.ok){
        Router.push('./frontend/pages/home');
      }
      handleClose();
    }
    
  }

  return (
    <React.Fragment>
      <Grid container justifyContent="center" alignItems="end" padding="20px" direction="column" spacing={5} style={{minHeight:"100vh", background:"#FFFFFF", 
                                                                                                        backgroundImage: "url(https://github.com/Francyelid/Safety-Control/blob/main/pages/frontend/components/background/inital_background.png?raw=true)",
                                                                                                        backgroundRepeat: 'no-repeat',
                                                                                                        backgroundPositionX: "0%",
                                                                                                        backgroundSize: "70%"}}>

              <form style={{height:"50vh", width:"50vw", display:"grid"}} onSubmit={handleSubmit}>

              <img
                width = "50%"
                height = "auto"
                style={{justifySelf:"end"}}
                src = "https://raw.githubusercontent.com/Francyelid/Safety-Control/main/pages/frontend/components/background/logo_purple.png"/>

                
                <Box boxShadow={20} borderRadius={2} style={{background:"#333333", display:"grid", gap:5, boxShadow:"2px 2px 5px #7E5095", width:"50%", justifySelf:"end"}}>
                  <Box  alignItems="center" sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)'}}>
                    <Item><Typography variant="h4" fontSize="4vh" align="center">Login</Typography></Item>
                    <Item>
                        <TextField className={style.textFieldLogin} variant="outlined" error={failValidation==='true'} placeholder="E-mail" fullWidth id="email" 
                        InputProps={{startAdornment: (<InputAdornment position="start" className={style.iconInput}><MailOutline/></InputAdornment>),}}/>
                    </Item>
                    <Item>
                        <TextField variant="outlined" className={style.textFieldLogin} error={failValidation==='true'} placeholder="Senha" type="password" fullWidth id="password" 
                        InputProps={{startAdornment: (<InputAdornment position="start" className={style.iconInput}><LockOutlined/></InputAdornment>),}} />
                    </Item>
                    <Item><Button style={{minHeight:"5vh", maxHeight:"8vh", minWidth:"10vw", fontSize:"1.5vh"}} color="secondary" size="large" variant = "contained" type="submit" >Entrar</Button></Item>
                
                    {loginError && 
                    <Item><Typography paragraph align="center" color="error">{loginError}</Typography></Item>}
                  </Box>
                </Box>
              </form>
      </Grid>
      <div>
      
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </React.Fragment>
  );
};

LoginPage.getInitialProps = async({query}) => {
  return {query}
}

export default LoginPage;
