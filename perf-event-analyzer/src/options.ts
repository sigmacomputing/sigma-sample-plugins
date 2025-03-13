import {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  EChartsOption,
} from 'echarts';

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
  xAxis: {
    show: false,
  },
  yAxis: {
    show: false,
    max: 10, // dummy value
  },
  series: [
    {
      type: 'custom',
      renderItem,
      encode: {
        x: [0, 1, 2],
        y: 0,
      },
      data: [], // Data to be filled in
    },
  ],
};

function renderItem(
  params: CustomSeriesRenderItemParams,
  api: CustomSeriesRenderItemAPI
) {
  const level = api.value(0);
  const start = api.coord([api.value(1), level]);
  const end = api.coord([api.value(2), level]);
  const height = ((api.size && api.size([0, 1])) || [0, 20])[1];
  const width = end[0] - start[0];
  return {
    type: 'rect',
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
      style: {
        text: api.value(3),
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
