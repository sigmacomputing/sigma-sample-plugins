import * as d3 from "d3";
import "./App.css";
import {
	client,
	useConfig,
	useElementColumns,
	useElementData,
} from "@sigmacomputing/plugin";
import { useMemo, useRef } from "react";
import { sum } from "lodash";
import { format, fromUnixTime } from "date-fns";
import Radar from 'react-d3-radar';

client.config.configureEditorPanel([
	{ 
		name: "source", 
		type: "element" 
	},
	{ 
		name: "categories", 
		type: "column", 
		source: "source", 
		allowMultiple: false, 
		allowedTypes: ['text'] 
	},
	{ 
		name: "spokes", 
		type: "column", 
		source: "source", 
		allowMultiple: true, 
		allowedTypes: ['number', 'integer'] 
	},
	{ 
		name: "source2", 
		type: "element" 
	},
	{
		name: 'column input 1',
		type: 'column',
		source: "source2",
		allowMultiple: true
	},
	{ 
		name: 'group input 2', 
		type: 'group' 
	},
	{
		name: 'text input 3',
		source: 'group input 2',
		type: 'text'
	},
	{
		name: 'text input 4',
		source: 'group input 2',
		type: 'text'
	},
	{
		name: 'secure input 5',
		type: 'text',
		secure: true
	},
	{
		name: 'checkbox input 6',
		type: 'checkbox'
	},
	{
		name: 'toggle input 7',
		type: 'toggle'
	},
]);

function formatColName(value, colInfo) {
	if (colInfo?.format) {
		return format(fromUnixTime(value / 1000), 'yyyy-MM')
	} else {
		return value;
	}
}

function chunk(data, colInfo, dimension, measures) {
	if (dimension.length) {
		const buckets = {};
		const dimColId = dimension[0];
		const dimCol = data[dimColId] ?? [];
		const columns = Object.keys(data);
		for (let i = 0; i < dimCol.length; i++) {
			buckets[dimCol[i]] = buckets[dimCol[i]] ?? columns.reduce((acc, col) => ({ ...acc, [col]: [] }), {});
			columns.forEach(k => {
				buckets[dimCol[i]][k].push(data[k][i]);
			})
		}
		return Object.entries(buckets).map(([bucketName, bucketData]) => ({
			name: formatColName(bucketName, colInfo[dimColId]),
			children: chunk(bucketData, colInfo, dimension.slice(1), measures)
		}))
	} else {
		return measures.map(m => ({
			name: colInfo[m]?.name,
			value: sum(data[m])
		}))
	}
}

function App() {
	const config = useConfig();
	const columns = useElementColumns(config.source); // all cols
	const sigmaData = useElementData(config.source);
	console.log(sigmaData);
	const data = useMemo(() => {
		const categories = config.categories ?? [];
		const spokes = config.spokes ?? [];

		return {
			name: "data",
			children: chunk(sigmaData, columns, categories, spokes),
		};
	}, [columns, config.categories, config.spokes, sigmaData]);

	const variableList = [];
	// { key: 'resilience', label: 'Resilience' },

	const setList = [];
	/*
	{
		key: 'me',
		label: 'My Scores',
		values: {
			resilience: 4,
			strength: 6,
			adaptability: 7,
			creativity: 2,
			openness: 8,
			confidence: 1,
		},
	},
	*/
	const realData = null;
	// const realData = {
	// 	variables: variableList,
	// 	sets: setList,
	// };

	const backupData = {
		variables: [
			{ key: 'resilience', label: 'Resilience' },
			{ key: 'strength', label: 'Strength' },
			{ key: 'adaptability', label: 'Adaptability' },
			{ key: 'creativity', label: 'Creativity' },
			{ key: 'openness', label: 'Open to Change' },
			{ key: 'confidence', label: 'Confidence' },
		],
		sets: [
			{
				key: 'me',
				label: 'My Scores',
				values: {
					resilience: 4,
					strength: 6,
					adaptability: 7,
					creativity: 2,
					openness: 8,
					confidence: 1,
				},
			},
			{
				key: 'everyone',
				label: 'Everyone',
				values: {
					resilience: 10,
					strength: 8,
					adaptability: 6,
					creativity: 4,
					openness: 2,
					confidence: 3,
				},
			},
		],
	};

	const axisMax = 10;
	return <Radar
		width={500}
		height={500}
		padding={70}
		domainMax={axisMax}
		highlighted={null}
		onHover={(point) => {
			if (point) {
				console.log('hello my name is fred');
			} else {
				console.log('lol butts');
			}
		}}
		data={realData || backupData}
	/>
}

export default App;
