# Getting Started with Sigma Plugins

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

&nbsp;

## Running This React App

If this is your first time running this app, navigate to the project directory and run the following command via your terminal:

### `yarn`

- Installs all necessary dependencies.

- You may skip this step if you have already run this command for this app previously.

After this, while still in the project directory, you can run:

### `yarn start`

- Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

- The page will reload if you make edits. You will also see any lint errors in the console.

&nbsp;

## Using This App as a Sigma Plugin

Start off by creating a new workbook or opening an existing workbook. Make sure that your workbook has a data table in it that the plugin can read from.

Open the "Add element..." tab in the sidebar and add a Plugin (under "UI Elements").

<img src="readme_images/add-element.png" alt="screenshot of 'Add element...' tab on the top left section of the workbook view" width="300">
<img src="readme_images/plugin.png" alt="screenshot of Plugin element under 'UI Elements' section" height="400" align="top">

Select the "Sigma Plugin Dev Playground" plugin, which plugin developers should have access to. Please contact your Organization Administrator if you cannot find this.

<img src="readme_images/sigma-plugin-dev-playground.png" alt="screenshot of 'Sigma Plugin Dev Playground' selection" width="300">

Select your source data table by selecting it in the "Select..." dropdown menu

<img src="readme_images/select-source.png" alt="screenshot of 'Select...' dropdown" width="300">

Select the columns of your table containing the data for the Date, High, Low, Open, and Close values by clicking on the "+" symbol next to these categories and then selecting the columns you want to use from your source data table.

<img src="readme_images/add-column.png" alt="screenshot of selecting a column for Date" width="300">

You should now be able to view the bar chart representation of your data!

<img src="readme_images/candlestick-chart-sample.png" alt="screenshot of candlestick chart with all steps completed" width="800">

&nbsp;

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
