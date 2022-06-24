import logo from './logo.svg';
import './App.css';
import { useConfig, useEditorPanelConfig, useElementColumns, useElementData } from '@sigmacomputing/plugin';
import { useMemo } from 'react';

function App() {
  useEditorPanelConfig([
    { type: 'element', name: 'source' },
    { type: 'column', name: 'measure', allowMultiple: false, allowedTypes: ['number', 'integer'] },
  ]);

  const config = useConfig()
  const data = useElementData(config.source);
  const info = useElementColumns(data.source);
  const columnData = data[config.measure];
  const columnInfo = info[config.measure];

  const sumOfColumn = useMemo(() => columnData?.reduce((a, b) => a + b, 0), [columnData]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hi, the sum of {columnInfo?.name} is {sumOfColumn}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
