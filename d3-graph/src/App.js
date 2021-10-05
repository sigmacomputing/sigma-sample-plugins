import logo from './logo.svg';
import './App.css';
import * as d3 from 'd3';
import {client, useConfig, useElementData} from '@sigmacomputing/plugin';
import { useEffect, useRef } from 'react';

client.config.configureEditorPanel([
  { name: "vertices", type: "element" },
  { name: "id", type: "column", source: "vertices" },
  { name: "edges", type: "element" },
  { name: "to", type: "column", source: "edges" },
  { name: "from", type: "column", source: "edges" },
  { name: "value", type: "column", source: "edges" },
])

const width = 600;
const height = 600;
function renderGraph(data, ref) {
  if (!ref.current) return null;
  d3.selectAll('svg > *').remove();
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  const svg = d3.select(ref.current)
      .attr("width", "100vw")
      .attr("height", "100vh")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", [0, 0, width, height]);

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 5)
      .attr("fill", color)
      .call(drag(simulation));

  node.append("title")
      .text(d => d.id);
  node.append("text").text(d => d.id);

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

  return simulation.stop;
}

const color = () => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}

const drag = simulation => {
  
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

function transform(config, vertices, edges) {
  const {id, to, from, value} = config;
  console.log(arguments);
  if (!id || !to || !from || !value || !vertices?.[id]?.length || !edges?.[to]?.length) return { nodes: [], links: [] };
  const transformed = {
    nodes: vertices[id].map((id) => ({ id, group: 1 })),
    links: edges[to].map((target, idx) => ({
      source: edges[from][idx],
      target: edges[to][idx],
      value: edges[value][idx],
    }))
  };
  console.log(transformed);
  return transformed;
}

function App() {
  const config = useConfig();
  const vertices = useElementData(config.vertices);
  const edges = useElementData(config.edges);
  const ref = useRef();

  useEffect(() => renderGraph(transform(config, vertices, edges), ref), [config, edges, vertices])

  return (
    <svg ref={ref} />
  );
}

export default App;
