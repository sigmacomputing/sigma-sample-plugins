# Getting Started with Hightouch Sync Plugin

This plugin is available on: [link to the netlify app]. You may configure this URL as the production URL of a plugin from the Administration Panel.

## Running/Developing This React App

If this is your first time running this app, navigate to the project directory and run the following command via your terminal:

### `yarn`
* Install all necessary dependencies.
* You may skip this step if you have already run this command for this app previously.

After this, while still in the project directory, you can run:

### `yarn start`
* Runs the app in the development mode. Open the url (by default is http://localhost:3000) to view it in the browser.
* The page will reload if you make edits. You will also see any lint erros in the console.

  ## Deployment/Host the React App
If you or your admin has already host this app for you, you can skip this step

### `yarn build`
* Build a production version of the app.
### Host the app
* Host the app on cloud and make sure you can visit the app from the url

## Registering This Plugin with Your Sigma Organization
If you or your admin has already registered the plugin, you can skip this step

### Requirements
* You must be an organization Admin to register a plugin.
* The plugin should be hosted; you will need to provide a production URL.
### Register a Plugin

1. Open your Admin portal.
2. Scroll to the "Custom Plugins" section on the "Account" page.
<img width="1153" alt="account-custom-plugins" src="https://github.com/scsigma/v2-hightouch/assets/120054623/ecbe94e4-d9c4-4097-bfab-be2cd50526ca">

3. Click the section's "Add" button - this will open the "Create New Custom Plugin" modal.
<img width="1194" alt="add-plugin-button" src="https://github.com/scsigma/v2-hightouch/assets/120054623/de50b888-3c9b-4f19-8df9-57eb26d0e94c">

4. Enter a Name for the plugin (Hightouch Sync).
5. [optional] Enter a Description for the plugin.
6. Enter the plugin's Production URL.
<img width="886" alt="enter-plugin-info" src="https://github.com/scsigma/v2-hightouch/assets/120054623/f901cbd0-1219-4dbc-b52e-a75698f2bdc2">

7. Click "Create Plugin".

## Using This App as a Sigma Plugin
1. Start off by creating a new workbook or opening an existing workbook. Make sure that your workbook has a data table in it that the plugin can read from.

2. Open the "Add element..." tab in the sidebar and add a Plugin (under "UI Elements").
<img width="277" alt="add-element" src="https://github.com/scsigma/v2-hightouch/assets/120054623/4cc652f9-8ed5-437f-bba5-4040a7b5d0b9">

<img width="280" alt="plugin" src="https://github.com/scsigma/v2-hightouch/assets/120054623/8974c6fc-4a26-47f8-9ed5-86599c8ba744">

3. Select the "Hightouch Sync" plugin. Please contact your Organization Administrator if you cannot find it.

4. Enter your Hightouch API token, Sync ID for the Sync you'd like to run, and the button text (default is "Export to HubSpot")

<img width="321" alt="Screenshot 2023-08-31 at 3 17 51 PM" src="https://github.com/scsigma/v2-hightouch/assets/120054623/8ee46686-0450-442b-8155-5028813a6abc">


![Screenshot 2023-08-24 at 12 48 45 PM](https://github.com/scsigma/v2-hightouch/assets/120054623/9ea55106-b550-4f2c-868a-ca67ef09223d)

![Screenshot 2023-08-24 at 12 53 08 PM](https://github.com/scsigma/v2-hightouch/assets/120054623/96882d9e-b1bb-4135-ac03-7c4e784fb1e7)










