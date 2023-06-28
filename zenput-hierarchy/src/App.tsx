import {
  useConfig,
  useEditorPanelConfig,
  useElementData,
  useVariable,
} from "@sigmacomputing/plugin";
import { useMemo, useState } from "react";
import CheckboxTree from "react-checkbox-tree";

interface Node_t {
  value: string;
  label: string;
  children?: Node_t[];
}

function App() {
  useEditorPanelConfig([
    { type: "element", name: "source" },
    { type: "column", name: "label", source: "source", allowMultiple: false },
    { type: "column", name: "depth", source: "source", allowMultiple: false },
    { type: "column", name: "x", source: "source", allowMultiple: false },
    { type: "variable", name: "filterControl" },
  ]);

  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const [filterValue, setFilter] = useVariable(config.filterControl);
  // @ts-expect-error lib definitions need updates
  const [expanded, setExpanded] = useState(filterValue?.defaultValue.value);

  const treeData = useMemo(() => {
    if (
      !sigmaData[config.x]?.length ||
      !sigmaData[config.label]?.length ||
      !sigmaData[config.depth]?.length
    ) {
      return [];
    }
    const rootNode: Node_t = {
      value: sigmaData[config.label][0],
      label: sigmaData[config.label][0],
    };
    const data = [rootNode];
    const stack = [rootNode];

    // assuming that x is always sorted by ascending order
    for (let i = 1; i < sigmaData[config.label].length; i++) {
      const node = {
        value: sigmaData[config.label][i],
        label: sigmaData[config.label][i],
      };
      const currentDepth = sigmaData[config.depth][i];
      stack[currentDepth] = node;
      if (!stack[currentDepth - 1].children) {
        stack[currentDepth - 1].children = [];
      }
      stack[currentDepth - 1].children.push(node);
    }
    return data;
  }, [config.depth, config.label, config.x, sigmaData]);

  return (
    <CheckboxTree
      nodes={treeData}
      // @ts-expect-error lib definitions need updates
      checked={filterValue?.defaultValue.value}
      expanded={expanded}
      expandOnClick
      noCascade
      onExpand={nodes => setExpanded(nodes)}
      onCheck={(selectedNodes) => {
        console.log(selectedNodes);
        if (selectedNodes.length) {
          setFilter(selectedNodes.join(","))
        } else {
          setFilter(null);
        }
      }}
      iconsClass="fa4"
    />
  );
}

export default App;
