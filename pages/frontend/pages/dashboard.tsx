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
import { Description, DescriptionOutlined, DescriptionRounded, DescriptionTwoTone } from '@material-ui/icons'
/*
const generateData = () => {
  
  return 
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
*/

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


/*

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
*/

  const quantityArray = Array(30).fill(0).map((e, i)=> e = i+1)
  const periodTypeArray = ['Ano', 'Mês', 'Dia', 'Hora']

  const teste = function (){
    alert("!");
  }

  const Dashboard = () => {

    const  [session] = useSession();
    const [episArray, setEpisArray] = useState([]);
    const [dataArray, setDataArray] = useState([["Data","Quantidate"],["01/01/2000",0]]);
    const [excelData, setExcelData] = useState([]);

    const getCsvData = () => {
      const csvData = [[['status'],['id'],['epi'],['description'],['start_date'],['end_date']]];
              let i;
              for (i = 0; i < excelData.length; i += 1) {
                  csvData.push([
                  [excelData[i].column_one], 
                  [excelData[i].column_two], 
                  [excelData[i].column_three], 
                  [excelData[i].column_four],  
                  [excelData[i].column_five], 
                  [excelData[i].column_six]
                ]);
              }
              return csvData;
      
  };
    
    useEffect(()=>{

      if(!session){
        Router.push('../../');
      }
      
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
              
              let resultRows = resControl.map(function(row) { 
                function findEpi(inv) {
                  return inv["id"] === row["epi_id"];
                }
                let epiFinded = resEpi.find(findEpi)   
    
                let startDate = new Date(row["start_date"]);   
                let endDate = new Date(row["end_date"]);                       
                let diff = endDate.getTime() - startDate.getTime();   
                
                let statusControl =  diff < 0 ? 'true' : 'false'
                //console.log(row["start_date"])
                return [new Date(row["start_date"]).getDay(), new Date(row["start_date"]).getMonth(), new Date(row["start_date"]).getFullYear(), new Date(row["start_date"])]
              })//.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
              //https://living-sun.com/pt/javascript/402373-how-to-generate-excel-through-javascript-closed-javascript-excel.html
              //console.log(resultRows)
            })
          })
        })
      })

      fetch('../../api/servicos/Epis/episService', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((result) => {
        result.json().then((res) => {
          let episName = res.map(function(row) {
            return row["name"];
          })
          setEpisArray(episName);
        })
      })

      setInterval(() => {
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
                 // console.log(row["start_date"])
                  return new Date(row["start_date"]).getDay().toString()  +"/"+  new Date(row["start_date"]).getMonth().toString() +"/"+ new Date(row["start_date"]).getFullYear().toString();
                 // return [new Date(row["start_date"]).getDay(), new Date(row["start_date"]).getMonth(), new Date(row["start_date"]).getFullYear(), new Date(row["start_date"])]
                });
               
                let ResultObject = resultRows.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null))/*.map(function(item) {
                  console.log(item)
                  //resultData.push(["Data","Quantidate"])
                });*/
                for (const [day, qtd] of Object.entries(ResultObject)) {
                  resultData.push([day,qtd]);
                }
                //console.log(resultData)
                
                //.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
                //https://living-sun.com/pt/javascript/402373-how-to-generate-excel-through-javascript-closed-javascript-excel.html
                //return
                //console.log(resultRows)
                setDataArray(resultData)

                let rows = resControl.map(function(row) { 
                  function findEpi(inv) {
                    return inv["id"] === row["epi_id"];
                  }
                  let epiFinded = resEpi.find(findEpi)   
  
                  let startDate = new Date(row["start_date"]);   
                  let endDate = new Date(row["end_date"]);                       
                  let diff = endDate.getTime() - startDate.getTime();   
                  
                  let statusControl =  diff < 0 ? 'true' : 'false'
                  return {
                    "column_one": statusControl,
                    "column_two": row["id"],
                    "column_three": epiFinded.name,
                    "column_four": row["description"],
                    "column_five": row["start_date"],
                    "column_six": row["end_date"]
                  }
                })
                setExcelData(rows);
              })
            })
          })
        })
        
      }, 60000)
      
    },[]);

    

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
                      <Item>
                        <Combobox title={"Tipo de EPI"} options={episArray} unselect={"Selecione o tipo do epi"}/>
                      </Item>
                      <Item>
                        <Combobox title={"Tipo Periodo Analisado"} options={periodTypeArray} unselect={"Selecione o tipo do periodo"}/>
                      </Item>
                      <Item>
                        <Combobox title={"Quantidade Analisada"} options={quantityArray} unselect={"Selecione a quantidade"}/>
                      </Item>
                    </Box>
                  </Grid>
                </Item>
                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{ height:"100%", width:"100%"}}>
                    <Box sx={{display:'grid', minHeight:"100%", minWidth:"100%", gridTemplateColumns: 'repeat(2, 1fr)', marginTop:"5vh",  marginLeft:"2vw"}}>
                      <Item >
                        <CSVLink filename="O4F.csv" data={getCsvData()}>
                          <Button style={{height:"100%"}} fullWidth onClick={() => teste()} color="primary" size="large" variant = "contained" type="button" >
                            <DescriptionOutlined sx={{ fontSize: 40 }} name="instagram"  />
                          </Button>
                        </CSVLink>
                      </Item>
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
/*

                <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                  <div>
                    <ComponentColuna/>
                  </div>
                </Item>
*/