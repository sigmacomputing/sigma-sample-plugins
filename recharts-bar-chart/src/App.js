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
    name: "measure1",
    type: "column",
    source: "source",
    allowMultiple: false,
  },
  { name: "measure2", type: "column", source: "source", allowMultiple: false },
]);

function RenderBarChart(props) {
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
        <Bar dataKey={props.bar1DataKey} fill="#8884d8" />
        <Bar dataKey={props.bar2DataKey} fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function App() {
  const config = useConfig();

  const sigmaData = useElementData(config.source);
  const columns = useElementColumns(config.source);

  const dimension = sigmaData[config["dimension"]];
  const measure1 = sigmaData[config["measure1"]];
  const measure2 = sigmaData[config["measure2"]];

  if (dimension && measure1 && measure2) {
    const dimId = config.dimension;
    var dimName = columns[dimId].name;

    const m1Id = config.measure1;
    var m1Name = columns[m1Id].name;

    const m2Id = config.measure2;
    var m2Name = columns[m2Id].name;
    //console.log(columns[m2Id].name);
  }

  const data = React.useMemo(() => {
    const data = [];

    if (dimension && measure1 && measure2) {
      for (let i = 0; i < dimension.length; i++) {
        let row = {};
        row[dimName] = dimension[i];
        row[m1Name] = measure1[i];
        row[m2Name] = measure2[i];

        data.push(row);
      }
    }
    return data;
  }, [dimension, measure1, measure2, dimName, m1Name, m2Name]);

  return (
    <RenderBarChart
      data={data}
      xAxisDataKey={dimName}
      bar1DataKey={m1Name}
      bar2DataKey={m2Name}
    />
  );
}

export default App;
