import * as React from 'react';
import {
  client,
  useConfig,
  useElementColumns,
  useElementData,
} from "@sigmacomputing/plugin";

import './App.css';
import Map from './components/Map';

client.config.configureEditorPanel([
  { name: "source", type: "element" },
  { name: "Latitude", type: "column", source: "source", allowMultiple: false },
  { name: "Longitude", type: "column", source: "source", allowMultiple: false },
  { name: "Fields", type: "column", source: "source", allowMultiple: true },
  { name: "Cluster scale", type: "text", placeholder: '1 to 100' },
]);

function App() {
  const config = useConfig();
  const columns = useElementColumns(config.source);
  const sigmaData = useElementData(config.source);

  const data = React.useMemo(() => {
    const latitude = config.Latitude;
    const longitude = config.Longitude;
    const fields = config.Fields;
    // console.log('got data', config, sigmaData, columns, latitude, longitude, fields);
    const _data = [];

    if (sigmaData?.[latitude] && sigmaData?.[longitude]) {
      for (let i = 0; i < sigmaData[latitude].length; i++) {
        const lat = sigmaData[latitude][i];
        const long = sigmaData[longitude][i];
        const tooltips = fields.map(id => {
          return {
            key: columns[id]?.name || '',
            value: sigmaData[id] ? sigmaData[id][i] : '',
          };
        }); 
        _data.push({
          id: i,
          coordinates: [long, lat],
          tooltips
        })
      }
    }
    return _data;
  }, [columns, config.Latitude, config.Longitude, config.Fields, sigmaData]);

  const clusterScaleText = config['Cluster scale'];
  const sizeScale = React.useMemo(() => {
    if (!clusterScaleText) return null;
    const num = Number(clusterScaleText);
    if (!isNaN(num) && num >= 1 && num <= 100) return num;
    return null;
  }, [clusterScaleText])

  return (
    <div className="App">
      <Map data={data} sizeScale={sizeScale} />
    </div>
  );
}

export default App;
