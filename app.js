const { App } = require('@slack/bolt');
const dotenv = require('dotenv')
// Config File
dotenv.config({ path: './config/config.env' });
// Initialize your app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

app.message('hello', async({message,say}) => {
  await say(`Hey there <@${message.user}>!`);
});

(async () => {
  // Start your App
  await app.start(process.env.PORT || 3000);
  console.log('Bolt app is running!');
})();