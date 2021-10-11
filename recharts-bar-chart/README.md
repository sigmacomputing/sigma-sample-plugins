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

*(add image here)*

Open the "Add element..." tab in the sidebar and add a Plugin (under "UI Elements").

*(add image here)*

Add your source data table by selecting it in the "Select..." dropdown menu

*(add image here)*

Select your dimension and measure(s) by clicking on the "+" symbol next to these categories and then selecting the columns you want to use from your source data table.
- **Note:** For this plugin specifically, the chart that is produced will only display the first three measures that you select as bars in order to conserve space.

*(add image here)*

You should now be able to view the bar chart representation of your data!

&nbsp;  
## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).