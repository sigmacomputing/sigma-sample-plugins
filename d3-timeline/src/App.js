import "./App.css";
import * as d3 from "d3";
import p from "aggregatejs/percentile";
import {
  useConfig,
  useEditorPanelConfig,
  useElementColumns,
  useElementData,
} from "@sigmacomputing/plugin";
import timeline from "timelines-chart";
import { useEffect, useRef } from "react";
import min from "aggregatejs/min";
import max from "aggregatejs/max";

const SPAN_START = /^(.*)StartTime$/;
const SPAN_END = /^(.*)EndTime$/;

function transform(marks, data, columnInfo, percentile) {
  const aggregatedData = {};
  for (const colId of marks) {
    const numRows = data[colId]?.length;
    if (!numRows) continue;

    const colValues = data[colId].filter((v) => v != null);
    if (!colValues) continue;
    const domain = d3.scaleLinear().domain([0, numRows]).range([min(colValues), max(colValues)]);
    aggregatedData[colId] = p(
      new Array(numRows).fill(0).map((_, index) => domain(index)),
      percentile
    );
  }
  const timeSpans = {};
  let domain = [0, 0];
  for (const colId of marks) {
    const colInfo = columnInfo[colId];
    if (!colInfo) continue;
    const spanStartMatch = SPAN_START.exec(colInfo.name);
    const spanEndMatch = SPAN_END.exec(colInfo.name);
    if (spanStartMatch) {
      if (!(spanStartMatch[1] in timeSpans)) {
        timeSpans[spanStartMatch[1]] = [0, 0];
      }
      timeSpans[spanStartMatch[1]][0] = aggregatedData[colId];
      domain[0] = Math.min(domain[0], aggregatedData[colId]);
    } else if (spanEndMatch) {
      if (!(spanEndMatch[1] in timeSpans)) {
        timeSpans[spanEndMatch[1]] = [0, 0];
      }
      timeSpans[spanEndMatch[1]][1] = aggregatedData[colId];
      domain[1] = Math.max(domain[1], aggregatedData[colId]);
    }
  }
  const out = [
    {
      group: "",
      data: Object.entries(timeSpans).map(([label, timeRange]) => ({
        label,
        data: [
          {
            timeRange,
            val: (timeRange[1] - timeRange[0]) / (domain[1] - domain[0])
          },
        ],
      })),
    },
  ];
  return out;
}

function renderTimeline(datum, ref) {
  if (!ref.current) return;
  d3.select(ref.current).selectAll("*").remove();
  timeline()
    .xTickFormat((x) => +x)
    .timeFormat("%Q")
    .enableAnimations(false)
    .zQualitative(false)
    .zColorScale(d3.scaleLinear().domain([0, 1]).range(['#90c2de', '#08306b']))
    .data(datum)(ref.current);
}

function App() {
  useEditorPanelConfig([
    { name: "source", type: "element" },
    { name: "marks", type: "column", source: "source", allowMultiple: true },
    {
      name: "percentile",
      type: "dropdown",
      source: "source",
      values: [0.25, 0.5, 0.75, 0.95],
    },
  ]);
  const marks = useConfig("marks");
  const source = useConfig("source");
  const percentile = useConfig("percentile");
  const columnInfo = useElementColumns(source);
  const data = useElementData(source);
  const ref = useRef();

  useEffect(() => {
    renderTimeline(transform(marks, data, columnInfo, percentile ?? 0.5), ref);
  }, [columnInfo, data, marks, percentile]);

  return <div ref={ref} />;
}

export default App;
