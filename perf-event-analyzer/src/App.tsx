import * as echarts from 'echarts';
import {
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemReturn,
} from 'echarts';
import { useCallback, useEffect, useRef, useState } from 'react';
import { options } from './options';

function App() {
  const chartElementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts>();
  const [chartOptions] = useState(options);

  // Initialize chart
  useEffect(() => {
    // Add a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (chartElementRef.current) {
        // Log container dimensions for debugging
        console.log(
          'Container dimensions:',
          chartElementRef.current.clientWidth,
          chartElementRef.current.clientHeight
        );

        try {
          // First, make sure the container is visible and has dimensions
          if (
            chartElementRef.current.clientWidth === 0 ||
            chartElementRef.current.clientHeight === 0
          ) {
            console.error('Chart container has zero width or height');
            return;
          }

          // Initialize the chart with explicit renderer
          const chart = echarts.init(chartElementRef.current);

          chartRef.current = chart;

          // Set initial options with some sample data
          const sampleData = [
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

          // Create a safe copy of the options with explicit data
          const fullOptions = {
            ...chartOptions,
            series: Array.isArray(chartOptions.series)
              ? chartOptions.series.map((series, index) =>
                  index === 0 ? { ...series, data: sampleData } : series
                )
              : [
                  {
                    type: 'custom',
                    renderItem: function (
                      params: CustomSeriesRenderItemParams,
                      api: CustomSeriesRenderItemAPI
                    ): CustomSeriesRenderItemReturn {
                      console.log('renderItem called with params:', params);
                      const level = api.value(0);
                      const start = api.coord([api.value(1), level]);
                      const end = api.coord([api.value(2), level]);
                      const apiSize = api.size ? api.size([0, 1]) : null;
                      const height = Array.isArray(apiSize) ? apiSize[1] : 20;
                      const width = end[0] - start[0];

                      return {
                        type: 'rect' as const,
                        shape: {
                          x: start[0],
                          y: start[1] - height / 2,
                          width,
                          height: height - 2,
                          r: 2,
                        },
                        style: {
                          fill: '#5470c6',
                        },
                      };
                    },
                    data: sampleData,
                  },
                ],
          };

          console.log(
            'Setting chart options:',
            JSON.stringify(fullOptions, null, 2)
          );
          chart.setOption(fullOptions);

          console.log('Chart initialized successfully');
        } catch (error) {
          console.error('Error initializing chart:', error);
        }
      } else {
        console.error('Chart container not found');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [chartOptions]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const refreshChart = useCallback(() => {
    if (chartRef.current) {
      console.log('Manually refreshing chart');
      chartRef.current.resize();

      // Force a redraw with the same options
      const currentOption = chartRef.current.getOption();
      chartRef.current.setOption(currentOption, true);

      console.log('Chart refreshed');
    } else {
      console.error('Chart not initialized');
    }
  }, []);

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
      >
        {/* The chart will render here */}
      </div>

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
