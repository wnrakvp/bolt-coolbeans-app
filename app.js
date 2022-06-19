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
    "text": 'Hi',
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
            "value": "americano",
            "action_id": "button_click"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Latte",
              "emoji": true
            },
            "value": "latte",
            "action_id": "button_click2"
          },
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "C.Mac",
              "emoji": true
            },
            "value": "C.mac",
            "action_id": "button_click3"
          }
        ],
        // "action_id": "button_click"
      }
    ]
  });
});

app.action('updateStock', async ({ ack, body, client, logger }) => {
  // Acknowledge the action
  await ack();
  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Modal title'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to a modal with _blocks_'
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click me!'
              },
              action_id: 'button_abc'
            }
          },
          {
            type: 'input',
            block_id: 'input_c',
            label: {
              type: 'plain_text',
              text: 'What are your hopes and dreams?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'dreamy_input',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      }
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }

  // Listen for a button invocation with action_id `button_abc` (assume it's inside of a modal)
app.action('button_abc', async ({ ack, body, client, logger }) => {
  // Acknowledge the button request
  await ack();

  try {
    // Call views.update with the built-in client
    const result = await client.views.update({
      // Pass the view_id
      view_id: body.view.id,
      // Pass the current hash to avoid race conditions
      hash: body.view.hash,
      // View payload with updated blocks
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'view_1',
        title: {
          type: 'plain_text',
          text: 'Updated modal'
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'You updated the modal!'
            }
          },
          {
            type: 'image',
            image_url: 'https://media.giphy.com/media/SVZGEcYt7brkFUyU90/giphy.gif',
            alt_text: 'Yay! The modal was updated'
          }
        ]
      }
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});
});

// Update the view on submission 
app.view('view_1', async ({ ack , body}) => {
  const userInput = body.view.state.values.input_c.dreamy_input.value;
  await ack({
    response_action: 'update',
    view: {
      type: 'modal',
      // View identifier
      callback_id: 'view_1',
      title: {
        type: 'plain_text',
        text: 'Successfully !!'
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: `Your dream is ${userInput}`
          }
        },
      ]
    },
  });
});
// Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
app.event("app_home_opened", async ({ payload,client }) => {
  const userId = payload.user;
  
  try {
    // Call the views.publish method using the WebClient passed to listeners
    const result = await client.views.publish({
      user_id: userId,
      view: {
        // Home tabs must be enabled in your app configuration page under "App Home"
        "type": "home",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Click button to update Stock."
            },
            "accessory": {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Click Me",
                "emoji": true
              },
              "value": "updateStock",
              "action_id": "updateStock"
            }
          }
        ]
      }
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

app.error(async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error(error);
});

(async () => {
  // Start your App
  await app.start(process.env.PORT || 3000);
  console.log('Bolt app is running!');
})();