import type { ECharts } from 'echarts';
import { useCallback, useRef, useState } from 'react';
import { options } from './options';
import { useHandleResize } from './resize';
import { CustomDataValue, useChartRefresh } from './refresh';
import { logIfDebug } from './log';
import { useFetchDataFromSigma } from './plugin';
import { useTransformData } from './transform';
import { logData } from './data';

export const DEBUG = false;

export type IncomingDataEntry = {
  name: string;
  value: CustomDataValue;
  itemStyle: { color: string };
};

export type IncomingDataType = IncomingDataEntry[];

function App() {
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts>();
  const [chartOptions] = useState(options);

  const { isMultipleSessionIds, resourceTimings, marks, offsets } =
    useFetchDataFromSigma();

  const transformedData = useTransformData(
    logData.resourceTimings,
    logData.marks,
    logData.offsets
  );

  console.log(
    logData.resourceTimings[0].length + logData.resourceTimings[1].length,
    Object.keys(logData.marks[0]).length + Object.keys(logData.marks[1]).length,
    transformedData.length
  );

  useChartRefresh(chartElementRef, chartRef, chartOptions, transformedData);

  const refreshChart = useCallback(() => {
    if (chartRef.current) {
      logIfDebug('log', 'Manually refreshing chart');
      chartRef.current.resize();

      // Force a redraw with the same options
      const currentOption = chartRef.current.getOption();
      chartRef.current.setOption(currentOption, true);

      logIfDebug('log', 'Chart refreshed');
    } else {
      if (DEBUG) {
        logIfDebug('error', 'Chart not initialized');
      }
    }
  }, []);

  useHandleResize(chartRef);

  if (isMultipleSessionIds) {
    return 'Multiple session ids in data source! This plugin is only built to support one session id.';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{
          width: '100%',
          height: '500px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          padding: '10px',
          backgroundColor: '#fff',
        }}
        ref={chartElementRef}
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={refreshChart}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Refresh chart
        </button>
      </div>
    </div>
  );
}

export default App;
