import { IncomingDataType } from './App';

export function getData(): IncomingDataType {
  return [
    // Main process
    {
      name: 'App Startup',
      value: [0, 0, 200, 'App Startup', 0],
      itemStyle: { color: '#5470c6' },
    },
    // Level 1 processes
    {
      name: 'Initialize Core',
      value: [1, 0, 50, 'Initialize Core', 0],
      itemStyle: { color: '#91cc75' },
    },
    {
      name: 'Load Resources',
      value: [1, 50, 120, 'Load Resources', 0],
      itemStyle: { color: '#fac858' },
    },
    {
      name: 'Initialize UI',
      value: [1, 120, 200, 'Initialize UI', 0],
      itemStyle: { color: '#ee6666' },
    },
    // Level 2 processes - Initialize Core children
    {
      name: 'Load Config',
      value: [2, 0, 20, 'Load Config', 0],
      itemStyle: { color: '#73c0de' },
    },
    {
      name: 'Initialize Services',
      value: [2, 20, 50, 'Initialize Services', 0],
      itemStyle: { color: '#3ba272' },
    },
    // Level 2 processes - Load Resources children
    {
      name: 'Load Images',
      value: [2, 50, 80, 'Load Images', 0],
      itemStyle: { color: '#fc8452' },
    },
    {
      name: 'Load Fonts',
      value: [2, 80, 100, 'Load Fonts', 0],
      itemStyle: { color: '#9a60b4' },
    },
    {
      name: 'Load Scripts',
      value: [2, 100, 120, 'Load Scripts', 0],
      itemStyle: { color: '#ea7ccc' },
    },
    // Level 2 processes - Initialize UI children
    {
      name: 'Create DOM',
      value: [2, 120, 150, 'Create DOM', 0],
      itemStyle: { color: '#58D9F9' },
    },
    {
      name: 'Render Components',
      value: [2, 150, 180, 'Render Components', 0],
      itemStyle: { color: '#FFDB5C' },
    },
    {
      name: 'Apply Styles',
      value: [2, 180, 200, 'Apply Styles', 0],
      itemStyle: { color: '#7ED3B2' },
    },

    // Point-in-time events (markers)
    {
      name: 'First Paint',
      value: [3, 25, 25, 'First Paint', 1],
      itemStyle: { color: '#FF5733' },
    },
    {
      name: 'DOM Ready',
      value: [3, 75, 75, 'DOM Ready', 1],
      itemStyle: { color: '#33FF57' },
    },
    {
      name: 'First Contentful Paint',
      value: [3, 110, 110, 'First Contentful Paint', 1],
      itemStyle: { color: '#3357FF' },
    },
    {
      name: 'Load Complete',
      value: [3, 190, 190, 'Load Complete', 1],
      itemStyle: { color: '#FF33F5' },
    },
  ];
}

export const logData = {
  isMultipleSessionIds: false,
  resourceTimings: [
    [
      {
        decodedBodySize: 12173,
        encodedBodySize: 5103,
        name: 'https://app.sigmacomputing.com/static/js/84185.dcd34c93.min.js',
        timeRange: [7.299999952316284, 14],
      },
      {
        decodedBodySize: 9206,
        encodedBodySize: 2772,
        name: 'https://app.sigmacomputing.com/static/js/23871.27cd4ac3.min.js',
        timeRange: [7.599999904632568, 15.899999976158142],
      },
      {
        decodedBodySize: 65498,
        encodedBodySize: 19519,
        name: 'https://app.sigmacomputing.com/static/js/90178.6bbe92b8.min.js',
        timeRange: [7.799999952316284, 18.5],
      },
      {
        decodedBodySize: 13109,
        encodedBodySize: 4515,
        name: 'https://app.sigmacomputing.com/static/js/84782.ef0a22cb.min.js',
        timeRange: [7.899999976158142, 19.09999990463257],
      },
      {
        decodedBodySize: 46420,
        encodedBodySize: 14568,
        name: 'https://app.sigmacomputing.com/static/js/55137.4b2df5ca.min.js',
        timeRange: [8.699999928474426, 20.59999990463257],
      },
      {
        decodedBodySize: 16598,
        encodedBodySize: 5153,
        name: 'https://app.sigmacomputing.com/static/js/41733.2095f8b5.min.js',
        timeRange: [9.299999952316284, 21.199999928474426],
      },
      {
        decodedBodySize: 17156,
        encodedBodySize: 5526,
        name: 'https://app.sigmacomputing.com/static/js/26262.8e3191ea.min.js',
        timeRange: [9.099999904632568, 20.899999976158142],
      },
      {
        decodedBodySize: 130114,
        encodedBodySize: 37960,
        name: 'https://app.sigmacomputing.com/static/js/27788.90c6fef5.min.js',
        timeRange: [8.299999952316284, 23.09999990463257],
      },
      {
        decodedBodySize: 283401,
        encodedBodySize: 74663,
        name: 'https://app.sigmacomputing.com/static/js/33986.8c082745.min.js',
        timeRange: [7.699999928474426, 24.899999976158142],
      },
      {
        decodedBodySize: 112789,
        encodedBodySize: 32326,
        name: 'https://app.sigmacomputing.com/static/js/19432.5c350157.min.js',
        timeRange: [10, 30.699999928474426],
      },
      {
        decodedBodySize: 76949,
        encodedBodySize: 24001,
        name: 'https://app.sigmacomputing.com/static/js/58726.e131ce04.min.js',
        timeRange: [10.399999976158142, 31.09999990463257],
      },
      {
        decodedBodySize: 614453,
        encodedBodySize: 165824,
        name: 'https://app.sigmacomputing.com/static/js/77345.afac996f.min.js',
        timeRange: [9.599999904632568, 37.5],
      },
      {
        decodedBodySize: 463747,
        encodedBodySize: 132049,
        name: 'https://app.sigmacomputing.com/static/js/82219.face3043.min.js',
        timeRange: [9.799999952316284, 39.699999928474426],
      },
      {
        decodedBodySize: 10727,
        encodedBodySize: 4312,
        name: 'https://app.sigmacomputing.com/static/js/19890.dcae476e.min.js',
        timeRange: [11.099999904632568, 67.29999995231628],
      },
      {
        decodedBodySize: 13955,
        encodedBodySize: 4201,
        name: 'https://app.sigmacomputing.com/static/js/29540.e211271f.min.js',
        timeRange: [10.899999976158142, 70.79999995231628],
      },
      {
        decodedBodySize: 2359809,
        encodedBodySize: 709341,
        name: 'https://app.sigmacomputing.com/static/js/32404.bedb1482.min.js',
        timeRange: [8.099999904632568, 55.799999952316284],
      },
      {
        decodedBodySize: 17392,
        encodedBodySize: 4325,
        name: 'https://app.sigmacomputing.com/static/js/63369.3316351a.min.js',
        timeRange: [10.799999952316284, 76.69999992847443],
      },
      {
        decodedBodySize: 23142,
        encodedBodySize: 8691,
        name: 'https://app.sigmacomputing.com/static/js/37090.0d86a9f6.min.js',
        timeRange: [22.799999952316284, 87.19999992847443],
      },
      {
        decodedBodySize: 3682903,
        encodedBodySize: 1105600,
        name: 'https://app.sigmacomputing.com/static/js/80662.4e4fc773.min.js',
        timeRange: [10.599999904632568, 62.199999928474426],
      },
      {
        decodedBodySize: 16,
        encodedBodySize: 16,
        name: 'https://app.sigmacomputing.com/features/v1/rgstr',
        timeRange: [12.5, 98.79999995231628],
      },
      {
        decodedBodySize: 0,
        encodedBodySize: 0,
        name: 'https://aws-api.sigmacomputing.com/api/v2/embed/refresh-token',
        timeRange: [11.899999976158142, 162.69999992847443],
      },
      {
        decodedBodySize: 786662,
        encodedBodySize: 147415,
        name: 'https://app.sigmacomputing.com/wasm_eval_main.119.wasm',
        timeRange: [199.59999990463257, 308],
      },
      {
        decodedBodySize: 16,
        encodedBodySize: 16,
        name: 'https://app.sigmacomputing.com/features/v1/rgstr',
        timeRange: [625.5999999046326, 712],
      },
      {
        decodedBodySize: 0,
        encodedBodySize: 0,
        name: 'https://aws-api.sigmacomputing.com/api/v2/embed/describe',
        timeRange: [516.8999999761581, 1021.5999999046326],
      },
      {
        decodedBodySize: 7286,
        encodedBodySize: 2750,
        name: 'https://app.sigmacomputing.com/static/js/8725.ff5794c8.min.js',
        timeRange: [1060.2999999523163, 1116.3999999761581],
      },
      {
        decodedBodySize: 67345,
        encodedBodySize: 21186,
        name: 'https://app.sigmacomputing.com/static/js/76694.537ca270.min.js',
        timeRange: [1061, 1116.5999999046326],
      },
      {
        decodedBodySize: 75203,
        encodedBodySize: 24435,
        name: 'https://app.sigmacomputing.com/static/js/8982.fe858f47.min.js',
        timeRange: [1061.0999999046326, 1119.5],
      },
      {
        decodedBodySize: 29449,
        encodedBodySize: 9811,
        name: 'https://app.sigmacomputing.com/static/js/15100.20d79ea0.min.js',
        timeRange: [1060.6999999284744, 1123.1999999284744],
      },
      {
        decodedBodySize: 12753,
        encodedBodySize: 4946,
        name: 'https://app.sigmacomputing.com/static/js/92072.1f4e32f0.min.js',
        timeRange: [1060.5, 1148.8999999761581],
      },
      {
        decodedBodySize: 14859,
        encodedBodySize: 5897,
        name: 'https://app.sigmacomputing.com/static/js/86600.4a4aeba7.min.js',
        timeRange: [1060.5999999046326, 1149.3999999761581],
      },
      {
        decodedBodySize: 8535,
        encodedBodySize: 3041,
        name: 'https://app.sigmacomputing.com/static/js/98215.96e82d2a.min.js',
        timeRange: [1060.3999999761581, 1151.6999999284744],
      },
      {
        decodedBodySize: 37448,
        encodedBodySize: 12248,
        name: 'https://app.sigmacomputing.com/static/js/92741.cda52803.min.js',
        timeRange: [1060.7999999523163, 1152.8999999761581],
      },
      {
        decodedBodySize: 82063,
        encodedBodySize: 25939,
        name: 'https://app.sigmacomputing.com/static/js/2060.72ed5641.min.js',
        timeRange: [1060.7999999523163, 1153.7999999523163],
      },
      {
        decodedBodySize: 341234,
        encodedBodySize: 98559,
        name: 'https://app.sigmacomputing.com/static/js/74788.707db450.min.js',
        timeRange: [1061, 1185.7999999523163],
      },
      {
        decodedBodySize: 105920,
        encodedBodySize: 35723,
        name: 'https://app.sigmacomputing.com/static/js/71145.3f7ed342.min.js',
        timeRange: [1061.1999999284744, 1186.1999999284744],
      },
      {
        decodedBodySize: 260502,
        encodedBodySize: 78622,
        name: 'https://app.sigmacomputing.com/static/js/83461.15557445.min.js',
        timeRange: [1061.2999999523163, 1214.5],
      },
      {
        decodedBodySize: 23251,
        encodedBodySize: 7659,
        name: 'https://app.sigmacomputing.com/static/js/61427.7ca6dc72.min.js',
        timeRange: [1061.3999999761581, 1216.7999999523163],
      },
      {
        decodedBodySize: 25691,
        encodedBodySize: 8485,
        name: 'https://app.sigmacomputing.com/static/js/88202.4fa8ac05.min.js',
        timeRange: [1288.3999999761581, 1356.3999999761581],
      },
    ],
    [
      {
        decodedBodySize: 7756,
        encodedBodySize: 796,
        name: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,600;1,400&display=swap',
        timeRange: [-5.300000071525574, -1.8000000715255737],
      },
      {
        decodedBodySize: 167958,
        encodedBodySize: 6468,
        name: 'https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,700;1,400&family=Exo:ital,wght@0,400;0,600;1,400;1,600&family=Fira+Mono:wght@400;700&family=Fira+Sans:ital,wght@0,400;0,600;1,400;1,600&family=Inconsolata:wght@400;700&family=Inter:wght@400;600&family=Lato:ital,wght@0,400;0,600;1,400;1,600&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,400;0,600;1,400;1,600&family=Nunito:ital,wght@0,400;0,600;1,400;1,600&family=Open+Sans:ital,wght@0,400;0,600;1,400;1,600&family=Oswald:wght@400;600&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Raleway:ital,wght@0,400;0,600;1,400;1,600&family=Roboto:ital,wght@0,400;0,600;1,400;1,600&family=Roboto+Mono:wght@400;700&family=Source+Serif+Pro:wght@400;600&family=Space+Mono:wght@400;700&family=Spectral:ital,wght@0,400;0,600;1,400;1,600&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu+Mono:wght@400;700&family=Vollkorn:ital,wght@0,400;0,600;1,400;1,600&display=swap',
        timeRange: [-4.800000071525574, -0.7000000476837158],
      },
      {
        decodedBodySize: 20063,
        encodedBodySize: 4404,
        name: 'https://app.sigmacomputing.com/static/css/main.a45d5a67.css',
        timeRange: [-4.5, -0.8999999761581421],
      },
      {
        decodedBodySize: 38003,
        encodedBodySize: 17498,
        name: 'https://app.sigmacomputing.com/static/js/init.ac2b3d5e.min.js',
        timeRange: [-4.700000047683716, 5.399999976158142],
      },
      {
        decodedBodySize: 183766,
        encodedBodySize: 54915,
        name: 'https://app.sigmacomputing.com/static/js/44671.1ca276b6.min.js',
        timeRange: [-4.700000047683716, 6.899999976158142],
      },
      {
        decodedBodySize: 158315,
        encodedBodySize: 51602,
        name: 'https://app.sigmacomputing.com/static/js/vendor-react.070a328a.min.js',
        timeRange: [-4.700000047683716, 7.699999928474426],
      },
      {
        decodedBodySize: 2000722,
        encodedBodySize: 435698,
        name: 'https://app.sigmacomputing.com/static/js/9885.e3633729.min.js',
        timeRange: [-4.700000047683716, 16.299999952316284],
      },
      {
        decodedBodySize: 332957,
        encodedBodySize: 103358,
        name: 'https://app.sigmacomputing.com/static/js/main.7c493860.min.js',
        timeRange: [-4.600000023841858, 10.799999952316284],
      },
      {
        decodedBodySize: 213,
        encodedBodySize: 157,
        name: 'https://app.sigmacomputing.com/static/js/353.1da0da32.min.js',
        timeRange: [77.39999997615814, 79.5],
      },
      {
        decodedBodySize: 477240,
        encodedBodySize: 78806,
        name: 'https://app.sigmacomputing.com/static/js/23992.8051ff78.min.js',
        timeRange: [93.29999995231628, 97.39999997615814],
      },
    ],
  ],
  marks: [
    {
      TTI: 1535,
      describeEmbedEndTime: 1024.2999999523163,
      describeEmbedStartTime: 516.5,
      getEmbedTokenEndTime: 516.2999999523163,
      getEmbedTokenStartTime: 6.899999976158142,
      'import(initializeWorkbookEmbed.ts)EndTime': 502.89999997615814,
      'import(initializeWorkbookEmbed.ts)StartTime': 11.099999904632568,
    },
    {
      jsBundleLoaded: 123.19999992847443,
      routingInitialized: 180.79999995231628,
    },
  ],
  offsets: [535.1000000238419, 265],
};
