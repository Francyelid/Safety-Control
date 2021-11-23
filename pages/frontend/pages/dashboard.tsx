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

import {Grid, Box, TextField, Button, Typography, BoxProps, InputAdornment, Card, CardMedia, CardActions, CardContent, CardHeader, Avatar, Modal, Backdrop, CircularProgress } from '@material-ui/core';
import { Description, DescriptionOutlined, DescriptionRounded, DescriptionTwoTone, UpdateOutlined, VerifiedUser, EventAvailable,  GitHub } from '@material-ui/icons'
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

function Item2(props: BoxProps) {
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

  const quantityArray = Array(30).fill(0).map((e, i)=> e = (i+1).toString())
  const periodTypeArray = ['Ano', 'Mês', 'Dia', 'Hora']
  const periodTypeObject = { 'Ano':1, 'Mês':2, 'Dia':3, 'Hora':4}

  const Dashboard = () => {

    const  [session] = useSession();
    const [episArray, setEpisArray] = useState([]);
    const [dataArray, setDataArray] = useState([["Data","Quantidate"],["01/01/2000",0]]);
    const [excelData, setExcelData] = useState([]);
    const [excelDataFilter, setExcelDataFilter] = useState([]);
    const [excelDataFilterActive, setExcelDataFilterActive] = useState([]);
    const [excelDataFilterInactive, setExcelDataFilterInactive] = useState([]);
    const [selectedItemEpi, setSelectedItemEpi] = useState(null);
    const [selectedItemPeriodo, setSelectedItemPeriodo] = useState(null);
    const [selectedItemQuantidade, setSelectedItemQuantidade] = useState(null);
    const [now, setNow] = useState(0);
    const [ocurred, setOcurred] = useState(0);
    const [relationModal, setOpenRelationModal] = useState(false);

    const getCsvData = () => {
      const csvData = [[['status'],['id'],['epi'],['description'],['start_date'],['end_date']]];

              excelData.map((excel_item) => {
                csvData.push([
                  [excel_item.column_one], 
                  [excel_item.column_two], 
                  [excel_item.column_three], 
                  [excel_item.column_four],  
                  [excel_item.column_five], 
                  [excel_item.column_six]
                ]);
              })
                  
              
              return csvData;
      
  };

  const handleOpenRelationModal = () => {
    setOpenRelationModal(true);
  };

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

  const handleCloseRelationModal = () => {
    setOpenRelationModal(false);
  };

  const getCsvDataFilter = () => {
    const csvDataFilter = [[['status'],['id'],['epi'],['description'],['start_date'],['end_date']]];
            excelDataFilter.map((excel_item_f) => {
              csvDataFilter.push([
                [excel_item_f.column_one], 
                [excel_item_f.column_two], 
                [excel_item_f.column_three], 
                [excel_item_f.column_four],  
                [excel_item_f.column_five], 
                [excel_item_f.column_six]
              ]);
            })
            return csvDataFilter;
    
};

const getCsvDataFilterActive = () => {
  const csvDataFilterActive = [[['status'],['id'],['epi'],['description'],['start_date'],['end_date']]];
  excelDataFilterActive.map((excel_item_a) => {
            csvDataFilterActive.push([
              [excel_item_a.column_one], 
              [excel_item_a.column_two], 
              [excel_item_a.column_three], 
              [excel_item_a.column_four],  
              [excel_item_a.column_five], 
              [excel_item_a.column_six]
            ]);
          })
          return csvDataFilterActive;
  
};

const getCsvDataFilterInactive = () => {
  const csvDataFilterInactive = [[['status'],['id'],['epi'],['description'],['start_date'],['end_date']]];
  excelDataFilterInactive.map((excel_item_i) => {
            csvDataFilterInactive.push([
              [excel_item_i.column_one], 
              [excel_item_i.column_two], 
              [excel_item_i.column_three], 
              [excel_item_i.column_four],  
              [excel_item_i.column_five], 
              [excel_item_i.column_six]
            ]);
          })
          return csvDataFilterInactive;
  
};

    useEffect(()=>{

      if(!session){
        Router.push('../../');
      }
      
     /* fetch('../../api/servicos/Control/controlService', {
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
                return [new Date(row["start_date"]).getDate(), new Date(row["start_date"]).getMonth(), new Date(row["start_date"]).getFullYear(), new Date(row["start_date"])]
              })//.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
              //https://living-sun.com/pt/javascript/402373-how-to-generate-excel-through-javascript-closed-javascript-excel.html
              //console.log(resultRows)
            })
          })
        })
      })*/

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

      DataReturned();   

      setInterval(() => {
        DataReturned();        
      }, 600000)
      
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
              
              var resultData = [];
              resultData.push(["Data","Quantidate"]);
              console.log("selecionado" + selectedItemEpi)
              console.log("periodo" + selectedItemPeriodo + " quantidade" + selectedItemQuantidade)
              let dtf = new Date();
              if(selectedItemQuantidade != null){                
                switch (selectedItemPeriodo) {
                 case 'Ano':
                  dtf.setFullYear(dtf.getFullYear() - Number(selectedItemQuantidade));
                   break;
                 case 'Mês':
                  dtf.setMonth(dtf.getMonth() - Number(selectedItemQuantidade));
                   break;
                 case 'Dia':
                  dtf.setDate(dtf.getDate() - Number(selectedItemQuantidade));
                   break;
                 case 'Hora':
                  dtf.setHours(dtf.getHours() - Number(selectedItemQuantidade));
                   break;
                 default:
                  dtf.setHours(dtf.getHours() - 1);
                }
              }
              setNow(0);
              setOcurred(0);
              let temp_now = 0;
              let temp_ocurred = 0;
              let resultRows = [];
              let lastWeek = [];
              resControl.map(function(row) { 
                
                function findEpi(inv) {
                  return inv["id"] === row["epi_id"];
                }
                let epiFinded = resEpi.find(findEpi)   
    
                let startDate = new Date(row["start_date"]);   
                let endDate = new Date(row["end_date"]);                       
                let diff = endDate.getTime() - startDate.getTime();   
                
                let statusControl =  diff < 0 ? 'true' : 'false';
                
               // console.log(row["start_date"])
               
               if(selectedItemEpi == null || (epiFinded && epiFinded.name == selectedItemEpi)){
                 if(selectedItemQuantidade != null){ 
                   if((new Date(row["start_date"])) > dtf){ 
                    temp_now = statusControl == 'true' ? temp_now+1: temp_now;
                    temp_ocurred = statusControl == 'false' ? temp_ocurred+1: temp_ocurred;
                    resultRows.push( 
                      new Date(row["start_date"]).getDate().toString()  +"/"+  (new Date(row["start_date"]).getMonth()+1).toString() +"/"+ new Date(row["start_date"]).getFullYear().toString()
                    )
                   }
                 }else{
                  temp_now = statusControl == 'true' ? temp_now+1: temp_now;
                  temp_ocurred = statusControl == 'false' ? temp_ocurred+1: temp_ocurred;
                  resultRows.push( 
                    new Date(row["start_date"]).getDate().toString()  +"/"+  (new Date(row["start_date"]).getMonth()+1).toString() +"/"+ new Date(row["start_date"]).getFullYear().toString()
                  )
                 }
                 
                 
                 
               }
               
               // return [new Date(row["start_date"]).getDate(), new Date(row["start_date"]).getMonth(), new Date(row["start_date"]).getFullYear(), new Date(row["start_date"])]
              });

              debugger;
              resultRows.map((x) => {
                if(x.start_date >= new Date().getDate() - 7)
                {
                  lastWeek.push(x);
                }
              });

              setNow(temp_now);
              setOcurred(temp_ocurred);
             
              let ResultObject = resultRows.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null))/*.map(function(item) {
                console.log(item)
                //resultData.push(["Data","Quantidate"])
              });*/
              for (const [day, qtd] of Object.entries(ResultObject)) {
                resultData.push([day,qtd]);
              }
              if(resultData.length == 1){
                resultData.push([new Date().getDate().toString()  +"/"+  (new Date().getMonth()+1).toString() +"/"+ new Date().getFullYear().toString(),0]);
              }
              //console.log(resultData)
              
              //.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
              //https://living-sun.com/pt/javascript/402373-how-to-generate-excel-through-javascript-closed-javascript-excel.html
              //return
              //console.log(resultRows)
              
              setDataArray(resultData)


              var rowsFilterA = [];
              var rowsFilterI = [];

              let rows = resControl.map(function(row) { 
                function findEpi(inv) {
                  return inv["id"] === row["epi_id"];
                }
                let epiFinded = resEpi.find(findEpi)   

                let startDate = new Date(row["start_date"]);   
                let endDate = new Date(row["end_date"]);                       
                let diff = endDate.getTime() - startDate.getTime();   
                
                let statusControl =  diff < 0 ? 'true' : 'false'
                if(statusControl == 'true'){
                  rowsFilterA.push( {
                    "column_one": statusControl,
                    "column_two": row["id"],
                    "column_three": epiFinded.name,
                    "column_four": row["description"],
                    "column_five": row["start_date"],
                    "column_six": row["end_date"]
                  })
                }
                if(statusControl == 'false'){
                  rowsFilterI.push( {
                    "column_one": statusControl,
                    "column_two": row["id"],
                    "column_three": epiFinded.name,
                    "column_four": row["description"],
                    "column_five": row["start_date"],
                    "column_six": row["end_date"]
                  })
                }
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
              setExcelDataFilterActive(rowsFilterA);
              setExcelDataFilterInactive(rowsFilterI);

              let rowsFilter = [];
              resControl.map(function(row) { 
                
                function findEpi(inv) {
                  return inv["id"] === row["epi_id"];
                }
                let epiFinded = resEpi.find(findEpi)   

                let startDate = new Date(row["start_date"]);   
                let endDate = new Date(row["end_date"]);                       
                let diff = endDate.getTime() - startDate.getTime();   
                
                let statusControl =  diff < 0 ? 'true' : 'false'

                if(selectedItemEpi == null || (epiFinded && epiFinded.name == selectedItemEpi)){
                  if(selectedItemQuantidade != null){
                   if((new Date(row["start_date"])) > dtf){
                    rowsFilter.push( {
                      "column_one": statusControl,
                      "column_two": row["id"],
                      "column_three": epiFinded.name,
                      "column_four": row["description"],
                      "column_five": row["start_date"],
                      "column_six": row["end_date"]
                    })
                   }
                  }else{
                    rowsFilter.push( {
                      "column_one": statusControl,
                      "column_two": row["id"],
                      "column_three": epiFinded.name,
                      "column_four": row["description"],
                      "column_five": row["start_date"],
                      "column_six": row["end_date"]
                    })
                  }
                  
                  
                  
                }
               
              })
              
              setExcelDataFilter(rowsFilter);


              

             
              

            })
          })
        })
      })
    }

    return (
      <DashboardLayout>
        <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{width:"100%"}}>
            <Box sx={{display: 'grid',gap: 1,gridTemplateColumns: 'repeat(1, 1fr)', minHeight:"100%", minWidth:"100%"}}>
              <Grid container spacing={5} style={{width:"100%", marginLeft:"2vw"}}>
              <Grid item xs={2}>
                  <Card>
                    <CardHeader
                      avatar= {
                        <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
                          <VerifiedUser/>
                        </Avatar>
                      }
                      title="Ocorrências Pendentes"
                      subheader="até o momento"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Atualmente existem {now} ocorrencias que precisam de atenção.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={2}>
                  <Card >
                    <CardHeader
                      avatar= {
                        <Avatar sx={{ bgcolor: 'purple' }} aria-label="recipe">
                          <VerifiedUser/>
                        </Avatar>
                      }
                      title="Ocorrências Encerradas"
                      subheader="até o momento"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Atualmente existem {ocurred} ocorrencias encerradas.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardHeader
                      avatar= {
                        <Avatar sx={{ bgcolor: 'yellow' }} aria-label="recipe">
                          <VerifiedUser/>
                        </Avatar>
                      }
                      title="Relação de ocorrências"
                      subheader="até o momento"
                    />
                    <CardContent style={{paddingBottom:"0"}}>
                      <Typography variant="body2" color="text.secondary">
                        Verifique a proporção entre ocorrencias ativas e encerradas.
                      </Typography>
                    </CardContent>
                    <CardActions style={{paddingTop:"0"}}>
                      <Button size="small" color="info" onClick={() => handleOpenRelationModal()}  >Verificar proporção</Button>
                    </CardActions>
                  </Card>
                  <Modal
                    open={relationModal}
                    onClose={handleCloseRelationModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <Item2><Typography variant="h4" align="center">Proporção entre ocorrências</Typography></Item2>
                        <Item2><Typography align="center"></Typography>Baseado no total de ocorrencias, pode-se obter a seguinte propoção:</Item2>
                        <Chart
                          width="50"
                          chartType="PieChart"
                          loader={<div>Loading Chart</div>}
                          data={[
                            ['Status', 'Quantidade'],
                            ['Resolvida', ocurred],
                            ['Pendente', now],
                          ]}
                          options={{
                            legend: 'none',
                            pieSliceText: 'label',
                            backgroundColor: 'transparent'
                            // Just add this option
                          }}
                        />
                      </Box>
                  </Modal>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardHeader
                      avatar= {
                        <Avatar sx={{ bgcolor: 'coral' }} aria-label="recipe">
                          <EventAvailable/>
                        </Avatar>
                      }
                      title="Detalhes das ocorrências"
                      subheader="ir até"
                    />
                    <CardContent style={{paddingBottom:"0"}}>
                      <Typography variant="body2" color="text.secondary">
                        Ver mais detalhes na tela de ocorrências.
                      </Typography>
                    </CardContent>
                    <CardActions style={{paddingTop:"0"}}>
                      <Button size="small" color="info" onClick={() => ChangePage("./event")}  >Ir para Ocorrências</Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={2}>
                  <Card>
                    <CardHeader
                      avatar= {
                        <Avatar sx={{ bgcolor: 'white' }} aria-label="recipe">
                          <GitHub/>
                        </Avatar>
                      }
                      title="Repositórios"
                      subheader="ir para o GitHub"
                    />
                    <CardContent style={{paddingBottom:"0"}}>
                      <Typography variant="body2" color="text.secondary">
                        Vererifique as atualizações mais recentes deste projeto.
                      </Typography>
                    </CardContent>
                    <CardActions style={{paddingTop:"0"}}>
                      <Button size="small" color="info" onClick={() => ChangePage("https://github.com/Francyelid/Safety-Control")}  >Conhecer Repositório</Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{display:'grid', minHeight:"100%", minWidth:"100%"}}>
              <Box  sx={{display: 'grid',gap: 1,gridTemplateColumns: 'repeat(2, 1fr)', minHeight:"100%", minWidth:"100%"}}>
             
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
                          title: 'Quantidade',                         
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
                  <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                    <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height:"100%", width:"100%"}}>
                      <Box sx={{display:'grid', minWidth:"100%", gridTemplateColumns: 'repeat(1, 2fr)', marginTop:"5vh"}}>
                        <Item>
                          <Combobox title={"Tipo de EPI"} options={episArray} unselect={"Selecione o tipo do epi"} selectedItem={selectedItemEpi} setSelectedItem = {(comboItem) => {setSelectedItemEpi(comboItem);}}/>
                        </Item>
                        <Item>
                          <Combobox title={"Tipo Periodo Analisado"} options={periodTypeArray} unselect={"Selecione o tipo do periodo"} selectedItem={selectedItemPeriodo} setSelectedItem = {(comboItemP) => {setSelectedItemPeriodo(comboItemP);}}/>
                        </Item>
                        <Item>
                          <Combobox title={"Quantidade Analisada"} options={quantityArray} unselect={"Selecione a quantidade"} selectedItem={selectedItemQuantidade} setSelectedItem = {(comboItemQ) => {setSelectedItemQuantidade(comboItemQ);}}/>
                        </Item>
                        <Item >
                            <Button style={{height:"100%"}} fullWidth onClick={() => DataReturned()} color="primary" size="large" variant = "contained" type="button" >
                              <UpdateOutlined sx={{ fontSize: 40 }} name="update"  />
                            </Button>
                        </Item>
                      </Box>
                    </Grid>
                  </Item>
                  <Item>
                      <TextField style={{marginRight:20}} label={"Detecções Ativas"} value={now} inputProps={{ readOnly: true  }}></TextField>
              
                      <TextField   label={"Detecções Recentes Registradas"} value={ocurred} inputProps={{ readOnly: true  }}></TextField>
                  </Item>
                  <Item style={{minHeight:"100%",  minWidth:"100%"}}>
                    <Grid container justifyContent="center" alignItems="center" direction="column" spacing={5} style={{ height:"100%", width:"100%"}}>
                      <Box sx={{display:'grid', minHeight:"100%", minWidth:"100%", gridTemplateColumns: 'repeat(2, 1fr)', marginTop:"5vh",  marginLeft:"2vw"}}>
                        <Item >
                          <CSVLink filename="DetecçõesCompletas.csv" data={getCsvData()}>
                            <Button style={{height:"100%"}} fullWidth onClick={() =>  {alert("Relatório de Todas Detecções")}} color="primary" size="large" variant = "contained" type="button" >
                              <DescriptionOutlined sx={{ fontSize: 40 }} name="instagram"  />
                              Relatório de Todas Detecções
                            </Button>
                          </CSVLink>
                        </Item>
                        <Item >
                          <CSVLink filename="DetecçõesFiltradas.csv" data={getCsvDataFilter()}>
                            <Button style={{height:"100%"}} fullWidth onClick={() =>  {alert("Relatório de Detecções Filtradas")}} color="primary" size="large" variant = "contained" type="button" >
                              <DescriptionOutlined sx={{ fontSize: 40 }} name="instagram"  />
                              Relatório de Detecções Filtradas
                            </Button>
                          </CSVLink>
                        </Item>           
                        <Item >
                          <CSVLink filename="DetecçõesFiltradasActive.csv" data={getCsvDataFilterActive()}>
                            <Button style={{height:"100%"}} fullWidth onClick={() =>  {alert("Relatório de Detecções Ativas")}} color="primary" size="large" variant = "contained" type="button" >
                              <DescriptionOutlined sx={{ fontSize: 40 }} name="instagram"  />
                              Relatório de Detecções Ativas
                            </Button>
                          </CSVLink>
                        </Item>  
                        <Item >
                          <CSVLink filename="DetecçõesFiltradasInactive.csv" data={getCsvDataFilterInactive()}>
                            <Button style={{height:"100%"}} fullWidth onClick={() =>  {alert("Relatório de Detecções Inativas")}} color="primary" size="large" variant = "contained" type="button" >
                              <DescriptionOutlined sx={{ fontSize: 40 }} name="instagram"  />
                              Relatório de Detecções Inativas
                            </Button>
                          </CSVLink>
                        </Item>          
                      </Box>
                    </Grid>
                  </Item>
              </Box>
            </Box>
        </Grid>
        <div>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openLoading}
            onClick={handleLoadingToggle}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
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