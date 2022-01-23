import{c as g,e as b,l as m,b as y,a as v,j as c,d as e,P as w,i as M,R as I,f as D}from"./vendor.6fedf12c.js";const N=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function d(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerpolicy&&(r.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?r.credentials="include":t.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(t){if(t.ep)return;t.ep=!0;const r=d(t);fetch(t.href,r)}};N();const x=new URL("/assets/PythonChart.84e44813.png",self.location).href,A=new URL("/assets/PythonCode.8502d0c5.png",self.location).href;function P(){const n=500,a=30,d=200,i=[],t=["January","February","March","April","May","June","July","August","September","October","November","December"];let r=[0,0,0,0,0,0,0,0,0,0,0,0];g("data/MM_14_21.csv",o=>{o.Year==2021&&o.Region=="North America"&&(i.push(o),i.forEach(h=>{let l=t.indexOf(h["Reported Month"]);if(l!==-1){let p=r[l];r[l]=p+parseFloat(h["Number Dead"])}}))}),console.log(r);const s=b(i),u=m().domain(s).range([n-a,a]),f=m().domain([0,11]).range([a,n-a]);return y().domain(t).range([0,n-a-a]),v().x((o,h)=>f(h)).y(o=>u(o)),c("div",{id:"maincont",children:[c("header",{className:"bg-info",children:[e("h1",{children:" North America Migrant Deaths Info Visualization (Assignment 1) "}),e("h2",{children:"Raiham Malik"})]}),c("nav",{className:"site-navigation page-navigation",children:[" ",e("h3",{children:"Navigation"}),c("ul",{className:"menu",children:[e("li",{children:e("a",{id:"sec-1",href:"#one",children:"About"})}),e("li",{children:e("a",{id:"sec-2",href:"#chart-img",children:"Python Chart and Findings"})}),e("li",{children:e("a",{id:"sec-3",href:"#code-img",children:"Python Code"})}),e("li",{children:e("a",{id:"sec-4",href:"#four",children:"Javascript Chart attempt"})})]})]}),e("p",{className:"m-3",id:"one",children:"The Missing Migrants Project tracks deaths of migrants, including refugees and asylum-seekers and this data has been collected from 2014 and is constantly updated. By collecting this data regularly the MM Project hopes to shed light on the global epidemic of crime and abuse inflicted upon migrants"}),e("h3",{children:"I would first like to answer the question: What has been the trend of migrants death in North America over the course of 2021 versus 2019 before the COVID-19 Pandemic?"}),e("p",{children:"The graph below shows the total deaths each month in 2019 versus 2021. This chart was created in python and the code follows the graphic."}),e("img",{src:x,id:"chart-img"}),e("p",{children:"This chart displays how the number of migrant deaths in 2019, before the pandemic, was much lower than in 2021. Through this chart I can explore further questions that come up from this representation. In December 2019 there was a steep incline in deaths and in December 2021 there was a much drastic lower number. Could this be due to lack of data from December 2021? Was the steep incline in migrant deaths in December of 2019 due to a harsh winter or was there another cause? I hope to explore these questions in further assignments as well as look at other data from other countries."}),e("img",{src:A,id:"code-img"}),c("div",{style:{margin:20},id:"four",children:[e(w,{data:[{x:t,y:r,type:"scatter",mode:"lines+markers",marker:{color:"red"}}],layout:{width:n+d,height:n,title:"Deaths in 2021 per Month"}}),e("p",{children:"The chart above is made in javascript. I was unable to sum number of dead migrants over each month in 2021 and similarly unable to do so for 2019."})]}),e("footer",{children:"Raiham Malik Winter 22 Info 474"})]})}const j={apiKey:"AIzaSyDqVxiaVeTpJ0V4bOAgHOIL5vMR5MEtsTg",authDomain:"finalprojectraiham.firebaseapp.com",projectId:"finalprojectraiham",storageBucket:"finalprojectraiham.appspot.com",messagingSenderId:"628719563822",appId:"1:628719563822:web:cc45c67e3901407c13dbbf"};M(j);I.render(e(D.StrictMode,{children:e(P,{})}),document.getElementById("root"));