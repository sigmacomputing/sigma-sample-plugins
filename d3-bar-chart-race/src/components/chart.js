// // function* createChart() {
// //   const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

// //   const updateBars = bars(svg);
// //   const updateAxis = axis(svg);
// //   const updateLabels = labels(svg);
// //   const updateTicker = ticker(svg);

// //   yield svg.node();

// //   for (const keyframe of keyframes) {
// //     const transition = svg.transition().duration(duration).ease(d3.easeLinear);

// //     // Extract the top bar’s value.
// //     x.domain([0, keyframe[1][0].value]);

// //     updateAxis(keyframe, transition);
// //     updateBars(keyframe, transition);
// //     updateLabels(keyframe, transition);
// //     updateTicker(keyframe, transition);

// //     invalidation.then(() => svg.interrupt());
// //     await transition.end();
// //   }
// // }

// function createChart() {
//     const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

//     const updateBars = bars(svg);
//     const updateAxis = axis(svg);
//     const updateLabels = labels(svg);
//     const updateTicker = ticker(svg);

//     return svg.node();

//     for (const keyframe of keyframes) {
//       const transition = svg.transition().duration(duration).ease(d3.easeLinear);

//       // Extract the top bar’s value.
//       x.domain([0, keyframe[1][0].value]);

//       updateAxis(keyframe, transition);
//       updateBars(keyframe, transition);
//       updateLabels(keyframe, transition);
//       updateTicker(keyframe, transition);

//       // invalidation.then(() => svg.interrupt());
//       await transition.end();
//     }
//   }

//   const duration = 250;

// const data = [
//     {
//       date: "2000 - 01 - 01",
//       name: "Coca-Cola",
//       category: "Beverages",
//       value: 72537,
//     },
//     {
//       date: "2000 - 01 - 01",
//       name: "Microsoft",
//       category: "Technology",
//       value: 70196,
//     },
//     {
//       date: "2000 - 01 - 01",
//       name: "IBM",
//       category: "Business Services",
//       value: 53183,
//     },
//     {
//       date: "2001 - 01 - 01",
//       name: "Coca-Cola",
//       category: "Beverages",
//       value: 68945,
//     },
//     {
//       date: "2001 - 01 - 01",
//       name: "Microsoft",
//       category: "Technology",
//       value: 65068,
//     },
//     {
//       date: "2001 - 01 - 01",
//       name: "IBM",
//       category: "Business Services",
//       value: 52752,
//     },
//   ];
