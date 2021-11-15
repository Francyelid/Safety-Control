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
        color: 'white',
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



  const quantityArray = Array(30).fill(0).map((e, i)=> e = (i+1).toString())
  const periodTypeArray = ['Ano', 'Mês', 'Dia', 'Hora']
  const periodTypeObject = { 'Ano':1, 'Mês':2, 'Dia':3, 'Hora':4}

  const teste = function (){
    alert("!");
  }

  const HomePage = () => {

    const  [session] = useSession();
    const [dataArray, setDataArray] = useState([["Data","Quantidate"],["01/01/2000",0]]);
    const [now, setNow] = useState(0);
    const [ocurred, setOcurred] = useState(0);
    
    
    useEffect(()=>{

      if(!session){
        Router.push('../../');
      }

      DataReturned();   

      
    },[]);

    const DataReturned = () => {
      fetch('../../api/servicos/Control/controlService', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((resultControl) => {
        fetch('../../api/servicos/Epis/episService', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((resultEpi) => {
          resultEpi.json().then((resEpi) => {
            resultControl.json().then((resControl) => {
              
              setNow(0);
              setOcurred(0);
              let temp_now = 0;
              let temp_ocurred = 0;
              var resultData = [];
              resultData.push(["Data","Quantidate"]);
              let resultRows = resControl.map(function(row) { 
                function findEpi(inv) {
                  return inv["id"] === row["epi_id"];
                }
                let epiFinded = resEpi.find(findEpi)   
    
                let startDate = new Date(row["start_date"]);   
                let endDate = new Date(row["end_date"]);                       
                let diff = endDate.getTime() - startDate.getTime();   
                
                let statusControl =  diff < 0 ? 'true' : 'false'
                temp_now = statusControl == 'true' ? temp_now+1: temp_now;
                temp_ocurred = statusControl == 'false' ? temp_ocurred+1: temp_ocurred;
                
                  var dt = new Date();
                  dt.setDate(dt.getDay() - 1);
                  if(new Date(row["start_date"]) > dt){
                    return new Date(row["start_date"]).getDay().toString()  +"/"+  new Date(row["start_date"]).getMonth().toString() +"/"+ new Date(row["start_date"]).getFullYear().toString();
                  }
                 
                 
               
              });
             
              setNow(temp_now);
              setOcurred(temp_ocurred);
              let ResultObject = resultRows.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null))

              for (const [day, qtd] of Object.entries(ResultObject)) {
                resultData.push([day,qtd]);
              }
              setDataArray(resultData)

              
            })
          })
        })
      })
    }
    

    return (
      <DashboardLayout>
        <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{width:"100%"}}>
            <Box sx={{display:'grid',  minWidth:"100%"}}>
              <Box  sx={{display: 'grid',gap: 1,gridTemplateColumns: 'repeat(2, 1fr)', minHeight:"100%", minWidth:"100%"}}>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  <div>
                  <Chart 
                    height="35vh"
                    chartType="ScatterChart"
                    loader={<div>Loading Chart</div>}
                    data={dataArray}
                    options={{
                      colors: ['#8e0152', '#276419'],
                      pointSize: 10,
                      animation: {
                        duration: 1000,
                        easing: 'out',
                        startup: true,
                      },
                      title: 'Data vs. Quantidade Detecções',
                      vAxis: {
                        title: 'Quantidate',                         
                        viewWindow: {
                          max: 100,
                          min: 0,
                        },
                      },
                      hAxis: {
                        title: 'Data',
                      },
                      legend: { position: 'none' },
                      enableInteractivity: true,
                    }}
                    rootProps={{ 'data-testid': '2' }}
                  />
                  </div>
                </Item>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height:"100%", width:"100%"}}>
                    <Box sx={{display:'grid', minWidth:"100%", gridTemplateColumns: 'repeat(1, 2fr)', marginTop:"5vh"}}>                     
                      <Item >
                          <Button style={{height:"100%"}} fullWidth onClick={() => DataReturned()} color="primary" size="large" variant = "contained" type="button" >
                            <UpdateOutlined sx={{ fontSize: 40 }} name="update"  />
                          </Button>
                      </Item>
                      <Item >
                          <Button style={{height:"100%"}} fullWidth onClick={() => {}} color="primary" size="large" variant = "contained" type="button" >
                            <TextField value={now} readOnly={true}></TextField>
                          </Button>
                      </Item>
                      <Item >
                          <Button style={{height:"100%"}} fullWidth onClick={() => {}} color="primary" size="large" variant = "contained" type="button" >
                          <TextField   value={ocurred} readOnly={true}></TextField>
                          </Button>
                      </Item>
                    </Box>
                  </Grid>
                </Item>
               
              </Box>
            </Box>
        </Grid>
      </DashboardLayout>
    )
  }
  
export default HomePage;