const { App } = require('@slack/bolt');
const { google } = require('googleapis');
// const dotenv = require('dotenv');
const { listenerSlack } = require('./listener/listener');

// Config File
// dotenv.config({ path: './config/config.env' });

// Google Credentials
const authGoogle = new google.auth.GoogleAuth({
  // keyFile: './config/credentials.json',
  keyFile: './google-credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});
const clientGoogle = async () => await auth.getClient();
const googleSheets = google.sheets({ version: 'v4', auth: clientGoogle });
const spreadsheetId = process.env.GOOGLESHEET_ID;

// Initialize your app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 5000,
});
listenerSlack(app, googleSheets, authGoogle, spreadsheetId);

(async () => {
  // Start your App
  await app.start(process.env.PORT || 5000);
  console.log(`Bolt app is running! on PORT ${process.env.PORT}`);
})();
