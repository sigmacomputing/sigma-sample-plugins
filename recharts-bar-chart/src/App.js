import { client, useConfig, useElementData } from "@sigmacomputing/plugin";
import "./App.css";
import React from "react";
import {
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
    name: "measure 1",
    type: "column",
    source: "source",
    allowMultiple: false,
  },
  { name: "measure 2", type: "column", source: "source", allowMultiple: false },
]);

function RenderBarChart(props) {
  return (
    <BarChart
      width={1800}
      height={600}
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
      <XAxis dataKey="State" angle={-45} textAnchor="end" interval={0} />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
      <Bar dataKey="Total Pop in 2000" fill="#8884d8" />
      <Bar dataKey="Total Pop in 2010" fill="#82ca9d" />
    </BarChart>
  );
}

function App() {
  const config = useConfig();

  const sigmaData = useElementData(config.source);

  const dimension = sigmaData[config["dimension"]];
  const measure1 = sigmaData[config["measure 1"]];
  const measure2 = sigmaData[config["measure 2"]];
  console.log(measure1);
  console.log(measure2);

  const data = React.useMemo(() => {
    const data = [];

    if (dimension) {
      for (let i = 0; i < dimension.length; i++) {
        let row = {
          State: dimension[i],
          "Total Pop in 2000": measure1[i],
          "Total Pop in 2010": measure2[i],
        };
        data.push(row);
      }
    }
    return data;
  }, [dimension, measure1, measure2]);

  return <RenderBarChart data={data} />;
}

export default App;
