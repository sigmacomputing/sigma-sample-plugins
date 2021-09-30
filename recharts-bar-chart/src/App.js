import {
  client,
  useConfig,
  useElementData,
  useElementColumns,
} from "@sigmacomputing/plugin";
import "./App.css";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

client.config.configureEditorPanel([
  { name: "source", type: "element" },
  {
    name: "dimension",
    type: "column",
    source: "source",
    allowMultiple: false,
  },
  {
    name: "measures",
    type: "column",
    source: "source",
    allowMultiple: true,
  },
]);

function RenderBarChart(props) {
  console.log(props);
  return (
    <ResponsiveContainer width="200%" height={500}>
      <BarChart
        data={props.data}
        margin={{
          top: 5,
          right: 50,
          left: 30,
          bottom: 90,
        }}
        barCategoryGap={5}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={props.xAxisDataKey}
          angle={-45}
          textAnchor="end"
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
        {props.measureNames.slice(0, 3).map((m, i) => ( // limiting number of bars rendered to max 3
          <Bar
            key={m}
            dataKey={props.measureNames[i]}
            fill={props.barFills[i]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function App() {
  const config = useConfig();

  const sigmaData = useElementData(config.source);
  const columns = useElementColumns(config.source);

  const dimension = sigmaData[config["dimension"]];
  const measures = config.measures;

  if (dimension && measures) {
    const dimId = config.dimension;
    var dimName = columns[dimId].name;

    var numMeasures = config.measures.length;
  }

  const measureIds = React.useMemo(() => {
    const measureIds = [];

    for (let i = 0; i < numMeasures; i++) {
      measureIds.push(config.measures[i]);
    }

    return measureIds;
  }, [config.measures, numMeasures]);

  const measureNames = React.useMemo(() => {
    const measureNames = [];

    for (let i = 0; i < numMeasures; i++) {
      measureNames.push(columns[measureIds[i]].name);
    }

    return measureNames;
  }, [columns, measureIds, numMeasures]);

  const data = React.useMemo(() => {
    const data = [];

    if (dimension && measures) {
      for (let i = 0; i < dimension.length; i++) {
        let row = {};
        row[dimName] = dimension[i];
        for (let j = 0; j < numMeasures; j++) {
          row[measureNames[j]] = sigmaData[measureIds[j]][i];
        }
        data.push(row);
      }
    }
    return data;
  }, [
    dimension,
    measures,
    numMeasures,
    dimName,
    sigmaData,
    measureIds,
    measureNames,
  ]);

  const barFills = ["#8884d8", "#82ca9d", "#f7a072"];

  return (
    <RenderBarChart
      data={data}
      xAxisDataKey={dimName}
      numMeasures={numMeasures}
      measureNames={measureNames}
      barFills={barFills}
    />
  );
}

export default App;
