import { scaleLinear, scaleBand, extent, line, symbol, csv, sum } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import _ from "lodash";
import Plot from 'react-plotly.js'
import './index.css'

const graphUrl = new URL('../PythonChart.png', import.meta.url).href
const codeUrl = new URL('../PythonCode.png', import.meta.url).href

function App() {
  const chartSize = 500;
  const margin = 30;
  const legendPadding = 200;
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
  let monthlyDeaths = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
  csv(
    "data/MM_14_21.csv",
    (data) => {
      if(data.Year == 2021 && data.Region =="North America"){
      csvData.push(data)
      csvData.forEach((object)=>{
        let matchingIndex = months.indexOf((object["Reported Month"]));
       if(matchingIndex !== -1){
         let curr = monthlyDeaths[matchingIndex]
        monthlyDeaths[matchingIndex] = curr + parseFloat(object["Number Dead"]) 
       }
       
      })
    }}
    
  );
 
  console.log(monthlyDeaths)
  const _extent = extent(csvData);
  const _scaleY = scaleLinear()
    .domain(_extent)
    .range([chartSize - margin, margin]);
  const _scaleLine = scaleLinear()
    .domain([0, 11])
    .range([margin, chartSize - margin]);
  const _scaleDate = scaleBand()
    .domain(months)
    .range([0, chartSize - margin - margin]);

  const _lineMaker = line()
    .x((d, i) => {
      return _scaleLine(i);
    })
    .y((d) => {
      return _scaleY(d);
    });
    
  return (
    <div id="maincont">
      <header className="bg-info">
       <h1> North America Migrant Deaths Info Visualization (Assignment 1) </h1>
       <h2>Raiham Malik</h2>
      </header>
      <nav className="site-navigation page-navigation"> <h3>Navigation</h3>
        <ul className="menu"> 
            <li><a id="sec-1" href="#one">About</a></li>
            <li><a id="sec-2" href="#chart-img">Python Chart and Findings</a></li>
            <li><a id="sec-3" href="#code-img">Python Code</a></li>
            <li><a id="sec-4" href="#four">Javascript Chart attempt</a></li>
          </ul>
      </nav>
      <p className="m-3" id="one">
        The Missing Migrants Project tracks deaths of migrants, including refugees and asylum-seekers and this data has been collected from 2014 and is constantly updated.
        By collecting this data regularly the MM Project hopes to shed light on the global epidemic of crime and abuse inflicted upon migrants  
      </p>
      <h3>I would first like to answer the question: What has been the trend of migrants death in North America over the course of 2021 versus 2019 before the COVID-19 Pandemic?</h3>
      <p>The graph below shows the total deaths each month in 2019 versus 2021. This chart was created in python and the code follows the graphic.</p>
      <img src={graphUrl} id="chart-img"/>
      <p>This chart displays how the number of migrant deaths in 2019, before the pandemic, was much lower than in 2021. Through this chart I can explore further questions that come up from this representation. In December 2019 there was a steep incline in deaths and in December 2021 there was a much drastic lower number. Could this be due to lack of data from December 2021? Was the steep incline in migrant deaths in December of 2019 due to a harsh winter or was there another cause? I hope to explore these questions in further assignments as well as look at other data from other countries.</p>
      <img src={codeUrl} id="code-img"/>
      <div style={{ margin: 20 }} id="four">

      <Plot
        data={[
          {
            x: months,
            y: monthlyDeaths,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
        ]}
        layout={ {width: chartSize + legendPadding, height: chartSize, title: 'Deaths in 2021 per Month'} }
      />
      <p>
        The chart above is made in javascript. I was unable to sum number of dead migrants over each month in 2021 and similarly unable to do so for 2019.
      </p>
      </div>
      <footer>
        Raiham Malik Winter 22 Info 474
      </footer>
    </div>
    
  );
}
export default App;