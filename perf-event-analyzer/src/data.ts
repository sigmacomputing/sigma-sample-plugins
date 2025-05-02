import { IncomingDataType } from './App';

export function getData(): IncomingDataType {
  return [
    // Main process
    {
      name: 'App Startup',
      value: [0, 0, 200, 'App Startup', 100],
      itemStyle: { color: '#5470c6' },
    },
    // Level 1 processes
    {
      name: 'Initialize Core',
      value: [1, 0, 50, 'Initialize Core', 25],
      itemStyle: { color: '#91cc75' },
    },
    {
      name: 'Load Resources',
      value: [1, 50, 120, 'Load Resources', 35],
      itemStyle: { color: '#fac858' },
    },
    {
      name: 'Initialize UI',
      value: [1, 120, 200, 'Initialize UI', 40],
      itemStyle: { color: '#ee6666' },
    },
    // Level 2 processes - Initialize Core children
    {
      name: 'Load Config',
      value: [2, 0, 20, 'Load Config', 10],
      itemStyle: { color: '#73c0de' },
    },
    {
      name: 'Initialize Services',
      value: [2, 20, 50, 'Initialize Services', 15],
      itemStyle: { color: '#3ba272' },
    },
    // Level 2 processes - Load Resources children
    {
      name: 'Load Images',
      value: [2, 50, 80, 'Load Images', 15],
      itemStyle: { color: '#fc8452' },
    },
    {
      name: 'Load Fonts',
      value: [2, 80, 100, 'Load Fonts', 10],
      itemStyle: { color: '#9a60b4' },
    },
    {
      name: 'Load Scripts',
      value: [2, 100, 120, 'Load Scripts', 10],
      itemStyle: { color: '#ea7ccc' },
    },
    // Level 2 processes - Initialize UI children
    {
      name: 'Create DOM',
      value: [2, 120, 150, 'Create DOM', 15],
      itemStyle: { color: '#58D9F9' },
    },
    {
      name: 'Render Components',
      value: [2, 150, 180, 'Render Components', 15],
      itemStyle: { color: '#FFDB5C' },
    },
    {
      name: 'Apply Styles',
      value: [2, 180, 200, 'Apply Styles', 10],
      itemStyle: { color: '#7ED3B2' },
    },
  ];
}
