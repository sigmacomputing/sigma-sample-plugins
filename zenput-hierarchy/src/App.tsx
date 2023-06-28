import "./App.css";
import {
  useConfig,
  useEditorPanelConfig,
  useElementData,
  useVariable,
} from "@sigmacomputing/plugin";
import { useMemo } from "react";
import DropdownTreeSelect from "react-dropdown-tree-select";
import "react-dropdown-tree-select/dist/styles.css";

interface Node_t {
  value: string;
  label: string;
  children: Node_t[];
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

  const treeData = useMemo(() => {
    if (
      !sigmaData[config.x]?.length ||
      !sigmaData[config.label]?.length ||
      !sigmaData[config.depth]?.length
    ) {
      return [];
    }
    const rootNode: Node_t = {
      value: sigmaData[config.x][0],
      label: sigmaData[config.label][0],
      children: [],
      isDefaultValue: filterValue?.defaultValue.value.includes(sigmaData[config.label][0]),
    };
    const data = [rootNode];
    const stack = [rootNode];

    // assuming that x is always sorted by ascending order
    for (let i = 1; i < sigmaData[config.label].length; i++) {
      const node = {
        value: sigmaData[config.x][i],
        label: sigmaData[config.label][i],
        children: [],
        isDefaultValue: filterValue?.defaultValue.value.includes(sigmaData[config.label][i]),
      };
      const currentDepth = sigmaData[config.depth][i];
      stack[currentDepth] = node;
      stack[currentDepth - 1].children.push(node);
    }
    return data;
  }, [config.depth, config.label, config.x, filterValue?.defaultValue.value, sigmaData]);

  return (
    <DropdownTreeSelect
      data={treeData}
      mode="hierarchical"
      keepOpenOnSelect
      onChange={(_, selectedNodes) => {
        console.log(selectedNodes);
        if (selectedNodes.length) {
          setFilter(selectedNodes.map((node) => node.label).join(","))
        } else {
          setFilter(null);
        }
      }
      }
    />
  );
}

export default App;
