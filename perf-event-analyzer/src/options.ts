import {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemReturn,
  EChartsOption,
} from 'echarts';
import { logIfDebug } from './log';

export const options: EChartsOption = {
  backgroundColor: {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0.05,
        color: '#eee',
      },
      {
        offset: 0.95,
        color: '#eeeeb0',
      },
    ],
  },
  tooltip: {
    show: true,
    trigger: 'item',
    formatter: function (params: unknown) {
      // Type assertion for the params object
      const typedParams = params as {
        data?: {
          name?: string;
          value?: number[];
        };
      };

      // For custom series, we need to access the data directly
      if (typedParams.data && Array.isArray(typedParams.data.value)) {
        const value = typedParams.data.value;
        const name = value[3] || typedParams.data.name || 'Event';
        const start = value[1];
        const end = value[2];
        const isPointInTime = value[5] === 1;

        if (isPointInTime) {
          // For point-in-time events
          return `
            <div style="font-weight: bold; margin-bottom: 3px; font-size: 14px;">${name}</div>
            <table style="width: 100%; border-spacing: 0; margin-top: 5px;">
              <tr>
                <td style="padding: 3px 0;">Time:</td>
                <td style="text-align: right; padding: 3px 0;">${start} ms</td>
              </tr>
              <tr>
                <td style="padding: 3px 0;">Type:</td>
                <td style="text-align: right; padding: 3px 0;">Point Event</td>
              </tr>
            </table>
          `;
        } else {
          // For time range events
          const duration = end - start;
          return `
            <div style="font-weight: bold; margin-bottom: 3px; font-size: 14px;">${name}</div>
            <table style="width: 100%; border-spacing: 0; margin-top: 5px;">
              <tr>
                <td style="padding: 3px 0;">Start:</td>
                <td style="text-align: right; padding: 3px 0;">${start} ms</td>
              </tr>
              <tr>
                <td style="padding: 3px 0;">End:</td>
                <td style="text-align: right; padding: 3px 0;">${end} ms</td>
              </tr>
              <tr>
                <td style="padding: 3px 0;">Duration:</td>
                <td style="text-align: right; padding: 3px 0;">${duration} ms</td>
              </tr>
            </table>
          `;
        }
      }
      return 'No data available';
    },
    backgroundColor: 'rgba(50, 50, 50, 0.95)',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: [8, 10],
    textStyle: {
      color: '#fff',
      fontSize: 12,
    },
    extraCssText:
      'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); border-radius: 4px;',
  },
  title: [
    {
      text: 'Performance event analyzer',
      left: 'center',
      top: 10,
      textStyle: {
        fontFamily: 'Verdana',
        fontWeight: 'normal',
        fontSize: 20,
      },
    },
  ],
  dataZoom: [
    // X-axis inside zoom (mouse wheel/pinch)
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 0,
      end: 100,
    },
    // X-axis slider zoom
    {
      type: 'slider',
      xAxisIndex: 0,
      start: 0,
      end: 100,
      height: 25,
      bottom: 10,
      handleSize: 20,
      showDetail: false,
    },
    // Y-axis inside zoom (mouse wheel/pinch with modifier key)
    {
      type: 'inside',
      yAxisIndex: 0,
      start: 0,
      end: 30, // Show only 30% of the data initially
      zoomOnMouseWheel: false, // Don't zoom y-axis on normal mouse wheel
      moveOnMouseWheel: true, // Allow moving the view on mouse wheel
      moveOnMouseMove: true, // Allow moving on mouse move
    },
    // Y-axis slider zoom
    {
      type: 'slider',
      yAxisIndex: 0,
      width: 25,
      right: 10,
      start: 0,
      end: 30, // Show only 30% of the data initially
      handleSize: 20,
      showDetail: false,
      orient: 'vertical',
    },
  ],
  xAxis: {
    show: true,
    type: 'value',
    name: 'Time (ms)',
    nameLocation: 'middle',
    nameGap: 30,
    min: 0,
    max: 'dataMax',
    axisLabel: {
      formatter: '{value} ms',
      showMinLabel: true,
      showMaxLabel: true,
      fontSize: 12,
      margin: 10,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        opacity: 0.5,
      },
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#999',
        width: 1,
      },
    },
    axisTick: {
      show: true,
      length: 5,
      lineStyle: {
        color: '#999',
        width: 1,
      },
    },
  },
  yAxis: {
    show: true,
    type: 'category',
    // Use dynamic max based on data instead of fixed value
    max: 'dataMax',
    // Set a reasonable min value to show a subset of data initially
    min: 0,
    axisLabel: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  grid: {
    left: '3%',
    right: '10%', // Increased to make room for y-axis slider
    bottom: '15%',
    top: '15%',
    containLabel: true,
  },
  series: [
    {
      type: 'custom',
      renderItem,
      encode: {
        x: [0, 1, 2],
        y: 0,
      },
      data: [
        {
          value: [0, 0, 100, 'root', 100],
          name: 'root',
          itemStyle: { color: '#FFFFFF' },
        },
      ],
    },
  ],
};

function renderItem(
  _params: CustomSeriesRenderItemParams,
  api: CustomSeriesRenderItemAPI
): CustomSeriesRenderItemReturn {
  // Log values for debugging
  logIfDebug('log', 'Rendering item with values:', {
    level: api.value(0),
    start: api.value(1),
    end: api.value(2),
    name: api.value(3),
    isPointInTime: api.value(4),
  });

  const level = api.value(0);
  const startTime = api.value(1);
  const endTime = api.value(2);
  const isPointInTime = api.value(4) === 1;

  // Get coordinates
  const start = api.coord([startTime, level]);
  const end = api.coord([endTime, level]);

  // Get size information
  const apiSize = api.size && api.size([0, 1]);
  if (typeof apiSize === 'number') {
    throw new Error('Invalid api.size');
  }
  const height = (apiSize || [0, 20])[1];
  const width = end[0] - start[0];

  // If this is a point-in-time event, render a circle
  if (isPointInTime) {
    const pointX = start[0];
    const pointY = start[1];
    const radius = height / 4;

    return {
      type: 'circle' as const,
      transition: ['shape'],
      shape: {
        cx: pointX,
        cy: pointY,
        r: radius,
      },
      style: {
        fill: api.visual('color'),
      },
      emphasis: {
        style: {
          stroke: '#000',
          lineWidth: 1,
        },
      },
    };
  }

  // Otherwise render a rectangle for time ranges
  return {
    type: 'rect' as const,
    transition: ['shape'],
    shape: {
      x: start[0],
      y: start[1] - height / 2,
      width,
      height: height - 2 /* itemGap */,
      r: 2,
    },
    style: {
      fill: api.visual('color'),
    },
    emphasis: {
      style: {
        stroke: '#000',
      },
    },
    textConfig: {
      position: 'insideLeft',
    },
    textContent: {
      type: 'text',
      style: {
        text: api.value(3).toString(),
        fontFamily: 'Verdana',
        fill: '#000',
        width: width - 4,
        overflow: 'truncate',
        ellipsis: '..',
        truncateMinChar: 1,
      },
      emphasis: {
        style: {
          stroke: '#000',
          lineWidth: 0.5,
        },
      },
    },
  };
}
