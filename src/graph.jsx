import { scaleLinear, scaleBand, extent, line, symbol, csv, sum, quantize } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import _, { indexOf, reduce } from "lodash";
import Plot from 'react-plotly.js'
import './index.css'
import migrantData from '../data/data.json'
import React, {useState} from "react";

export default function Graphs() {
    const chartSize = 500;
    const margin = 30;
    const legendPadding = 180;
    const usableData = [];
    const globalData = [] 
    let quality = [1,2,3,4,5]
    let [show, setShow] = useState([true,true,true,true,true]);
    let [view,setView] = useState(false)
    const handleOnChange = (position) => {
      const updatedCheckedState = show.map((item, index) =>
        index === position ? !item : item
      );
      setShow(updatedCheckedState)
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
        color: 'blue'
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
        color: 'blue'
      }
    }
    let globalDeath = [globalline1,globalline2]
    let globalMissing = [globalline1cred, globalline2cred] 
    
  
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
        color: 'black'
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
        color: 'blue'
      }
  
    }]   
  
    return (
        <div id="graphs">
    <div className="plot fixed">
        <Plot
          data={globalDeath}
          layout={ {width: chartSize + legendPadding, height: chartSize, yaxis: {
            title:'Deaths',
          },
          xaxis: {
            title:'Months',
          },title: 'Total Deaths Globally in 2021 and 2019 per Month'}
        }
        />
      </div>
        <div id="addSpace" className="plot flex-item">
          <Plot
          data={globalMissing}
            layout={ {width: chartSize + legendPadding, height: chartSize, yaxis: {
              title:'Deaths',
            },
            
            xaxis: {
              title:'Months',
            },title: 'Total Missing Globally in 2021 and 2019 per Month'}
          }
          />
          </div>
        <div className="flex-item">
        <p>
          It is understandable and reasonable that there are more deaths in December each year due to cold weather. In April and May in both years there was a drop in deaths. In 2019 the Sudan Protests began this could possibly attribute to the lack of deaths and migration to North America. After President AMLO took office in 2019 there was a decrease in immigration staff at the border of Mexico and the US as well as more policies that promoted orderly transit according to <cite><a href="https://www.wilsoncenter.org/article/2019-migration-to-and-through-mexico-mid-year-report">Wilson Center</a></cite>. Through stronger enforcement from January to May of 2019 this could cause the decline in deaths in April and May.
        </p>
        <p>
        In 2021 there was still an ongoing Pandemic, although the United States began rolling out vaccines the rest of the world was still not fully vaccinated. The drop in deaths in October could be attributed to the higher rate of fully vaccinated people globally. By the end of September 2021, about 35% of the world's population is fully vaccinated according to <cite><a href="https://ourworldindata.org/covid-vaccinations">Our World in Data</a></cite>.
        </p>
        <div>
        </div>
        </div>
        <div id="addSpace" className="plot fixed">
        <Plot
          data={regionData}
          layout={ {
            width: chartSize + legendPadding, 
            height: chartSize + margin,
            yaxis: {
              title:'Deaths',
            },
            xaxis: {
              title:'Regions',
            }, 
            title: 'Total Dead for Each Region'}}
        />
        </div>
        <p>
          North America has much higher deaths than any other region, it also has the most people migrating to this region than anywhere else in the world in 2016 it was found that there were 1 Million people who migrated to the US each year. Thus I will continue to focus solely on North America in my further investigations.
        </p>
        <div className="fixed">
        <h2>Error Charts</h2>
        <p>Going back to the <a href="#two">first chart</a> I made let's explore the error margin for each month. 
        I did this through taking into account the source quality. Scaling the data by the source quality, i.e. if it is a 5 quality level the death will be counted wholly with no margin or error,
         but if there is a level 1 quality deaths source the error margin will increase. This will allow us to understand just how reliable this data is for both 2019 and 2021 in North America.</p>
         </div>
      <div className="plot fixed">
        <Plot
          data={err2019}
          layout={ {
            width: chartSize + legendPadding, 
            height: chartSize, 
            yaxis: {
              title:'Deaths',
            },
            xaxis: {
              title:'Months',
            },
            title: 'Deaths with Error Margin in NA in 2019 per Month'}}
        />
      </div>
      <div className="plot fixed">
        <Plot
          data={err2021}
          layout={ {
            width: chartSize + legendPadding, 
            height: chartSize, 
            yaxis: {
              title:'Deaths',
            },
            xaxis: {
              title:'Months',
            },
            title: 'Deaths with Error Margin in NA in 2021 per Month'}}
        />
      </div>
      <div className="fixed">
      <h2>Conclusion</h2>
      <p>
        After calculating the error margins in both 2019 and 2021 there are several months that have very high error margins. In 2019 both June and July had bigger margins of error, after a quick google search I found out President reached a deal with Mexico to avoid tariffs and curb immigration and human trafficking. This caused immigrants to illegally cross borders out of desperation and fight to survive in their journeys, leading to lower quality of sources reporting these deaths. Lastly in June of 2021, travel restrictions were eased in countries not yet equiped or safe enough to do so, leading to surges in cases globally. The different causes and trends in these graphs can be explained by major events. 
      </p>
      </div>
  </div>)
}