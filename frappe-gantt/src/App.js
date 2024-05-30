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

function validateData(columnId, sigmaData, i, defaultValue) {
  if(columnId && sigmaData[columnId] && sigmaData[columnId][i]) {
    return sigmaData[columnId][i];
  }
  return defaultValue;
}

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
    const tasks = [];
    if (!sigmaData[nameColumnId]) {
      return;
    }

    for (let i = 0; i < sigmaData[nameColumnId].length; i++) {
      tasks.push({
            start: new Date(validateData(startColumnId, sigmaData, i, new Date())),
            end: new Date(validateData(endColumnId, sigmaData, i, new Date())),
            name: validateData(nameColumnId, sigmaData, i, undefined),
            id:  validateData(nameColumnId, sigmaData, i, undefined),
            progress: validateData(completionColumnId, sigmaData, i, undefined),
            dependencies: validateData(parentTask, sigmaData, i, undefined),
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
