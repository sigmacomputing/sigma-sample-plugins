import './App.css';
import {client, useConfig, useElementData, useElementColumns} from '@sigmacomputing/plugin';
import Gantt from 'frappe-gantt';
import * as React from 'react';

client.config.configureEditorPanel([
  {name: "source", type: "element"},
  {name: "task name", type: "column", allowMultiple: false, source: "source"},
  {name: "parent task", type: "column", allowMultiple: false, source: "source"},
  {name: "start", type: "column", allowMultiple: false, source: "source", allowedTypes: ["datetime"]},
  {name: "end", type: "column", allowMultiple: false, source: "source", allowedTypes: ["datetime"]},
  {name: "completion rate", type: "column", allowMultiple: false, source: "source", allowedTypes: ["number"] }
])
function App() {
  const config = useConfig();
  const columns = useElementColumns(config.source);
  const sigmaData = useElementData(config.source);
  const ref = React.useRef(null);
  const chart = React.useRef(null);

  const data = React.useMemo(() => {
    const startColumnId = config['start'];
    const endColumnId = config['end'];
    const nameColumnId = config['task name'];
    const completionColumnId = config['completion rate'];
    const parentTask = config['parent task'];
    console.log(startColumnId, endColumnId, nameColumnId, completionColumnId, parentTask)
    const tasks = [];
    if (!sigmaData[nameColumnId]) {
      return;
    }

    for (let i = 0; i < sigmaData[nameColumnId].length; i++) {
      tasks.push({
            start: startColumnId && sigmaData[startColumnId][i] ? new Date(sigmaData[startColumnId][i]) : new Date(),
            end: endColumnId && sigmaData[endColumnId][i] ? new Date(sigmaData[endColumnId][i]) : new Date(),
            name: nameColumnId ? sigmaData[nameColumnId][i]: undefined,
            id:  nameColumnId ? sigmaData[nameColumnId][i]: undefined,
            progress: completionColumnId ? sigmaData[completionColumnId][i] : undefined,
            dependencies: parentTask ? sigmaData[parentTask][i] ?? undefined : undefined,
          });
    }
    return {
      tasks,
      start: new Date(),
      end: new Date(),
    }
  }, [columns, config, sigmaData])

  React.useEffect(() => {
    if (data) {
      chart.current = new Gantt(ref.current, data.tasks, {
        readonly: true,
      });
    }
  }, []);
  React.useEffect(() => {
    if (data) {
      if (chart.current) {
        chart.current.refresh(data.tasks);
      } else {
        chart.current = new Gantt(ref.current, data.tasks, {
          readonly: true,
        });
      }
    }
  }, [data]);
  return (
      <div className='App'>
        <div ref={ref}/>
      </div>
  )
}

export default App;
