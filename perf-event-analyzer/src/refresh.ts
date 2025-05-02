import {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemReturn,
  EChartsOption,
  init,
} from 'echarts';
import { useEffect } from 'react';
import { DEBUG, IncomingDataType } from './App';
import { logIfDebug } from './log';

// Define a type for our custom data format
// [level, startTime, endTime, name, isPointInTime]
// isPointInTime: 1 = point in time (dot), 0 = time range (rectangle)
type Level = number;
type StartTime = number;
type EndTime = number;
type Name = string;
type IsPointInTime = 0 | 1;
export type CustomDataValue = [Level, StartTime, EndTime, Name, IsPointInTime?];

export function useChartRefresh(
  chartElementRef: React.RefObject<HTMLDivElement>,
  chartRef: React.MutableRefObject<echarts.ECharts | undefined>,
  chartOptions: EChartsOption,
  data: IncomingDataType
) {
  // Initialize chart
  useEffect(() => {
    // Add a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (chartElementRef.current) {
        // Log container dimensions for debugging
        logIfDebug(
          'log',
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
            logIfDebug('error', 'Chart container has zero width or height');
            return;
          }

          // Initialize the chart with explicit renderer
          const chart = init(chartElementRef.current);

          chartRef.current = chart;

          // Create a safe copy of the options with explicit data
          const fullOptions = {
            ...chartOptions,
            series: Array.isArray(chartOptions.series)
              ? chartOptions.series.map((series, index) =>
                  index === 0 ? { ...series, data } : series
                )
              : [
                  {
                    type: 'custom',
                    renderItem: function (
                      params: CustomSeriesRenderItemParams,
                      api: CustomSeriesRenderItemAPI
                    ): CustomSeriesRenderItemReturn {
                      logIfDebug(
                        'log',
                        'renderItem called with params:',
                        params
                      );
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
                    data,
                  },
                ],
          };

          if (DEBUG) {
            logIfDebug(
              'log',
              'Setting chart options:',
              JSON.stringify(fullOptions, null, 2)
            );
          }
          chart.setOption(fullOptions);

          if (DEBUG) {
            logIfDebug('log', 'Chart initialized successfully');
          }
        } catch (error) {
          if (DEBUG) {
            logIfDebug('error', 'Error initializing chart:', error);
          }
        }
      } else {
        if (DEBUG) {
          logIfDebug('error', 'Chart container not found');
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [chartElementRef, chartOptions, chartRef, data]);
}
