const { App } = require("@slack/bolt");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const { logging } = require("googleapis/build/src/apis/logging");

// Config File
dotenv.config({ path: "./config/config.env" });
// Google Credentials
const authGoogle = new google.auth.GoogleAuth({
  keyFile: "./config/credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const clientGoogle = async() => await auth.getClient();
const googleSheets = google.sheets({ version: "v4", auth: clientGoogle });
const spreadsheetId = "1iU10tVrpc1Xh2dezq5xCrwBF6hk5_LpkDPO8YUe9pME";

// Initialize your app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});
// -------------General Home View--------------------
const homeView = async (userId,client,currentStock,currentAmount,lastUpdated) => {
  // Call the views.publish method using the WebClient passed to listeners
  try {
  const result = await client.views.publish({
    user_id: userId,
    view: {
      "type": "home",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Stock Level",
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Please choose your Stock type"
          },
          "accessory": {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select an item",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Coffee Beans",
                  "emoji": true
                },
                "value": "CoffeeBeans"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "Dairy",
                  "emoji": true
                },
                "value": "Dairy"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "Sweetened",
                  "emoji": true
                },
                "value": "Sweetened"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "Packaging",
                  "emoji": true
                },
                "value": "Packaging"
              }
            ],
            "action_id": "getStocks"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": `*Current Items*\n${currentStock}`
            },
            {
              "type": "mrkdwn",
              "text": `*Amount*\n${currentAmount}`
            }
          ]
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Last Updated At*"
            },
            {
              "type": "plain_text",
              "text": `${lastUpdated}`
            }
          ]
        },
        {
          "type": "divider"
        }
      ]
    },
  });
  console.info('Successfully generated HomeView !');
  return result;
} catch (e) {
  console.error(e.message);
  return e;
}
}
// -------------End of General Home View--------------------
// Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
app.event("app_home_opened", async ({ payload, client, logger }) => {
  const userId = payload.user;
    // --------Initialize Tab Home-----------
    const currentStock = ' ';
    const currentAmount = ' ';
    const lastUpdated = ' ';
    // --------------------------------------------------
    homeView(userId,client,currentStock,currentAmount,lastUpdated);
});
app.action("getStocks", async ({ack,}) => {
  // Acknowledge the action
  await ack();
  // Update Views
});
app.action("updateStock", async ({ ack, body, client, logger }) => {
  // Acknowledge the action
  await ack();
  try {
    const options = [];
    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
      auth: authGoogle,
      spreadsheetId,
      range: "Stock!A:A",
    });
    getRows.data.values.forEach((item) => {
      var obj = {
        text: {
          type: "plain_text",
          text: `${item[0]}`,
          emoji: true,
        },
        value: `${item[0]}`,
      };
      options.push(obj);
    });
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Update Stock",
        },
        blocks: [
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Pick an item from the dropdown list",
            },
            accessory: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select an item",
                emoji: true,
              },
              options: options,
              // "action_id": "static_select-action"
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "input_c",
            label: {
              type: "plain_text",
              text: "What are your hopes and dreams?",
            },
            element: {
              type: "plain_text_input",
              action_id: "dreamy_input",
              multiline: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

// Update the view on submission
app.view("view_1", async ({ ack, body, logger }) => {
  const userInput = body.view.state.values.input_c.dreamy_input.value;
  try {
  await ack({
    response_action: "update",
    view: {
      type: "modal",
      // View identifier
      callback_id: "view_1",
      title: {
        type: "plain_text",
        text: "Successfully !!",
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: `Your dream is ${userInput}`,
          },
        },
      ],
    },
  });
    // Write a row from spreadsheet
    const result = await googleSheets.spreadsheets.values.append({
      auth: authGoogle,
      spreadsheetId,
      range: "Stock!A:B",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[userInput, 1]],
      },
    });
    logger.info(result.status);
  } catch (e) {
    logger.error(e.message);
  }
});

app.error(async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error(error);
});

(async () => {
  // Start your App
  await app.start(process.env.PORT || 3000);
  console.log("Bolt app is running!");
})();
