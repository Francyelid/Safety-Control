import React from 'react';
import {DashboardLayout} from '../components/Layout';
import { GetStaticProps } from "next"
import Post, { PostProps } from "../components/Post"
import Chart from "react-google-charts";
import { generateKeyPair } from "crypto";
import { type } from "os";
import { renderers } from "react-markdown";



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
        width={'700px'}
        height={'700px'}
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
  width={'500px'}
  height={'300px'}
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



  const Dashboard = () => {
    return (
      <DashboardLayout>
        <div className="page">
        <Component/>
        <ComponentColuna/>
        <h1>Public Feed</h1>

        <main>
        
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
      </DashboardLayout>
    )
  }
  
export default Dashboard;
