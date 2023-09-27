import './App.css';
import default_face from "./default.png";
import root_face from "./sigma.jpg";
import {client, useConfig, useElementData, useElementColumns} from '@sigmacomputing/plugin';
import { useEffect, useRef, useMemo } from 'react';
import { OrgChart } from 'd3-org-chart';
import * as d3 from 'd3';

// d.data.positionName
// d.data.area
// d.data.imageUrl
// -- d.depth
// d.data.name
// d.data.id
client.config.configureEditorPanel([
  { name: "source", type: "element" },
  { name: "name", type: "column", source: "source", allowMultiple: false },
  { name: "id", type: "column", source: "source", allowMultiple: false },
  { name: "parentId", type: "column", source: "source", allowMultiple: false },
  { name: "positionName", type: "column", source: "source" },
  { name: "area", type: "column", source: "source" },
  { name: "imageUrl", type: "column", source: "source" },
  { name: "location", type: "column", source: "source" },
]);

function graph(data) {
  d3.selectAll('.container > *').remove();
  new OrgChart()
      .container('.container')
      .data(data)
      .nodeHeight(d => 70)
      .nodeWidth(d => {
        if (d.depth === 0) return 250;
        if (d.depth === 1) return 220;
        return 140;
      })
      .childrenMargin(d => 50)
      .compactMarginBetween(d => 35)
      .compactMarginPair(d => 30)
      .neightbourMargin((a, b) => 20)
      .buttonContent(({ node, state }) => {
        return `<div style="border-radius:3px;padding:3px;font-size:10px;margin:auto auto;background-color:lightgray"> <span style="font-size:9px">${
            node.children
                ? `<i class="fas fa-chevron-up"></i>`
                : `<i class="fas fa-chevron-down"></i>`
        }</span> ${node.data._directSubordinates}  </div>`;
      })
      .nodeContent(function(d, i, arr, state) {
        const colors = ['#278B8D', '#404040', '#0C5C73', '#33C6CB'];
        const color = colors[d.depth % colors.length];
        return `
            <div style="background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:50px">
               <img src=" ${
            d.data.imageUrl
        }" style="position:absolute;margin-top:5px;margin-left:${5}px;border-radius:100px;width:60px;height:60px;text-align: left;" />
               <div style="position:absolute;top:-15px;width:${
            d.width
        }px;text-align:center;color:#fafafa;">
                     <!--<div style="margin:0 auto;background-color:${color};display:inline-block;padding:8px;padding-bottom:0px;border-radius:5px"> ${d.data.id}</div>-->
              </div>

              <div style="color:#fafafa;font-size:${
            d.depth < 2 ? 16 : 12
        }px;font-weight:bold;margin-left:70px;margin-top:15px"> ${d.depth < 2 ? d.data.name : (d.data.name || '').trim().split(/\s+/g)[0]} </div>
              <div style="color:#fafafa;margin-left:70px;margin-top:5px"> ${
            d.depth < 2 ? d.data.positionName : d.data.area
        } </div>
              
               <!--
               <div style="padding:20px; padding-top:35px;text-align:center">
                  
                   
               </div> 
              
               <div style="display:flex;justify-content:space-between;padding-left:15px;padding-right:15px;">
                 <div > Manages:  ${d.data._directSubordinates} 👤</div>  
                 <div > Oversees: ${d.data._totalSubordinates} 👤</div>    
               </div>
               -->
           </div>
  `;
      })
      .render();
}
function transform(config, columns, sigmaData) {
  const name = config.name;
  const id = config.id;
  const parentId = config.parentId;
  const positionName = config.positionName; //config.positionName;
  const area = config.area; //config.area;
  const imageUrl = config.imageUrl;// config.imageUrl;
  const location = config.location; //config.location;

  //console.log('got data', config, sigmaData, columns, name, id, parentId);
  //console.log(config.source);
  const data = [];
  const roots = [];
  if (sigmaData?.[name] && sigmaData?.[id] && sigmaData?.[parentId]) {
    for (let idx = 0; idx < sigmaData[name].length; ++idx) {
      data.push({
        "positionName": sigmaData[positionName]?.[idx],
        "area": sigmaData[area]?.[idx],
        "imageUrl": sigmaData[imageUrl]?.[idx] || default_face,
        "location": sigmaData[location]?.[idx],
        "name": sigmaData[name][idx],
        "id": sigmaData[id][idx],
        "parentId": sigmaData[parentId][idx]
      });
      if(!sigmaData[parentId][idx]) {
        roots.push(idx);
      }
    }
    if(roots.length > 1) {
      for(let j=0; j < roots.length; ++j) {
        const idx = roots[j];
        data[idx]['parentId'] = "Root";
      }
      data.push({
        "positionName": "",// sigmaData[positionName],
        "area": "area", //sigmaData[area],
        "imageUrl": root_face, //sigmaData[imageUrl],
        "location": "location", //sigmaData[location],
        "name": "",
        "id": "Root",
        "parentId": null
      });
    }
    console.log('generated data', data);
  }
  return data;
}

function App() {
  const config = useConfig();
  const columns = useElementColumns(config.source);
  const sigmaData = useElementData(config.source);
  console.log("source", config.source);
  console.log("data", sigmaData);
  console.log("columns", columns);
  /*  sigmaData = {}
    sigmaData[config.name] = ['sam', 'anand', 'eran', 'darien']
    sigmaData[config.parentId] = ['anand', 'eran', null, 'eran']
    sigmaData[config.id] = ['sam', 'anand', 'eran', 'darien']
  */

  useEffect(() => {
    graph(transform(config, columns, sigmaData));
  }, [config, columns, sigmaData]);

  return (
      <div className="App">
        <div className="container"/>
      </div>
  );
};

export default App;
