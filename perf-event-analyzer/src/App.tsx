import { CustomDataValue } from './refresh';
import { useFetchDataFromSigma } from './plugin';
import { Chart } from './Chart';

export type IncomingDataEntry = {
  name: string;
  value: CustomDataValue;
  itemStyle: { color: string };
};

export type IncomingDataType = IncomingDataEntry[];

function App() {
  const { isMultipleSessionIds, resourceTimings, marks, offsets } =
    useFetchDataFromSigma();

  if (isMultipleSessionIds) {
    return 'Multiple session ids in data source! This plugin is only built to support one session id.';
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxSizing: 'border-box', // Include padding in width calculation
        padding: '0 10px', // Add some padding on the sides
      }}
    >
      <Chart
        marks={marks}
        resourceTimings={resourceTimings}
        offsets={offsets}
      />
    </div>
  );
}

export default App;
