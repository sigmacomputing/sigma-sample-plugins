import { client, useConfig, useElementData } from "@sigmacomputing/plugin";
import "./App.css";
import * as d3 from "d3";
import React, { useRef } from "react";

client.config.configureEditorPanel([
  { name: "source", type: "element" },
  // max range of dates: 8 months, otherwise x-axis may get too cramped unless ticks are changed
  { name: "date", type: "column", source: "source", allowMultiple: false },
  { name: "high", type: "column", source: "source", allowMultiple: false },
  { name: "low", type: "column", source: "source", allowMultiple: false },
  { name: "open", type: "column", source: "source", allowMultiple: false },
  { name: "close", type: "column", source: "source", allowMultiple: false },
]);

const height = 300;
const width = 600;
const margin = { top: 0, right: 25, bottom: 20, left: 40 };

function renderChart(data, ref) {
  const x = d3
    .scaleBand()
    //ticks are set to Mondays
    .domain(
      d3.utcDay
        .range(data[0].date, +data[data.length - 1].date + 1)
    )
    .rangeRound([30, width - 20])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)])
    .range([height - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(
            d3.utcMonday
              .every(width > 720 ? 1 : 2)
              .range(data[0].date, data[data.length - 1].date)
          )
          .tickFormat(d3.utcFormat("%-m/%-d"))
      )
      .call((g) => g.select(".domain").remove());

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickFormat(d3.format("$~f"))
          .tickValues(d3.scaleLinear().domain(y.domain()).ticks())
      )
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("stroke-opacity", 0.2)
          .attr("x2", width - margin.left - margin.right)
      )
      .call((g) => g.select(".domain").remove());

  const svg = d3.select(ref.current).attr("viewBox", [0, 0, width, height]);
  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  const g = svg
    .append("g")
    .attr("stroke-linecap", "round")
    .attr("stroke", "black")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(${x(d.date)},0)`);

  g.append("line")
    .attr("y1", (d) => y(d.low))
    .attr("y2", (d) => y(d.high));

  g.append("line")
    .attr("y1", (d) => y(d.open))
    .attr("y2", (d) => y(d.close))
    .attr("stroke-width", x.bandwidth())
    .attr("stroke", (d) =>
      d.open > d.close
        ? d3.schemeSet1[0]
        : d.close > d.open
        ? d3.schemeSet1[2]
        : d3.schemeSet1[8]
    );

  return svg.node();
}

function App() {
  const config = useConfig();
  const ref = useRef();

  const sigmaData = useElementData(config.source);

  const date = sigmaData[config["date"]];
  const high = sigmaData[config["high"]];
  const low = sigmaData[config["low"]];
  const open = sigmaData[config["open"]];
  const close = sigmaData[config["close"]];

  const data = React.useMemo(() => {
    const data = [];

    if (date && high && low && open && close) {
      for (let i = 0; i < date.length; i++) {
        let dateTime = new Date(date[i]);
        const offset = dateTime.getTimezoneOffset();
        dateTime = new Date(dateTime.getTime() - offset * 60 * 1000);
        let row = {
          date: dateTime,
          high: high[i],
          low: low[i],
          open: open[i],
          close: close[i],
        };
        data.push(row);
      }
    }
    return data;
  }, [date, high, low, open, close]);

  React.useMemo(() => {
    if (data.length) renderChart(data, ref);
  }, [data]);

  return <svg ref={ref} />;
}

export default App;
