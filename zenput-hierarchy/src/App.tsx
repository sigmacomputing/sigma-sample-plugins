import './App.css'
import { useConfig, useEditorPanelConfig, useElementData, useVariable } from '@sigmacomputing/plugin'
import { useMemo } from 'react';
import TreeMenu from 'react-simple-tree-menu'

interface Node_t {
  key: string;
  label: string;
  nodes: Node_t[];
}

function App() {
  useEditorPanelConfig([
    { type: 'element', name: 'source' },
    { type: 'column', name: 'label', source: 'source', allowMultiple: false },
    { type: 'column', name: 'depth', source: 'source', allowMultiple: false },
    { type: 'column', name: 'x', source: 'source', allowMultiple: false },
    { type: 'variable', name: 'filterControl' },
  ]);

  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const [, setFilter] = useVariable(config.filterControl);

  const treeData = useMemo(() => {
    if (!sigmaData[config.x]?.length || !sigmaData[config.label]?.length || !sigmaData[config.depth]?.length) {
      return [];
    }
    const rootNode: Node_t = { key: sigmaData[config.x][0], label: sigmaData[config.label][0], nodes: [] };
    const data = [rootNode];
    const stack = [rootNode];

    // assuming that x is always sorted by ascending order
    for (let i = 1; i < sigmaData[config.label].length; i++) {
      const node = { key: sigmaData[config.x][i], label: sigmaData[config.label][i], nodes: [] };
      const currentDepth = sigmaData[config.depth][i];
      stack[currentDepth] = node;
      stack[currentDepth - 1].nodes.push(node);
    }
    return data;
  }, [config.depth, config.label, config.x, sigmaData]);

  return (<><TreeMenu data={treeData} onClickItem={item => setFilter(item.label)} /></>)
}

export default App
