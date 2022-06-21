const { App } = require('@slack/bolt');
const dotenv = require('dotenv');
const { google } = require('googleapis');

// Config File
dotenv.config({ path: './config/config.env' });
// Google Credentials
const authGoogle = new google.auth.GoogleAuth({
  keyFile: './config/credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});
const clientGoogle = async () => await auth.getClient();
const googleSheets = google.sheets({ version: 'v4', auth: clientGoogle });
const spreadsheetId = '1iU10tVrpc1Xh2dezq5xCrwBF6hk5_LpkDPO8YUe9pME';

// Initialize your app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});
let userId = '';
// -------------General Home View--------------------
const homeView = (userId, client, currentStock, currentAmount, currentPrice, totalPrice, lastUpdated) => {
  // Call the views.publish method using the WebClient passed to listeners
  const result = client.views.publish({
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Stock Level',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Please choose your Stock type',
          },
          accessory: {
            type: 'static_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select an item',
              emoji: true,
            },
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Coffee Beans',
                  emoji: true,
                },
                value: 'CoffeeBeans',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Dairy',
                  emoji: true,
                },
                value: 'Dairy',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Sweetened',
                  emoji: true,
                },
                value: 'Sweetened',
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'Packaging',
                  emoji: true,
                },
                value: 'Packaging',
              },
            ],
            action_id: 'getStocks',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Current Items*\n${currentStock}`,
            },
            {
              type: 'mrkdwn',
              text: " ",
            },
            {
              type: 'mrkdwn',
              text: `*Amount*\n${currentAmount}`,
            },
            {
              type: 'mrkdwn',
              text: " ",
            },
            {
              type: 'mrkdwn',
              text: `*Inventory Cost*\n${currentPrice}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Total Inventory Cost*',
            },
            {
              type: 'plain_text',
              text: `${totalPrice}  Baht`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Last Updated At*',
            },
            {
              type: 'plain_text',
              text: `${lastUpdated}`,
            },
          ],
        },
        {
          type: 'divider',
        },
      ],
    },
  });
  return result;
};
// -------------End of General Home View--------------------
// -------------Authentication Middleware-------------------
async function authenticateUser({payload, client, next}) {
  userId = payload.user;
  const user = await client.oauth.v2.access();
    console.log(user);
  await next();
  }
// ---------------------------------------------------------
// Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
app.event('app_home_opened',authenticateUser, async ({client, logger}) => {
  // -------------Initialize Tab Home------------------
  const currentStock = '-';
  const currentAmount = '-';
  const currentPrice = '-';
  const totalPrice = '0';
  const lastUpdated = '-';
  // --------------------------------------------------
  try {
  await homeView(userId, client, currentStock, currentAmount, currentPrice, totalPrice, lastUpdated);
  } catch(e) {
  logger.error(e.message);
  }
});
app.action('getStocks', async ({ ack, payload, client, logger }) => {
  try {
  // Acknowledge the action
  await ack();
  logger.info(
    `Looking for ${payload.selected_option.value} Type in Google Sheet`
  );
  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth: authGoogle,
    spreadsheetId,
    range: 'Stock!A2:E10',
  });
  const lastUpdated = getRows.data.values[0][4];
  const stocks = getRows.data.values.filter((item) => {
    if (item.includes(payload.selected_option.value)) {
      return item;
    }
  });
  let currentStock = '';
  let currentAmount = '';
  let currentPrice = '';
  let totalPrice = 0;
  stocks.forEach((stock) => {
    currentStock += `${stock[0]}\n`;
    currentAmount += `${stock[2]}\n`;
    currentPrice += `${stock[3]*stock[2]} Baht\n`;
    totalPrice += stock[3]*stock[2];
  });
  await homeView(userId, client, currentStock, currentAmount, currentPrice, totalPrice, lastUpdated);
  logger.info(
    `User: ${userId} has viewed your ${payload.selected_option.value} Stocks`
  );
  } catch (e) {
    logger.error(e.message);
  }
});
// app.action('updateStock', async ({ ack, body, client, logger }) => {
//   // Acknowledge the action
//   await ack();
//   try {
//     const options = [];
//     // Read rows from spreadsheet
//     const getRows = await googleSheets.spreadsheets.values.get({
//       auth: authGoogle,
//       spreadsheetId,
//       range: 'Stock!A:A',
//     });
//     getRows.data.values.forEach((item) => {
//       var obj = {
//         text: {
//           type: 'plain_text',
//           text: `${item[0]}`,
//           emoji: true,
//         },
//         value: `${item[0]}`,
//       };
//       options.push(obj);
//     });
//     // Call views.open with the built-in client
//     const result = await client.views.open({
//       // Pass a valid trigger_id within 3 seconds of receiving it
//       trigger_id: body.trigger_id,
//       // View payload
//       view: {
//         type: 'modal',
//         // View identifier
//         callback_id: 'view_updateStock',
//         title: {
//           type: 'plain_text',
//           text: 'Update Stock',
//         },
//         blocks: [
//           {
//             type: 'divider',
//           },
//           {
//             type: 'section',
//             text: {
//               type: 'mrkdwn',
//               text: 'Pick an item from the dropdown list',
//             },
//             accessory: {
//               type: 'static_select',
//               placeholder: {
//                 type: 'plain_text',
//                 text: 'Select an item',
//                 emoji: true,
//               },
//               options: options,
//               // "action_id": "static_select-action"
//             },
//           },
//           {
//             type: 'divider',
//           },
//           {
//             type: 'input',
//             block_id: 'input_c',
//             label: {
//               type: 'plain_text',
//               text: 'What are your hopes and dreams?',
//             },
//             element: {
//               type: 'plain_text_input',
//               action_id: 'dreamy_input',
//               multiline: true,
//             },
//           },
//         ],
//         submit: {
//           type: 'plain_text',
//           text: 'Submit',
//         },
//       },
//     });
//     logger.info(result);
//   } catch (error) {
//     logger.error(error);
//   }
// });
// // Update the view on submission
// app.view('view_updateStock', async ({ ack, body, logger }) => {
//   const userInput = body.view.state.values.input_c.dreamy_input.value;
//   try {
//     await ack({
//       response_action: 'update',
//       view: {
//         type: 'modal',
//         // View identifier
//         callback_id: 'view_1',
//         title: {
//           type: 'plain_text',
//           text: 'Successfully !!',
//         },
//         blocks: [
//           {
//             type: 'section',
//             text: {
//               type: 'plain_text',
//               text: `Your dream is ${userInput}`,
//             },
//           },
//         ],
//       },
//     });
//     // Write a row from spreadsheet
//     const result = await googleSheets.spreadsheets.values.append({
//       auth: authGoogle,
//       spreadsheetId,
//       range: 'Stock!A:B',
//       valueInputOption: 'USER_ENTERED',
//       resource: {
//         values: [[userInput, 1]],
//       },
//     });
//     logger.info(result.status);
//   } catch (e) {
//     logger.error(e.message);
//   }
// });
app.error(async (error) => {
  // Check the details of the error to handle cases where you should retry sending a message or stop the app
  console.error(error);
});
(async () => {
  // Start your App
  await app.start(process.env.PORT || 3000);
  console.log('Bolt app is running!');
})();
