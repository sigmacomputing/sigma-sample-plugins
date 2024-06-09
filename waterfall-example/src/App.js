import React, {
  useState,
  useEffect,
  useMemo
} from 'react';

import { client, useConfig, useElementData } from '@sigmacomputing/plugin';

import Highcharts from 'highcharts';
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsReact from 'highcharts-react-official';

HighchartsMore(Highcharts);


// ------------------------------------------------------------------------------------------

client.config.configureEditorPanel([
  { name: "source", type: "element"},
  { name: "x", type: "column", source: "source", allowMultiple: false},
  { name: "y", type: "column", source: "source", allowMultiple: false},
  { name: "date grouping", type: "column", source: "source", allowMultiple: false },
  { name: "Show Final Total Bar? (Y/N)", type: "text", defaultValue: "Y" },

]);

// ------------------------------------------------------------------------------------------

const allSigmaDataReceived = (config, sigmaData) => {
  if (!sigmaData[config['x']] && !sigmaData[config['y']]) {
    return false;
  }

  return true;
}


const getSigmaData = (config, sigmaData) => {

  // Async data conditional
  if (!allSigmaDataReceived(config, sigmaData)) return null;

  // This will tell us what to group by: day, week, month, year
  let date_grouping = sigmaData[config["date grouping"]][0];

  // -------------------------------------------------------
  // Sort the dates coming in to the data

  // 1. combine the x and y arrays into an object
  let arr_unsorted = []
  for (let i = 0; i < sigmaData[config['x']].length; i++) {
    arr_unsorted.push({'x': sigmaData[config['x']][i], 'y': sigmaData[config['y']][i]})
  }

  let sorted_arr = arr_unsorted.sort((a,b) => {
    return a.x - b.x
  })

  // Reassign sigmaData object values here for x and y axis
  sigmaData[config['x']] = sorted_arr.map((val) => val.x)
  sigmaData[config['y']] = sorted_arr.map((val) => val.y)

  // Create the data object that fits into the highcharts series
  // Call to attention how the formatting is for highcharts
  const data = sigmaData[config['x']].map((date_input, i) => {
    
    let date = new Date(date_input)
    let month_string = date.toDateString().split(' ')[1];
    let day_num_string = date.toDateString().split(' ')[2];
    let year_string = date.toDateString().split(' ')[3];

    // output
    let res = {}

    // depending on what the date grouping is, we will return different objects
    switch(date_grouping) {
      case 'day':
        // day object
        res = {
          name: month_string + ' ' + day_num_string + ' ' + year_string,
          y: sigmaData[config['y']][i]
        };
        break;
      case 'week':
        // week object
        res = {
          name: month_string + ' ' + day_num_string + ' ' + year_string,
          y: sigmaData[config['y']][i]
        };
        break;
      case 'month':
        // month object
        res = {
          name: month_string + ' ' + year_string,
          y: sigmaData[config['y']][i]
        };
        break;
      case 'year':
        // year object
        res = {
          name: year_string,
          y: sigmaData[config['y']][i]
        };
        break;

      default:
        // do nothing
    }

    return res;
  });


  // add the last total balance object to the data list if the show final total bar is Y
  if (client.config.getKey("Show Final Total Bar? (Y/N)") === 'Y') {
    data.push({
      name: 'Total Profit',
      isSum: true,
      color: Highcharts.getOptions().colors[1]
    })
  }

  return {
    chart: {
      type: 'waterfall',
    },
    title: {
      text: 'Profits'
    },
    legend: {
      enabled: false
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      enabled: true,
      title: {
        text: 'Profit'
      }
    },
    tooltip: {
      // Default Point format
      // pointFormat: "<b>${point.y:,.2f}</b> USD"

      // More Clean Tooltip formatter
      enabled: true,
      formatter: function () {

        // now i need to figure out the formatting here
        let [number, zeros] = (this.y).toPrecision(3).split('e+'); // if this.y=750,000, output is -> ['7.50','5']

        // conver this number to absolute value
        number = Math.abs(number).toString();
      
        let output_num, suffix;

        // for all of these statements, assume that "this.y" is actually Math.abs(this.y)
        switch(zeros) {
          case undefined:
            // this.y < 1,000
            output_num = number;
            suffix = ''
            break;
          case '3':
            // 1,000 <= this.y < 10,000, input is '7.50', '3'
            output_num = number;
            suffix = 'K'
            break;
          case '4':
            // 10,000 <= this.y < 100,000
            output_num = (parseFloat(number) * 10).toString().slice(0,4)
            suffix = 'K'
            break;
          case '5':
            // 100,000 <= this.y < 1,000,000
            output_num = (parseFloat(number) * 100).toString().slice(0,3)
            suffix = 'K'
            break;
          case '6':
            // 1,000,000 <= this.y < 10,000,000
            output_num = number
            suffix = 'M'
            break;
          case '7':
            // 10,000,000 <= this.y < 100,000,000
            output_num = (parseFloat(number) * 10).toString().slice(0,4)
            suffix = 'M'
            break;
          case '8':
            // 100,000,000 <= this.y < 1,000,000,000
            output_num = (parseFloat(number) * 100).toString().slice(0,3)
            suffix = 'M'
            break;
          case '9':
            // 1,000,000,000 <= this.y < 10,000,000,000
            output_num = number
            suffix = 'B'
            break;
          case '10':
            // 10,000,000,000 <= this.y < 100,000,000,000
            output_num = (parseFloat(number) * 10).toString().slice(0,4)
            suffix = 'B'
            break;

          default:
            // this number is greater than 100 billion
            // i'm not going to keep doing this...
        }


        // determine the prefix and the date name to be shown in the chart
        let prefix = this.y >= 0 ? '$' : '-$';
        let date_name = this.key;

        return `${date_name} :    ${prefix + output_num + suffix + ' USD'}`;
      }
    },
    series: [{
      upColor: Highcharts.getOptions().colors[2],
      color: Highcharts.getOptions().colors[8],
      data: data
    }]
  };
}



const useMain = () => {
  
  // Receive config and element data objects from Sigma
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  
  const payload = useMemo(() => getSigmaData(config, sigmaData), [config, sigmaData]);

  const [res, setRes] = useState(null);

  useEffect(() => {
    setRes(payload);
  }, [payload]);

  return res;
}

const App = () => { 
  const options = useMain();
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options}/>
    </div>
  );
}

export default App;