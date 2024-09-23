import React, { useMemo } from 'react';
import { render } from 'react-dom';
import CandlestickChart from './CandlestickChart';
import {
	client,
	useConfig,
	useElementColumns,
	useElementData,
} from "@sigmacomputing/plugin";

client.config.configureEditorPanel([
	{ name: "source", type: "element" },
	{ name: "Date", type: "column", source: "source", allowMultiple: false, allowedTypes: ['datetime'] },
	{ name: "High", type: "column", source: "source", allowMultiple: false, allowedTypes: ['number', 'integer'] },
	{ name: "Low", type: "column", source: "source", allowMultiple: false, allowedTypes: ['number', 'integer'] },
	{ name: "Open", type: "column", source: "source", allowMultiple: false, allowedTypes: ['number', 'integer'] },
	{ name: "Close", type: "column", source: "source", allowMultiple: false, allowedTypes: ['number', 'integer'] },
]);

const ChartComponent = () => {

  const config = useConfig();
  const sigmaCols = useElementColumns(config.source);
  const sigmaData = useElementData(config.source);

  // mapping function for returning the data in the correct format below
  const data = useMemo(() => {
	const result = [];
	if (Object.keys(sigmaData).length) {
		const entries = Object.entries(sigmaData);
		for (let i = 0; i < entries[0][1].length; i++) {
			const row = {};
			for (const [columnId, values] of entries) {
				if (sigmaCols[columnId] && sigmaCols[columnId].name) {
					const columnName = sigmaCols[columnId].name.toLowerCase();
					let value = values[i];
					if (columnName === 'date') {
						value = new Date(values[i]);
					}
					row[columnName] = value;
				}
			}
			result.push(row);
		}
	}
	result.sort((a,b) => (a.date > b.date) ? 1 : -1)
	return result;
  }, [sigmaCols, sigmaData])

  // handling for async loading call below
  if(!data || !data.length) {
    return (<div>Loading...</div>)
  }

  return (
	<CandlestickChart 
		type={"svg"}
		data={data} 
	/>
  )
}

render(
	<ChartComponent />,
	document.getElementById("root")
);
