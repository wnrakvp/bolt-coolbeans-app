exports.listenerSlack = (app, googleSheets, authGoogle, spreadsheetId) => {
    const authenticateUser = require("../middleware/auth");
    const { homeView } = require("../views/home");
    const { modalView, updateView } = require("../views/ticket");
    const { notifyToChannel } = require("../views/stockreport");
    const {
      getStockfromGoogleSheet,
      updateStockToGoogleSheet,
      updateViewinHomeTab,
      updateViewinModalTab,
    } = require("../controller/stock");
  // Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
    app.event("app_home_opened", authenticateUser, async ({ client, logger }) => {
        const initialView = {};
        initialView.currentStock = "-";
        initialView.currentAmount = "-";
        initialView.currentStatus = "-";
        initialView.totalPrice = "0";
        initialView.lastUpdated = "-";
        try {
        await getStockfromGoogleSheet(googleSheets, authGoogle, spreadsheetId);
        await homeView(
            userId,
            client,
            initialView
        );
        } catch (e) {
        logger.error(e.message);
        }
    });

    app.action("getStocks", async ({ ack, payload, client, logger }) => {
        try {
        // Acknowledge the action
        await ack();
        logger.info(
            `Looking for ${payload.selected_option.value} Type in db.json`
        );
        const updateView = await updateViewinHomeTab(payload);
        await homeView(
            userId,
            client,
            updateView
        );
        logger.info(
            `User: ${userId} has viewed your ${payload.selected_option.value} Stocks`
        );
        } catch (e) {
        logger.error(e.message);
        }
    });

    app.command("/update", async ({ ack, body, client, logger }) => {
        // Acknowledge command request
        try {
        await ack();
        await getStockfromGoogleSheet(googleSheets, authGoogle, spreadsheetId);
        await modalView(body, client, logger);
        } catch(e) {
            logger.error(e.message);
        }
        // await say(`${command.text}`);
    });

    app.action("update", async ({ ack, body, client, logger }) => {
        await ack();
        await modalView(body, client, logger);
    });

    app.action("selectStock", async ({ ack, body, payload, client, logger }) => {
        try {
        await ack();
        const updateModal = await updateViewinModalTab(payload);
        await updateView(body, client, logger, updateModal);
        } catch (e) {
            logger.error(e.message);
        }
    });

    app.view("updatestock", async ({ ack, payload, body, client, logger }) => {
        try {
            await ack({
                response_action: "clear"
            });
            const user = body.user.id;
            await updateStockToGoogleSheet(googleSheets, authGoogle, spreadsheetId, payload);
            
            let msg = `${payload.blocks[1].fields[1].text} has been updated. Thanks`
            await client.chat.postMessage({
                channel: user,
                text: msg
            });
            const initialView = {};
            initialView.currentStock = "-";
            initialView.currentAmount = "-";
            initialView.currentStatus = "-";
            initialView.totalPrice = "0";
            initialView.lastUpdated = "-";
            await getStockfromGoogleSheet(googleSheets, authGoogle, spreadsheetId);
            await homeView(
            userId,
            client,
            initialView
            );
            const channelId = 'C03L149EDNJ'; // # notification channel
            await notifyToChannel(channelId, client, payload);
        } catch (e) {
            logger.error(e.message);
        }
    });

    app.action("updateAmount", async ({ ack }) => {
        await ack();
    });

    app.error(async (error) => {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
  });
};
