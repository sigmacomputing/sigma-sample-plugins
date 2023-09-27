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
      .nodeHeight((d) => 85 + 25)
      .nodeWidth((d) => 220 + 2)
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
      .nodeContent(function (d, i, arr, state) {
        const color = '#FFFFFF';
        const imageDiffVert = 25 + 2;
        return `
                <div className="parent" style='width:${d.width}px;height:${d.height}px;padding-top:${imageDiffVert - 2}px;padding-left:1px;padding-right:1px;'>

                        <div className="person-component" style="font-family: 'Inter', sans-serif;background-color:${color};  margin-left:-1px;width:${d.width - 2}px;height:${d.height - imageDiffVert}px;border-radius:10px;border: 1px solid #E4E2E9; display:flex; justify-content:center; align-items:center; flex-direction:column; position: relative">
                                          
                      

                            <img src=" ${d.data.imageUrl}" style="margin-left:${-139}px;border-radius:500px;width:50px;height:50px; position: fixed; top: -10px;" />
                            
                            <div className="name parent" style="position: fixed; top: 35px;">
                              <div className="person name" style="font-size:15px;color:#08011E;margin-left:-100px;margin-top:5px; position: fixed;">  ${d.data.name} </div>
                            </div>
                            
                            <div className="title parent" style="position: fixed; width: 200px;">
                              <div className="person title" style="color:#4346FF;font-size:10px; font-weight: bold; width: fit-content; left: 12px; position: fixed; top: 62px;"> ${d.data.positionName} </div>
                            </div>

                            <div className="area parent" style="position: fixed; width: 200px;">
                              <div className="person area" style="color:#716E7B;font-size:10px; width: fit-content; position: fixed; top: 80px; left: 12px;"> ${d.data.area} </div>
                            </div>

                            <div className="location parent" style="position: fixed; width: 200px; height: 70px;">
                              <div className="person location" style="color:#716E7B;font-size:10px; width: fit-content; position: absolute; right: 0px;"> ${d.data.location} </div>
                            </div>
                            

                        </div>
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
