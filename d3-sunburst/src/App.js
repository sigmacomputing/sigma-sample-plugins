import * as d3 from "d3";
import "./App.css";
import {
  client,
  useConfig,
  useElementColumns,
  useElementData,
} from "@sigmacomputing/plugin";
import { useMemo, useRef } from "react";
import { groupBy, sum, uniq } from "lodash";
import { format, fromUnixTime } from "date-fns";

client.config.configureInspector([
  { name: "source", type: "element" },
  { name: "dimension", type: "column", source: "source", allowMultiple: true },
  { name: "measures", type: "column", source: "source", allowMultiple: true },
]);

const partition = (data) => {
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);
  return d3.partition().size([2 * Math.PI, root.height + 1])(root);
};
function getChart(data, ref) {
  const format = d3.format(",d");
  const width = 932;
  const radius = width / 6;
  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius((d) => d.y0 * radius)
    .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));
  const color = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, data.children.length + 1)
  );
  const root = partition(data);

  root.each((d) => (d.current = d));

  d3.selectAll('svg > *').remove();
  const svg = d3
    .select(ref.current)
    .attr("viewBox", [0, 0, width, width])
    .style("font", "10px sans-serif");

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);

  const path = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .attr("fill-opacity", (d) =>
      arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
    )
    .attr("d", (d) => arc(d.current));

  path
    .filter((d) => d.children)
    .style("cursor", "pointer")
    .on("click", clicked);

  path.append("title").text(
    (d) =>
      `${d
        .ancestors()
        .map((d) => d.data.name)
        .reverse()
        .join("/")}\n${format(d.value)}`
  );

  const label = g
    .append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    .attr("dy", "0.35em")
    .attr("fill-opacity", (d) => +labelVisible(d.current))
    .attr("transform", (d) => labelTransform(d.current))
    .text((d) => d.data.name);

  const parent = g
    .append("circle")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

  function clicked(event, p) {
    parent.datum(p.parent || root);

    root.each(
      (d) =>
        (d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        })
    );

    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path
      .transition(t)
      .tween("data", (d) => {
        const i = d3.interpolate(d.current, d.target);
        return (t) => (d.current = i(t));
      })
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attrTween("d", (d) => () => arc(d.current));

    label
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      })
      .transition(t)
      .attr("fill-opacity", (d) => +labelVisible(d.target))
      .attrTween("transform", (d) => () => labelTransform(d.current));
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  return svg.node();
}

function formatColName(value, colInfo) {
  if (colInfo?.format) {
    return format(fromUnixTime(value / 1000), 'yyyy-MM')
  } else {
    return value;
  }
}

function chunk(data, colInfo, dimension, measures) {
  if (dimension.length) {
    const buckets = {};
    const dimColId = dimension[0];
    const dimCol = data[dimColId] ?? [];
    const columns = Object.keys(data);
    for (let i = 0; i < dimCol.length; i++) {
      buckets[dimCol[i]] = buckets[dimCol[i]] ?? columns.reduce((acc, col) => ({...acc, [col]: []}), {});
      columns.forEach(k => {
        buckets[dimCol[i]][k].push(data[k][i]);
      })
    }
    return Object.entries(buckets).map(([bucketName, bucketData]) => ({
      name: formatColName(bucketName, colInfo[dimColId]),
      children: chunk(bucketData, colInfo, dimension.slice(1), measures)
    }))
  } else {
    return measures.map(m => ({
      name: colInfo[m]?.name,
      value: sum(data[m])
    }))
  }
}

function App() {
  const config = useConfig();
  const columns = useElementColumns(config.source);
  const sigmaData = useElementData(config.source);
  const ref = useRef();
  const data = useMemo(() => {
    const dimension = config.dimension ?? [];
    const measures = config.measures ?? [];

    return {
      name: "data",
      children: chunk(sigmaData, columns, dimension, measures),
    };
  }, [columns, config.dimension, config.measures, sigmaData]);
  useMemo(() => getChart(data, ref), [data]);
  return (
    <div className="App">
      <svg ref={ref} />
    </div>
  );
}

export default App;
