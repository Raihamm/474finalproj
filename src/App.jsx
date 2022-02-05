import { scaleLinear, scaleBand, extent, line, symbol, csv, sum } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import _ from "lodash";
import Plot from 'react-plotly.js'
import './index.css'
import migrantData from '../data/data.json'

function App() {
  const chartSize = 550;
  const margin = 30;
  const legendPadding = 180;
  const usableData = [];
  const globalData = []
  const csvData = []
  const districts = [];
  let dataByDay;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let monthlyDeaths2021 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let monthlyDeaths2019 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let credible2019 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let credible2021 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  migrantData.forEach((object)=>{
    if(object.Region =="North America" && !isNaN(object["Number Dead"]) && object["Number Dead"] !== ""){
    usableData.push(object)
    
    }}
  )
  
  usableData.forEach((object)=>{
    let matchingIndex = months.indexOf((object["Reported Month"]));
   if(matchingIndex !== -1){
     if(object.Year === 2019){
      let curr = monthlyDeaths2019[matchingIndex]
        monthlyDeaths2019[matchingIndex] = curr + parseFloat(object["Number Dead"])
        if(object["Source Quality"] > 4){
          credible2019[matchingIndex] = credible2019[matchingIndex] + parseFloat(object["Number Dead"])
        }
     }
     if(object.Year === 2021){
      let curr = monthlyDeaths2021[matchingIndex]
        monthlyDeaths2021[matchingIndex] = curr + parseFloat(object["Number Dead"])
        if(object["Source Quality"] > 4){
          credible2021[matchingIndex] = curr + parseFloat(object["Number Dead"])
        }
    }
   }
   
  })
  
  let line1 = {
    x:months,
    y:monthlyDeaths2019,
    type: 'scatter',
    name: '2019', 

  }
  let line2 = {
    x:months,
    y:monthlyDeaths2021,
    type: 'scatter',
    name: '2021'
  }
  let line1cred = {
    x:months,
    y:credible2019,
    type: 'scatter',
    name: '2019'
  }
  let line2cred = {
    x:months,
    y:credible2021,
    type: 'scatter',
    name: '2021'
  }
  let graphData = [line1,line2]
  let higherQual = [line1cred, line2cred]
  let dataRange = [0]
  dataRange.push(Math.max(...monthlyDeaths2019))
  const _extent = extent(dataRange);
  const _scaleY = scaleLinear()
    .domain(_extent)
    .range([chartSize - margin, 2*margin + 10]);
  const _scaleLine = scaleLinear()
    .domain([0, 11])
    .range([margin, chartSize+50]);
  const _scaleDate = scaleBand()
    .domain(months)
    .range([0, chartSize+50]);

  const _lineMaker = line()
    .x((d, i) => {
      return _scaleLine(i);
    })
    .y((d) => {
      return _scaleY(d);
    });
    const years = ['2019', '2021']
  let globalDeaths2021 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let globalDeaths2019 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let globMissing2019 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let globMissing2021 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  
  migrantData.forEach((object)=>{
    if(!isNaN(object["Number Dead"]) && object["Number Dead"] !== "" && object["Source Quality"] > 4 && !isNaN(object["Source Quality"]) && object['Source Quality'] > 0){
      globalData.push(object)
    }}
  )
  globalData.forEach((object)=>{
    let matchingIndex = months.indexOf((object["Reported Month"]));
   if(matchingIndex !== -1){
     if(object.Year === 2019){
      globalDeaths2019[matchingIndex] = globalDeaths2019[matchingIndex] + parseFloat(object["Number Dead"])
      if(!isNaN(object["Minimum Estimated Number of Missing"]) && object["Minimum Estimated Number of Missing"] !== ""){
        globMissing2019[matchingIndex] = globMissing2019[matchingIndex] + parseFloat(object["Minimum Estimated Number of Missing"])
      }
    }
     if(object.Year === 2021){
      globalDeaths2021[matchingIndex] = globalDeaths2021[matchingIndex] + parseFloat(object["Number Dead"])
      if(!isNaN(object["Minimum Estimated Number of Missing"]) && object["Minimum Estimated Number of Missing"] !== ""){
        globMissing2021[matchingIndex] = globMissing2021[matchingIndex] + parseFloat(object["Number Dead"])
      }
    }
   }
   
  })
  let globalline1 = {
    x:months,
    y:globalDeaths2019,
    type: 'scatter',
    name: '2019',
    line: {
      color: 'red'
    } 

  }
  let globalline2 = {
    x:months,
    y:globalDeaths2021,
    type: 'scatter',
    name: '2021',
    line: {
      color: 'green'
    }
  }
  let globalline1cred = {
    x:months,
    y:globMissing2019,
    type: 'scatter',
    name: '2019',
    line: {
      color: 'red'
    }
  }
  let globalline2cred = {
    x:months,
    y:globMissing2021,
    type: 'scatter',
    name: '2021',
    line: {
      color: 'green'
    }
  }
  let globalDeath = [globalline1,globalline2]
  let globalMissing = [globalline1cred, globalline2cred] 
  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  let regions = groupBy(globalData, 'Region')
  let regionList = Object.keys(regions)
  let holder = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  
  for (const [key, value] of Object.entries(regions)) {
    let index = 0;
    value.forEach(object=>{
      index = regionList.indexOf(key)
      holder[index] = holder[index] + parseFloat(object['Number Dead'])
    })
  }
  let regionData = [{
    x: regionList,
    y: holder,
    type: 'bar',
    marker: {
      color: 'red'
    }
  }]
  
  // Handles North America Deaths per year
  let allNA = groupBy(usableData, 'Year')
  let yearList = Object.keys(allNA)
  let sumYearly = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  for (const [key, value] of Object.entries(allNA)) {
    let index = 0;
    value.forEach(object=>{
      index = yearList.indexOf(key)
      sumYearly[index] = sumYearly[index] + parseFloat(object['Number Dead'])
    })
  }
  let NAData = [{
    x: yearList,
    y: sumYearly,
    type: 'line',
    marker: {
      color: 'red'
    }
  }]
  
  //Error Charts
  // I can reuse the monthlyDeatharrys but need to create another array solely for errors
  let error2019 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let error2021 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let errorScale = {5: 1, 4: 0.8, 3: 0.6, 2: 0.4, 1:0.2}
  usableData.forEach((object)=>{
    let matchingIndex = months.indexOf((object["Reported Month"]));
   if(matchingIndex !== -1 && !isNaN(object['Source Quality']) && object['Source Quality'] >0){
     if(object.Year === 2019){
      error2019[matchingIndex] = error2019[matchingIndex] + parseFloat(errorScale[object['Source Quality']])
     }
     if(object.Year === 2021){
      error2021[matchingIndex] = error2021[matchingIndex] + parseFloat(errorScale[object['Source Quality']])
      
    }
   }
  })
  let err2019 = [{
    x:months,
    y:monthlyDeaths2019,
    type: 'scatter',
    name: '2019', 
    error_y: {
      type: 'data',
      array: error2019,
      visible: true
    },
    line: {
      color: 'red'
    }

  }]

  let err2021 = [{
    x:months,
    y:monthlyDeaths2021,
    type: 'scatter',
    name: '2021', 
    error_y: {
      type: 'data',
      array: error2021,
      visible: true
    },
    line: {
      color: 'green'
    }

  }]

  return (
    <div id="maincont">
      <header className="bg-info">
       <h1> Missing Migrants Visualization Project</h1>
       <h2>Raiham Malik</h2>
       <div className="topnav"> 
        {/* <ul className="menu">  */}
            <a id="sec-1" href="#one">About</a>
            {/* <a id="sec-2" href="#chart-img">Python Chart and Findings</a>
            <a id="sec-3" href="#code-img">Python Code</a>
            <a id="sec-4" href="#four">Javascript Chart attempt</a> */}
          {/* </ul> */}
      </div>
      </header>
      
      <p className="m-3" id="one">
        The Missing Migrants Project tracks deaths of migrants, including refugees and asylum-seekers and this data has been collected from 2014 and is constantly updated.
        By collecting this data regularly the MM Project hopes to shed light on the global epidemic of crime and abuse inflicted upon migrants  
      </p>
      <h3>I would first like to answer the question: What has been the trend of migrants death in North America over the course of 2021 versus 2019 before the COVID-19 Pandemic?</h3>
      <div style={{ margin: 20 }} id="two">
      {/* <Carousel> */}
  {/* <Carousel.Item> */}

      <svg
        width={chartSize + legendPadding}
        height={chartSize + margin}
        key = {'a'}
      >
        
          <rect 
          width={'100%'}
          height={'100%'}
          fill={'white'}
          /> 
         
        <path d="M683.874 207.887V209H676.894V208.026L680.387 204.137C680.817 203.658 681.149 203.253 681.383 202.921C681.623 202.584 681.789 202.284 681.881 202.02C681.979 201.751 682.028 201.478 682.028 201.2C682.028 200.848 681.955 200.531 681.808 200.248C681.667 199.959 681.457 199.73 681.178 199.559C680.9 199.388 680.563 199.303 680.167 199.303C679.694 199.303 679.298 199.396 678.981 199.581C678.668 199.762 678.434 200.016 678.278 200.343C678.122 200.67 678.043 201.046 678.043 201.471H676.688C676.688 200.87 676.82 200.321 677.084 199.823C677.348 199.325 677.738 198.929 678.256 198.636C678.773 198.338 679.411 198.189 680.167 198.189C680.841 198.189 681.417 198.309 681.896 198.548C682.375 198.783 682.741 199.115 682.995 199.544C683.253 199.969 683.383 200.467 683.383 201.039C683.383 201.351 683.329 201.668 683.222 201.991C683.119 202.308 682.975 202.625 682.79 202.943C682.609 203.26 682.396 203.573 682.152 203.88C681.913 204.188 681.657 204.491 681.383 204.789L678.527 207.887H683.874ZM692.018 202.818V204.444C692.018 205.318 691.94 206.056 691.784 206.656C691.627 207.257 691.403 207.74 691.11 208.106C690.817 208.473 690.463 208.739 690.048 208.905C689.638 209.066 689.174 209.146 688.656 209.146C688.246 209.146 687.868 209.095 687.521 208.993C687.174 208.89 686.862 208.727 686.583 208.502C686.31 208.272 686.076 207.975 685.88 207.608C685.685 207.242 685.536 206.798 685.434 206.275C685.331 205.753 685.28 205.143 685.28 204.444V202.818C685.28 201.944 685.358 201.212 685.514 200.621C685.675 200.03 685.902 199.557 686.195 199.2C686.488 198.839 686.84 198.58 687.25 198.424C687.665 198.268 688.129 198.189 688.642 198.189C689.057 198.189 689.438 198.241 689.784 198.343C690.136 198.441 690.448 198.6 690.722 198.819C690.995 199.034 691.227 199.322 691.417 199.684C691.613 200.04 691.762 200.477 691.864 200.995C691.967 201.512 692.018 202.12 692.018 202.818ZM690.656 204.664V202.591C690.656 202.113 690.626 201.693 690.568 201.332C690.514 200.965 690.434 200.653 690.326 200.394C690.219 200.135 690.082 199.925 689.916 199.764C689.755 199.603 689.567 199.486 689.352 199.413C689.142 199.334 688.905 199.295 688.642 199.295C688.319 199.295 688.034 199.356 687.785 199.479C687.536 199.596 687.326 199.784 687.155 200.042C686.989 200.301 686.862 200.641 686.774 201.061C686.686 201.48 686.642 201.991 686.642 202.591V204.664C686.642 205.143 686.669 205.565 686.723 205.931C686.781 206.297 686.867 206.615 686.979 206.883C687.091 207.147 687.228 207.364 687.389 207.535C687.55 207.706 687.736 207.833 687.946 207.916C688.161 207.994 688.397 208.033 688.656 208.033C688.988 208.033 689.279 207.97 689.528 207.843C689.777 207.716 689.984 207.518 690.15 207.25C690.321 206.976 690.448 206.627 690.531 206.202C690.614 205.772 690.656 205.26 690.656 204.664ZM700.749 207.887V209H693.769V208.026L697.262 204.137C697.692 203.658 698.024 203.253 698.258 202.921C698.498 202.584 698.664 202.284 698.756 202.02C698.854 201.751 698.903 201.478 698.903 201.2C698.903 200.848 698.83 200.531 698.683 200.248C698.542 199.959 698.332 199.73 698.053 199.559C697.775 199.388 697.438 199.303 697.042 199.303C696.569 199.303 696.173 199.396 695.856 199.581C695.543 199.762 695.309 200.016 695.153 200.343C694.997 200.67 694.918 201.046 694.918 201.471H693.563C693.563 200.87 693.695 200.321 693.959 199.823C694.223 199.325 694.613 198.929 695.131 198.636C695.648 198.338 696.286 198.189 697.042 198.189C697.716 198.189 698.292 198.309 698.771 198.548C699.25 198.783 699.616 199.115 699.87 199.544C700.128 199.969 700.258 200.467 700.258 201.039C700.258 201.351 700.204 201.668 700.097 201.991C699.994 202.308 699.85 202.625 699.665 202.943C699.484 203.26 699.271 203.573 699.027 203.88C698.788 204.188 698.532 204.491 698.258 204.789L695.402 207.887H700.749ZM706.652 198.277V209H705.297V199.969L702.565 200.965V199.742L706.439 198.277H706.652Z" fill="black"/>
        <path d="M683.874 146.887V148H676.894V147.026L680.387 143.137C680.817 142.658 681.149 142.253 681.383 141.921C681.623 141.584 681.789 141.284 681.881 141.02C681.979 140.751 682.028 140.478 682.028 140.2C682.028 139.848 681.955 139.531 681.808 139.248C681.667 138.959 681.457 138.73 681.178 138.559C680.9 138.388 680.563 138.303 680.167 138.303C679.694 138.303 679.298 138.396 678.981 138.581C678.668 138.762 678.434 139.016 678.278 139.343C678.122 139.67 678.043 140.046 678.043 140.471H676.688C676.688 139.87 676.82 139.321 677.084 138.823C677.348 138.325 677.738 137.929 678.256 137.636C678.773 137.338 679.411 137.189 680.167 137.189C680.841 137.189 681.417 137.309 681.896 137.548C682.375 137.783 682.741 138.115 682.995 138.544C683.253 138.969 683.383 139.467 683.383 140.039C683.383 140.351 683.329 140.668 683.222 140.991C683.119 141.308 682.975 141.625 682.79 141.943C682.609 142.26 682.396 142.573 682.152 142.88C681.913 143.188 681.657 143.491 681.383 143.789L678.527 146.887H683.874ZM692.018 141.818V143.444C692.018 144.318 691.94 145.056 691.784 145.656C691.627 146.257 691.403 146.74 691.11 147.106C690.817 147.473 690.463 147.739 690.048 147.905C689.638 148.066 689.174 148.146 688.656 148.146C688.246 148.146 687.868 148.095 687.521 147.993C687.174 147.89 686.862 147.727 686.583 147.502C686.31 147.272 686.076 146.975 685.88 146.608C685.685 146.242 685.536 145.798 685.434 145.275C685.331 144.753 685.28 144.143 685.28 143.444V141.818C685.28 140.944 685.358 140.212 685.514 139.621C685.675 139.03 685.902 138.557 686.195 138.2C686.488 137.839 686.84 137.58 687.25 137.424C687.665 137.268 688.129 137.189 688.642 137.189C689.057 137.189 689.438 137.241 689.784 137.343C690.136 137.441 690.448 137.6 690.722 137.819C690.995 138.034 691.227 138.322 691.417 138.684C691.613 139.04 691.762 139.477 691.864 139.995C691.967 140.512 692.018 141.12 692.018 141.818ZM690.656 143.664V141.591C690.656 141.113 690.626 140.693 690.568 140.332C690.514 139.965 690.434 139.653 690.326 139.394C690.219 139.135 690.082 138.925 689.916 138.764C689.755 138.603 689.567 138.486 689.352 138.413C689.142 138.334 688.905 138.295 688.642 138.295C688.319 138.295 688.034 138.356 687.785 138.479C687.536 138.596 687.326 138.784 687.155 139.042C686.989 139.301 686.862 139.641 686.774 140.061C686.686 140.48 686.642 140.991 686.642 141.591V143.664C686.642 144.143 686.669 144.565 686.723 144.931C686.781 145.297 686.867 145.615 686.979 145.883C687.091 146.147 687.228 146.364 687.389 146.535C687.55 146.706 687.736 146.833 687.946 146.916C688.161 146.994 688.397 147.033 688.656 147.033C688.988 147.033 689.279 146.97 689.528 146.843C689.777 146.716 689.984 146.518 690.15 146.25C690.321 145.976 690.448 145.627 690.531 145.202C690.614 144.772 690.656 144.26 690.656 143.664ZM698.214 137.277V148H696.859V138.969L694.127 139.965V138.742L698.002 137.277H698.214ZM703.546 146.865H703.686C704.467 146.865 705.102 146.755 705.59 146.535C706.078 146.315 706.454 146.02 706.718 145.649C706.981 145.278 707.162 144.86 707.26 144.396C707.357 143.928 707.406 143.447 707.406 142.954V141.32C707.406 140.837 707.35 140.407 707.238 140.031C707.13 139.655 706.979 139.34 706.784 139.086C706.593 138.833 706.376 138.64 706.132 138.508C705.888 138.376 705.629 138.31 705.355 138.31C705.043 138.31 704.762 138.374 704.513 138.5C704.269 138.623 704.062 138.796 703.891 139.021C703.725 139.245 703.598 139.509 703.51 139.812C703.422 140.114 703.378 140.444 703.378 140.8C703.378 141.118 703.417 141.425 703.495 141.723C703.573 142.021 703.693 142.29 703.854 142.529C704.015 142.768 704.215 142.958 704.455 143.1C704.699 143.237 704.984 143.305 705.312 143.305C705.614 143.305 705.897 143.247 706.161 143.129C706.43 143.007 706.667 142.844 706.872 142.639C707.082 142.429 707.248 142.192 707.37 141.928C707.497 141.665 707.57 141.389 707.589 141.101H708.234C708.234 141.506 708.153 141.906 707.992 142.302C707.836 142.692 707.616 143.049 707.333 143.371C707.05 143.693 706.718 143.952 706.337 144.147C705.956 144.338 705.541 144.433 705.092 144.433C704.564 144.433 704.108 144.331 703.722 144.125C703.336 143.92 703.019 143.647 702.77 143.305C702.526 142.963 702.343 142.583 702.221 142.163C702.104 141.738 702.045 141.308 702.045 140.874C702.045 140.366 702.116 139.89 702.257 139.445C702.399 139.001 702.609 138.61 702.887 138.273C703.166 137.932 703.51 137.666 703.92 137.475C704.335 137.285 704.813 137.189 705.355 137.189C705.966 137.189 706.486 137.312 706.916 137.556C707.345 137.8 707.694 138.127 707.963 138.537C708.236 138.947 708.437 139.409 708.563 139.921C708.69 140.434 708.754 140.961 708.754 141.503V141.994C708.754 142.546 708.717 143.107 708.644 143.679C708.576 144.245 708.441 144.787 708.241 145.305C708.046 145.822 707.76 146.286 707.384 146.696C707.008 147.102 706.518 147.424 705.912 147.663C705.312 147.897 704.569 148.015 703.686 148.015H703.546V146.865Z" fill="black"/>
        <circle cx="649" cy="144" r="10" fill="#FF0000"/>
        <circle cx="649" cy="205" r="10" fill="#008000"/>
        <text
          fill={"black"}
          style={{
                  fontSize: '18px',
                  fontWeight: 'heavy'
                }}
                x='175' 
                y='35'
               aria-label="Chart of All Missing Migrant Deaths in 2019 and 2021"
              >
                All Missing Migrant Deaths in 2019 and 2021
        </text>


        <AxisLeft strokeWidth={0} left={margin} scale={_scaleY}/>
        <AxisBottom 
        strokeWidth={0} 
        top={chartSize - margin}
        left={margin}
        scale={_scaleDate}
        tickValues={months}
        
        />
        
        {years.map((year, i) => {
            return (
              <path
                stroke={year === "2019" ? "red" : "green"}
                strokeWidth={2}
                // fill={"rgba(255,0,0,.3)"}
                fill={"none"}
                key={year}
                d={_lineMaker(graphData[i].y)}
              />
            );
          })}

          
      </svg>
    {/* <Carousel.Caption> */}
        {/* </Carousel.Caption> */}
  {/* </Carousel.Item> */}
  {/* <Carousel.Item> */}
<p>This plot was my first look into the data, but upon further inspection I see that there is a variable "Source Quality" provided by the Missing Migrants data. In order to ensure the plots and therefore the conclusions drawn are well-founded I filtered for data of quality 4 and higher. This scale is from 1-5.  </p>
  <svg
        width={chartSize + legendPadding}
        height={chartSize+margin}
        key = {'b'}
        // style={'background:white'}
        >
          <rect 
          width={'100%'}
          height={'100%'}
          fill={'white'}
          /> 
        <path d="M683.874 207.887V209H676.894V208.026L680.387 204.137C680.817 203.658 681.149 203.253 681.383 202.921C681.623 202.584 681.789 202.284 681.881 202.02C681.979 201.751 682.028 201.478 682.028 201.2C682.028 200.848 681.955 200.531 681.808 200.248C681.667 199.959 681.457 199.73 681.178 199.559C680.9 199.388 680.563 199.303 680.167 199.303C679.694 199.303 679.298 199.396 678.981 199.581C678.668 199.762 678.434 200.016 678.278 200.343C678.122 200.67 678.043 201.046 678.043 201.471H676.688C676.688 200.87 676.82 200.321 677.084 199.823C677.348 199.325 677.738 198.929 678.256 198.636C678.773 198.338 679.411 198.189 680.167 198.189C680.841 198.189 681.417 198.309 681.896 198.548C682.375 198.783 682.741 199.115 682.995 199.544C683.253 199.969 683.383 200.467 683.383 201.039C683.383 201.351 683.329 201.668 683.222 201.991C683.119 202.308 682.975 202.625 682.79 202.943C682.609 203.26 682.396 203.573 682.152 203.88C681.913 204.188 681.657 204.491 681.383 204.789L678.527 207.887H683.874ZM692.018 202.818V204.444C692.018 205.318 691.94 206.056 691.784 206.656C691.627 207.257 691.403 207.74 691.11 208.106C690.817 208.473 690.463 208.739 690.048 208.905C689.638 209.066 689.174 209.146 688.656 209.146C688.246 209.146 687.868 209.095 687.521 208.993C687.174 208.89 686.862 208.727 686.583 208.502C686.31 208.272 686.076 207.975 685.88 207.608C685.685 207.242 685.536 206.798 685.434 206.275C685.331 205.753 685.28 205.143 685.28 204.444V202.818C685.28 201.944 685.358 201.212 685.514 200.621C685.675 200.03 685.902 199.557 686.195 199.2C686.488 198.839 686.84 198.58 687.25 198.424C687.665 198.268 688.129 198.189 688.642 198.189C689.057 198.189 689.438 198.241 689.784 198.343C690.136 198.441 690.448 198.6 690.722 198.819C690.995 199.034 691.227 199.322 691.417 199.684C691.613 200.04 691.762 200.477 691.864 200.995C691.967 201.512 692.018 202.12 692.018 202.818ZM690.656 204.664V202.591C690.656 202.113 690.626 201.693 690.568 201.332C690.514 200.965 690.434 200.653 690.326 200.394C690.219 200.135 690.082 199.925 689.916 199.764C689.755 199.603 689.567 199.486 689.352 199.413C689.142 199.334 688.905 199.295 688.642 199.295C688.319 199.295 688.034 199.356 687.785 199.479C687.536 199.596 687.326 199.784 687.155 200.042C686.989 200.301 686.862 200.641 686.774 201.061C686.686 201.48 686.642 201.991 686.642 202.591V204.664C686.642 205.143 686.669 205.565 686.723 205.931C686.781 206.297 686.867 206.615 686.979 206.883C687.091 207.147 687.228 207.364 687.389 207.535C687.55 207.706 687.736 207.833 687.946 207.916C688.161 207.994 688.397 208.033 688.656 208.033C688.988 208.033 689.279 207.97 689.528 207.843C689.777 207.716 689.984 207.518 690.15 207.25C690.321 206.976 690.448 206.627 690.531 206.202C690.614 205.772 690.656 205.26 690.656 204.664ZM700.749 207.887V209H693.769V208.026L697.262 204.137C697.692 203.658 698.024 203.253 698.258 202.921C698.498 202.584 698.664 202.284 698.756 202.02C698.854 201.751 698.903 201.478 698.903 201.2C698.903 200.848 698.83 200.531 698.683 200.248C698.542 199.959 698.332 199.73 698.053 199.559C697.775 199.388 697.438 199.303 697.042 199.303C696.569 199.303 696.173 199.396 695.856 199.581C695.543 199.762 695.309 200.016 695.153 200.343C694.997 200.67 694.918 201.046 694.918 201.471H693.563C693.563 200.87 693.695 200.321 693.959 199.823C694.223 199.325 694.613 198.929 695.131 198.636C695.648 198.338 696.286 198.189 697.042 198.189C697.716 198.189 698.292 198.309 698.771 198.548C699.25 198.783 699.616 199.115 699.87 199.544C700.128 199.969 700.258 200.467 700.258 201.039C700.258 201.351 700.204 201.668 700.097 201.991C699.994 202.308 699.85 202.625 699.665 202.943C699.484 203.26 699.271 203.573 699.027 203.88C698.788 204.188 698.532 204.491 698.258 204.789L695.402 207.887H700.749ZM706.652 198.277V209H705.297V199.969L702.565 200.965V199.742L706.439 198.277H706.652Z" fill="black"/>
        <path d="M683.874 146.887V148H676.894V147.026L680.387 143.137C680.817 142.658 681.149 142.253 681.383 141.921C681.623 141.584 681.789 141.284 681.881 141.02C681.979 140.751 682.028 140.478 682.028 140.2C682.028 139.848 681.955 139.531 681.808 139.248C681.667 138.959 681.457 138.73 681.178 138.559C680.9 138.388 680.563 138.303 680.167 138.303C679.694 138.303 679.298 138.396 678.981 138.581C678.668 138.762 678.434 139.016 678.278 139.343C678.122 139.67 678.043 140.046 678.043 140.471H676.688C676.688 139.87 676.82 139.321 677.084 138.823C677.348 138.325 677.738 137.929 678.256 137.636C678.773 137.338 679.411 137.189 680.167 137.189C680.841 137.189 681.417 137.309 681.896 137.548C682.375 137.783 682.741 138.115 682.995 138.544C683.253 138.969 683.383 139.467 683.383 140.039C683.383 140.351 683.329 140.668 683.222 140.991C683.119 141.308 682.975 141.625 682.79 141.943C682.609 142.26 682.396 142.573 682.152 142.88C681.913 143.188 681.657 143.491 681.383 143.789L678.527 146.887H683.874ZM692.018 141.818V143.444C692.018 144.318 691.94 145.056 691.784 145.656C691.627 146.257 691.403 146.74 691.11 147.106C690.817 147.473 690.463 147.739 690.048 147.905C689.638 148.066 689.174 148.146 688.656 148.146C688.246 148.146 687.868 148.095 687.521 147.993C687.174 147.89 686.862 147.727 686.583 147.502C686.31 147.272 686.076 146.975 685.88 146.608C685.685 146.242 685.536 145.798 685.434 145.275C685.331 144.753 685.28 144.143 685.28 143.444V141.818C685.28 140.944 685.358 140.212 685.514 139.621C685.675 139.03 685.902 138.557 686.195 138.2C686.488 137.839 686.84 137.58 687.25 137.424C687.665 137.268 688.129 137.189 688.642 137.189C689.057 137.189 689.438 137.241 689.784 137.343C690.136 137.441 690.448 137.6 690.722 137.819C690.995 138.034 691.227 138.322 691.417 138.684C691.613 139.04 691.762 139.477 691.864 139.995C691.967 140.512 692.018 141.12 692.018 141.818ZM690.656 143.664V141.591C690.656 141.113 690.626 140.693 690.568 140.332C690.514 139.965 690.434 139.653 690.326 139.394C690.219 139.135 690.082 138.925 689.916 138.764C689.755 138.603 689.567 138.486 689.352 138.413C689.142 138.334 688.905 138.295 688.642 138.295C688.319 138.295 688.034 138.356 687.785 138.479C687.536 138.596 687.326 138.784 687.155 139.042C686.989 139.301 686.862 139.641 686.774 140.061C686.686 140.48 686.642 140.991 686.642 141.591V143.664C686.642 144.143 686.669 144.565 686.723 144.931C686.781 145.297 686.867 145.615 686.979 145.883C687.091 146.147 687.228 146.364 687.389 146.535C687.55 146.706 687.736 146.833 687.946 146.916C688.161 146.994 688.397 147.033 688.656 147.033C688.988 147.033 689.279 146.97 689.528 146.843C689.777 146.716 689.984 146.518 690.15 146.25C690.321 145.976 690.448 145.627 690.531 145.202C690.614 144.772 690.656 144.26 690.656 143.664ZM698.214 137.277V148H696.859V138.969L694.127 139.965V138.742L698.002 137.277H698.214ZM703.546 146.865H703.686C704.467 146.865 705.102 146.755 705.59 146.535C706.078 146.315 706.454 146.02 706.718 145.649C706.981 145.278 707.162 144.86 707.26 144.396C707.357 143.928 707.406 143.447 707.406 142.954V141.32C707.406 140.837 707.35 140.407 707.238 140.031C707.13 139.655 706.979 139.34 706.784 139.086C706.593 138.833 706.376 138.64 706.132 138.508C705.888 138.376 705.629 138.31 705.355 138.31C705.043 138.31 704.762 138.374 704.513 138.5C704.269 138.623 704.062 138.796 703.891 139.021C703.725 139.245 703.598 139.509 703.51 139.812C703.422 140.114 703.378 140.444 703.378 140.8C703.378 141.118 703.417 141.425 703.495 141.723C703.573 142.021 703.693 142.29 703.854 142.529C704.015 142.768 704.215 142.958 704.455 143.1C704.699 143.237 704.984 143.305 705.312 143.305C705.614 143.305 705.897 143.247 706.161 143.129C706.43 143.007 706.667 142.844 706.872 142.639C707.082 142.429 707.248 142.192 707.37 141.928C707.497 141.665 707.57 141.389 707.589 141.101H708.234C708.234 141.506 708.153 141.906 707.992 142.302C707.836 142.692 707.616 143.049 707.333 143.371C707.05 143.693 706.718 143.952 706.337 144.147C705.956 144.338 705.541 144.433 705.092 144.433C704.564 144.433 704.108 144.331 703.722 144.125C703.336 143.92 703.019 143.647 702.77 143.305C702.526 142.963 702.343 142.583 702.221 142.163C702.104 141.738 702.045 141.308 702.045 140.874C702.045 140.366 702.116 139.89 702.257 139.445C702.399 139.001 702.609 138.61 702.887 138.273C703.166 137.932 703.51 137.666 703.92 137.475C704.335 137.285 704.813 137.189 705.355 137.189C705.966 137.189 706.486 137.312 706.916 137.556C707.345 137.8 707.694 138.127 707.963 138.537C708.236 138.947 708.437 139.409 708.563 139.921C708.69 140.434 708.754 140.961 708.754 141.503V141.994C708.754 142.546 708.717 143.107 708.644 143.679C708.576 144.245 708.441 144.787 708.241 145.305C708.046 145.822 707.76 146.286 707.384 146.696C707.008 147.102 706.518 147.424 705.912 147.663C705.312 147.897 704.569 148.015 703.686 148.015H703.546V146.865Z" fill="black"/>
        <circle cx="649" cy="144" r="10" fill="#FF0000"/>
        <circle cx="649" cy="205" r="10" fill="#008000"/>
        <text
          fill={"black"}
          style={{
            fontSize: '15px',
            fontWeight: 'heavy'
          }}
          x='90' 
          y='35'
          aria-label="Chart of Missing Migrant Deaths in 2019 and 2021 of Higher Source Quality"
        >
              Missing Migrant Deaths in 2019 and 2021 from Higher Quality Sources
        </text>
        <AxisLeft strokeWidth={0} left={margin} scale={_scaleY}/>
        <AxisBottom 
        strokeWidth={0} 
        top={chartSize - margin}
        left={margin}
        scale={_scaleDate}
        tickValues={months}
        />
        {years.map((year, i) => {
            return (
              <path
                stroke={year === "2019" ? "red" : "green"}
                strokeWidth={2}
                // fill={"rgba(255,0,0,.3)"}
                fill={"none"}
                key={year}
                d={_lineMaker(higherQual[i].y)}
              />
            );
          })}
      </svg>
    {/* <Carousel.Caption> */}
    <p>Now that the data is more reputable we can see that the trend remains the same for both years, however 2019 has a drastic change in the counts for deaths. 
      From now on I will only utilize data of Source Quality of 4 and higher</p>
    {/* </Carousel.Caption> */}
  {/* </Carousel.Item> */}
  
{/* </Carousel> */}
<h2>Global Distributions</h2>
<p>Below we take a look at the total number of missing and deaths in 2019 and 2021. This will allow us to see the trends globally. </p>
    <div>
      <Plot
        data={globalDeath}
        layout={ {width: chartSize + legendPadding, height: chartSize, title: 'Total Deaths Globally in 2021 and 2019 per Month'}
      }
      />
    </div>
      <div id="addSpace">
        <Plot
        data={globalMissing}
          layout={ {width: chartSize + legendPadding, height: chartSize, title: 'Total Missing Globally in 2021 and 2019 per Month'}
        }
        />
      </div>
      <p>
        It is understandable and reasonable that there are more deaths in December each year due to cold weather. In April and May in both years there was a drop in deaths. In 2019 the Sudan Protests began this could possibly attribute to the lack of deaths and migration to North America. After President AMLO took office in 2019 there was a decrease in immigration staff at the border of Mexico and the US as well as more policies that promoted orderly transit according to <cite><a href="https://www.wilsoncenter.org/article/2019-migration-to-and-through-mexico-mid-year-report">Wilson Center</a></cite>. Through stronger enforcement from January to May of 2019 this could cause the decline in deaths in April and May.
      </p>
      <p>
      In 2021 there was still an ongoing Pandemic, although the United States began rolling out vaccines the rest of the world was still not fully vaccinated. The drop in deaths in October could be attributed to the higher rate of fully vaccinated people globally. By the end of September 2021, about 35% of the world's population is fully vaccinated according to <cite><a href="https://ourworldindata.org/covid-vaccinations">Our World in Data</a></cite>.
      </p>
      <div id="addSpace">
      <Plot
        data={regionData}
        layout={ {width: chartSize + legendPadding, height: chartSize + margin, title: 'Total Dead for Each Region'}}
      />
      </div>
      <p>
        North America has much higher deaths than any other region, it also has the most people migrating to this region than anywhere else in the world in 2016 it was found that there were 1 Million people who migrated to the US each year. Thus I will continue to focus solely on North America in my further investigations.
      </p>
      <div>
      <Plot
        data={NAData}
        layout={ {width: chartSize + legendPadding, height: chartSize + margin, title: 'Total Dead for Each Year'}}
      />
      </div>
      <p>
        There has been a steady increase in deaths per year with a drop in 2020, explained by the strict travel restrictions globally due to the pandemic. The steep increase in 2021 can be attributed to the easing travel restrictions but still ongoing deaths due to COVID-19 and other factors.
      </p>
      <h2>Error Charts</h2>
      <p>Going back to the <a href="#two">first chart</a> I made let's explore the error margin for each month. 
      I did this through taking into account the source quality. Scaling the data by the source quality, i.e. if it is a 5 quality level the death will be counted wholly with no margin or error,
       but if there is a level 1 quality deaths source the error margin will increase. This will allow us to understand just how reliable this data is for both 2019 and 2021 in North America.</p>
    <div>
      <Plot
        data={err2019}
        layout={ {
          width: chartSize + legendPadding, 
          height: chartSize, 
          title: 'Deaths with Error Margin in NA in 2019 per Month'}}
      />
    </div>
    <div>
      <Plot
        data={err2021}
        layout={ {
          width: chartSize + legendPadding, 
          height: chartSize, 
          title: 'Deaths with Error Margin in NA in 2021 per Month'}}
      />
    </div>
    <h2>Conclusion</h2>
    </div>
  <footer>
        <p>Raiham Malik Winter 22 Info 474</p>
  </footer>
  </div>
    
  );
}
export default App;