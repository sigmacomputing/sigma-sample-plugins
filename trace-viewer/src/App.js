import "./App.css";
import "./WaterfallChart/scss/main.scss";
import 'pretty-print-json/css/pretty-print-json.dark-mode.min.css';
import {
  useConfig,
  useEditorPanelConfig,
  useElementColumns,
  useElementData,
} from "@sigmacomputing/plugin";
import WaterfallChart from './WaterfallChart';

const palette = [
    // green
    "#20c933", "#11af22", "#338a17", "#d1f7c4",
    // yellow
    "#fcb400", "#e08d00", "#b87503", "#ffeab6",
    // orange
    "#ff6f2c", "#f7653b", "#d74d26", "#fee2d5",
    // red
    "#f82b60", "#ef3061", "#ba1e45", "#ffdce5",
    // pink
    "#ff08c2", "#e929ba", "#b2158B", "#f99de2",
    // purple
    "#8b46ff", "#7c39ed", "#6b1cb0", "#ede2fe",
    // blue
    "#2d7ff9", "#1283da", "#2750ae", "#cfdfff",
    // cyan
    "#18bfff", "#01a9db", "#0b76b7", "#d0f0fd",
    // teal
    "#20d9d2", "#02aaa4", "#06a09b", "#c2f5e9", 
];

function App() {
  useEditorPanelConfig([
    { name: "source", type: "element" },
    { name: "Trace ID", type: "column", source: "source", allowMultiple: false },
    { name: "start", type: "column", source: "source", allowMultiple: false },
    { name: "duration", type: "column", source: "source", allowMultiple: false },
    { name: "Span ID", type: "column", source: "source", allowMultiple: false },
    { name: "Parent Span ID", type: "column", source: "source", allowMultiple: false },
    { name: "Service Name", type: "column", source: "source", allowMultiple: false },
    { name: "Span Name", type: "column", source: "source", allowMultiple: false },
    { name: "Tags", type: "column", source: "source", allowMultiple: false },
  ]);
  const config = useConfig();
  const columnInfo = useElementColumns(config.source);
  const data = useElementData(config.source);

  const trace_id_column = config["Trace ID"];
  const span_id_column = config["Span ID"];
  const parent_span_id_column = config["Parent Span ID"];
  const duration_column = config["duration"];
  const service_name_column = config["Service Name"];
  const start_time_column = config["start"];
  const span_name_column = config["Span Name"];
  const tags_name_column = config["Tags"];
  if (!trace_id_column || !span_id_column || !parent_span_id_column || data.length === 0) {
    return <div>Loading</div>;
  }
  if (! (trace_id_column in data)) {
    return <div>Loading</div>;
  }
  const traceID = data[trace_id_column][0];

  const traces = [];

  const trace_ids = data[trace_id_column];
  const span_ids = data[span_id_column];
  const parent_span_ids = data[parent_span_id_column];
  const durations = data[duration_column];
  const start_times = data[start_time_column];
  const service_names = data[service_name_column];
  const span_names = data[span_name_column];
  let tags = null;
  if (tags_name_column) {
      tags = data[tags_name_column];
  }

  let allLabels = new Set();
  for (let i = 0; i < data[trace_id_column].length; i++) {
    if (data[trace_id_column][i] !== traceID) {
        continue;
    }
    const label = span_names[i];
    allLabels.add(label);
  }

  allLabels = Array.from(allLabels);
  allLabels.sort()

  let nameToColor = {};
  let i = 0;
  for (let label of allLabels) {
      nameToColor[label] = palette[i % palette.length];
      i++;
  }

  for (let i = 0; i < data[trace_id_column].length; i++) {
    if (data[trace_id_column][i] !== traceID) {
        continue;
    }
    let x = {
        traceId: trace_ids[i],
        parentId: parent_span_ids[i],
        id: span_ids[i],
        name: span_names[i],
        timestamp: start_times[i] * 1000,
        // The WaterfallChart library does not handle a duration of 0
        // correctly. I looked for 30 minutes and could not figure out why
        // setting a 0 value here ends up as undefined inside the library.
        duration: (durations[i] * 1000) || 1,
        serviceName: service_names[i],
        tags: {},
    };
    if (tags) {
        try {
            const y = JSON.parse(tags[i]);
            x.tags = y || {};
        } catch(err) {
            console.error(err);
        }
    }

    x.color = nameToColor[x.name]

    traces.push(x);
  }

  return (<div>
      <WaterfallChart
          traceId={traceID}
          traceSummary={traces}
        />
    </div>
  );
}

export default App;
