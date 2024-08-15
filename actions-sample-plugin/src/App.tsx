import { useMemo, useState } from 'react';
import './App.css';
import {
  useConfig,
  useEditorPanelConfig,
  useElementColumns,
  useElementData,
  useActionTrigger,
  useActionEffect,
} from '@sigmacomputing/plugin';

function App() {
  useEditorPanelConfig([
    { type: 'element', name: 'source' },
    {
      type: 'column',
      name: 'measure',
      source: 'source',
      allowMultiple: false,
      allowedTypes: ['number', 'integer'],
    },
    {
      type: 'action-trigger',
      name: 'exampleTrigger',
      label: 'Button 1 (main button)',
    },
    { type: 'action-trigger', name: 'exampleTrigger2', label: 'Button 2' },
    { type: 'action-effect', name: 'exampleEffect' },
    { type: 'action-effect', name: 'exampleEffect2' },
  ]);

  const config = useConfig();
  const data = useElementData(config.source);
  const info = useElementColumns(config.source);
  const columnData = data[config.measure];
  const columnInfo = info[config.measure];

  const exampleTrigger = useActionTrigger(config.exampleTrigger);
  const exampleTrigger2 = useActionTrigger(config.exampleTrigger2);

  useActionEffect(config.exampleEffect, triggerEffect);
  useActionEffect(config.exampleEffect2, triggerEffect2);

  function triggerEffect() {
    setEffectMessage('1st effect triggered!');
  }
  function triggerEffect2() {
    setEffectMessage('2nd effect triggered!');
  }
  const [effectMessage, setEffectMessage] = useState('');

  const sumOfColumn = useMemo(
    () => columnData?.reduce((a, b) => a + b, 0),
    [columnData]
  );

  return (
    <div>
      <header>
        <p>
          Hi, the sum of [{columnInfo?.name}] is {sumOfColumn}
        </p>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={exampleTrigger}>Button 1</button>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={exampleTrigger2}>Button 2</button>
        </div>
        <p>{effectMessage}</p>
      </header>
    </div>
  );
}

export default App;
