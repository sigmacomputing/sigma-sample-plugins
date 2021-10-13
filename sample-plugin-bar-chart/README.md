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

If you have groupings in your data table that you wish for this plugin to take into account, select an option from the "Aggregation Level" dropdown menu.

<img src="readme_images/aggregation-level.png" alt="screenshot of aggregation level dropdown" width="300">

Select your dimension and measure(s) by clicking on the "+" symbol next to these categories and then selecting the columns you want to use from your source data table.

- **Note:** For this plugin specifically, the chart that is produced will only display the first three measures that you select as bars in order to conserve space.

<img src="readme_images/add-dimension.png" alt="screenshot of dimension column selection" height="315">
<img src="readme_images/add-measures.png" alt="screenshot of measure columns selection" height="315" align="top">

You should now be able to view the bar chart representation of your data!

<img src="readme_images/bar-chart-sample.png" alt="screenshot of bar chart plugin with all steps completed" width="800">

&nbsp;

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
