import { useCallback, useRef, useState } from 'react';
import { useChartRefresh } from './refresh';
import { logIfDebug } from './log';
import { useHandleResize } from './resize';
import { ECharts } from 'echarts';
import { options } from './options';
import { useTransformData } from './transform';
import { Marks, ResourceTimings } from './plugin';

interface ChartProps_t {
  marks: Marks[] | undefined;
  offsets: number[] | undefined;
  resourceTimings: ResourceTimings[] | undefined;
}

export function Chart(props: ChartProps_t) {
  const chartRef = useRef<ECharts>();
  const chartElementRef = useRef<HTMLDivElement | null>(null);

  const [chartOptions] = useState(options);

  const transformedData = useTransformData(
    props.resourceTimings,
    props.marks,
    props.offsets
  );

  useChartRefresh(chartElementRef, chartRef, chartOptions, transformedData);
  useHandleResize(chartRef);

  const refreshChart = useCallback(() => {
    if (chartRef.current) {
      logIfDebug('log', 'Manually refreshing chart');
      chartRef.current.resize();

      // Force a redraw with the same options
      const currentOption = chartRef.current.getOption();
      chartRef.current.setOption(currentOption, true);

      logIfDebug('log', 'Chart refreshed');
    } else {
      logIfDebug('error', 'Chart not initialized');
    }
  }, []);

  return (
    <>
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
          overflow: 'hidden', // Ensure chart container doesn't overflow
          boxSizing: 'border-box', // Include padding in width calculation
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
    </>
  );
}
