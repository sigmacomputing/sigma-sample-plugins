# Getting Started with Sigma Plugins

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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

1. Start off by creating a new workbook or opening an existing workbook. Make sure that your workbook has a data table in it that the plugin can read from.

2. Open the "Add element..." tab in the sidebar and add a Plugin (under "UI Elements").

   <img src="readme_images/add-element.png" alt="screenshot of 'Add element...' tab on the top left section of the workbook view" width="300">
   <img src="readme_images/plugin.png" alt="screenshot of Plugin element under 'UI Elements' section" height="400" align="top">

3. Select the "Sigma Plugin Dev Playground" plugin, which plugin developers should have access to. Please contact your Organization Administrator if you cannot find this.

   <img src="readme_images/sigma-plugin-dev-playground.png" alt="screenshot of 'Sigma Plugin Dev Playground' selection" width="250">

4. Select your source data table by selecting it in the "Select..." dropdown menu

   <img src="readme_images/select-source.png" alt="screenshot of 'Select...' dropdown" width="300">

5. If you have groupings in your data table that you wish for this plugin to take into account, select an option from the "Aggregation Level" dropdown menu.

   <img src="readme_images/aggregation-level.png" alt="screenshot of aggregation level dropdown" width="300">

6. Select your date, category and value by clicking on the "+" symbol next to these categories.

   <img src="readme_images/add-date.png" alt="screenshot of dimension column selection" height="300">
   <img src="readme_images/add-category.png" alt="screenshot of dimension column selection" height="300">
   <img src="readme_images/add-value.png" alt="screenshot of dimension column selection" height="300">

   Click on the "Replay" button and you should be able to view the bar chart race animation! You can also pause the animation by clicking on the "Pause". If you want to resume an animation, you can click the "Start".

   <img src="readme_images/bar-chart-race-sample.png" alt="screenshot of bar chart plugin with all steps completed" width="700">

7. You can also customize the ranking by entering the ranking and saving it.
   <img src="readme_images/add-rank.png" alt="screenshot of dimension column selection" height="200">

8. You can change the grouping type of date by truncating date to year, month or day, the bar-chart-race will be displayed according to the changed type.

   <img src="readme_images/truncate-date.png" alt="screenshot of dimension column selection" height="400">

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
