import {
  client,
  useConfig,
  useElementData,
  useElementColumns,
} from "@sigmacomputing/plugin";
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
  {
    // configuring selection of data source
    name: "source",
    type: "element",
  },
  {
    // configuring selection of data column from the source that contains qualitative values
    // (e.g. names, dates)
    name: "dimension",
    type: "column",
    source: "source",
    allowMultiple: false,
  },
  {
    // configuring selection of data column(s) from the source that contain quantitative, numeric values
    name: "measures",
    type: "column",
    source: "source",
    allowMultiple: true,
  },
]);

// chart layout via Recharts
function RenderBarChart(props) {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={props.data}
        margin={{
          top: 0,
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
        {props.measureNames.slice(0, 3).map(
          // limiting number of bars rendered to max 3
          (m, i) => (
            <Bar
              key={m}
              dataKey={props.measureNames[i]}
              fill={props.barFills[i]}
            />
          )
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

function App() {
  const config = useConfig();

  // Sigma represents their data in a columnar format. Given a data source, useElementData will return 
  // any columns specified in the side panel with their respective data. 
  // The format is { [columnId: string]: any[] } 
  // For more details / examples on the API, refer to the documentation.
  const sigmaData = useElementData(config.source);

  const columnInfo = useElementColumns(config.source);

  // arrays of the ids corresponding to the "dimension" and "measures" data columns from the editor panel
  const { dimension, measures } = config;

  if (dimension && measures && Object.keys(columnInfo).length && columnInfo) {
    var dimensionName = columnInfo[dimension].name;
    var numMeasures = measures.length;
  }

  const measureNames = React.useMemo(() => {
    const measureNames = [];
    if (numMeasures && Object.keys(columnInfo).length) {
      for (let i = 0; i < numMeasures; i++) {
        measureNames.push(columnInfo[measures[i]].name);
      }
    }

    return measureNames;
  }, [columnInfo, measures, numMeasures]);

  // rearranging the data so that Recharts can accept it
  const data = React.useMemo(() => {
    const data = [];

    if (dimension && measures && Object.keys(sigmaData).length && sigmaData) {
      for (let i = 0; i < sigmaData[dimension].length; i++) {
        let row = {};
        row[dimensionName] = sigmaData[dimension][i];
        for (let j = 0; j < numMeasures; j++) {
          row[measureNames[j]] = sigmaData[measures[j]][i];
        }
        data.push(row);
      }
    }
    return data;
  }, [
    dimension,
    measures,
    numMeasures,
    dimensionName,
    sigmaData,
    measureNames,
  ]);

  const barFills = ["#8884d8", "#82ca9d", "#f7a072"];

  return (
    <RenderBarChart
      data={data}
      xAxisDataKey={dimensionName}
      numMeasures={numMeasures}
      measureNames={measureNames}
      barFills={barFills}
    />
  );
}

export default App;
