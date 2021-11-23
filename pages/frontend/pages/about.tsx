import React, {useEffect, useState} from 'react';
import { useSession } from "next-auth/client";
import Router from 'next/router';
import DashboardLayout from '../components/Layout';
import { GetStaticProps } from "next"
import Chart from "react-google-charts";
import { generateKeyPair } from "crypto";
import { type } from "os";
import { renderers } from "react-markdown";
import { CSVLink } from 'react-csv';
import Combobox from '../components/Combobox';
import { title } from 'process';

import {Grid, Box, TextField, Button, Typography, BoxProps, InputAdornment } from '@material-ui/core';
import { Description, DescriptionOutlined, DescriptionRounded, DescriptionTwoTone, UpdateOutlined } from '@material-ui/icons'


function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        height:"90%",
        bgcolor: 'primary.main',
        color: 'black',
        p: 1,
        borderRadius: 1,
        textAlign: 'center',
        fontSize: 19,
        ...sx,
      }}
      {...other}
    />
  );
}



  const AboutPage = () => {

    const  [session] = useSession();
    const [dataArray, setDataArray] = useState([["Data","Quantidate"],["01/01/2000",0]]);
    const [now, setNow] = useState(0);
    const [ocurred, setOcurred] = useState(0);
    
    
    useEffect(()=>{

      if(!session){
        Router.push('../../');
      }
      
    },[]);

    

    return (
      <DashboardLayout>
        <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{width:"100%"}}>
            <Box sx={{display:'grid',  minWidth:"100%"}}>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  Sobre
                </Item>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  Projeto desenvolvido para a absorção dos conceitos vistos relacionados durante
                   a graduação como avaliação da disciplina de Projeto Integrado em Engenharia de 
                   Computação I do oitavo semestre do curso de Engenharia de Computação.
                </Item>
            </Box>
        </Grid>
      </DashboardLayout>
    )
  }
  
export default AboutPage;