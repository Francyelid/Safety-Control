import React, {useEffect} from 'react';
import { useSession } from "next-auth/client";
import Router from 'next/router';
import DashboardLayout from '../components/Layout';
import { GetStaticProps } from "next"
import Chart from "react-google-charts";
import { generateKeyPair } from "crypto";
import { type } from "os";
import { renderers } from "react-markdown";

import Combobox from '../components/Combobox';
import { title } from 'process';

import {Grid, Box, TextField, Button, Typography, BoxProps, InputAdornment } from '@material-ui/core';
import { Description, DescriptionOutlined, DescriptionRounded, DescriptionTwoTone } from '@material-ui/icons'

const generateData = () => {
  var randomNumber1 = Math.floor(Math.random() * 20) + 1;
  var randomNumber2 = Math.floor(Math.random() * 20) + 1;
  var randomNumber3 = Math.floor(Math.random() * 20) + 1;
  var randomNumber4 = Math.floor(Math.random() * 20) + 1;
  var randomNumber5 = Math.floor(Math.random() * 20) + 1;
  var randomNumber6 = Math.floor(Math.random() * 20) + 1;
  var randomNumber7 = Math.floor(Math.random() * 20) + 1;
  var randomNumber8 = Math.floor(Math.random() * 20) + 1;
  var randomNumber9 = Math.floor(Math.random() * 20) + 1;
  return [['Age', 'Weight'],
    [randomNumber1, randomNumber2],[randomNumber3, randomNumber4],
    [randomNumber5, randomNumber6],[randomNumber7, randomNumber8],[randomNumber9, randomNumber3],[randomNumber2, randomNumber1]
  ];
}

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

class Component extends React.Component<{}, { chartData: (string[] | number[])[] }> {
  constructor(props) {
    super(props);
    this.state ={ 
      chartData: generateData() 
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(
        { 
          chartData: generateData() 
        }
      );
    }, 3000)
  }

  render () {
    return (
      <Chart 
        height="35vh"
        chartType="ScatterChart"
        loader={<div>Loading Chart</div>}
        data={this.state.chartData}
        options={{
          colors: ['#8e0152', '#276419'],
          pointSize: 10,
          animation: {
            duration: 1000,
            easing: 'out',
            startup: true,
          },
          title: 'Age vs. Weight comparison',
          vAxis: {
            title: 'Age', 
            viewWindow: {
              max: 0,
              min: 20,
            },
          },
          hAxis: {
            title: 'Weight',
            viewWindow: {
              max: 25,
              min: 0,
            },
          },
          legend: { position: 'none' },
          enableInteractivity: true,
        }}
        rootProps={{ 'data-testid': '2' }}
      />
    )
  }
}


const generateDataColuna = () => {
  var randomNumber1 = Math.floor(Math.random() * 1000) + 1;
  var randomNumber2 = Math.floor(Math.random() * 1000) + 1;
  var randomNumber3 = Math.floor(Math.random() * 1000) + 1;
  var randomNumber4 = Math.floor(Math.random() * 1000) + 1;
  var randomNumber5 = Math.floor(Math.random() * 1000) + 1;
  var randomNumber6 = Math.floor(Math.random() * 1000) + 1;
  var randomNumber7 = Math.floor(Math.random() * 1000) + 1;
  var randomNumber8 = Math.floor(Math.random() * 1000) + 1;
  var randomNumber9 = Math.floor(Math.random() * 1000) + 1;
  return [
    ['Year', 'Sales', 'Expenses', 'Profit'],
    ['2014', randomNumber1.toString(), randomNumber2.toString(), randomNumber3.toString()],
    ['2015', randomNumber4.toString(), randomNumber5.toString(), randomNumber6.toString()],
    ['2016', randomNumber7.toString(), randomNumber8.toString(), randomNumber9.toString()],
    ['2017', randomNumber2.toString(), randomNumber3.toString(), randomNumber1.toString()]
  ];
}

class ComponentColuna extends React.Component<{}, { chartData: (string[])[] }> {
  constructor(props) {
    super(props);
    this.state ={ 
      chartData: generateDataColuna() 
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState(
        { 
          chartData: generateDataColuna() 
        }
      );
    }, 1500)
  }

  render () {
    return (
      <Chart
  height="35vh"
  chartType="Bar"
  loader={<div>Loading Chart</div>}
  data={this.state.chartData}
  options={{
    // Material design options
    chart: {
      title: 'Company Performance',
      subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    },
    chartArea: {
      width: '85%',
      height: '85%',
    },
    animation: {
      duration: 1000,
      easing: 'out',
      startup: true,
    },
    enableInteractivity: true,
  }}
  // For tests
  rootProps={{ 'data-testid': '2' }}
/>
     
    )
  }
}

  // Our sample dropdown options
  const optionsArray = ['Monday', 'Tuesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday']
  const teste = function (){
    alert("!");
  }

  const Dashboard = () => {

    const  [session] = useSession();

    useEffect(()=>{
      if(!session){
        Router.push('../../');
      }
    },[]);


    return (
      <DashboardLayout>
        <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{width:"100%"}}>
            <Box sx={{display:'grid',  minWidth:"100%"}}>
              <Box  sx={{display: 'grid',gap: 1,gridTemplateColumns: 'repeat(2, 1fr)', minHeight:"100%", minWidth:"100%"}}>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  <div>
                    <Component/>
                  </div>
                </Item>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height:"100%", width:"100%"}}>
                    <Box sx={{display:'grid', minWidth:"100%", gridTemplateColumns: 'repeat(1, 2fr)', marginTop:"5vh"}}>
                      <Item>
                        <Combobox title={"teste"} options={optionsArray}/>
                      </Item>
                      <Item>
                        <Combobox title={"teste"} options={optionsArray}/>
                      </Item>
                        <Item>
                        <Combobox title={"teste"} options={optionsArray}/>
                      </Item>
                    </Box>
                  </Grid>
                </Item>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  <div>
                    <ComponentColuna/>
                  </div>
                </Item>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{ height:"100%", width:"100%"}}>
                    <Box sx={{display:'grid', minHeight:"100%", minWidth:"100%", gridTemplateColumns: 'repeat(2, 1fr)', marginTop:"5vh",  marginLeft:"2vw"}}>
                      <Item ><Button style={{height:"100%"}} fullWidth onClick={() => teste()} color="secondary" size="large" variant = "contained" type="button" ><Description sx={{ fontSize: 40 }} name="instagram"  /></Button></Item>
                      <Item ><Button style={{height:"100%"}} fullWidth onClick={() => teste()} color="secondary" size="large" variant = "contained" type="button" ><DescriptionOutlined sx={{ fontSize: 40 }} name="instagram"  /></Button></Item>
                      <Item ><Button style={{height:"100%"}} fullWidth onClick={() => teste()} color="secondary" size="large" variant = "contained" type="button" ><DescriptionTwoTone sx={{ fontSize: 40 }} name="instagram"  /></Button></Item>
                      <Item ><Button style={{height:"100%"}} fullWidth onClick={() => teste()} color="secondary" size="large" variant = "contained" type="button" ><DescriptionRounded sx={{ fontSize: 40 }} name="instagram"  /></Button></Item>
                    </Box>
                  </Grid>
                </Item>
              </Box>
            </Box>
        </Grid>
      </DashboardLayout>
    )
  }
  
export default Dashboard;
