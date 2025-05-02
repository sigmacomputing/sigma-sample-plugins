import type { ECharts } from 'echarts';
import { useCallback, useMemo, useRef, useState } from 'react';
import { options } from './options';
import { useHandleResize } from './resize';
import { CustomDataValue, useChartRefresh } from './refresh';
import { getData } from './data';
import { logIfDebug } from './log';
import { useFetchDataFromSigma } from './plugin';

export const DEBUG = false;

export type IncomingDataType = {
  name: string;
  value: CustomDataValue;
  itemStyle: { color: string };
}[];

function App() {
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts>();
  const [chartOptions] = useState(options);

  const { isMultipleSessionIds, resourceTimings, annotations, marks, offset } =
    useFetchDataFromSigma();
  // TODO: Make this come from a plugin fetch
  const sampleData = useMemo<IncomingDataType>(() => {
    return getData();
  }, []);

  useChartRefresh(chartElementRef, chartRef, chartOptions, sampleData);

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
