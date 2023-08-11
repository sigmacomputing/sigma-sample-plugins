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
import Radar from 'react-d3-radar';

client.config.configureEditorPanel([
	{ 
		name: "source", 
		type: "element" 
	},
	{ 
		name: "sets", 
		type: "column", 
		source: "source", 
		allowMultiple: false, 
		allowedTypes: ['text'] 
	},
	{ 
		name: "variables", 
		type: "column", 
		source: "source", 
		allowMultiple: true, 
		allowedTypes: ['number', 'integer'] 
	},
	{
		name: 'number',
		source: "source", 
		type: 'text'
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

function chunk(data, colInfo, sets, variables, numGroups) {
	if (sets && variables && data && colInfo) {
		// let valuesObj = {};
		// for(let i = 0; i < variables.length; i++) {
		// 	valuesObj[variables[i]] = Math.random() * 10;
		// }

		const setCol = data[sets] ?? [];
		const uniqueSets = setCol.filter(onlyUnique).slice(0, numGroups);
		const setList = uniqueSets.map((name) => {
			let valuesObj = {};
			for(let i = 0; i < variables.length; i++) {
				valuesObj[variables[i]] = 0;
			}
			return (
				{
					key: name,
					label: name,
					values: {
						...valuesObj
					},
				}
			);
		})
		// console.log(variables); // list of spoke variable col names
		const variableObjList = variables.map((variableName) => {
			return {
				key: variableName,
				label: colInfo[variableName]?.name,
			}
		})

		for(let j = 0; j < setCol.length; j++){
			let thisSet = setCol[j];
			if (uniqueSets.includes(thisSet)) {
				for(let setIdx = 0; setIdx < uniqueSets.length; setIdx++){
					if(setList[setIdx].key === thisSet) {
						for(let varIdx = 0; varIdx < variables.length; varIdx++){
							setList[setIdx].values[variables[varIdx]] += data[variables[varIdx]][j] * 10000;
						}
					}
				}
			}
		}

		return {
			variables: variableObjList,
			sets: setList,
		}
	} else {
		return (
			{
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
					{
						key: 'everyone2',
						label: 'Everyone2',
						values: {
							resilience: 1,
							strength: 6,
							adaptability: 3,
							creativity: 1,
							openness: 6,
							confidence: 9,
						},
					},
				],
			}
		);
	}
}

function onlyUnique(value, index, array) {
	return array.indexOf(value) === index;
  }

function App() {
	// useConfig, useElementColumns, useElementData is a function of the Sigma API
	const config = useConfig(); // all the info of the selections in the LHS panel
	const columns = useElementColumns(config.source); // name of all cols in "source"
	const sigmaData = useElementData(config.source); // data in the table
	const numGroups = config.number || 5;

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const tempData = {
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
			{
				key: 'everyone2',
				label: 'Everyone2',
				values: {
					resilience: 1,
					strength: 6,
					adaptability: 3,
					creativity: 1,
					openness: 6,
					confidence: 9,
				},
			},
		],
	};

	const data = useMemo(() => {
		if(! config) {
			console.log("foo");
			return tempData;
		}
		const sets = config.sets ?? [];
		const variables = config.variables ?? [];

		return {
			name: "data",
			children: chunk(sigmaData, columns, sets, variables, numGroups),
		};
	}, [config, sigmaData, columns, numGroups, tempData]);
	
	const realData = data.children;

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
				console.log('lol');
			}
		}}
		// data={realData}
		data={tempData}

	/>
}

export default App;
