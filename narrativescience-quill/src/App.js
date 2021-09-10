import logo from './logo.svg';
import './App.css';
import {client, useConfig, useElementColumns, useElementData} from '@sigmacomputing/plugin';
import pluralize from 'pluralize';
import { useEffect, useMemo, useState } from 'react';

client.config.configureInspector([
  { name: 'source', type: 'element' },
  { name: 'dimension', type: 'column', source: 'source', allowMultiple: false },
  { name: 'measures', type: 'column', source: 'source', allowMultiple: true },
  { name: 'apiKey', type: 'text', secure: true },
]);

function getQuillPayload(sigmaData, colInfo, config) {
  const source = config.source;
  const dimensions = config.dimension ? [config.dimension] : [];
  const measures = config.measures ?? [];
  if (!source || !dimensions.length || !measures.length) return null;
  for (const colId of [...dimensions, ...measures]) {
    if (!(colId in colInfo)) return;
  }

  if (!(dimensions[0] in sigmaData)) return null;
  const rowCount = sigmaData[dimensions[0]].length
  const rows = new Map();
  for (let i = 0; i < rowCount; i++) {
    const key = `${dimensions.map(colId => sigmaData[colId][i]).join(':')}`
    if (rows.has(key)) {
      const row = rows.get(key);
      for (let j = dimensions.length; j < row.length; j++) {
        row[j].value += sigmaData[measures[j - dimensions.length]][i];
      }
    } else {
      rows.set(key, [
        ...dimensions.map(colId => ({ id: colId, value: sigmaData[colId][i] })),
        ...measures.map(colId => ({ id: colId, value: sigmaData[colId][i] })),
      ]);
    }
  }

  return {
    metadata: { platform: "clientname" },
    api_version: 2,
    data: {
      dimensions: dimensions.map(
        colId => ({
          name: colInfo[colId].name,
          id: colId,
          labels: [
            { singular: colInfo[colId].name,
            plural: pluralize(colInfo[colId].name)}
          ]
        })),
      measures: measures.map(
        colId => ({
          id: colId,
          outside: false,
          up_sentiment: "good", // good/bad/neutral
          format: config.measureFormat || "number", //money/number/percent
          name: colInfo[colId].name, // e.g. "sales"
        })),
      rows: [...rows.values()],
    },
    configuration: {
      authoring: {
        verbosity: "high", // low/medium/high
        format: "bullets", // bullets/paragraph
      },
      drivers: null,
      analytics: {
        trendline: {
          enabled: true,
          index: 1,
          thresholds: {
            inclusion: {
              value: 0.95,
            },
          },
        },
        segments: {
          enabled: true,
          index: 0,
        },
      },
      relationships: null,
    },
    focus: null,
    selections: null,
  }
}

function useGetQuillStory() {
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const colInfo = useElementColumns(config.source);
  const payload = useMemo(() => getQuillPayload(sigmaData, colInfo, config), [colInfo, config, sigmaData]);
  const apiKey = config.apiKey;
  const [res, setRes] = useState(null);

  useEffect(() => {
    if (!payload || !apiKey) return null;

    var quillURL =
      "https://viz.narrativescience.com/v2/stories/linechart?user_key=" + apiKey;

    fetch(quillURL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
      .then(data => {
        return data.text();
      })
      .then(res => {
        setRes(res);
      })
      .catch(e => console.log(e));
  }, [apiKey, payload]);

  return res;
}

function App() {
  const res = useGetQuillStory();
  return (
    res &&<div style={{padding: "24px"}} dangerouslySetInnerHTML={{__html: res}}/>
  );
}

export default App;
