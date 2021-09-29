import logo from "./logo.svg";
import {
  client,
  useConfig,
  useElementData,
  useElementColumns,
} from "@sigmacomputing/plugin";
import "./App.css";
import * as d3 from 'd3';
import React from "react";

client.config.configureEditorPanel([
  { name: "source", type: "element" },
  { name: "date", type: "column", source: "source", allowMultiple: false },
  { name: "high", type: "column", source: "source", allowMultiple: false },
  { name: "low", type: "column", source: "source", allowMultiple: false },
  { name: "open", type: "column", source: "source", allowMultiple: false },
  { name: "close", type: "column", source: "source", allowMultiple: false },
]);

function App() {
  const config = useConfig();

  const sigmaData = useElementData(config.source);
  const columns = useElementColumns(config.source);

  const date = sigmaData[config["date"]];
  console.log(date);
  const high = sigmaData[config["high"]];
  const low = sigmaData[config["low"]];
  const open = sigmaData[config["open"]];
  const close = sigmaData[config["close"]];

  if (date && high && low && open && close) {
    const dateId = config.date;
    var dateTitle = columns[dateId].name;

    const highId = config.high;
    var highTitle = columns[highId].name;

    const lowId = config.low;
    var lowTitle = columns[lowId].name;

    const openId = config.open;
    var openTitle = columns[openId].name;

    const closeId = config.close;
    var closeTitle = columns[closeId].name;
  }

  const data = React.useMemo(() => {
    const data = [];

    if (date && high && low && open && close) {
      for (let i = 0; i < date.length; i++) {
        let row = {};

        row[dateTitle] = new Date(date[i]);
        row[highTitle] = high[i];
        row[lowTitle] = low[i];
        row[openTitle] = open[i];
        row[closeTitle] = close[i];

        data.push(row);
      }
    }

    return data;
  }, [
    date,
    dateTitle,
    high,
    highTitle,
    low,
    lowTitle,
    open,
    openTitle,
    close,
    closeTitle,
  ]);

  console.log(data);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <div>{JSON.stringify(data)}</div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
