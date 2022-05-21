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

const SPAN_START = /^(.*)StartTime$/;
const SPAN_END = /^(.*)EndTime$/;

function transform(marks, data, columnInfo, percentile) {
  const aggregatedData = {};
  for (const colId of marks) {
    const colValues = data[colId];
    if (!colValues) continue;
    aggregatedData[colId] = p(
      colValues.filter((v) => v == null ? 0 : v),
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
            val: timeRange[1] - timeRange[0]
          },
        ],
      })),
    },
  ];
  return [out, domain];
}

function renderTimeline(datum, ref, domain) {
  if (!ref.current) return;
  d3.select(ref.current).selectAll("*").remove();
  timeline()
    .xTickFormat((x) => +x)
    .timeFormat("%Q")
    .enableAnimations(false)
    .zQualitative(false)
    .zColorScale(d3.scaleLinear().domain(domain).range(['#90c2de', '#08306b']))
    .zScaleLabel('ms')
    .enableOverview(false)
    .segmentTooltipContent(d => `<b>${d.label}</b>: ${d.timeRange[1] - d.timeRange[0]}ms (${(d.val / domain[1] * 100).toFixed(2)}%)`)
    .maxLineHeight(24)
    .rightMargin(150)
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
    const [transformedData, domain] = transform(marks, data, columnInfo, percentile ?? 0.5);
    renderTimeline(transformedData, ref, domain);
  }, [columnInfo, data, marks, percentile]);

  return <div ref={ref} />;
}

export default App;
