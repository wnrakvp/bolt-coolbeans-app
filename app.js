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
  await say({
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Hello, Coffee Lovers! \n\n *Please select a drink:*"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Americano",
              "emoji": true
            },
            "value": "americano"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Latte",
              "emoji": true
            },
            "value": "latte"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "C.Mac",
              "emoji": true
            },
            "value": "C.mac"
          }
        ]
      }
    ]
  });
});

app.action('button_click', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`We received <@${body.user.id}> request. Please Wait for moment!`);
});

(async () => {
  // Start your App
  await app.start(process.env.PORT || 3000);
  console.log('Bolt app is running!');
})();