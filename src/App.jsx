import { scaleLinear, scaleBand, extent, line, symbol, csv, sum, quantize, color } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import _, { fill, indexOf, reduce } from "lodash";
import Plot from 'react-plotly.js'
import './index.css'
import migrantData from '../data/data.json'
import React, {useState} from "react";
import imgUrl from '../favicon.png'
document.getElementById('favicon').href = imgUrl
import Graphs from './graph'
// add more divisions bt graphs and text, move text and graph side by side, add differing visuals
// add map

function App() {
  const chartSize = 500;
  const margin = 30;
  const legendPadding = 180;
  const usableData = [];
  let quality = [1,2,3,4,5]
  let [show, setShow] = useState([true,true,true,true,true]);
  let [guess,setGuess] = useState("")
  let [view,setView] = useState(false)
  let [correct,setCorrect] = useState(false)
  let [clicked, setClicked] = useState(false)
  const handleOnChange = (position) => {
    const updatedCheckedState = show.map((item, index) =>
      index === position ? !item : item
    );
    setShow(updatedCheckedState)
  }
  
  let idsForMonth = {"January":[],
  "February":[],
    "March":[],
    "April":[],
    "May":[],
    "June":[],
    "July":[],
    "August":[],
    "September":[],
    "October":[],
    "November":[],
    "December":[],
}
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
  let tester2019 = []
  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  var sum = function(key) {
    return reduce((a,b) => a + (b[key] || 0), 0);
  }
  function linearRegression(y,x){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    } 

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}
  let monthlyDeaths2021 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  let monthlyDeaths2019 = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  
  migrantData.forEach((object)=>{
    object.show = show;
    if(object.Region =="North America" && !isNaN(object["Number Dead"]) && object["Number Dead"] !== ""){
      usableData.push(object)
    }}
  )
   
let causesOfDeath = groupBy(usableData, 'Cause of Death');
causesOfDeath = Object.keys(causesOfDeath)
let [checked, setChecked] = useState(new Array(causesOfDeath.length).fill(true));
const handleClick = (position) => {
  const updatedState = checked.map((item, index) =>
    index === position ? !item : item
  );
  setChecked(updatedState)
}

usableData.forEach((object)=>{
    let matchingIndex = months.indexOf((object["Reported Month"]));
   if(matchingIndex !== -1){
     if(object.Year === 2019 && show[quality.indexOf(object['Source Quality'])] == true && checked[causesOfDeath.indexOf(object['Cause of Death'])] == true){
      let curr = monthlyDeaths2019[matchingIndex]
      monthlyDeaths2019[matchingIndex] = curr + parseFloat(object["Number Dead"])
     }
     if(object.Year === 2021 && show[quality.indexOf(object['Source Quality'])] == true && checked[causesOfDeath.indexOf(object['Cause of Death'])] == true){
      let curr = monthlyDeaths2021[matchingIndex]
        monthlyDeaths2021[matchingIndex] = curr + parseFloat(object["Number Dead"])
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
 
  let graphData = [line1,line2]
  let dataRange = [0]
  if(Math.max(...monthlyDeaths2019) > Math.max(...monthlyDeaths2021)){
    dataRange.push(Math.max(...monthlyDeaths2019))
  } else {
    dataRange.push(Math.max(...monthlyDeaths2021))
  }
  
  const _extent = extent(dataRange);
  const _scaleY = scaleLinear()
    .domain(_extent)
    .range([chartSize - margin, 2*margin + 10]);
  const _scaleLine = scaleLinear()
    .domain([0, 11])
    .range([2*margin, chartSize+50]);
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

  let lin2022 = []
  let allMo = groupBy(usableData, 'Reported Month')
  let indexerCount = []
  let sumMonthly = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  for (const [key, value] of Object.entries(allMo)) {
    let index = 0;
    let indexer = [0]
    let cont = []
    value.forEach(object=>{
      cont.push(parseFloat(object['Number Dead']))
      indexer.push(index +1)
      index = index+1
    })
    lin2022.push(linearRegression(cont, indexer))
    indexerCount.push(indexer.length)
  }
  let predicted2022 = []
  lin2022.forEach(object=>{
    predicted2022.push(object['slope'] * (indexerCount[(lin2022.indexOf(object))]) + object['intercept'])
        
  })
  lin2022 = linearRegression(sumYearly,[1,2,3,4,5,6,7,8])
  predicted2022 = lin2022['slope'] * 9 + lin2022['intercept']
  let newYearsSum = [...sumYearly]
  let newYears = [...yearList]
  newYears.push('2022')
  
  newYearsSum.push(predicted2022)
  let predicted = {
    x:newYears,
    y:newYearsSum,
    type: 'scatter',
    name: '2022', 
  }
  
  let pee = [0, Math.max(...newYearsSum)]
  const _extent1 = extent(pee);
  const _scaleY1 = scaleLinear()
    .domain(_extent1)
    .range([chartSize - margin, 2*margin + 10]);
  const _scaleLine1 = scaleLinear()
    .domain([0, 8])
    .range([2*margin, chartSize+90]);
  const _scaleDate1 = scaleBand()
    .domain(newYears)
    .range([0, chartSize+50]);

  const _lineMaker1 = line()
    .x((d, i) => {
      return _scaleLine1(i);
    })
    .y((d) => {
      return _scaleY1(d);
    });
    
    
    let poo = [0, Math.max(...sumYearly)]
  const _extent2 = extent(poo);
  const _scaleY2 = scaleLinear()
    .domain(_extent2)
    .range([chartSize - margin, 2*margin + 10]);
  const _scaleLine2 = scaleLinear()
    .domain([0, 7])
    .range([2*margin, chartSize+90]);
  const _scaleDate2 = scaleBand()
    .domain(yearList)
    .range([0, chartSize+50]);

  const _lineMaker2 = line()
    .x((d, i) => {
      return _scaleLine2(i);
    })
    .y((d) => {
      return _scaleY2(d);
    }); 
  let cause2022 = groupBy(usableData, 'Cause of Death')
  let causeSum =new Array(causesOfDeath.length).fill(0.0)
  let lengths = new Array(causesOfDeath.length).fill(0.0)
  let causeMeans =  []
  let totalSum = 0
  for (const [key, value] of Object.entries(cause2022)) {
    let i = causesOfDeath.indexOf(key)
    value.forEach(object=>{
      // if(parseFloat(object['Number Dead']) >0.0){
        lengths[i] = value.length
        causeSum[i] = causeSum[i] + (parseFloat(object['Number Dead']))
        totalSum = totalSum + parseFloat(object['Number Dead'])
      // }
    })  
  }
  causeSum.forEach(value=>{
    causeMeans.push(predicted2022*value/totalSum)
  })
  const handleSubmit = (value)=>{
    
    console.log(value)
    if(parseFloat(value) < (predicted2022 +100) && parseFloat(value) > (predicted2022 -100)){
      setCorrect(true)
    } else {
      setCorrect(false)
    }
  }

  return (
    <div id="maincont">
      <header className="bg-info">
        <div className="header-img">
       <h1> Missing Migrants Visualization Project</h1>
       <h2>Raiham Malik</h2>
       </div>
      </header>
      
      <p className="m-3" id="one">
        The <a href="https://missingmigrants.iom.int/">Missing Migrants Project</a> tracks deaths of migrants, including refugees and asylum-seekers and this data has been collected from 2014 and is constantly updated.
        By collecting this data regularly the MM Project hopes to shed light on the global epidemic of crime and abuse inflicted upon migrants. Through D3, Javascript, and the Pandas Library I will illuminate the unfortunate trends and insight that can be shown through the data. 
      </p>
      <p>Below there are diffferent Source Quality levels this corresponds to the source quality of the reported incident and the causes of death are thus dependent on this source as well.</p>
      <h3>Play around with the different quality of the sources and causes of death, what do you find?</h3>
      <div id="checkboxes">
      <h4>Source Quality Level</h4> 
        {quality.map((value, index) => {
         
          return (
                <div className="left-section">
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    value={value}
                    checked={show[index]}
                    onChange={() => handleOnChange(index)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{value}</label>
                </div>
          );
        })}
         <h4>Causes of Death</h4> 
        {causesOfDeath.map((value, index) => {
         
          return (
                <div className="right-section">
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    value={value}
                    checked={checked[index]}
                    onChange={() => handleClick(index)}
                  />
                  <label htmlFor={`checkbox-${index}`}>{value}</label>
                </div>
          );
        })}  
        </div>    
      <div style={{ margin: 20 }} id="two">
      
          
      <svg
        width={chartSize + legendPadding}
        height={chartSize + margin}
        key = {'a'}
        className="fixed"
      >
          <rect 
          width={'100%'}
          height={'100%'}
          fill={'white'}
          /> 
        <path d="M649.824 210.035V211H643.774V210.156L646.802 206.785C647.175 206.37 647.462 206.019 647.666 205.731C647.873 205.439 648.017 205.179 648.097 204.951C648.182 204.718 648.224 204.481 648.224 204.24C648.224 203.935 648.161 203.66 648.034 203.415C647.911 203.165 647.729 202.966 647.488 202.818C647.247 202.67 646.955 202.596 646.612 202.596C646.201 202.596 645.859 202.676 645.583 202.837C645.313 202.993 645.11 203.214 644.974 203.497C644.839 203.781 644.771 204.106 644.771 204.475H643.597C643.597 203.954 643.711 203.478 643.939 203.046C644.168 202.615 644.507 202.272 644.955 202.018C645.404 201.76 645.956 201.631 646.612 201.631C647.196 201.631 647.695 201.735 648.11 201.942C648.525 202.145 648.842 202.433 649.062 202.805C649.286 203.173 649.398 203.605 649.398 204.1C649.398 204.371 649.352 204.646 649.259 204.925C649.17 205.2 649.045 205.475 648.884 205.75C648.728 206.026 648.544 206.296 648.332 206.563C648.125 206.83 647.903 207.092 647.666 207.35L645.19 210.035H649.824ZM656.882 205.643V207.052C656.882 207.809 656.815 208.448 656.679 208.969C656.544 209.489 656.349 209.908 656.095 210.226C655.841 210.543 655.535 210.774 655.175 210.917C654.819 211.057 654.417 211.127 653.969 211.127C653.613 211.127 653.285 211.083 652.985 210.994C652.684 210.905 652.414 210.763 652.172 210.568C651.935 210.369 651.732 210.111 651.563 209.794C651.394 209.477 651.265 209.091 651.176 208.639C651.087 208.186 651.042 207.657 651.042 207.052V205.643C651.042 204.885 651.11 204.25 651.246 203.738C651.385 203.226 651.582 202.816 651.836 202.507C652.09 202.194 652.395 201.969 652.75 201.834C653.11 201.699 653.512 201.631 653.956 201.631C654.316 201.631 654.646 201.675 654.946 201.764C655.251 201.849 655.522 201.986 655.759 202.177C655.996 202.363 656.197 202.613 656.362 202.926C656.531 203.235 656.66 203.613 656.749 204.062C656.838 204.511 656.882 205.037 656.882 205.643ZM655.702 207.242V205.446C655.702 205.031 655.676 204.667 655.625 204.354C655.579 204.037 655.509 203.766 655.416 203.542C655.323 203.317 655.204 203.135 655.061 202.996C654.921 202.856 654.758 202.754 654.572 202.691C654.39 202.623 654.185 202.589 653.956 202.589C653.677 202.589 653.429 202.642 653.213 202.748C652.998 202.85 652.816 203.013 652.667 203.237C652.524 203.461 652.414 203.755 652.337 204.119C652.261 204.483 652.223 204.925 652.223 205.446V207.242C652.223 207.657 652.246 208.023 652.293 208.34C652.344 208.658 652.418 208.933 652.515 209.166C652.612 209.394 652.731 209.582 652.871 209.73C653.01 209.879 653.171 209.989 653.353 210.061C653.539 210.128 653.744 210.162 653.969 210.162C654.257 210.162 654.508 210.107 654.724 209.997C654.94 209.887 655.12 209.716 655.264 209.483C655.412 209.246 655.522 208.943 655.594 208.575C655.666 208.203 655.702 207.758 655.702 207.242ZM664.449 210.035V211H658.399V210.156L661.427 206.785C661.8 206.37 662.087 206.019 662.291 205.731C662.498 205.439 662.642 205.179 662.722 204.951C662.807 204.718 662.849 204.481 662.849 204.24C662.849 203.935 662.786 203.66 662.659 203.415C662.536 203.165 662.354 202.966 662.113 202.818C661.872 202.67 661.58 202.596 661.237 202.596C660.826 202.596 660.484 202.676 660.208 202.837C659.938 202.993 659.735 203.214 659.599 203.497C659.464 203.781 659.396 204.106 659.396 204.475H658.222C658.222 203.954 658.336 203.478 658.564 203.046C658.793 202.615 659.132 202.272 659.58 202.018C660.029 201.76 660.581 201.631 661.237 201.631C661.821 201.631 662.32 201.735 662.735 201.942C663.15 202.145 663.467 202.433 663.687 202.805C663.911 203.173 664.023 203.605 664.023 204.1C664.023 204.371 663.977 204.646 663.884 204.925C663.795 205.2 663.67 205.475 663.509 205.75C663.353 206.026 663.169 206.296 662.957 206.563C662.75 206.83 662.528 207.092 662.291 207.35L659.815 210.035H664.449ZM669.565 201.707V211H668.391V203.173L666.023 204.037V202.977L669.381 201.707H669.565Z" fill="black"/>
        <path d="M649.824 152.035V153H643.774V152.156L646.802 148.785C647.175 148.37 647.462 148.019 647.666 147.731C647.873 147.439 648.017 147.179 648.097 146.951C648.182 146.718 648.224 146.481 648.224 146.24C648.224 145.935 648.161 145.66 648.034 145.415C647.911 145.165 647.729 144.966 647.488 144.818C647.247 144.67 646.955 144.596 646.612 144.596C646.201 144.596 645.859 144.676 645.583 144.837C645.313 144.993 645.11 145.214 644.974 145.497C644.839 145.781 644.771 146.106 644.771 146.475H643.597C643.597 145.954 643.711 145.478 643.939 145.046C644.168 144.615 644.507 144.272 644.955 144.018C645.404 143.76 645.956 143.631 646.612 143.631C647.196 143.631 647.695 143.735 648.11 143.942C648.525 144.145 648.842 144.433 649.062 144.805C649.286 145.173 649.398 145.605 649.398 146.1C649.398 146.371 649.352 146.646 649.259 146.925C649.17 147.2 649.045 147.475 648.884 147.75C648.728 148.026 648.544 148.296 648.332 148.563C648.125 148.83 647.903 149.092 647.666 149.35L645.19 152.035H649.824ZM656.882 147.643V149.052C656.882 149.809 656.815 150.448 656.679 150.969C656.544 151.489 656.349 151.908 656.095 152.226C655.841 152.543 655.535 152.774 655.175 152.917C654.819 153.057 654.417 153.127 653.969 153.127C653.613 153.127 653.285 153.083 652.985 152.994C652.684 152.905 652.414 152.763 652.172 152.568C651.935 152.369 651.732 152.111 651.563 151.794C651.394 151.477 651.265 151.091 651.176 150.639C651.087 150.186 651.042 149.657 651.042 149.052V147.643C651.042 146.885 651.11 146.25 651.246 145.738C651.385 145.226 651.582 144.816 651.836 144.507C652.09 144.194 652.395 143.969 652.75 143.834C653.11 143.699 653.512 143.631 653.956 143.631C654.316 143.631 654.646 143.675 654.946 143.764C655.251 143.849 655.522 143.986 655.759 144.177C655.996 144.363 656.197 144.613 656.362 144.926C656.531 145.235 656.66 145.613 656.749 146.062C656.838 146.511 656.882 147.037 656.882 147.643ZM655.702 149.242V147.446C655.702 147.031 655.676 146.667 655.625 146.354C655.579 146.037 655.509 145.766 655.416 145.542C655.323 145.317 655.204 145.135 655.061 144.996C654.921 144.856 654.758 144.754 654.572 144.691C654.39 144.623 654.185 144.589 653.956 144.589C653.677 144.589 653.429 144.642 653.213 144.748C652.998 144.85 652.816 145.013 652.667 145.237C652.524 145.461 652.414 145.755 652.337 146.119C652.261 146.483 652.223 146.925 652.223 147.446V149.242C652.223 149.657 652.246 150.023 652.293 150.34C652.344 150.658 652.418 150.933 652.515 151.166C652.612 151.394 652.731 151.582 652.871 151.73C653.01 151.879 653.171 151.989 653.353 152.061C653.539 152.128 653.744 152.162 653.969 152.162C654.257 152.162 654.508 152.107 654.724 151.997C654.94 151.887 655.12 151.716 655.264 151.483C655.412 151.246 655.522 150.943 655.594 150.575C655.666 150.203 655.702 149.758 655.702 149.242ZM662.252 143.707V153H661.078V145.173L658.71 146.037V144.977L662.068 143.707H662.252ZM666.874 152.016H666.994C667.671 152.016 668.221 151.921 668.645 151.73C669.068 151.54 669.394 151.284 669.622 150.962C669.851 150.641 670.007 150.279 670.092 149.877C670.176 149.471 670.219 149.054 670.219 148.626V147.211C670.219 146.792 670.17 146.42 670.073 146.094C669.98 145.768 669.848 145.495 669.679 145.275C669.514 145.055 669.326 144.888 669.114 144.773C668.903 144.659 668.678 144.602 668.441 144.602C668.171 144.602 667.927 144.657 667.711 144.767C667.5 144.873 667.32 145.023 667.172 145.218C667.028 145.412 666.918 145.641 666.842 145.903C666.766 146.166 666.728 146.451 666.728 146.76C666.728 147.035 666.761 147.302 666.829 147.56C666.897 147.818 667 148.051 667.14 148.258C667.28 148.466 667.453 148.631 667.661 148.753C667.872 148.872 668.12 148.931 668.403 148.931C668.666 148.931 668.911 148.88 669.14 148.779C669.372 148.673 669.578 148.531 669.755 148.354C669.937 148.172 670.081 147.966 670.187 147.738C670.297 147.509 670.361 147.27 670.377 147.021H670.936C670.936 147.372 670.866 147.719 670.727 148.062C670.591 148.4 670.401 148.709 670.155 148.988C669.91 149.268 669.622 149.492 669.292 149.661C668.962 149.826 668.602 149.909 668.213 149.909C667.756 149.909 667.36 149.82 667.026 149.642C666.692 149.464 666.417 149.227 666.201 148.931C665.989 148.635 665.83 148.305 665.725 147.941C665.623 147.573 665.572 147.2 665.572 146.824C665.572 146.384 665.634 145.971 665.756 145.586C665.879 145.201 666.061 144.862 666.302 144.57C666.543 144.274 666.842 144.043 667.197 143.878C667.557 143.713 667.972 143.631 668.441 143.631C668.97 143.631 669.421 143.737 669.793 143.948C670.166 144.16 670.468 144.443 670.701 144.799C670.938 145.154 671.112 145.554 671.222 145.999C671.332 146.443 671.387 146.9 671.387 147.37V147.795C671.387 148.273 671.355 148.76 671.292 149.255C671.232 149.746 671.116 150.215 670.942 150.664C670.773 151.113 670.526 151.515 670.2 151.87C669.874 152.221 669.449 152.501 668.924 152.708C668.403 152.911 667.76 153.013 666.994 153.013H666.874V152.016Z" fill="black"/>
        <circle cx="624" cy="148" r="6" fill="#FF0000"/>
        <circle cx="624" cy="209" r="6" fill="#0000FF"/>
        
        <text
          fill={"black"}
          style={{
                  fontSize: '18px',
                  fontWeight: 'heavy'
                }}
                x='150' 
                y='40'
               aria-label="Chart of All Missing Migrant Deaths in 2019 and 2021"
              >
                North American Missing Migrant Deaths in 2019 and 2021
        </text>
        <text
        className="y label"
        transform="rotate(-90)"
        y= "margin/2"
        x="-260"
        dy="1em"
        textAnchor = "end"
        >
          Deaths
        </text>
        <text
        className="x label"
        y= "500"
        x="340"
        dy="1em"
        textAnchor = "middle"
        >
          Months
        </text>
        <AxisLeft strokeWidth={0} left={margin + margin} scale={_scaleY}/>
        <AxisBottom 
        strokeWidth={0} 
        top={chartSize - margin}
        left={margin + margin}
        scale={_scaleDate}
        />
       
        {years.map((year, i) => {
            return (
              <>
              <path
                stroke={year === "2019" ? "red" : "blue"}
                strokeWidth={2}
                fill={"none"}
                key={year}
                d={_lineMaker(graphData[i].y)}
              />
              
              </>
            );
          })}

          
      </svg>
   
    <div className="flex-item">
    <h3> You should find that most causes of death are mixed or unknown and that the highest source quality is quite abundant in this dataset.</h3>
    <p>This allows us to learn very little about the effect of COVID in the migrants as the data changes only slightly when sickness is not a cause of death. This could be in part to the lower quality of sources, but also due to the fact perhaps COVID was only a factor in the many hardships migrants face in their journeys.</p>
    <p>But what about this year? Take a look at the total deaths per year and then make a guess below. </p>
    </div>
    <div className="plot flex-item">
    <svg
        width={chartSize + legendPadding}
        height={chartSize + margin}
        key = {'c'}
        className="fixed"
      >
        
          <rect 
          width={'100%'}
          height={'100%'}
          fill={'white'}
          /> 
        
        <text
          fill={"black"}
          style={{
                  fontSize: '18px',
                  fontWeight: 'heavy'
                }}
                x='150' 
                y='35'
               aria-label="Chart of All Missing Migrant Deaths in 2019 and 2021"
              >
                North American Total Deaths per Year
        </text>
        <text
        className="y label"
        transform="rotate(-90)"
        y= "margin/2"
        x="-260"
        dy="1em"
        textAnchor = "end"
        >
          Deaths
        </text>
        <text
        className="x label"
        y= "500"
        x="340"
        dy="1em"
        textAnchor = "middle"
        >
          Years
        </text>
        <AxisLeft strokeWidth={0} left={2*margin} scale={_scaleY2}/>
        <AxisBottom 
        strokeWidth={0} 
        top={chartSize - margin}
        left={margin + margin}
        scale={_scaleDate2}
        tickValues={yearList}
        />
     
              <path
                stroke={"black"}
                strokeWidth={2}
                fill={"none"}
                key={'poo'}
                d={_lineMaker2(sumYearly)}
              />
          
    </svg>
    <p>Guess:</p>
<p>
    <form>
      <input type={'text'} id="guess" name="guess" value={guess} onChange={(event)=>setGuess(event.target.value)}></input>
      <input type='button' value={'Make a Guess'} onClick={()=>{handleSubmit(guess)
         setClicked(true)}}></input>
      {correct && clicked &&
      <p>Unfortunately the number is this high.</p>}
      {!correct && clicked &&
        <p>Try again</p>
      }
    </form>
    
    </p>
    {clicked &&
    <p>Using a linear regression model I calculated the expected trend for each year and thus the predicted deaths for 2022. The predicted value of deaths is {parseInt(predicted2022)} </p>
    }
    </div>
    {clicked &&
    <svg
        width={chartSize + legendPadding}
        height={chartSize + margin}
        key = {'b'}
        className="fixed"
      >
        
          <rect 
          width={'100%'}
          height={'100%'}
          fill={'white'}
          /> 
        
        <text
          fill={"black"}
          style={{
                  fontSize: '18px',
                  fontWeight: 'heavy'
                }}
                x='150' 
                y='35'
               aria-label="Chart of All Missing Migrant Deaths in 2019 and 2021"
              >
                North American Predicted Missing Migrant Deaths in 2022
        </text>
        <text
        className="y label"
        transform="rotate(-90)"
        y= "margin/2"
        x="-260"
        dy="1em"
        textAnchor = "end"
        >
          Deaths
        </text>
        <text
        className="x label"
        // transform="rotate(90)"
        y= "500"
        x="340"
        dy="1em"
        textAnchor = "middle"
        >
          Years
        </text>
        <AxisLeft strokeWidth={0} left={2*margin} scale={_scaleY1}/>
        <AxisBottom 
        strokeWidth={0} 
        top={chartSize - margin}
        left={margin + margin}
        scale={_scaleDate1}
        tickValues={newYears}
        />
     
              <path
                stroke={"black"}
                strokeWidth={2}
                fill={"none"}
                key={'pee'}
                d={_lineMaker1(predicted.y)}
              />
          
    </svg>
}
    <div className="flex-item"> 
    {view==false &&
      <p>Do you want to take a closer look at causes of death for this year?</p>}
    {view==false && 
      <button onClick={()=>setView(true)}>Take a closer look</button>
    } 
    
     </div>
    <p></p>
    {view && 
      <Plot 
      data={[{
        x: causesOfDeath,
        y: causeMeans,
        type: 'bar',
        marker: {
          color: 'black'
        }
      }]}
      layout={ {
        width: chartSize + legendPadding, 
        height: chartSize, 
        
        yaxis: {
          title:'Predicted Deaths',
        },
        tickfont:{
          family: 'Lato, serif',
          size: 10
        },
        title: 'Predicted Causes of Death in 2022'}}/>
    }
   {view &&
   <button  onClick={()=>setView(false)}>Close Graph</button>
   }
    <div className="flex-item">
    <p>The unfortunate trend in migrants death is upwards each year with a large spike in 2021. Further down you will find older graphs that illuminate global trends and North American trends</p>
      </div>
   
<div className="fixed"> 
  <h2>Global Distributions</h2>
  <p>Below we take a look at the total number of missing and deaths in 2019 and 2021. This will allow us to see the trends globally. </p>
</div>
<div className="flex-item">
<Graphs/>
    
    </div>
    </div>
    <footer>
     <p> Raiham Malik Info 474 Winter 2022 Project</p>
     <p><a href="https://github.com/Raihamm/474finalproj">Github Repo</a></p>
      </footer>
  </div>
   
  );
}
export default App;