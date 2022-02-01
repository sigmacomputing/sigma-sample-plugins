import "./App.css";
import * as d3 from "d3";
import { client, useConfig, useElementData } from "@sigmacomputing/plugin";
import { useCallback, useMemo, useState } from "react";
import { useEffect } from "react/cjs/react.development";

client.config.configureEditorPanel([
  { name: "source", type: "element" },
  { name: "date", type: "column", source: "source", allowMultiple: false },
  { name: "category", type: "column", source: "source", allowMultiple: false },
  { name: "value", type: "column", source: "source", allowMultiple: false },
  { name: "rank", type: "text", source: "source", placeholder: "rank" },
]);

function convertData(data, dateData, category, measure) {
  const convertedData = [];
  for (let i = 0; i < dateData.length; i++) {
    let item = {
      date: dateData[i],
      name: category[i],
      value: measure[i],
    };
    convertedData.push(item);
  }
  return convertedData;
}

function App() {
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const [ref, setRef] = useState();
  const dateData = sigmaData[config.date] ?? [];
  const category = sigmaData[config.category] ?? [];
  const measure = sigmaData[config.value] ?? [];

  // data preprocesing
  const data = convertData(sigmaData, dateData, category, measure);
  const names = new Set(data.map((d) => d.name));

  const n = Math.min(names.size, config.rank);
  const margin = { top: 30, right: 30, bottom: 10, left: 0 };
  const barSize = 30;
  const height = margin.top + barSize * n + margin.bottom;
  const width = 1200;
  const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
  const y = d3
    .scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1);
  const duration = 1000;

  const datevalues = Array.from(
    d3.rollup(
      data,
      ([d]) => d.value,
      (d) => +d.date,
      (d) => d.name
    )
  )
    .map(([date, data]) => [new Date(date), data])
    .sort(([a], [b]) => d3.ascending(a, b));

  const rank = useCallback(
    (value) => {
      const data = Array.from(names, (name) => ({ name, value: value(name) }));
      data.sort((a, b) => d3.descending(a.value, b.value));
      for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
      return data;
    },
    [names, n]
  );

  const keyframes = useMemo(
    function createkeyframes() {
      const keyframes = [];
      let ka, a;
      for ([ka, a] of datevalues) {
        keyframes.push([ka, rank((name) => a.get(name) || 0)]);
      }
      return keyframes;
    },
    [datevalues, rank]
  );

  const nameframes = d3.groups(
    keyframes.flatMap(([, data]) => data),
    (d) => d.name
  );
  const prev = new Map(
    nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
  );
  const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));

  // color each bar
  const arr_names = Array.from(names);
  const colors = d3.scaleOrdinal().domain(arr_names).range(d3.schemeTableau10);

  // draw bar
  const bars = useCallback((svg) => {
    let bar = svg.append("g").attr("fill-opacity", 0.6).selectAll("rect");

    return ([date, data], transition) =>
      (bar = bar
        .data(data.slice(0, n), (d) => d.name)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("fill", (d) => colors(d.name))
              .attr("height", y.bandwidth())
              .attr("x", x(0))
              .attr("y", (d) => y((prev.get(d) || d).rank))
              .attr("width", (d) => x((prev.get(d) || d).value) - x(0)),
          (update) => update,
          (exit) =>
            exit
              .transition(transition)
              .remove()
              .attr("y", (d) => y((next.get(d) || d).rank))
              .attr("width", (d) => x((next.get(d) || d).value) - x(0))
        )
        .call((bar) =>
          bar
            .transition(transition)
            .attr("y", (d) => y(d.rank))
            .attr("width", (d) => x(d.value) - x(0))
        ));
  });

  // add labels for each bar
  const labels = useCallback((svg) => {
    let label = svg
      .append("g")
      .style("font", "bold 10px sans-serif")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .selectAll("text");

    return ([date, data], transition) =>
      (label = label
        .data(data.slice(0, n), (d) => d.name)
        .join(
          (enter) =>
            enter
              .append("text")
              .attr(
                "transform",
                (d) =>
                  `translate(${x((prev.get(d) || d).value)},${y(
                    (prev.get(d) || d).rank
                  )})`
              )
              .attr("y", y.bandwidth() / 2)
              .attr("x", -6)
              .attr("dy", "-0.25em")
              .text((d) => d.name)
              .call((text) =>
                text
                  .append("tspan")
                  .attr("fill-opacity", 0.6)
                  .attr("font-weight", "normal")
                  .attr("x", -6)
                  .attr("dy", "1.15em")
              ),
          (update) => update,
          (exit) =>
            exit
              .transition(transition)
              .remove()
              .attr(
                "transform",
                (d) =>
                  `translate(${x((next.get(d) || d).value)},${y(
                    (next.get(d) || d).rank
                  )})`
              )
              .call((g) =>
                g
                  .select("tspan")
                  .tween("text", (d) =>
                    textTween(d.value, (next.get(d) || d).value)
                  )
              )
        )
        .call((bar) =>
          bar
            .transition(transition)
            .attr("transform", (d) => `translate(${x(d.value)},${y(d.rank)})`)
            .call((g) =>
              g
                .select("tspan")
                .tween("text", (d) =>
                  textTween((prev.get(d) || d).value, d.value)
                )
            )
        ));
  });

  const formatNumber = d3.format(",d");

  function textTween(a, b) {
    const i = d3.interpolateNumber(a, b);
    return function (t) {
      this.textContent = formatNumber(i(t));
    };
  }

  // draw axis
  const axis = useCallback((svg) => {
    const g = svg.append("g").attr("transform", `translate(0,${margin.top})`);
    const axis = d3
      .axisTop(x)
      .ticks(width / 150)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

    return (_, transition) => {
      g.transition(transition).call(axis);
      g.select(".tick:first-of-type text").remove();
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
      g.select(".domain").remove();
    };
  });

  // draw date ticker
  const formatDate = d3.timeFormat("%Y");
  const ticker = useCallback((svg) => {
    if (keyframes.length) {
      const now = svg
        .append("text")
        .style("font", `bold ${barSize}px sans-serif`)
        .style("font-variant-numeric", "tabular-nums")
        .attr("text-anchor", "end")
        .attr("x", width - 30)
        .attr("y", margin.top + barSize * (n - 0.45))
        .attr("dy", "0.32em")
        .text(formatDate(keyframes[0][0]));

      return ([date], transition) => {
        transition.end().then(() => now.text(formatDate(date)));
      };
    }
  });

  // create chart
  const iter = useMemo(
    function* () {
      const svg = d3.select(ref).attr("viewBox", [0, 0, width, height]);
      svg.selectAll("*").remove();

      const updateBars = bars(svg);
      const updateAxis = axis(svg);
      const updateLabels = labels(svg);
      const updateTicker = ticker(svg);

      for (const keyframe of keyframes) {
        const transition = svg
          .transition()
          .duration(duration)
          .ease(d3.easeLinear);
        // Extract the top bar’s value.
        x.domain([0, keyframe[1][0].value]);

        updateAxis(keyframe, transition);
        updateBars(keyframe, transition);
        updateLabels(keyframe, transition);
        updateTicker(keyframe, transition);
        yield transition.end();
      }
    },
    [axis, bars, height, keyframes, labels, ref, ticker, x]
  );

  useEffect(() => {
    const interval = setInterval(() => iter.next(), duration);
    return () => clearInterval(interval);
  }, [iter]);

  // console.log("hello");
  return <svg ref={setRef} />;
}

export default App;
